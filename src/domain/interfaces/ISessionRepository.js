/**
 * Interfaz para el repositorio de sesiones
 */
class ISessionRepository {
  /**
   * Crear o actualizar una sesión
   * @param {string} sessionId - ID de la sesión
   * @param {string} intent - Intención de la sesión
   * @param {Object} parameters - Parámetros de la sesión
   * @returns {Promise<SessionDTO>} - Sesión creada o actualizada
   */
  async createOrUpdateSession(sessionId, intent, parameters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener una entidad de sesión por ID
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<Session|null>} - Entidad de sesión encontrada o null
   */
  async getSessionEntity(sessionId) {
    throw new Error('Method not implemented');
  }

  /**
   * Guardar una entidad de sesión
   * @param {Session} session - Entidad de sesión a guardar
   * @returns {Promise<void>}
   */
  async saveSession(session) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener una sesión por ID
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<SessionDTO|null>} - Sesión encontrada o null
   */
  async getSession(sessionId) {
    throw new Error('Method not implemented');
  }

  /**
   * Actualizar el estado de una sesión
   * @param {string} sessionId - ID de la sesión
   * @param {string} estado - Nuevo estado
   * @param {Object} parameters - Nuevos parámetros
   * @returns {Promise<boolean>} - True si se actualizó correctamente
   */
  async updateSessionState(sessionId, estado, parameters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Incrementar el contador de fallbacks de una sesión
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<boolean>} - True si se incrementó correctamente
   */
  async incrementFallbacks(sessionId) {
    throw new Error('Method not implemented');
  }

  /**
   * Eliminar una sesión
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async clearSession(sessionId) {
    throw new Error('Method not implemented');
  }

  /**
   * Limpiar sesiones expiradas
   * @returns {Promise<number>} - Número de sesiones limpiadas
   */
  async cleanupExpiredSessions() {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener estadísticas de sesiones
   * @returns {Promise<Object>} - Estadísticas de sesiones
   */
  async getSessionStats() {
    throw new Error('Method not implemented');
  }

  /**
   * Verificar si una sesión tiene demasiados fallbacks
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<boolean>} - True si tiene demasiados fallbacks
   */
  async hasTooManyFallbacks(sessionId) {
    throw new Error('Method not implemented');
  }
}

module.exports = { ISessionRepository }; 