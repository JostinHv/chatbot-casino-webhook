const { logger } = require('../../infrastructure/logger');

class GetSessionStatsUseCase {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute() {
    logger.info('🔄 INICIO GetSessionStatsUseCase');

    try {
      const stats = await this.sessionRepository.getSessionStats();
      
      logger.info('Estadísticas de sesiones obtenidas', { stats });
      
      return {
        sessions: stats,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error obteniendo estadísticas de sesiones', { 
        error: error.message 
      });
      throw error;
    }
  }
}

module.exports = { GetSessionStatsUseCase }; 