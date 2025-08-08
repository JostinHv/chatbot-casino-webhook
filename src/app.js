const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { logger } = require('./infrastructure/logger');
const { errorHandler } = require('./infrastructure/middleware/errorHandler');
const { requestLogger } = require('./infrastructure/middleware/requestLogger');
const { validateRequest } = require('./infrastructure/middleware/validateRequest');

// Importar rutas
const webhookRoutes = require('./infrastructure/routes/webhookRoutes');
const healthRoutes = require('./infrastructure/routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad y optimización
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use(requestLogger);

// Rutas
app.use('/api/webhook', webhookRoutes);
app.use('/api/health', healthRoutes);

// Ruta de prueba "Hola mundo"
app.get('/', (req, res) => {
  res.json({
    message: '¡Hola mundo! Backend del chatbot de casinos en Perú está funcionando correctamente.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor.`
  });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
  logger.info(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 URL: http://localhost:${PORT}`);
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado exitosamente');
    process.exit(0);
  });
});

module.exports = app; 