const BaseRepository = require('./base.repository');
const VentaAccesorio = require('../models/VentaAccesorio');
const { pool } = require('../config/db');

class VentaAccesorioRepository extends BaseRepository {
  constructor() { super(VentaAccesorio); }

  consultaBase() {
    return `SELECT t.*, v.numero_factura, a.nombre AS accesorio
            FROM venta_accesorios t
            JOIN ventas v     ON v.id_venta     = t.id_venta
            JOIN accesorios a ON a.id_accesorio = t.id_accesorio`;
  }

  /** Precio actual del accesorio (se usa si no se envía precio_unitario). */
  async precioAccesorio(id) {
    const [filas] = await pool.query('SELECT precio FROM accesorios WHERE id_accesorio = ?', [id]);
    return filas[0] ? filas[0].precio : null;
  }
}

module.exports = new VentaAccesorioRepository();
