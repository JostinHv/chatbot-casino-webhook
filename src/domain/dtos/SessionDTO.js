const { Session } = require('../entities/Session');

class SessionDTO {
  constructor(session) {
    if (!(session instanceof Session)) {
      throw new Error('SessionDTO requiere una instancia de Session');
    }
    this.session = session;
  }

  static fromSession(session) {
    return new SessionDTO(session);
  }

  static fromSessionData(sessionId, intent, estado, parameters = {}, timestamp = Date.now(), fallbacks = 0) {
    const session = Session.create(sessionId, intent, estado, parameters, timestamp, fallbacks);
    return new SessionDTO(session);
  }

  toResponse() {
    return {
      sessionId: this.session.getSessionId().toValue(),
      intent: this.session.getIntent().toValue(),
      estado: this.session.getState(),
      parameters: this.session.getParameters(),
      timestamp: this.session.getTimestamp(),
      fallbacks: this.session.getFallbacks(),
      isExpired: this.session.isExpired(),
      isWaitingForEntity: this.session.isWaitingForEntity(),
      waitingEntity: this.session.getWaitingEntity()
    };
  }

  toSessionData() {
    return this.session.toSessionDTO();
  }

  getSession() {
    return this.session;
  }
}

module.exports = { SessionDTO }; 