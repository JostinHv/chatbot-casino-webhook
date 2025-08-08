const { SessionId } = require('../../../domain/entities/value-objects/SessionId');

describe('SessionId', () => {
  describe('create', () => {
    it('debería crear SessionId válido', () => {
      // Arrange
      const value = 'session-123';

      // Act
      const sessionId = SessionId.create(value);

      // Assert
      expect(sessionId).toBeInstanceOf(SessionId);
      expect(sessionId.toValue()).toBe(value);
    });

    it('debería generar SessionId automáticamente', () => {
      // Act
      const sessionId = SessionId.generate();

      // Assert
      expect(sessionId).toBeInstanceOf(SessionId);
      expect(sessionId.toValue()).toMatch(/^session-[a-zA-Z0-9]{8}$/);
    });

    it('debería validar formato válido', () => {
      // Arrange
      const validValues = [
        'session-123',
        'session-abc123',
        'session-123456789'
      ];

      validValues.forEach(value => {
        // Act & Assert
        expect(() => SessionId.create(value)).not.toThrow();
      });
    });

    it('debería rechazar formato inválido', () => {
      // Arrange
      const invalidValues = [
        '',
        'invalid',
        '123',
        'session',
        'session_123'
      ];

      invalidValues.forEach(value => {
        // Act & Assert
        expect(() => SessionId.create(value)).toThrow('SessionId debe tener formato válido');
      });
    });
  });

  describe('toValue', () => {
    it('debería retornar el valor como string', () => {
      // Arrange
      const value = 'session-123';
      const sessionId = SessionId.create(value);

      // Act
      const result = sessionId.toValue();

      // Assert
      expect(result).toBe(value);
      expect(typeof result).toBe('string');
    });
  });

  describe('equals', () => {
    it('debería ser igual a otro SessionId con mismo valor', () => {
      // Arrange
      const value = 'session-123';
      const sessionId1 = SessionId.create(value);
      const sessionId2 = SessionId.create(value);

      // Act
      const areEqual = sessionId1.equals(sessionId2);

      // Assert
      expect(areEqual).toBe(true);
    });

    it('debería ser diferente a otro SessionId con valor distinto', () => {
      // Arrange
      const sessionId1 = SessionId.create('session-123');
      const sessionId2 = SessionId.create('session-456');

      // Act
      const areEqual = sessionId1.equals(sessionId2);

      // Assert
      expect(areEqual).toBe(false);
    });

    it('debería ser diferente a null', () => {
      // Arrange
      const sessionId = SessionId.create('session-123');

      // Act
      const areEqual = sessionId.equals(null);

      // Assert
      expect(areEqual).toBe(false);
    });
  });

  describe('toString', () => {
    it('debería retornar representación string', () => {
      // Arrange
      const value = 'session-123';
      const sessionId = SessionId.create(value);

      // Act
      const result = sessionId.toString();

      // Assert
      expect(result).toBe(`SessionId(${value})`);
    });
  });
}); 