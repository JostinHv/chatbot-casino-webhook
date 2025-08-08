// Value Objects
const { IntentId } = require('./value-objects/IntentId');
const { EntityId } = require('./value-objects/EntityId');
const { IntentName } = require('./value-objects/IntentName');
const { EntityName } = require('./value-objects/EntityName');
const { EntityValue } = require('./value-objects/EntityValue');
const { LanguageCode } = require('./value-objects/LanguageCode');
const { SessionId } = require('./value-objects/SessionId');

// Entities
const { Intent } = require('./Intent');
const { Entity } = require('./Entity');
const { EntityValue: EntityValueEntity } = require('./EntityValue');
const { EntitySynonym } = require('./EntitySynonym');
const { Response } = require('./Response');
const { IntentEntity } = require('./IntentEntity');
const { TrainingPhrase } = require('./TrainingPhrase');
const { InteractionHistory } = require('./InteractionHistory');
const { Session } = require('./Session');

module.exports = {
  // Value Objects
  IntentId,
  EntityId,
  IntentName,
  EntityName,
  EntityValue,
  LanguageCode,
  SessionId,
  
  // Entities
  Intent,
  Entity,
  EntityValue: EntityValueEntity,
  EntitySynonym,
  Response,
  IntentEntity,
  TrainingPhrase,
  InteractionHistory,
  Session
}; 