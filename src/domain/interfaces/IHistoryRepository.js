/**
 * Interfaz para el repositorio de historial
 */
class IHistoryRepository {
  /**
   * Guardar una interacción en el historial
   * @param {string} intent - Intención detectada
   * @param {Object} parameters - Parámetros de la interacción
   * @param {string} response - Respuesta devuelta
   * @returns {Promise<void>}
   */
  async saveInteraction(intent, parameters, response) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener historial de interacciones
   * @param {number} limit - Límite de registros
   * @returns {Promise<Array<InteractionHistory>>} - Lista de entidades de historial
   */
  async getInteractionHistory(limit = 100) {
    throw new Error('Method not implemented');
  }
}

module.exports = { IHistoryRepository }; 