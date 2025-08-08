const express = require('express');
const { DialogflowWebhookController } = require('../controllers/DialogflowWebhookController');
const { requestLogger } = require('../middleware/requestLogger');

// Importar rutas de Dialogflow
const dialogflowRoutes = require('./dialogflowRoutes');

const router = express.Router();
const dialogflowController = new DialogflowWebhookController();

// Middleware para todas las rutas
router.use(requestLogger);

// Webhook principal para Dialogflow (formato oficial)
router.use('/dialogflow', dialogflowRoutes);

// Endpoint de información general
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot Casino Webhook API',
    version: '1.0.0',
    endpoints: {
      'POST /dialogflow': 'Webhook principal para Dialogflow (formato oficial)',
      'POST /dialogflow/test': 'Testing con formato simulado de Dialogflow',
      'POST /dialogflow/validate': 'Validar formato de request',
      'GET /dialogflow/health': 'Health check de Dialogflow',
      'GET /dialogflow/info': 'Información de Dialogflow',
      'GET /': 'Información general de la API'
    },
    architecture: 'Hexagonal (Ports & Adapters)',
    dialogflowCompatible: true,
    documentation: 'https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook',
    timestamp: new Date().toISOString()
  });
});

// Health check general
router.get('/health', async (req, res) => {
  try {
    await dialogflowController.getHealthStatus(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en health check general',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 