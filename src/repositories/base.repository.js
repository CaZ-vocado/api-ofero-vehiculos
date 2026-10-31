/**
 * Repositorio base: el CRUD genérico que heredan los repositorios de cada tabla.
 * Es el ÚNICO lugar (junto con sus hijos) donde se escribe SQL.
 * Los valores siempre van con marcadores (?) → no hay riesgo de inyección SQL.
 */
const { pool } = require('../config/db');

class BaseRepository {
  /** @param Modelo clase del modelo (define tabla, llave y campos) */
  constructor(Modelo) {
    this.Modelo = Modelo;
    this.tabla = Modelo.tabla;
    this.llave = Modelo.llave;
  }

  /** Consulta usada para listar y obtener (los hijos la reemplazan para agregar JOIN). */
  consultaBase() {
    return `SELECT * FROM ${this.tabla} t`;
  }

  async listar(filtros = {}) {
    const condiciones = [];
    const valores = [];
    for (const [campo, valor] of Object.entries(filtros)) {
      condiciones.push(`t.${campo} = ?`);
      valores.push(valor);
    }
    const where = condiciones.length ? ` WHERE ${condiciones.join(' AND ')}` : '';
    const [filas] = await pool.query(`${this.consultaBase()}${where} ORDER BY t.${this.llave}`, valores);
    return filas.map((f) => new this.Modelo(f));
  }

  async obtener(id) {
    const [filas] = await pool.query(`${this.consultaBase()} WHERE t.${this.llave} = ?`, [id]);
    return filas[0] ? new this.Modelo(filas[0]) : null;
  }

  async crear(datos) {
    const [resultado] = await pool.query(`INSERT INTO ${this.tabla} SET ?`, [datos]);
    return this.obtener(resultado.insertId);
  }

  async actualizar(id, datos) {
    if (Object.keys(datos).length) {
      const [resultado] = await pool.query(`UPDATE ${this.tabla} SET ? WHERE ${this.llave} = ?`, [datos, id]);
      if (resultado.affectedRows === 0) return null;
    }
    return this.obtener(id);
  }

  async eliminar(id) {
    const [resultado] = await pool.query(`DELETE FROM ${this.tabla} WHERE ${this.llave} = ?`, [id]);
    return resultado.affectedRows > 0;
  }
}

module.exports = BaseRepository;
