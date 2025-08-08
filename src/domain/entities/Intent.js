const { IntentId } = require('./value-objects/IntentId');
const { IntentName } = require('./value-objects/IntentName');

class Intent {
  constructor(id, name, description = '', version = 1, isActive = true) {
    this.id = IntentId.create(id);
    this.name = IntentName.create(name);
    this.description = description;
    this.version = version;
    this.isActive = isActive;
  }

  static create(id, name, description = '', version = 1, isActive = true) {
    return new Intent(id, name, description, version, isActive);
  }

  static fromDatabase(data) {
    return new Intent(
      data.intencion_id,
      data.nombre,
      data.descripcion || '',
      data.version || 1,
      data.estado_activo === 1 || data.estado_activo === true
    );
  }

  toDatabase() {
    return {
      intencion_id: this.id.toValue(),
      nombre: this.name.toValue(),
      descripcion: this.description,
      version: this.version,
      estado_activo: this.isActive ? 1 : 0
    };
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  updateDescription(description) {
    this.description = description;
  }

  updateVersion(version) {
    this.version = version;
  }

  isActive() {
    return this.isActive;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getVersion() {
    return this.version;
  }

  equals(other) {
    return other instanceof Intent && this.id.equals(other.id);
  }
}

module.exports = { Intent }; 