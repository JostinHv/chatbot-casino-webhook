const { logger } = require('../logger');
const { Response } = require('../../domain/entities/Response');
const { ResponseDTO } = require('../../domain/dtos/ResponseDTO');
const { IResponseRepository } = require('../../domain/interfaces/IResponseRepository');

class ResponseRepository extends IResponseRepository {
  constructor(dbConnection) {
    super();
    this.dbConnection = dbConnection;
  }

  async findResponsesForIntent(intentId, languageCode = 'es') {
    try {
      logger.info('Buscando respuestas para intentId', { intentId, languageCode });
      
      const rows = await this.dbConnection.query(`
        SELECT respuesta_id, respuesta_texto, condicion, idioma, intencion_id
        FROM respuestas 
        WHERE intencion_id = ? AND idioma = ?
        ORDER BY respuesta_id ASC
      `, [intentId, languageCode]);

      logger.info('Respuestas encontradas', { count: rows.length, intentId });
      
      return rows.map(row => {
        try {
          return Response.fromDatabase(row);
        } catch (error) {
          logger.error('Error creando Response desde BD', { 
            error: error.message, 
            row, 
            intentId 
          });
          return null;
        }
      }).filter(response => response !== null);
    } catch (error) {
      logger.error('Error obteniendo respuestas', { error: error.message, intentId });
      return [];
    }
  }

  async getIntentByName(intent) {
    try {
      const intenciones = await this.dbConnection.query(
        'SELECT intencion_id FROM intenciones WHERE nombre = ? AND estado_activo = TRUE',
        [intent]
      );

      return intenciones.length > 0 ? intenciones[0] : null;
    } catch (error) {
      logger.error('Error obteniendo intención', { error: error.message, intent });
      return null;
    }
  }
}

module.exports = { ResponseRepository }; 