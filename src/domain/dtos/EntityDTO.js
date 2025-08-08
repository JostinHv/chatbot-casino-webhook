const { Entity } = require('../entities/Entity');

class EntityDTO {
  constructor(entity) {
    if (!(entity instanceof Entity)) {
      throw new Error('EntityDTO requiere una instancia de Entity');
    }
    this.entity = entity;
  }

  static fromEntity(entity) {
    return new EntityDTO(entity);
  }

  static fromDatabase(data) {
    const entity = Entity.fromDatabase(data);
    return new EntityDTO(entity);
  }

  toResponse() {
    return {
      id: this.entity.getId().toValue(),
      name: this.entity.getName().toValue(),
      values: this.entity.getValues().map(value => ({
        id: value.getId(),
        canonicalValue: value.getCanonicalValue().toValue(),
        description: value.getDescription()
      })),
      synonyms: this.entity.getSynonyms().map(synonym => ({
        id: synonym.getId(),
        canonicalValue: synonym.getCanonicalValue().toValue(),
        synonym: synonym.getSynonym().toValue()
      }))
    };
  }

  toDatabase() {
    return this.entity.toDatabase();
  }

  getEntity() {
    return this.entity;
  }
}

module.exports = { EntityDTO }; 