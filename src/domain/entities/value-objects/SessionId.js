class SessionId {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('SessionId debe ser una cadena no vacía');
    }
    this.value = value.trim();
  }

  static create(value) {
    return new SessionId(value);
  }

  static generate() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return new SessionId(`${timestamp}-${random}`);
  }

  equals(other) {
    return other instanceof SessionId && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }
}

module.exports = { SessionId }; 