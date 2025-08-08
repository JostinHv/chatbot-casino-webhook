const { logger } = require('../../infrastructure/logger');

class ClearSessionUseCase {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute(sessionId) {
    logger.info('🔄 INICIO ClearSessionUseCase', { sessionId });

    try {
      const removed = await this.sessionRepository.clearSession(sessionId);
      
      if (removed) {
        logger.info('Sesión eliminada exitosamente', { sessionId });
        return { success: true, message: 'Sesión eliminada exitosamente' };
      } else {
        logger.warn('Sesión no encontrada para eliminar', { sessionId });
        return { success: false, message: 'Sesión no encontrada' };
      }

    } catch (error) {
      logger.error('Error eliminando sesión', { 
        error: error.message, 
        sessionId 
      });
      throw error;
    }
  }
}

module.exports = { ClearSessionUseCase }; 