const { logger } = require('../logger');
const { InteractionHistory } = require('../../domain/entities/InteractionHistory');
const { IHistoryRepository } = require('../../domain/interfaces/IHistoryRepository');

class HistoryRepository extends IHistoryRepository {
  constructor(dbConnection) {
    super();
    this.dbConnection = dbConnection;
  }

  async saveInteraction(intent, parameters, response) {
    try {
      const responseText = response || 'No response';
      
      await this.dbConnection.query(`
        INSERT INTO historial_interacciones 
        (intencion_detectada, entidades_detectadas, respuesta_devuelta, fecha)
        VALUES (?, ?, ?, NOW())
      `, [intent, JSON.stringify(parameters), responseText]);

      logger.info('Interacción guardada en historial', { intent, parameters });
    } catch (error) {
      logger.error('Error guardando en historial', { error: error.message, intent });
    }
  }

  async getInteractionHistory(limit = 100) {
    try {
      const rows = await this.dbConnection.query(`
        SELECT historial_id, intencion_detectada, entidades_detectadas, respuesta_devuelta, fecha
        FROM historial_interacciones 
        ORDER BY fecha DESC 
        LIMIT ${parseInt(limit)}
      `);

      return rows.map(row => InteractionHistory.fromDatabase(row));
    } catch (error) {
      logger.error('Error obteniendo historial', { error: error.message });
      return [];
    }
  }
}

module.exports = { HistoryRepository }; 