const BaseController = require('./base.controller');
const repo = require('../repositories/vehiculo.repository');

class VehiculoController extends BaseController {
  constructor() { super(repo, 'Vehículo', ['id_marca', 'tipo', 'combustible', 'condicion', 'estado']); }
}

module.exports = new VehiculoController();
