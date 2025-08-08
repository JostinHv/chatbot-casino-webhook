const { logger } = require('../logger');

const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error en la aplicación:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determinar el tipo de error
  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'No autorizado';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Conflicto: el recurso ya existe';
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    statusCode = 500;
    message = 'Error de configuración de base de datos';
  }

  // En desarrollo, incluir más detalles del error
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.message;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler }; 