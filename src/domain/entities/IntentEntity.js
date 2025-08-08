const { IntentId } = require('./value-objects/IntentId');
const { EntityId } = require('./value-objects/EntityId');

class IntentEntity {
  constructor(id, intentId, entityId, required = false, prompt = '') {
    this.id = id;
    this.intentId = IntentId.create(intentId);
    this.entityId = EntityId.create(entityId);
    this.required = required;
    this.prompt = prompt;
  }

  static create(id, intentId, entityId, required = false, prompt = '') {
    return new IntentEntity(id, intentId, entityId, required, prompt);
  }

  static fromDatabase(data) {
    return new IntentEntity(
      data.id,
      data.intencion_id,
      data.entidad_id,
      data.requerida === 1 || data.requerida === true,
      data.prompt || ''
    );
  }

  toDatabase() {
    return {
      id: this.id,
      intencion_id: this.intentId.toValue(),
      entidad_id: this.entityId.toValue(),
      requerida: this.required ? 1 : 0,
      prompt: this.prompt
    };
  }

  setRequired(required) {
    this.required = required;
  }

  setPrompt(prompt) {
    this.prompt = prompt;
  }

  isRequired() {
    return this.required;
  }

  getId() {
    return this.id;
  }

  getIntentId() {
    return this.intentId;
  }

  getEntityId() {
    return this.entityId;
  }

  getPrompt() {
    return this.prompt;
  }

  equals(other) {
    return other instanceof IntentEntity && this.id === other.id;
  }
}

module.exports = { IntentEntity }; 