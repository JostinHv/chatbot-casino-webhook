const { logger } = require('../logger');

/**
 * Middleware para manejar errores de manera centralizada
 * Elimina la necesidad de try-catch en cada endpoint
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware para respuestas exitosas estandarizadas
 */
const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Middleware para respuestas de error estandarizadas
 */
const errorResponse = (res, error, message = 'Error en la operación', statusCode = 500) => {
  logger.error('Error en endpoint', {
    error: error.message,
    stack: error.stack,
    statusCode,
    message
  });

  return res.status(statusCode).json({
    success: false,
    message,
    error: error.message,
    timestamp: new Date().toISOString()
  });
};

module.exports = { 
  asyncHandler, 
  successResponse, 
  errorResponse 
}; 