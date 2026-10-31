const BaseController = require('./base.controller');
const repo = require('../repositories/accesorio.repository');

class AccesorioController extends BaseController {
  constructor() { super(repo, 'Accesorio', ['categoria']); }
}

module.exports = new AccesorioController();
