const { logger } = require('../logger');
const { Session } = require('../../domain/entities/Session');
const { SessionDTO } = require('../../domain/dtos/SessionDTO');
const { ISessionRepository } = require('../../domain/interfaces/ISessionRepository');

class SessionRepository extends ISessionRepository {
  constructor() {
    super();
    this.sessions = new Map();
    this.SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutos
    this.MAX_FALLBACKS = 3;
  }

  // Crear o actualizar sesión
  async createOrUpdateSession(sessionId, intent, parameters = {}) {
    const now = Date.now();
    
    if (this.sessions.has(sessionId)) {
      const existingSession = this.sessions.get(sessionId);
      
      if (!existingSession.isExpired(this.SESSION_TIMEOUT)) {
        // Actualizar sesión existente
        existingSession.updateParameters(parameters);
        logger.info('Sesión actualizada', { sessionId, intent, parameters });
        return SessionDTO.fromSession(existingSession);
      } else {
        logger.info('Sesión expirada, reiniciando', { sessionId, intent });
      }
    }

    // Crear nueva sesión
    const session = Session.create(sessionId, intent, 'iniciada', parameters, now, 0);
    this.sessions.set(sessionId, session);
    logger.info('Nueva sesión creada', { sessionId, intent, parameters });
    
    return SessionDTO.fromSession(session);
  }

  // Obtener sesión
  async getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    if (session.isExpired(this.SESSION_TIMEOUT)) {
      logger.info('Sesión expirada, eliminando', { sessionId });
      this.sessions.delete(sessionId);
      return null;
    }

    return SessionDTO.fromSession(session);
  }

  // Actualizar estado de sesión
  async updateSessionState(sessionId, estado, parameters = {}) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (session.isExpired(this.SESSION_TIMEOUT)) {
      logger.info('Sesión expirada, no se puede actualizar', { sessionId });
      this.sessions.delete(sessionId);
      return false;
    }

    session.updateState(estado, parameters);
    logger.info('Estado de sesión actualizado', { sessionId, estado, parameters });
    return true;
  }

  // Incrementar contador de fallbacks
  async incrementFallbacks(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (session.isExpired(this.SESSION_TIMEOUT)) {
      logger.info('Sesión expirada, no se puede incrementar fallbacks', { sessionId });
      this.sessions.delete(sessionId);
      return false;
    }

    session.incrementFallbacks();
    logger.info('Fallback incrementado', { sessionId, fallbacks: session.getFallbacks() });
    return true;
  }

  // Eliminar sesión
  async clearSession(sessionId) {
    const removed = this.sessions.delete(sessionId);
    if (removed) {
      logger.info('Sesión eliminada', { sessionId });
    }
    return removed;
  }

  // Limpiar sesiones expiradas
  async cleanupExpiredSessions() {
    const expiredSessions = [];
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.isExpired(this.SESSION_TIMEOUT)) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });

    if (expiredSessions.length > 0) {
      logger.info('Sesiones expiradas limpiadas', { count: expiredSessions.length });
    }

    return expiredSessions.length;
  }

  // Obtener estadísticas de sesiones
  async getSessionStats() {
    const now = Date.now();
    const activeSessions = Array.from(this.sessions.values()).filter(
      session => !session.isExpired(this.SESSION_TIMEOUT)
    );

    return {
      total: this.sessions.size,
      active: activeSessions.length,
      expired: this.sessions.size - activeSessions.length
    };
  }

  // Verificar si una sesión tiene demasiados fallbacks
  async hasTooManyFallbacks(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.isExpired(this.SESSION_TIMEOUT)) {
      return false;
    }
    return session.hasTooManyFallbacks();
  }

  // Métodos adicionales para trabajar directamente con entidades
  async getSessionEntity(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  async saveSession(session) {
    if (!(session instanceof Session)) {
      throw new Error('SessionRepository.saveSession requiere una instancia de Session');
    }
    this.sessions.set(session.getSessionId().toValue(), session);
    logger.info('Sesión guardada', { sessionId: session.getSessionId().toValue() });
  }
}

module.exports = { SessionRepository }; 