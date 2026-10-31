const BaseRepository = require('./base.repository');
const Vehiculo = require('../models/Vehiculo');
const { pool } = require('../config/db');

class VehiculoRepository extends BaseRepository {
  constructor() { super(Vehiculo); }

  // JOIN con marcas para mostrar el nombre (lo usa el inventario de WordPress)
  consultaBase() {
    return `SELECT t.*, m.nombre AS marca
            FROM vehiculos t
            JOIN marcas m ON m.id_marca = t.id_marca`;
  }

  /** Cambia el estado del vehículo (Disponible, Reservado, Vendido). */
  async cambiarEstado(id, estado) {
    await pool.query('UPDATE vehiculos SET estado = ? WHERE id_vehiculo = ?', [estado, id]);
  }
}

module.exports = new VehiculoRepository();
