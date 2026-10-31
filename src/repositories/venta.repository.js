const BaseRepository = require('./base.repository');
const Venta = require('../models/Venta');
const { pool } = require('../config/db');

class VentaRepository extends BaseRepository {
  constructor() { super(Venta); }

  // JOIN con clientes, vehículos y marcas para mostrar nombres en lugar de ids
  consultaBase() {
    return `SELECT t.*, CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
                   CONCAT(m.nombre, ' ', ve.referencia, ' ', ve.version) AS vehiculo
            FROM ventas t
            JOIN clientes c   ON c.id_cliente   = t.id_cliente
            JOIN vehiculos ve ON ve.id_vehiculo = t.id_vehiculo
            JOIN marcas m     ON m.id_marca     = ve.id_marca`;
  }

  /** Precio y estado del vehículo (para validar la venta). */
  async vehiculo(id) {
    const [filas] = await pool.query('SELECT precio, estado FROM vehiculos WHERE id_vehiculo = ?', [id]);
    return filas[0] || null;
  }

  /** Total de la venta = precio del vehículo + subtotales de sus accesorios. */
  async recalcularTotal(idVenta) {
    await pool.query(
      `UPDATE ventas SET total = precio_vehiculo +
         (SELECT COALESCE(SUM(subtotal), 0) FROM venta_accesorios WHERE id_venta = ?)
       WHERE id_venta = ?`, [idVenta, idVenta]);
  }
}

module.exports = new VentaRepository();
