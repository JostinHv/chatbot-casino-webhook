const { IntentId } = require('./value-objects/IntentId');
const { LanguageCode } = require('./value-objects/LanguageCode');

class Response {
  constructor(id, intentId, responseText, languageCode = 'es', condition = null) {
    this.id = id;
    this.intentId = IntentId.create(intentId);
    this.responseText = responseText;
    this.languageCode = LanguageCode.create(languageCode);
    this.condition = condition || {};
  }

  static create(id, intentId, responseText, languageCode = 'es', condition = null) {
    return new Response(id, intentId, responseText, languageCode, condition);
  }

  static fromDatabase(data) {
    let condition = null;
    
    // Manejar condicion que puede venir como string JSON o como objeto
    if (data.condicion) {
      if (typeof data.condicion === 'string') {
        try {
          condition = JSON.parse(data.condicion);
        } catch (error) {
          condition = null;
        }
      } else {
        condition = data.condicion;
      }
    }

    return new Response(
      data.respuesta_id,
      data.intencion_id,
      data.respuesta_texto,
      data.idioma || 'es',
      condition
    );
  }

  toDatabase() {
    return {
      respuesta_id: this.id,
      intencion_id: this.intentId.toValue(),
      respuesta_texto: this.responseText,
      idioma: this.languageCode.toValue(),
      condicion: this.condition ? JSON.stringify(this.condition) : null
    };
  }

  updateResponseText(text) {
    this.responseText = text;
  }

  updateLanguageCode(languageCode) {
    this.languageCode = LanguageCode.create(languageCode);
  }

  updateCondition(condition) {
    this.condition = condition;
  }

  hasCondition() {
    return this.condition && Object.keys(this.condition).length > 0;
  }

  isDefaultResponse() {
    return !this.hasCondition();
  }

  getConditionObject() {
    return this.condition;
  }

  getId() {
    return this.id;
  }

  getIntentId() {
    return this.intentId;
  }

  getResponseText() {
    return this.responseText;
  }

  getLanguageCode() {
    return this.languageCode;
  }

  equals(other) {
    return other instanceof Response && this.id === other.id;
  }
}

module.exports = { Response }; 