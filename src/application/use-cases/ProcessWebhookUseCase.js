const { logger } = require('../../infrastructure/logger');
const { ConversationResponseDTO } = require('../../domain/dtos/ConversationResponseDTO');
const { Session } = require('../../domain/entities/Session');
const { SessionId } = require('../../domain/entities/value-objects/SessionId');

class ProcessWebhookUseCase {
  constructor(
    sessionRepository,
    entityRepository,
    responseRepository,
    historyRepository
  ) {
    this.sessionRepository = sessionRepository;
    this.entityRepository = entityRepository;
    this.responseRepository = responseRepository;
    this.historyRepository = historyRepository;
  }

  async execute(intent, parameters = {}, sessionId = null, languageCode = 'es') {
    logger.info('🔄 INICIO ProcessWebhookUseCase', {
      intent,
      parameters,
      sessionId,
      languageCode
    });

    try {
      // 1. Validar intención
      const intentValidation = await this.entityRepository.validateIntent(intent);
      if (!intentValidation.isValid) {
        logger.warn('Intención no válida', { intent, message: intentValidation.message });
        return ConversationResponseDTO.createFallback(intent, intentValidation.message);
      }

      // 2. Obtener entidades requeridas para la intención
      const requiredEntities = await this.entityRepository.getRequiredEntities(intentValidation.intentId);

      // 3. Si no hay entidades requeridas, procesar inmediatamente
      if (requiredEntities.length === 0) {
        logger.info('No hay entidades requeridas, procesando inmediatamente', { intent });
        return await this.processImmediateResponse(intent, parameters, languageCode);
      }

      // 4. Generar sessionId si no se proporciona
      if (!sessionId) {
        sessionId = SessionId.generate().toValue();
        logger.info('SessionId generado', { sessionId });
      }

      // 5. Procesar flujo conversacional con entidades requeridas
      return await this.processConversationalFlow(
        intent,
        parameters,
        sessionId,
        languageCode,
        requiredEntities,
        intentValidation.intentId
      );

    } catch (error) {
      logger.error('Error en ProcessWebhookUseCase', { 
        error: error.message, 
        intent, 
        sessionId 
      });
      return ConversationResponseDTO.createFallback(intent, 'Error interno del servidor');
    }
  }

  async processImmediateResponse(intent, parameters, languageCode) {
    // Obtener intención
    const intentData = await this.responseRepository.getIntentByName(intent);
    if (!intentData) {
      return ConversationResponseDTO.createFallback(intent, 'Intención no encontrada');
    }

    // Obtener respuestas usando el ID numérico directamente
    const responses = await this.responseRepository.findResponsesForIntent(intentData.intencion_id, languageCode);
    
    // Seleccionar mejor respuesta
    const bestResponse = this.selectBestResponse(responses, parameters);
    
    // Guardar en historial
    await this.historyRepository.saveInteraction(intent, parameters, bestResponse.fulfillmentText);
    
    return bestResponse;
  }

  async processConversationalFlow(intent, parameters, sessionId, languageCode, requiredEntities, intentId) {
    // 1. Crear o actualizar sesión
    const sessionDTO = await this.sessionRepository.createOrUpdateSession(sessionId, intent, parameters);
    const session = sessionDTO.getSession();

    // 2. Normalizar parámetros recibidos
    const normalizedParameters = await this.normalizeParameters(parameters);

    // 3. Actualizar sesión con parámetros normalizados
    await this.sessionRepository.updateSessionState(sessionId, session.getState(), normalizedParameters);

    // 4. Verificar parámetros faltantes
    const entityValidation = this.validateRequiredEntities(requiredEntities, normalizedParameters);

    // 5. Si faltan entidades requeridas, solicitar la primera
    if (!entityValidation.hasAllRequired) {
      const nextEntity = entityValidation.missingEntities[0];
      const prompt = nextEntity.prompt || `Por favor proporciona ${nextEntity.entityName}`;
      
      session.setWaitingForEntity(nextEntity.entityName);
      await this.sessionRepository.saveSession(session);

      logger.info('Solicitando entidad requerida', { 
        sessionId, 
        entity: nextEntity.entityName, 
        prompt 
      });

      return ConversationResponseDTO.createPrompt(intent, prompt, normalizedParameters, session.getState());
    }

    // 6. Todos los parámetros requeridos están presentes, procesar respuesta final
    logger.info('Todos los parámetros requeridos completos, procesando respuesta final', {
      sessionId,
      parameters: normalizedParameters
    });

    const response = await this.processImmediateResponse(intent, normalizedParameters, languageCode);
    
    // 7. Limpiar sesión
    await this.sessionRepository.clearSession(sessionId);

    return response;
  }

  async normalizeParameters(parameters) {
    const normalizedParameters = {};
    
    for (const [key, value] of Object.entries(parameters)) {
      if (value) {
        const normalizedValue = await this.entityRepository.normalizeEntityValue(value, key);
        if (normalizedValue) {
          normalizedParameters[key] = normalizedValue;
        }
      }
    }

    return normalizedParameters;
  }

  validateRequiredEntities(requiredEntities, parameters) {
    const missingEntities = [];
    
    for (const entity of requiredEntities) {
      if (!parameters[entity.entityName]) {
        missingEntities.push(entity);
      }
    }

    return {
      hasAllRequired: missingEntities.length === 0,
      missingEntities
    };
  }

  selectBestResponse(responses, parameters) {
    let bestResponse = null;
    let bestScore = 0;
    let fallbackResponse = null;

    logger.info('Iniciando evaluación de respuestas', { totalRespuestas: responses.length });

    for (const response of responses) {
      logger.info('Evaluando respuesta', { 
        responseId: response.getId(), 
        hasCondition: response.hasCondition()
      });

      if (response.isDefaultResponse()) {
        if (!fallbackResponse) {
          fallbackResponse = response;
          logger.info('Respuesta por defecto guardada', { responseId: response.getId() });
        }
      } else {
        const condition = response.getConditionObject();
        if (condition) {
          const score = this.calculateConditionScore(condition, parameters);
          
          logger.info('Evaluando respuesta con condición', { 
            responseId: response.getId(), 
            condition, 
            parameters, 
            score 
          });
          
          if (score > bestScore) {
            bestScore = score;
            bestResponse = response;
          }
        }
      }
    }

    // Si encontramos una respuesta con condiciones que coincida, usarla
    if (bestResponse && bestScore > 0) {
      logger.info('Mejor respuesta con condiciones encontrada', { 
        responseId: bestResponse.getId(), 
        score: bestScore 
      });

      return ConversationResponseDTO.createFromResponse(bestResponse, bestResponse.getIntentId().toValue(), parameters);
    }

    // Si no hay coincidencias con condiciones, usar respuesta por defecto
    if (fallbackResponse) {
      logger.info('Usando respuesta por defecto', { 
        responseId: fallbackResponse.getId() 
      });

      return ConversationResponseDTO.createFromResponse(fallbackResponse, fallbackResponse.getIntentId().toValue(), parameters);
    }

    logger.warn('No se encontró respuesta válida');
    return ConversationResponseDTO.createFallback('unknown', 'No se encontró respuesta específica');
  }

  calculateConditionScore(condition, parameters) {
    let score = 0;
    let totalConditions = 0;

    for (const [key, value] of Object.entries(condition)) {
      totalConditions++;
      if (parameters[key] === value) {
        score++;
      }
    }

    return totalConditions > 0 ? score / totalConditions : 0;
  }
}

module.exports = { ProcessWebhookUseCase }; 