class EntityId {
  constructor(value) {
    if (!value || value <= 0) {
      throw new Error('EntityId debe ser un valor positivo');
    }
    this.value = value;
  }

  static create(value) {
    return new EntityId(value);
  }

  equals(other) {
    return other instanceof EntityId && this.value === other.value;
  }

  toString() {
    return this.value.toString();
  }

  toValue() {
    return this.value;
  }
}

module.exports = { EntityId }; 