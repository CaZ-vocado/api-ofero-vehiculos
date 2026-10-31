const BaseRepository = require('./base.repository');
const Marca = require('../models/Marca');

class MarcaRepository extends BaseRepository {
  constructor() { super(Marca); }

  // Cuenta cuántos vehículos tiene cada marca en el inventario
  consultaBase() {
    return `SELECT t.*, (SELECT COUNT(*) FROM vehiculos v WHERE v.id_marca = t.id_marca) AS total_vehiculos
            FROM marcas t`;
  }
}

module.exports = new MarcaRepository();
