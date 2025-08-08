const { logger } = require('../../infrastructure/logger');

class GetInteractionHistoryUseCase {
  constructor(historyRepository) {
    this.historyRepository = historyRepository;
  }

  async execute(limit = 100) {
    logger.info('🔄 INICIO GetInteractionHistoryUseCase', { limit });

    try {
      const history = await this.historyRepository.getInteractionHistory(limit);
      
      logger.info('Historial de interacciones obtenido', { 
        count: history.length,
        limit 
      });

      return history.map(interaction => ({
        id: interaction.getId(),
        intent: interaction.getDetectedIntent().toValue(),
        parameters: interaction.getDetectedEntities(),
        response: interaction.getReturnedResponse(),
        date: interaction.getDate()
      }));

    } catch (error) {
      logger.error('Error obteniendo historial de interacciones', { 
        error: error.message,
        limit 
      });
      throw error;
    }
  }
}

module.exports = { GetInteractionHistoryUseCase }; 