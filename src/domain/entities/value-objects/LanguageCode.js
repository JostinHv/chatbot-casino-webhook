class LanguageCode {
  constructor(value) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('LanguageCode debe ser una cadena no vacía');
    }
    this.value = value.trim().toLowerCase();
  }

  static create(value) {
    return new LanguageCode(value);
  }

  static getDefault() {
    return new LanguageCode('es');
  }

  equals(other) {
    return other instanceof LanguageCode && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  isValid() {
    const validCodes = ['es', 'en', 'fr', 'pt'];
    return validCodes.includes(this.value);
  }
}

module.exports = { LanguageCode }; 