const { logger } = require('../logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log de la petición entrante
  logger.info('Petición recibida', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length')
  });

  // Interceptar el final de la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Respuesta enviada', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length')
    });
  });

  next();
};

module.exports = { requestLogger }; 