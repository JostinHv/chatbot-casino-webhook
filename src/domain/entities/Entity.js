const { EntityId } = require('./value-objects/EntityId');
const { EntityName } = require('./value-objects/EntityName');

class Entity {
  constructor(id, name) {
    this.id = EntityId.create(id);
    this.name = EntityName.create(name);
    this.values = [];
    this.synonyms = [];
  }

  static create(id, name) {
    return new Entity(id, name);
  }

  static fromDatabase(data) {
    return new Entity(
      data.entidad_id,
      data.nombre
    );
  }

  toDatabase() {
    return {
      entidad_id: this.id.toValue(),
      nombre: this.name.toValue()
    };
  }

  addValue(value) {
    this.values.push(value);
  }

  addSynonym(synonym) {
    this.synonyms.push(synonym);
  }

  getValues() {
    return [...this.values];
  }

  getSynonyms() {
    return [...this.synonyms];
  }

  findValueByCanonical(canonicalValue) {
    return this.values.find(value => value.getCanonicalValue().equals(canonicalValue));
  }

  findSynonymByValue(synonymValue) {
    return this.synonyms.find(synonym => synonym.getSynonym().equals(synonymValue));
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  equals(other) {
    return other instanceof Entity && this.id.equals(other.id);
  }
}

module.exports = { Entity }; 