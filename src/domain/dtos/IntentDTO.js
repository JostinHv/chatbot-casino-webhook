const { Intent } = require('../entities/Intent');

class IntentDTO {
  constructor(intent) {
    if (!(intent instanceof Intent)) {
      throw new Error('IntentDTO requiere una instancia de Intent');
    }
    this.intent = intent;
  }

  static fromIntent(intent) {
    return new IntentDTO(intent);
  }

  static fromDatabase(data) {
    const intent = Intent.fromDatabase(data);
    return new IntentDTO(intent);
  }

  toResponse() {
    return {
      id: this.intent.getId().toValue(),
      name: this.intent.getName().toValue(),
      description: this.intent.getDescription(),
      version: this.intent.getVersion(),
      isActive: this.intent.isActive()
    };
  }

  toDatabase() {
    return this.intent.toDatabase();
  }

  getIntent() {
    return this.intent;
  }
}

module.exports = { IntentDTO }; 