const { SessionId } = require('./value-objects/SessionId');
const { IntentName } = require('./value-objects/IntentName');

class Session {
  constructor(sessionId, intent, state = 'iniciada', parameters = {}, timestamp = Date.now(), fallbacks = 0) {
    this.sessionId = SessionId.create(sessionId);
    this.intent = IntentName.create(intent);
    this.state = state;
    this.parameters = { ...parameters };
    this.timestamp = timestamp;
    this.fallbacks = fallbacks;
    this.SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutos
    this.MAX_FALLBACKS = 3;
  }

  static create(sessionId, intent, state = 'iniciada', parameters = {}, timestamp = Date.now(), fallbacks = 0) {
    return new Session(sessionId, intent, state, parameters, timestamp, fallbacks);
  }

  static fromSessionDTO(sessionDTO) {
    return new Session(
      sessionDTO.sessionId,
      sessionDTO.intent,
      sessionDTO.estado,
      sessionDTO.parameters,
      sessionDTO.timestamp,
      sessionDTO.fallbacks
    );
  }

  toSessionDTO() {
    return {
      sessionId: this.sessionId.toValue(),
      intent: this.intent.toValue(),
      estado: this.state,
      parameters: { ...this.parameters },
      timestamp: this.timestamp,
      fallbacks: this.fallbacks
    };
  }

  // Lógica de negocio
  isExpired(timeout = this.SESSION_TIMEOUT) {
    return (Date.now() - this.timestamp) >= timeout;
  }

  updateParameters(newParameters) {
    this.parameters = { ...this.parameters, ...newParameters };
    this.timestamp = Date.now();
  }

  updateState(newState, newParameters = {}) {
    this.state = newState;
    this.updateParameters(newParameters);
  }

  incrementFallbacks() {
    this.fallbacks = (this.fallbacks || 0) + 1;
    this.timestamp = Date.now();
  }

  hasTooManyFallbacks() {
    return this.fallbacks >= this.MAX_FALLBACKS;
  }

  resetFallbacks() {
    this.fallbacks = 0;
  }

  isWaitingForEntity() {
    return this.state.startsWith('esperando_');
  }

  getWaitingEntity() {
    if (this.isWaitingForEntity()) {
      return this.state.replace('esperando_', '');
    }
    return null;
  }

  setWaitingForEntity(entityName) {
    this.state = `esperando_${entityName}`;
    this.timestamp = Date.now();
  }

  complete() {
    this.state = 'completada';
    this.timestamp = Date.now();
  }

  // Getters
  getSessionId() {
    return this.sessionId;
  }

  getIntent() {
    return this.intent;
  }

  getState() {
    return this.state;
  }

  getParameters() {
    return { ...this.parameters };
  }

  getTimestamp() {
    return this.timestamp;
  }

  getFallbacks() {
    return this.fallbacks;
  }

  getSessionTimeout() {
    return this.SESSION_TIMEOUT;
  }

  getMaxFallbacks() {
    return this.MAX_FALLBACKS;
  }

  equals(other) {
    return other instanceof Session && this.sessionId.equals(other.sessionId);
  }
}

module.exports = { Session }; 