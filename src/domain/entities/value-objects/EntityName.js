class EntityName {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('EntityName debe ser una cadena no vacía');
    }
    this.value = value.trim();
  }

  static create(value) {
    return new EntityName(value);
  }

  equals(other) {
    return other instanceof EntityName && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }
}

module.exports = { EntityName }; 