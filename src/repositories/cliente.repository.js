const BaseRepository = require('./base.repository');
const Cliente = require('../models/Cliente');

class ClienteRepository extends BaseRepository {
  constructor() { super(Cliente); }

  // Cuenta cuántas compras tiene cada cliente
  consultaBase() {
    return `SELECT t.*, (SELECT COUNT(*) FROM ventas v WHERE v.id_cliente = t.id_cliente) AS total_compras
            FROM clientes t`;
  }
}

module.exports = new ClienteRepository();
