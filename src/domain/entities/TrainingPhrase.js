const { IntentId } = require('./value-objects/IntentId');

class TrainingPhrase {
  constructor(id, intentId, text) {
    this.id = id;
    this.intentId = IntentId.create(intentId);
    this.text = text;
  }

  static create(id, intentId, text) {
    return new TrainingPhrase(id, intentId, text);
  }

  static fromDatabase(data) {
    return new TrainingPhrase(
      data.frase_id,
      data.intencion_id,
      data.texto_frase
    );
  }

  toDatabase() {
    return {
      frase_id: this.id,
      intencion_id: this.intentId.toValue(),
      texto_frase: this.text
    };
  }

  updateText(text) {
    this.text = text;
  }

  getId() {
    return this.id;
  }

  getIntentId() {
    return this.intentId;
  }

  getText() {
    return this.text;
  }

  equals(other) {
    return other instanceof TrainingPhrase && this.id === other.id;
  }
}

module.exports = { TrainingPhrase }; 