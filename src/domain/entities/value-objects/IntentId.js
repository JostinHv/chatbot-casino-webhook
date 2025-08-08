class IntentId {
  constructor(value) {
    if (!value || value <= 0) {
      throw new Error('IntentId debe ser un valor positivo');
    }
    this.value = value;
  }

  static create(value) {
    return new IntentId(value);
  }

  equals(other) {
    return other instanceof IntentId && this.value === other.value;
  }

  toString() {
    return this.value.toString();
  }

  toValue() {
    return this.value;
  }
}

module.exports = { IntentId }; 