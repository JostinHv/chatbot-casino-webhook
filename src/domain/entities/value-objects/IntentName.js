class IntentName {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('IntentName debe ser una cadena no vacía');
    }
    this.value = value.trim();
  }

  static create(value) {
    return new IntentName(value);
  }

  equals(other) {
    return other instanceof IntentName && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }
}

module.exports = { IntentName }; 