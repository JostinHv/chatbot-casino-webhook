class ConversationResponseDTO {
  constructor(fulfillmentText, intent, confidence, responseId = null, conditions = {}, sessionState = null) {
    this.fulfillmentText = fulfillmentText;
    this.intent = intent;
    this.confidence = confidence;
    this.responseId = responseId;
    this.conditions = conditions;
    this.sessionState = sessionState;
  }

  static createFallback(intent, message) {
    return new ConversationResponseDTO(
      message,
      intent,
      0.3,
      null,
      {}
    );
  }

  static createFromResponse(response, intent, parameters, confidence = 1.0) {
    return new ConversationResponseDTO(
      response.getResponseText(),
      intent,
      confidence,
      response.getId(),
      parameters
    );
  }

  static createPrompt(intent, prompt, parameters, sessionState) {
    return new ConversationResponseDTO(
      prompt,
      intent,
      0.5,
      null,
      parameters,
      sessionState
    );
  }

  toJSON() {
    return {
      fulfillmentText: this.fulfillmentText,
      intent: this.intent,
      confidence: this.confidence,
      responseId: this.responseId,
      conditions: this.conditions,
      sessionState: this.sessionState
    };
  }
}

module.exports = { ConversationResponseDTO }; 