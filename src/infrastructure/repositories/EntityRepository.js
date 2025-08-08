const { logger } = require('../logger');
const { DatabaseConnection } = require('../database/connection');
const { IEntityRepository } = require('../../domain/interfaces/IEntityRepository');
const { Intent } = require('../../domain/entities/Intent');
const { Entity } = require('../../domain/entities/Entity');
const { IntentEntity } = require('../../domain/entities/IntentEntity');
const { EntityValue } = require('../../domain/entities/EntityValue');
const { EntitySynonym } = require('../../domain/entities/EntitySynonym');

class EntityRepository extends IEntityRepository {
  constructor(dbConnection) {
    super();
    this.dbConnection = dbConnection;
  }

  async normalizeEntityValue(value, entityName) {
    try {
      const rows = await this.dbConnection.query(`
        SELECT DISTINCT ve.valor_canonico 
        FROM valores_entidad ve 
        LEFT JOIN sinonimos_entidad se ON ve.entidad_id = se.entidad_id AND ve.valor_canonico = se.valor_canonico
        WHERE ve.entidad_id = (SELECT entidad_id FROM entidades WHERE nombre = ?)
        AND (LOWER(ve.valor_canonico) = LOWER(?) OR LOWER(se.sinonimo) = LOWER(?))
        LIMIT 1
      `, [entityName, value, value]);

      const normalizedValue = rows.length > 0 ? rows[0].valor_canonico : value;
      logger.info('Valor normalizado', { original: value, normalized: normalizedValue, entityName });
      
      return normalizedValue;
    } catch (error) {
      logger.error('Error normalizando valor', { error: error.message, value, entityName });
      return value;
    }
  }

  async getRequiredEntities(intentId) {
    try {
      const entidades = await this.dbConnection.query(`
        SELECT 
          e.entidad_id,
          e.nombre as entidad_nombre,
          ie.requerida,
          ie.prompt
        FROM intencion_entidad ie
        JOIN entidades e ON ie.entidad_id = e.entidad_id
        WHERE ie.intencion_id = ? AND ie.requerida = TRUE
        ORDER BY ie.id
      `, [intentId]);

      return entidades.map(ent => ({
        entityId: ent.entidad_id,
        entityName: ent.entidad_nombre,
        required: ent.requerida,
        prompt: ent.prompt
      }));
    } catch (error) {
      logger.error('Error obteniendo entidades requeridas', { error: error.message, intentId });
      return [];
    }
  }

  async validateIntent(intent) {
    try {
      const intenciones = await this.dbConnection.query(
        'SELECT intencion_id, nombre, estado_activo FROM intenciones WHERE nombre = ? AND estado_activo = TRUE',
        [intent]
      );

      if (intenciones.length === 0) {
        logger.warn('Intención no encontrada o inactiva', { intent });
        return { isValid: false, message: 'Intención no reconocida' };
      }

      return { 
        isValid: true, 
        intentId: intenciones[0].intencion_id,
        intentName: intenciones[0].nombre
      };
    } catch (error) {
      logger.error('Error validando intención', { error: error.message, intent });
      return { isValid: false, message: 'Error validando intención' };
    }
  }

  // Métodos adicionales para trabajar con entidades
  async getIntentByName(intentName) {
    try {
      const intenciones = await this.dbConnection.query(
        'SELECT intencion_id, nombre, descripcion, version, estado_activo FROM intenciones WHERE nombre = ?',
        [intentName]
      );

      if (intenciones.length === 0) {
        return null;
      }

      return Intent.fromDatabase(intenciones[0]);
    } catch (error) {
      logger.error('Error obteniendo intención por nombre', { error: error.message, intentName });
      return null;
    }
  }

  async getEntityByName(entityName) {
    try {
      const entidades = await this.dbConnection.query(
        'SELECT entidad_id, nombre FROM entidades WHERE nombre = ?',
        [entityName]
      );

      if (entidades.length === 0) {
        return null;
      }

      return Entity.fromDatabase(entidades[0]);
    } catch (error) {
      logger.error('Error obteniendo entidad por nombre', { error: error.message, entityName });
      return null;
    }
  }

  async getIntentEntities(intentId) {
    try {
      const intentEntities = await this.dbConnection.query(`
        SELECT id, intencion_id, entidad_id, requerida, prompt
        FROM intencion_entidad 
        WHERE intencion_id = ?
        ORDER BY id
      `, [intentId]);

      return intentEntities.map(data => IntentEntity.fromDatabase(data));
    } catch (error) {
      logger.error('Error obteniendo entidades de intención', { error: error.message, intentId });
      return [];
    }
  }

  async getEntityValues(entityId) {
    try {
      const values = await this.dbConnection.query(`
        SELECT valor_id, entidad_id, valor_canonico, descripcion
        FROM valores_entidad 
        WHERE entidad_id = ?
        ORDER BY valor_canonico
      `, [entityId]);

      return values.map(data => EntityValue.fromDatabase(data));
    } catch (error) {
      logger.error('Error obteniendo valores de entidad', { error: error.message, entityId });
      return [];
    }
  }

  async getEntitySynonyms(entityId) {
    try {
      const synonyms = await this.dbConnection.query(`
        SELECT sinonimo_id, entidad_id, valor_canonico, sinonimo
        FROM sinonimos_entidad 
        WHERE entidad_id = ?
        ORDER BY valor_canonico, sinonimo
      `, [entityId]);

      return synonyms.map(data => EntitySynonym.fromDatabase(data));
    } catch (error) {
      logger.error('Error obteniendo sinónimos de entidad', { error: error.message, entityId });
      return [];
    }
  }
}

module.exports = { EntityRepository }; 