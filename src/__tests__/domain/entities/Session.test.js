const { Session } = require('../../../domain/entities/Session');
const { SessionId } = require('../../../domain/entities/value-objects/SessionId');

describe('Session', () => {
  describe('create', () => {
    it('debería crear una sesión válida', () => {
      // Arrange
      const sessionId = 'session-123';
      const intent = 'saludar';
      const state = 'iniciada';
      const parameters = { nombre: 'Juan' };
      const timestamp = Date.now();
      const fallbacks = 0;

      // Act
      const session = Session.create(sessionId, intent, state, parameters, timestamp, fallbacks);

      // Assert
      expect(session).toBeInstanceOf(Session);
      expect(session.getSessionId().toValue()).toBe(sessionId);
      expect(session.getIntent().toValue()).toBe(intent);
      expect(session.getState()).toBe(state);
      expect(session.getParameters()).toEqual(parameters);
      expect(session.getTimestamp()).toBe(timestamp);
      expect(session.getFallbacks()).toBe(fallbacks);
    });

    it('debería generar SessionId automáticamente si no se proporciona', () => {
      // Act
      const session = Session.create(null, 'saludar', 'iniciada', {});

      // Assert
      expect(session.getSessionId()).toBeInstanceOf(SessionId);
      expect(session.getSessionId().toValue()).toMatch(/^session-/);
    });
  });

  describe('isExpired', () => {
    it('debería detectar sesión expirada', () => {
      // Arrange
      const oldTimestamp = Date.now() - 600000; // 10 minutos atrás
      const session = Session.create('session-123', 'saludar', 'iniciada', {}, oldTimestamp);
      const timeout = 300000; // 5 minutos

      // Act
      const isExpired = session.isExpired(timeout);

      // Assert
      expect(isExpired).toBe(true);
    });

    it('debería detectar sesión no expirada', () => {
      // Arrange
      const recentTimestamp = Date.now() - 60000; // 1 minuto atrás
      const session = Session.create('session-123', 'saludar', 'iniciada', {}, recentTimestamp);
      const timeout = 300000; // 5 minutos

      // Act
      const isExpired = session.isExpired(timeout);

      // Assert
      expect(isExpired).toBe(false);
    });
  });

  describe('hasTooManyFallbacks', () => {
    it('debería detectar demasiados fallbacks', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {}, Date.now(), 3);

      // Act
      const hasTooMany = session.hasTooManyFallbacks();

      // Assert
      expect(hasTooMany).toBe(true);
    });

    it('debería permitir fallbacks normales', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {}, Date.now(), 2);

      // Act
      const hasTooMany = session.hasTooManyFallbacks();

      // Assert
      expect(hasTooMany).toBe(false);
    });
  });

  describe('updateParameters', () => {
    it('debería actualizar parámetros correctamente', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', { nombre: 'Juan' });
      const newParameters = { nombre: 'María', edad: 25 };

      // Act
      session.updateParameters(newParameters);

      // Assert
      expect(session.getParameters()).toEqual(newParameters);
    });

    it('debería fusionar parámetros existentes con nuevos', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', { nombre: 'Juan' });
      const additionalParameters = { edad: 25 };

      // Act
      session.updateParameters(additionalParameters);

      // Assert
      expect(session.getParameters()).toEqual({ nombre: 'Juan', edad: 25 });
    });
  });

  describe('updateState', () => {
    it('debería actualizar estado y parámetros', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {});
      const newState = 'completada';
      const newParameters = { resultado: 'exitoso' };

      // Act
      session.updateState(newState, newParameters);

      // Assert
      expect(session.getState()).toBe(newState);
      expect(session.getParameters()).toEqual(newParameters);
    });
  });

  describe('incrementFallbacks', () => {
    it('debería incrementar contador de fallbacks', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {}, Date.now(), 1);

      // Act
      session.incrementFallbacks();

      // Assert
      expect(session.getFallbacks()).toBe(2);
    });
  });

  describe('isWaitingForEntity', () => {
    it('debería detectar cuando está esperando entidad', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {});
      session.setWaitingForEntity('fecha');

      // Act
      const isWaiting = session.isWaitingForEntity();

      // Assert
      expect(isWaiting).toBe(true);
    });

    it('debería detectar cuando no está esperando entidad', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', {});

      // Act
      const isWaiting = session.isWaitingForEntity();

      // Assert
      expect(isWaiting).toBe(false);
    });
  });

  describe('fromDatabase', () => {
    it('debería crear sesión desde datos de base de datos', () => {
      // Arrange
      const dbData = {
        sessionId: 'session-123',
        intent: 'saludar',
        state: 'iniciada',
        parameters: JSON.stringify({ nombre: 'Juan' }),
        timestamp: Date.now(),
        fallbacks: 0
      };

      // Act
      const session = Session.fromDatabase(dbData);

      // Assert
      expect(session).toBeInstanceOf(Session);
      expect(session.getSessionId().toValue()).toBe('session-123');
      expect(session.getIntent().toValue()).toBe('saludar');
      expect(session.getParameters()).toEqual({ nombre: 'Juan' });
    });
  });

  describe('toDatabase', () => {
    it('debería convertir sesión a formato de base de datos', () => {
      // Arrange
      const session = Session.create('session-123', 'saludar', 'iniciada', { nombre: 'Juan' }, Date.now(), 0);

      // Act
      const dbData = session.toDatabase();

      // Assert
      expect(dbData.sessionId).toBe('session-123');
      expect(dbData.intent).toBe('saludar');
      expect(dbData.state).toBe('iniciada');
      expect(dbData.parameters).toBe(JSON.stringify({ nombre: 'Juan' }));
      expect(dbData.fallbacks).toBe(0);
    });
  });
}); 