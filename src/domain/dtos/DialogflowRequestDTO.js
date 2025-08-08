/**
 * DTO para manejar el formato oficial de entrada de Dialogflow
 * Basado en la documentación oficial: https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook
 */
class DialogflowRequestDTO {
  constructor(data) {
    this.responseId = data.responseId;
    this.session = data.session;
    this.queryResult = new DialogflowQueryResultDTO(data.queryResult);
    this.originalDetectIntentRequest = data.originalDetectIntentRequest;
  }

  /**
   * Crea DTO desde objeto raw de Dialogflow
   * @param {Object} rawData - Datos raw de Dialogflow
   * @returns {DialogflowRequestDTO} DTO creado
   */
  static fromDialogflowRequest(rawData) {
    return new DialogflowRequestDTO(rawData);
  }

  /**
   * Extrae datos procesables para nuestro sistema
   * @returns {Object} Datos extraídos
   */
  extractProcessableData() {
    return {
      intent: this.queryResult.intent.displayName,
      parameters: this.queryResult.parameters || {},
      languageCode: this.queryResult.languageCode || 'es',
      session: this.extractSessionId(),
      confidence: this.queryResult.intentDetectionConfidence || 1.0,
      queryText: this.queryResult.queryText || '',
      action: this.queryResult.action || '',
      allRequiredParamsPresent: this.queryResult.allRequiredParamsPresent || false
    };
  }

  /**
   * Extrae sessionId del formato de Dialogflow
   * @returns {string|null} Session ID extraído
   */
  extractSessionId() {
    if (!this.session) return null;
    
    // Dialogflow session format: "projects/project-id/agent/sessions/session-id"
    const sessionMatch = this.session.match(/sessions\/([^\/]+)$/);
    return sessionMatch ? sessionMatch[1] : this.session;
  }

  /**
   * Valida que el DTO tenga la estructura correcta
   * @returns {Object} Resultado de validación
   */
  validate() {
    const errors = [];

    if (!this.responseId) {
      errors.push('responseId es requerido');
    }

    if (!this.queryResult) {
      errors.push('queryResult es requerido');
    } else {
      const queryResultValidation = this.queryResult.validate();
      if (!queryResultValidation.isValid) {
        errors.push(...queryResultValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte a objeto JSON
   * @returns {Object} Objeto JSON
   */
  toJSON() {
    return {
      responseId: this.responseId,
      session: this.session,
      queryResult: this.queryResult.toJSON(),
      originalDetectIntentRequest: this.originalDetectIntentRequest
    };
  }
}

/**
 * DTO para QueryResult de Dialogflow
 */
class DialogflowQueryResultDTO {
  constructor(data) {
    this.queryText = data.queryText;
    this.action = data.action;
    this.parameters = data.parameters || {};
    this.allRequiredParamsPresent = data.allRequiredParamsPresent || false;
    this.fulfillmentText = data.fulfillmentText || '';
    this.fulfillmentMessages = data.fulfillmentMessages || [];
    this.intent = new DialogflowIntentDTO(data.intent);
    this.intentDetectionConfidence = data.intentDetectionConfidence || 1.0;
    this.diagnosticInfo = data.diagnosticInfo || {};
    this.languageCode = data.languageCode || 'es';
  }

  /**
   * Valida la estructura del QueryResult
   * @returns {Object} Resultado de validación
   */
  validate() {
    const errors = [];

    if (!this.intent) {
      errors.push('intent es requerido');
    } else {
      const intentValidation = this.intent.validate();
      if (!intentValidation.isValid) {
        errors.push(...intentValidation.errors);
      }
    }

    if (this.parameters && typeof this.parameters !== 'object') {
      errors.push('parameters debe ser un objeto');
    }

    if (this.languageCode && typeof this.languageCode !== 'string') {
      errors.push('languageCode debe ser string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte a objeto JSON
   * @returns {Object} Objeto JSON
   */
  toJSON() {
    return {
      queryText: this.queryText,
      action: this.action,
      parameters: this.parameters,
      allRequiredParamsPresent: this.allRequiredParamsPresent,
      fulfillmentText: this.fulfillmentText,
      fulfillmentMessages: this.fulfillmentMessages,
      intent: this.intent.toJSON(),
      intentDetectionConfidence: this.intentDetectionConfidence,
      diagnosticInfo: this.diagnosticInfo,
      languageCode: this.languageCode
    };
  }
}

/**
 * DTO para Intent de Dialogflow
 */
class DialogflowIntentDTO {
  constructor(data) {
    this.name = data.name;
    this.displayName = data.displayName;
  }

  /**
   * Valida la estructura del Intent
   * @returns {Object} Resultado de validación
   */
  validate() {
    const errors = [];

    if (!this.displayName || typeof this.displayName !== 'string') {
      errors.push('intent.displayName es requerido y debe ser string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte a objeto JSON
   * @returns {Object} Objeto JSON
   */
  toJSON() {
    return {
      name: this.name,
      displayName: this.displayName
    };
  }
}

module.exports = { 
  DialogflowRequestDTO, 
  DialogflowQueryResultDTO, 
  DialogflowIntentDTO 
}; 