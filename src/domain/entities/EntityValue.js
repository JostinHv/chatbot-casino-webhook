const { EntityId } = require('./value-objects/EntityId');
const { EntityValue: EntityValueVO } = require('./value-objects/EntityValue');

class EntityValue {
  constructor(id, entityId, canonicalValue, description = '') {
    this.id = id;
    this.entityId = EntityId.create(entityId);
    this.canonicalValue = EntityValueVO.create(canonicalValue);
    this.description = description;
  }

  static create(id, entityId, canonicalValue, description = '') {
    return new EntityValue(id, entityId, canonicalValue, description);
  }

  static fromDatabase(data) {
    return new EntityValue(
      data.valor_id,
      data.entidad_id,
      data.valor_canonico,
      data.descripcion || ''
    );
  }

  toDatabase() {
    return {
      valor_id: this.id,
      entidad_id: this.entityId.toValue(),
      valor_canonico: this.canonicalValue.toValue(),
      descripcion: this.description
    };
  }

  updateDescription(description) {
    this.description = description;
  }

  getId() {
    return this.id;
  }

  getEntityId() {
    return this.entityId;
  }

  getCanonicalValue() {
    return this.canonicalValue;
  }

  getDescription() {
    return this.description;
  }

  equals(other) {
    return other instanceof EntityValue && this.id === other.id;
  }
}

module.exports = { EntityValue }; 