const { logger } = require('../../infrastructure/logger');

class GetSessionInfoUseCase {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute(sessionId) {
    logger.info('🔄 INICIO GetSessionInfoUseCase', { sessionId });

    try {
      const sessionDTO = await this.sessionRepository.getSession(sessionId);
      
      if (!sessionDTO) {
        logger.warn('Sesión no encontrada', { sessionId });
        return null;
      }

      logger.info('Información de sesión obtenida', { sessionId });
      return sessionDTO.toResponse();

    } catch (error) {
      logger.error('Error obteniendo información de sesión', { 
        error: error.message, 
        sessionId 
      });
      throw error;
    }
  }
}

module.exports = { GetSessionInfoUseCase }; 