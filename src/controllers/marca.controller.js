const BaseController = require('./base.controller');
const repo = require('../repositories/marca.repository');

class MarcaController extends BaseController {
  constructor() { super(repo, 'Marca', [], true); }
}

module.exports = new MarcaController();
