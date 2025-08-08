const { DatabaseConnection } = require('../database/connection');
const { SessionRepository } = require('../repositories/SessionRepository');
const { EntityRepository } = require('../repositories/EntityRepository');
const { ResponseRepository } = require('../repositories/ResponseRepository');
const { HistoryRepository } = require('../repositories/HistoryRepository');
const { ProcessWebhookUseCase } = require('../../application/use-cases/ProcessWebhookUseCase');
const { GetSessionInfoUseCase } = require('../../application/use-cases/GetSessionInfoUseCase');
const { ClearSessionUseCase } = require('../../application/use-cases/ClearSessionUseCase');
const { GetInteractionHistoryUseCase } = require('../../application/use-cases/GetInteractionHistoryUseCase');
const { GetHealthStatusUseCase } = require('../../application/use-cases/GetHealthStatusUseCase');
const { GetSessionStatsUseCase } = require('../../application/use-cases/GetSessionStatsUseCase');

class DependencyContainer {
  constructor() {
    this.instances = new Map();
  }

  // Singleton para la conexión de base de datos
  getDatabaseConnection() {
    if (!this.instances.has('databaseConnection')) {
      this.instances.set('databaseConnection', DatabaseConnection.getInstance());
    }
    return this.instances.get('databaseConnection');
  }

  // Repositorios
  getSessionRepository() {
    if (!this.instances.has('sessionRepository')) {
      this.instances.set('sessionRepository', new SessionRepository());
    }
    return this.instances.get('sessionRepository');
  }

  getEntityRepository() {
    if (!this.instances.has('entityRepository')) {
      const dbConnection = this.getDatabaseConnection();
      this.instances.set('entityRepository', new EntityRepository(dbConnection));
    }
    return this.instances.get('entityRepository');
  }

  getResponseRepository() {
    if (!this.instances.has('responseRepository')) {
      const dbConnection = this.getDatabaseConnection();
      this.instances.set('responseRepository', new ResponseRepository(dbConnection));
    }
    return this.instances.get('responseRepository');
  }

  getHistoryRepository() {
    if (!this.instances.has('historyRepository')) {
      const dbConnection = this.getDatabaseConnection();
      this.instances.set('historyRepository', new HistoryRepository(dbConnection));
    }
    return this.instances.get('historyRepository');
  }

  // Casos de uso
  getProcessWebhookUseCase() {
    if (!this.instances.has('processWebhookUseCase')) {
      const sessionRepository = this.getSessionRepository();
      const entityRepository = this.getEntityRepository();
      const responseRepository = this.getResponseRepository();
      const historyRepository = this.getHistoryRepository();

      this.instances.set('processWebhookUseCase', new ProcessWebhookUseCase(
        sessionRepository,
        entityRepository,
        responseRepository,
        historyRepository
      ));
    }
    return this.instances.get('processWebhookUseCase');
  }

  getGetSessionInfoUseCase() {
    if (!this.instances.has('getSessionInfoUseCase')) {
      const sessionRepository = this.getSessionRepository();
      this.instances.set('getSessionInfoUseCase', new GetSessionInfoUseCase(sessionRepository));
    }
    return this.instances.get('getSessionInfoUseCase');
  }

  getClearSessionUseCase() {
    if (!this.instances.has('clearSessionUseCase')) {
      const sessionRepository = this.getSessionRepository();
      this.instances.set('clearSessionUseCase', new ClearSessionUseCase(sessionRepository));
    }
    return this.instances.get('clearSessionUseCase');
  }

  getGetInteractionHistoryUseCase() {
    if (!this.instances.has('getInteractionHistoryUseCase')) {
      const historyRepository = this.getHistoryRepository();
      this.instances.set('getInteractionHistoryUseCase', new GetInteractionHistoryUseCase(historyRepository));
    }
    return this.instances.get('getInteractionHistoryUseCase');
  }

  getGetHealthStatusUseCase() {
    if (!this.instances.has('getHealthStatusUseCase')) {
      const sessionRepository = this.getSessionRepository();
      this.instances.set('getHealthStatusUseCase', new GetHealthStatusUseCase(sessionRepository));
    }
    return this.instances.get('getHealthStatusUseCase');
  }

  getGetSessionStatsUseCase() {
    if (!this.instances.has('getSessionStatsUseCase')) {
      const sessionRepository = this.getSessionRepository();
      this.instances.set('getSessionStatsUseCase', new GetSessionStatsUseCase(sessionRepository));
    }
    return this.instances.get('getSessionStatsUseCase');
  }

  // Método para limpiar todas las instancias (útil para testing)
  clear() {
    this.instances.clear();
  }
}

// Singleton del contenedor
let containerInstance = null;

function getContainer() {
  if (!containerInstance) {
    containerInstance = new DependencyContainer();
  }
  return containerInstance;
}

module.exports = { DependencyContainer, getContainer }; 