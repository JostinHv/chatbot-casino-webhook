class EntityValue {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('EntityValue debe ser una cadena no vacía');
    }
    this.value = value.trim();
  }

  static create(value) {
    return new EntityValue(value);
  }

  equals(other) {
    return other instanceof EntityValue && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  toLowerCase() {
    return this.value.toLowerCase();
  }
}

module.exports = { EntityValue }; 