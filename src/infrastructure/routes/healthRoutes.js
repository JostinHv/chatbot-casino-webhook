const express = require('express');
const router = express.Router();
const { logger } = require('../logger');
const { DatabaseConnection } = require('../database/connection');

// Health check básico
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check completo con base de datos
router.get('/full', async (req, res) => {
  try {
    const dbConnection = DatabaseConnection.getInstance();
    const isConnected = await dbConnection.testConnection();
    
    const healthStatus = {
      status: isConnected ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: isConnected ? 'connected' : 'disconnected',
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    const statusCode = isConnected ? 200 : 503;
    res.status(statusCode).json(healthStatus);
    
    logger.info('Health check completado', { status: healthStatus.status });
  } catch (error) {
    logger.error('Error en health check', { error: error.message });
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Error al verificar la salud del sistema'
    });
  }
});

module.exports = router; 