const { logger } = require('../../infrastructure/logger');
const { DatabaseConnection } = require('../../infrastructure/database/connection');

class GetHealthStatusUseCase {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute() {
    logger.info('🔄 INICIO GetHealthStatusUseCase');

    try {
      // Verificar conexión a base de datos
      const dbConnection = DatabaseConnection.getInstance();
      const isConnected = await dbConnection.testConnection();
      
      // Obtener estadísticas de sesiones
      const sessionStats = await this.sessionRepository.getSessionStats();
      
      // Obtener información del sistema
      const healthData = {
        database: { 
          connected: isConnected,
          status: isConnected ? 'OK' : 'ERROR'
        },
        sessions: {
          ...sessionStats,
          status: 'OK'
        },
        system: {
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            external: Math.round(process.memoryUsage().external / 1024 / 1024)
          },
          status: 'OK'
        },
        overall: {
          status: isConnected ? 'HEALTHY' : 'UNHEALTHY',
          timestamp: new Date().toISOString()
        }
      };

      logger.info('Estado de salud obtenido', { 
        databaseConnected: isConnected,
        sessionCount: sessionStats.total
      });

      return healthData;

    } catch (error) {
      logger.error('Error obteniendo estado de salud', { 
        error: error.message 
      });
      
      return {
        database: { connected: false, status: 'ERROR' },
        sessions: { status: 'ERROR' },
        system: { status: 'ERROR' },
        overall: {
          status: 'UNHEALTHY',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

module.exports = { GetHealthStatusUseCase }; 