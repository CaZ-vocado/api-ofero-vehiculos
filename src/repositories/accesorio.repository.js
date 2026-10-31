const BaseRepository = require('./base.repository');
const Accesorio = require('../models/Accesorio');

class AccesorioRepository extends BaseRepository {
  constructor() { super(Accesorio); }
}

module.exports = new AccesorioRepository();
