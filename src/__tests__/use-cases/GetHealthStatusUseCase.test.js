const { GetHealthStatusUseCase } = require('../../application/use-cases/GetHealthStatusUseCase');

// Mock de DatabaseConnection
jest.mock('../../infrastructure/database/connection', () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => ({
      testConnection: jest.fn()
    }))
  }
}));

const mockSessionRepository = {
  getSessionStats: jest.fn()
};

describe('GetHealthStatusUseCase', () => {
  let useCase;
  let mockDbConnection;

  beforeEach(() => {
    const { DatabaseConnection } = require('../../infrastructure/database/connection');
    mockDbConnection = DatabaseConnection.getInstance();
    
    useCase = new GetHealthStatusUseCase(mockSessionRepository);
    
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('debería retornar estado de salud cuando todo está funcionando', async () => {
      // Arrange
      mockDbConnection.testConnection.mockResolvedValue(true);
      mockSessionRepository.getSessionStats.mockResolvedValue({
        total: 5,
        active: 3,
        expired: 2
      });

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockDbConnection.testConnection).toHaveBeenCalled();
      expect(mockSessionRepository.getSessionStats).toHaveBeenCalled();
      
      expect(result.database.connected).toBe(true);
      expect(result.database.status).toBe('OK');
      expect(result.sessions.total).toBe(5);
      expect(result.sessions.active).toBe(3);
      expect(result.sessions.expired).toBe(2);
      expect(result.sessions.status).toBe('OK');
      expect(result.system.status).toBe('OK');
      expect(result.overall.status).toBe('HEALTHY');
      expect(result.overall.timestamp).toBeDefined();
    });

    it('debería retornar estado no saludable cuando la base de datos falla', async () => {
      // Arrange
      mockDbConnection.testConnection.mockResolvedValue(false);
      mockSessionRepository.getSessionStats.mockResolvedValue({
        total: 0,
        active: 0,
        expired: 0
      });

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.database.connected).toBe(false);
      expect(result.database.status).toBe('ERROR');
      expect(result.overall.status).toBe('UNHEALTHY');
    });

    it('debería manejar errores y retornar estado de error', async () => {
      // Arrange
      mockDbConnection.testConnection.mockRejectedValue(new Error('Error de conexión'));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.database.connected).toBe(false);
      expect(result.database.status).toBe('ERROR');
      expect(result.sessions.status).toBe('ERROR');
      expect(result.system.status).toBe('ERROR');
      expect(result.overall.status).toBe('UNHEALTHY');
      expect(result.overall.error).toBe('Error de conexión');
    });

    it('debería incluir información del sistema', async () => {
      // Arrange
      mockDbConnection.testConnection.mockResolvedValue(true);
      mockSessionRepository.getSessionStats.mockResolvedValue({
        total: 0,
        active: 0,
        expired: 0
      });

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.system.uptime).toBeDefined();
      expect(result.system.environment).toBeDefined();
      expect(result.system.memory.used).toBeDefined();
      expect(result.system.memory.total).toBeDefined();
      expect(result.system.memory.external).toBeDefined();
    });
  });
}); 