/**
 * Interfaz para el repositorio de entidades
 */
class IEntityRepository {
  /**
   * Normalizar un valor de entidad
   * @param {string} value - Valor a normalizar
   * @param {string} entityName - Nombre de la entidad
   * @returns {Promise<string>} - Valor normalizado
   */
  async normalizeEntityValue(value, entityName) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener entidades requeridas para una intención
   * @param {number} intentId - ID de la intención
   * @returns {Promise<Array>} - Lista de entidades requeridas
   */
  async getRequiredEntities(intentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Validar una intención
   * @param {string} intent - Nombre de la intención
   * @returns {Promise<Object>} - Resultado de la validación
   */
  async validateIntent(intent) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener una intención por nombre
   * @param {string} intentName - Nombre de la intención
   * @returns {Promise<Intent|null>} - Entidad de intención encontrada o null
   */
  async getIntentByName(intentName) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener una entidad por nombre
   * @param {string} entityName - Nombre de la entidad
   * @returns {Promise<Entity|null>} - Entidad encontrada o null
   */
  async getEntityByName(entityName) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener entidades de una intención
   * @param {number} intentId - ID de la intención
   * @returns {Promise<Array<IntentEntity>>} - Lista de entidades de intención
   */
  async getIntentEntities(intentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener valores de una entidad
   * @param {number} entityId - ID de la entidad
   * @returns {Promise<Array<EntityValue>>} - Lista de valores de entidad
   */
  async getEntityValues(entityId) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtener sinónimos de una entidad
   * @param {number} entityId - ID de la entidad
   * @returns {Promise<Array<EntitySynonym>>} - Lista de sinónimos de entidad
   */
  async getEntitySynonyms(entityId) {
    throw new Error('Method not implemented');
  }
}

module.exports = { IEntityRepository }; 