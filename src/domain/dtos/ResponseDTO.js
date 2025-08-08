const { Response } = require('../entities/Response');

class ResponseDTO {
  constructor(response) {
    if (!(response instanceof Response)) {
      throw new Error('ResponseDTO requiere una instancia de Response');
    }
    this.response = response;
  }

  static fromResponse(response) {
    return new ResponseDTO(response);
  }

  static fromDatabase(data) {
    const response = Response.fromDatabase(data);
    return new ResponseDTO(response);
  }

  toResponse() {
    return {
      id: this.response.getId(),
      intentId: this.response.getIntentId().toValue(),
      responseText: this.response.getResponseText(),
      languageCode: this.response.getLanguageCode().toValue(),
      hasCondition: this.response.hasCondition(),
      isDefaultResponse: this.response.isDefaultResponse(),
      condition: this.response.getConditionObject()
    };
  }

  toDatabase() {
    return this.response.toDatabase();
  }

  getResponse() {
    return this.response;
  }
}

module.exports = { ResponseDTO }; 