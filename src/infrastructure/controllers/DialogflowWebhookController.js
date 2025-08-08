const { logger } = require('../logger');
const { getContainer } = require('../container/DependencyContainer');
const { DialogflowRequestDTO } = require('../../domain/dtos/DialogflowRequestDTO');
const { DialogflowResponseDTO } = require('../../domain/dtos/DialogflowResponseDTO');

class DialogflowWebhookController {
  constructor() {
    this.container = getContainer();
    this.processWebhookUseCase = this.container.getProcessWebhookUseCase();
  }

  /**
   * Maneja webhooks de Dialogflow según la documentación oficial
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async handleDialogflowWebhook(req, res) {
    try {
      const startTime = Date.now();
      
      // Crear DTO de request y validar
      const dialogflowRequest = DialogflowRequestDTO.fromDialogflowRequest(req.body);
      const validationResult = dialogflowRequest.validate();
      
      if (!validationResult.isValid) {
        logger.warn('Request de Dialogflow inválido', {
          errors: validationResult.errors,
          body: req.body
        });
        
        const errorResponse = DialogflowResponseDTO.createValidationErrorResponse(
          `Error en formato: ${validationResult.errors.join(', ')}`
        );
        return res.status(400).json(errorResponse.toJSON());
      }

      // Extraer datos procesables
      const processableData = dialogflowRequest.extractProcessableData();
      
      logger.info('Webhook de Dialogflow recibido', {
        intent: processableData.intent,
        parameters: processableData.parameters,
        languageCode: processableData.languageCode,
        session: processableData.session,
        confidence: processableData.confidence,
        queryText: processableData.queryText
      });

      // Procesar con arquitectura hexagonal
      const result = await this.processWebhookUseCase.execute(
        processableData.intent,
        processableData.parameters,
        processableData.session,
        processableData.languageCode
      );

      // Crear respuesta en formato Dialogflow
      const dialogflowResponse = DialogflowResponseDTO.fromProcessResult(result);

      const duration = Date.now() - startTime;
      
      logger.info('Webhook de Dialogflow procesado exitosamente', {
        intent: processableData.intent,
        session: processableData.session,
        fulfillmentText: result.fulfillmentText,
        duration: `${duration}ms`,
        confidence: processableData.confidence
      });

      // Responder con formato oficial de Dialogflow
      res.status(200).json(dialogflowResponse.toJSON());

    } catch (error) {
      logger.error('Error procesando webhook de Dialogflow', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });

      // Respuesta de error en formato Dialogflow
      const errorResponse = DialogflowResponseDTO.createErrorResponse(
        'Lo siento, ocurrió un error interno. Por favor, intenta de nuevo.'
      );
      res.status(500).json(errorResponse.toJSON());
    }
  }

  /**
   * Valida la estructura de entrada según documentación oficial de Dialogflow
   * @param {Object} body - Cuerpo de la request
   * @returns {Object} Resultado de validación
   */
  validateDialogflowRequest(body) {
    try {
      const dialogflowRequest = DialogflowRequestDTO.fromDialogflowRequest(body);
      return dialogflowRequest.validate();
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Extrae datos del formato oficial de Dialogflow
   * @param {Object} body - Cuerpo de la request
   * @returns {Object} Datos extraídos
   */
  extractDialogflowData(body) {
    const dialogflowRequest = DialogflowRequestDTO.fromDialogflowRequest(body);
    return dialogflowRequest.extractProcessableData();
  }

  /**
   * Formatea respuesta según estándar oficial de Dialogflow
   * @param {Object} result - Resultado del caso de uso
   * @returns {Object} Respuesta formateada para Dialogflow
   */
  formatDialogflowResponse(result) {
    const dialogflowResponse = DialogflowResponseDTO.fromProcessResult(result);
    return dialogflowResponse.toJSON();
  }

  /**
   * Endpoint de health check para Dialogflow
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getHealthStatus(req, res) {
    try {
      const healthUseCase = this.container.getGetHealthStatusUseCase();
      const health = await healthUseCase.execute();
      
      res.status(200).json({
        success: true,
        message: 'Dialogflow Webhook funcionando correctamente',
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error en health check de Dialogflow', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Error en health check',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Endpoint de información para Dialogflow
   * @param {Object} req - Request de Express
   * @param {Object} res - Response de Express
   */
  async getDialogflowInfo(req, res) {
    res.status(200).json({
      success: true,
      message: 'Dialogflow Webhook API - Chatbot Casino',
      version: '1.0.0',
      endpoints: {
        'POST /dialogflow': 'Webhook principal para Dialogflow (formato oficial)',
        'GET /health': 'Health check del servicio',
        'GET /info': 'Información de endpoints',
        'POST /validate': 'Validar formato de request',
        'POST /test': 'Testing con formato simulado'
      },
      architecture: 'Hexagonal (Ports & Adapters)',
      dialogflowCompatible: true,
      documentation: 'https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { DialogflowWebhookController }; 