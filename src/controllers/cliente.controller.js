const BaseController = require('./base.controller');
const repo = require('../repositories/cliente.repository');

class ClienteController extends BaseController {
  constructor() { super(repo, 'Cliente', ['ciudad']); }
}

module.exports = new ClienteController();
