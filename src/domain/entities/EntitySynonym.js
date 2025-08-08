const { EntityId } = require('./value-objects/EntityId');
const { EntityValue: EntityValueVO } = require('./value-objects/EntityValue');

class EntitySynonym {
  constructor(id, entityId, canonicalValue, synonym) {
    this.id = id;
    this.entityId = EntityId.create(entityId);
    this.canonicalValue = EntityValueVO.create(canonicalValue);
    this.synonym = EntityValueVO.create(synonym);
  }

  static create(id, entityId, canonicalValue, synonym) {
    return new EntitySynonym(id, entityId, canonicalValue, synonym);
  }

  static fromDatabase(data) {
    return new EntitySynonym(
      data.sinonimo_id,
      data.entidad_id,
      data.valor_canonico,
      data.sinonimo
    );
  }

  toDatabase() {
    return {
      sinonimo_id: this.id,
      entidad_id: this.entityId.toValue(),
      valor_canonico: this.canonicalValue.toValue(),
      sinonimo: this.synonym.toValue()
    };
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

  getSynonym() {
    return this.synonym;
  }

  equals(other) {
    return other instanceof EntitySynonym && this.id === other.id;
  }
}

module.exports = { EntitySynonym }; 