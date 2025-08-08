const express = require('express');
const { DialogflowWebhookController } = require('../controllers/DialogflowWebhookController');
const { requestLogger } = require('../middleware/requestLogger');

const router = express.Router();
const dialogflowController = new DialogflowWebhookController();

// Middleware para todas las rutas
router.use(requestLogger);

/**
 * Webhook principal para Dialogflow
 * Maneja el formato oficial de Dialogflow según documentación
 * POST /api/webhook/dialogflow
 */
router.post('/', 
  // Validación básica de contenido
  (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        fulfillmentText: 'Error: Body debe ser un objeto JSON',
        fulfillmentMessages: [
          {
            text: {
              text: ['Error: Body debe ser un objeto JSON']
            }
          }
        ]
      });
    }
    next();
  },
  dialogflowController.handleDialogflowWebhook.bind(dialogflowController)
);

/**
 * Endpoint de health check para Dialogflow
 * GET /api/webhook/dialogflow/health
 */
router.get('/health', dialogflowController.getHealthStatus.bind(dialogflowController));

/**
 * Endpoint de información para Dialogflow
 * GET /api/webhook/dialogflow/info
 */
router.get('/info', dialogflowController.getDialogflowInfo.bind(dialogflowController));

/**
 * Endpoint de testing para Dialogflow (formato simulado)
 * POST /api/webhook/dialogflow/test
 */
router.post('/test', 
  (req, res, next) => {
    try {
      const { intent, parameters = {}, languageCode = 'es', session } = req.body;
      
      // Simular formato Dialogflow para testing
      const mockDialogflowRequest = {
        responseId: "test-response-id",
        session: session || "projects/test-project/agent/sessions/test-session",
        queryResult: {
          queryText: `Test query for ${intent}`,
          action: intent,
          parameters,
          allRequiredParamsPresent: true,
          fulfillmentText: "",
          fulfillmentMessages: [],
          intent: {
            name: `projects/test-project/agent/intents/${intent}`,
            displayName: intent
          },
          intentDetectionConfidence: 0.95,
          diagnosticInfo: {},
          languageCode
        },
        originalDetectIntentRequest: {
          source: "test",
          version: "2",
          payload: {}
        }
      };

      req.body = mockDialogflowRequest;
      next();
    } catch (error) {
      res.status(400).json({
        fulfillmentText: 'Error en formato de testing',
        fulfillmentMessages: [
          {
            text: {
              text: ['Error en formato de testing']
            }
          }
        ]
      });
    }
  },
  dialogflowController.handleDialogflowWebhook.bind(dialogflowController)
);

/**
 * Endpoint de validación de formato Dialogflow
 * POST /api/webhook/dialogflow/validate
 */
router.post('/validate', (req, res) => {
  const validationResult = dialogflowController.validateDialogflowRequest(req.body);
  
  res.status(200).json({
    success: validationResult.isValid,
    message: validationResult.isValid ? 'Formato válido' : 'Formato inválido',
    error: validationResult.error,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 