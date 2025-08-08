const { ProcessWebhookUseCase } = require('../../application/use-cases/ProcessWebhookUseCase');
const { ConversationResponseDTO } = require('../../domain/dtos/ConversationResponseDTO');

// Mocks
const mockSessionRepository = {
  createOrUpdateSession: jest.fn(),
  updateSessionState: jest.fn(),
  saveSession: jest.fn(),
  clearSession: jest.fn(),
  getSession: jest.fn()
};

const mockEntityRepository = {
  validateIntent: jest.fn(),
  getRequiredEntities: jest.fn(),
  normalizeEntityValue: jest.fn()
};

const mockResponseRepository = {
  getIntentByName: jest.fn(),
  findResponsesForIntent: jest.fn()
};

const mockHistoryRepository = {
  saveInteraction: jest.fn()
};

describe('ProcessWebhookUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new ProcessWebhookUseCase(
      mockSessionRepository,
      mockEntityRepository,
      mockResponseRepository,
      mockHistoryRepository
    );
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('debería procesar webhook con intención válida sin entidades requeridas', async () => {
      // Arrange
      const intent = 'saludar';
      const parameters = { nombre: 'Juan' };
      const languageCode = 'es';

      mockEntityRepository.validateIntent.mockResolvedValue({
        isValid: true,
        intentId: 1,
        intentName: 'saludar'
      });

      mockEntityRepository.getRequiredEntities.mockResolvedValue([]);

      mockResponseRepository.getIntentByName.mockResolvedValue({
        intencion_id: 1
      });

      const mockResponses = [
        { getId: () => 1, getText: () => '¡Hola!', hasCondition: () => false, isDefaultResponse: () => true }
      ];

      mockResponseRepository.findResponsesForIntent.mockResolvedValue(mockResponses);

      // Act
      const result = await useCase.execute(intent, parameters, null, languageCode);

      // Assert
      expect(mockEntityRepository.validateIntent).toHaveBeenCalledWith(intent);
      expect(mockEntityRepository.getRequiredEntities).toHaveBeenCalledWith(1);
      expect(mockResponseRepository.getIntentByName).toHaveBeenCalledWith(intent);
      expect(mockResponseRepository.findResponsesForIntent).toHaveBeenCalledWith(1, languageCode);
      expect(mockHistoryRepository.saveInteraction).toHaveBeenCalledWith(intent, parameters, expect.any(String));
      expect(result).toBeInstanceOf(ConversationResponseDTO);
    });

    it('debería devolver fallback para intención inválida', async () => {
      // Arrange
      const intent = 'intencion_invalida';
      const parameters = {};

      mockEntityRepository.validateIntent.mockResolvedValue({
        isValid: false,
        message: 'Intención no reconocida'
      });

      // Act
      const result = await useCase.execute(intent, parameters);

      // Assert
      expect(mockEntityRepository.validateIntent).toHaveBeenCalledWith(intent);
      expect(result.fulfillmentText).toBe('Intención no reconocida');
      expect(result.intent).toBe(intent);
    });

    it('debería procesar flujo conversacional con entidades requeridas', async () => {
      // Arrange
      const intent = 'reservar_mesa';
      const parameters = { fecha: '2024-01-15' };
      const sessionId = 'session-123';

      mockEntityRepository.validateIntent.mockResolvedValue({
        isValid: true,
        intentId: 2,
        intentName: 'reservar_mesa'
      });

      mockEntityRepository.getRequiredEntities.mockResolvedValue([
        { entityName: 'fecha', required: true, prompt: '¿Qué fecha?' },
        { entityName: 'hora', required: true, prompt: '¿Qué hora?' }
      ]);

      mockSessionRepository.createOrUpdateSession.mockResolvedValue({
        getSession: () => ({
          getState: () => 'iniciada',
          setWaitingForEntity: jest.fn()
        })
      });

      mockEntityRepository.normalizeEntityValue.mockImplementation((value, key) => value);

      // Act
      const result = await useCase.execute(intent, parameters, sessionId);

      // Assert
      expect(mockSessionRepository.createOrUpdateSession).toHaveBeenCalledWith(sessionId, intent, parameters);
      expect(result.fulfillmentText).toContain('¿Qué hora?');
      expect(result.sessionState).toBe('iniciada');
    });

    it('debería manejar errores internos', async () => {
      // Arrange
      const intent = 'saludar';
      const parameters = {};

      mockEntityRepository.validateIntent.mockRejectedValue(new Error('Error de base de datos'));

      // Act
      const result = await useCase.execute(intent, parameters);

      // Assert
      expect(result.fulfillmentText).toBe('Error interno del servidor');
      expect(result.intent).toBe(intent);
    });
  });

  describe('validateRequiredEntities', () => {
    it('debería validar entidades requeridas correctamente', () => {
      // Arrange
      const requiredEntities = [
        { entityName: 'fecha', required: true },
        { entityName: 'hora', required: true }
      ];
      const parameters = { fecha: '2024-01-15' };

      // Act
      const result = useCase.validateRequiredEntities(requiredEntities, parameters);

      // Assert
      expect(result.hasAllRequired).toBe(false);
      expect(result.missingEntities).toHaveLength(1);
      expect(result.missingEntities[0].entityName).toBe('hora');
    });

    it('debería retornar true cuando todas las entidades están presentes', () => {
      // Arrange
      const requiredEntities = [
        { entityName: 'fecha', required: true },
        { entityName: 'hora', required: true }
      ];
      const parameters = { fecha: '2024-01-15', hora: '19:00' };

      // Act
      const result = useCase.validateRequiredEntities(requiredEntities, parameters);

      // Assert
      expect(result.hasAllRequired).toBe(true);
      expect(result.missingEntities).toHaveLength(0);
    });
  });

  describe('calculateConditionScore', () => {
    it('debería calcular score correctamente', () => {
      // Arrange
      const condition = { fecha: '2024-01-15', hora: '19:00' };
      const parameters = { fecha: '2024-01-15', hora: '19:00' };

      // Act
      const score = useCase.calculateConditionScore(condition, parameters);

      // Assert
      expect(score).toBe(1.0); // 100% match
    });

    it('debería calcular score parcial correctamente', () => {
      // Arrange
      const condition = { fecha: '2024-01-15', hora: '19:00' };
      const parameters = { fecha: '2024-01-15', hora: '20:00' };

      // Act
      const score = useCase.calculateConditionScore(condition, parameters);

      // Assert
      expect(score).toBe(0.5); // 50% match
    });
  });
}); 