/**
 * Interfaz para el repositorio de respuestas
 */
class IResponseRepository {
  /**
   * Obtener respuestas para una intención
   * @param {number} intentId - ID de la intención
   * @param {string} languageCode - Código de idioma
   * @returns {Promise<Array<Response>>} - Lista de entidades de respuesta
   */
  async findResponsesForIntent(intentId, languageCode = 'es') {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener intención por nombre
   * @param {string} intent - Nombre de la intención
   * @returns {Promise<Object|null>} - Intención encontrada o null
   */
  async getIntentByName(intent) {
    throw new Error('Method not implemented');
  }
}

module.exports = { IResponseRepository }; 