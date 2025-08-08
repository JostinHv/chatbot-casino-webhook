const { IntentName } = require('./value-objects/IntentName');

class InteractionHistory {
  constructor(id, detectedIntent, detectedEntities, returnedResponse, date = new Date()) {
    this.id = id;
    this.detectedIntent = IntentName.create(detectedIntent);
    this.detectedEntities = detectedEntities || {};
    this.returnedResponse = returnedResponse;
    this.date = date;
  }

  static create(id, detectedIntent, detectedEntities, returnedResponse, date = new Date()) {
    return new InteractionHistory(id, detectedIntent, detectedEntities, returnedResponse, date);
  }

  static fromDatabase(data) {
    return new InteractionHistory(
      data.historial_id,
      data.intencion_detectada,
      data.entidades_detectadas ? JSON.parse(data.entidades_detectadas) : {},
      data.respuesta_devuelta,
      new Date(data.fecha)
    );
  }

  toDatabase() {
    return {
      historial_id: this.id,
      intencion_detectada: this.detectedIntent.toValue(),
      entidades_detectadas: JSON.stringify(this.detectedEntities),
      respuesta_devuelta: this.returnedResponse,
      fecha: this.date.toISOString()
    };
  }

  getId() {
    return this.id;
  }

  getDetectedIntent() {
    return this.detectedIntent;
  }

  getDetectedEntities() {
    return { ...this.detectedEntities };
  }

  getReturnedResponse() {
    return this.returnedResponse;
  }

  getDate() {
    return this.date;
  }

  equals(other) {
    return other instanceof InteractionHistory && this.id === other.id;
  }
}

module.exports = { InteractionHistory }; 