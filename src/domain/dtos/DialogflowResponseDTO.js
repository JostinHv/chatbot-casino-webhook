/**
 * DTO para manejar el formato oficial de respuesta de Dialogflow
 * Basado en la documentación oficial: https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook
 */
class DialogflowResponseDTO {
  constructor(fulfillmentText, fulfillmentMessages = [], payload = null) {
    this.fulfillmentText = fulfillmentText;
    this.fulfillmentMessages = fulfillmentMessages;
    this.payload = payload;
  }

  /**
   * Crea respuesta desde resultado de nuestro sistema
   * @param {Object} result - Resultado del caso de uso
   * @returns {DialogflowResponseDTO} DTO de respuesta
   */
  static fromProcessResult(result) {
    // Validar que tenemos fulfillmentText
    if (!result.fulfillmentText) {
      return new DialogflowResponseDTO(
        'Lo siento, no pude procesar tu solicitud.',
        [
          {
            text: {
              text: ['Lo siento, no pude procesar tu solicitud.']
            }
          }
        ]
      );
    }

    // Crear mensajes de fulfillment
    const fulfillmentMessages = [
      {
        text: {
          text: [result.fulfillmentText]
        }
      }
    ];

    // Crear payload personalizado si hay datos adicionales
    let payload = null;
    if (result.intent || result.confidence || result.responseId || result.conditions) {
      payload = {
        intent: result.intent,
        confidence: result.confidence,
        responseId: result.responseId,
        conditions: result.conditions,
        sessionState: result.sessionState,
        source: "chatbot-casino-backend"
      };
    }

    return new DialogflowResponseDTO(result.fulfillmentText, fulfillmentMessages, payload);
  }

  /**
   * Crea respuesta de error
   * @param {string} message - Mensaje de error
   * @returns {DialogflowResponseDTO} DTO de respuesta de error
   */
  static createErrorResponse(message = 'Lo siento, ocurrió un error interno.') {
    return new DialogflowResponseDTO(
      message,
      [
        {
          text: {
            text: [message]
          }
        }
      ]
    );
  }

  /**
   * Crea respuesta de validación fallida
   * @param {string} message - Mensaje de validación
   * @returns {DialogflowResponseDTO} DTO de respuesta de validación
   */
  static createValidationErrorResponse(message = 'Error en el formato de la solicitud.') {
    return new DialogflowResponseDTO(
      message,
      [
        {
          text: {
            text: [message]
          }
        }
      ]
    );
  }

  /**
   * Agrega mensaje de fulfillment adicional
   * @param {Object} message - Mensaje a agregar
   * @returns {DialogflowResponseDTO} DTO actualizado
   */
  addFulfillmentMessage(message) {
    this.fulfillmentMessages.push(message);
    return this;
  }

  /**
   * Agrega mensaje de texto simple
   * @param {string} text - Texto a agregar
   * @returns {DialogflowResponseDTO} DTO actualizado
   */
  addTextMessage(text) {
    this.fulfillmentMessages.push({
      text: {
        text: [text]
      }
    });
    return this;
  }

  /**
   * Agrega mensaje de tarjeta (Card)
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {DialogflowResponseDTO} DTO actualizado
   */
  addCardMessage(cardData) {
    this.fulfillmentMessages.push({
      card: {
        title: cardData.title,
        subtitle: cardData.subtitle,
        imageUri: cardData.imageUri,
        buttons: cardData.buttons || []
      }
    });
    return this;
  }

  /**
   * Agrega mensaje de respuesta rápida (Quick Replies)
   * @param {Array} quickReplies - Lista de respuestas rápidas
   * @returns {DialogflowResponseDTO} DTO actualizado
   */
  addQuickRepliesMessage(quickReplies) {
    this.fulfillmentMessages.push({
      quickReplies: {
        title: 'Selecciona una opción:',
        quickReplies: quickReplies
      }
    });
    return this;
  }

  /**
   * Valida que la respuesta tenga la estructura correcta
   * @returns {Object} Resultado de validación
   */
  validate() {
    const errors = [];

    if (!this.fulfillmentText || typeof this.fulfillmentText !== 'string') {
      errors.push('fulfillmentText es requerido y debe ser string');
    }

    if (!Array.isArray(this.fulfillmentMessages)) {
      errors.push('fulfillmentMessages debe ser un array');
    } else {
      this.fulfillmentMessages.forEach((message, index) => {
        if (!message || typeof message !== 'object') {
          errors.push(`fulfillmentMessages[${index}] debe ser un objeto`);
        } else if (!message.text && !message.card && !message.quickReplies) {
          errors.push(`fulfillmentMessages[${index}] debe tener text, card o quickReplies`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte a objeto JSON para respuesta HTTP
   * @returns {Object} Objeto JSON
   */
  toJSON() {
    const response = {
      fulfillmentText: this.fulfillmentText,
      fulfillmentMessages: this.fulfillmentMessages
    };

    if (this.payload) {
      response.payload = this.payload;
    }

    return response;
  }

  /**
   * Convierte a respuesta HTTP completa
   * @returns {Object} Respuesta HTTP
   */
  toHTTPResponse() {
    const validation = this.validate();
    if (!validation.isValid) {
      return {
        status: 400,
        body: DialogflowResponseDTO.createValidationErrorResponse(
          `Error en formato de respuesta: ${validation.errors.join(', ')}`
        ).toJSON()
      };
    }

    return {
      status: 200,
      body: this.toJSON()
    };
  }
}

/**
 * Builder para crear respuestas complejas de Dialogflow
 */
class DialogflowResponseBuilder {
  constructor() {
    this.fulfillmentText = '';
    this.fulfillmentMessages = [];
    this.payload = null;
  }

  /**
   * Establece el texto de fulfillment
   * @param {string} text - Texto de fulfillment
   * @returns {DialogflowResponseBuilder} Builder
   */
  setFulfillmentText(text) {
    this.fulfillmentText = text;
    return this;
  }

  /**
   * Agrega mensaje de texto
   * @param {string} text - Texto del mensaje
   * @returns {DialogflowResponseBuilder} Builder
   */
  addTextMessage(text) {
    this.fulfillmentMessages.push({
      text: {
        text: [text]
      }
    });
    return this;
  }

  /**
   * Agrega mensaje de tarjeta
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {DialogflowResponseBuilder} Builder
   */
  addCard(cardData) {
    this.fulfillmentMessages.push({
      card: cardData
    });
    return this;
  }

  /**
   * Agrega respuestas rápidas
   * @param {Array} quickReplies - Lista de respuestas rápidas
   * @returns {DialogflowResponseBuilder} Builder
   */
  addQuickReplies(quickReplies) {
    this.fulfillmentMessages.push({
      quickReplies: {
        title: 'Selecciona una opción:',
        quickReplies: quickReplies
      }
    });
    return this;
  }

  /**
   * Establece payload personalizado
   * @param {Object} payload - Payload personalizado
   * @returns {DialogflowResponseBuilder} Builder
   */
  setPayload(payload) {
    this.payload = payload;
    return this;
  }

  /**
   * Construye la respuesta final
   * @returns {DialogflowResponseDTO} DTO de respuesta
   */
  build() {
    return new DialogflowResponseDTO(
      this.fulfillmentText,
      this.fulfillmentMessages,
      this.payload
    );
  }
}

module.exports = { 
  DialogflowResponseDTO, 
  DialogflowResponseBuilder 
}; 