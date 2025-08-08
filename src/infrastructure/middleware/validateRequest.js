const Joi = require('joi');
const { logger } = require('../logger');

// Esquemas de validación
const webhookSchema = Joi.object({
  intent: Joi.string().required(),
  parameters: Joi.object().optional(),
  languageCode: Joi.string().default('es'),
  session: Joi.string().optional(),
  sessionId: Joi.string().optional(),
  timestamp: Joi.date().optional()
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      logger.warn('Validación fallida', {
        error: error.details[0].message,
        body: req.body,
        url: req.url
      });
      
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: error.details[0].message
      });
    }
    
    // Reemplazar el body con los datos validados
    req.body = value;
    next();
  };
};

// Middleware específico para webhook
const validateWebhookRequest = validateRequest(webhookSchema);

module.exports = { 
  validateRequest, 
  validateWebhookRequest,
  webhookSchema 
}; 