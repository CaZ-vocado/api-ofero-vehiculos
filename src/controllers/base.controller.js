/**
 * Controlador base: la lógica de los 5 endpoints CRUD, común a todas las tablas.
 * Cada tabla tiene su propio controlador que hereda de este.
 */
const { ErrorApi, exito } = require('../middlewares/respuesta');

class BaseController {
  /**
   * @param repo      repositorio de la tabla
   * @param nombre    nombre en singular para los mensajes ("Venta")
   * @param filtros   parámetros de consulta permitidos en GET /lista (?id_marca=2)
   * @param femenino  true si el nombre es femenino ("Venta creada", "Cliente creado")
   */
  constructor(repo, nombre, filtros = [], femenino = false) {
    this.repo = repo;
    this.nombre = nombre;
    this.filtros = filtros;
    this.o = femenino ? 'a' : 'o';   // terminación de los mensajes
    // Se enlazan para poder pasarlos directamente a Express
    for (const m of ['listar', 'obtener', 'crear', 'actualizar', 'eliminar']) this[m] = this[m].bind(this);
  }

  filtrosDe(query) {
    const filtros = {};
    for (const f of this.filtros) if (query[f] !== undefined && query[f] !== '') filtros[f] = query[f];
    return filtros;
  }

  async buscar(id) {
    const registro = await this.repo.obtener(id);
    if (!registro) throw new ErrorApi(404, `${this.nombre} con id ${id} no encontrad${this.o}`);
    return registro;
  }

  // GET /api/recurso
  async listar(req, res) {
    const datos = await this.repo.listar(this.filtrosDe(req.query));
    exito(res, 200, `${datos.length} registros encontrados`, datos);
  }

  // GET /api/recurso/:id
  async obtener(req, res) {
    exito(res, 200, `${this.nombre} encontrad${this.o}`, await this.buscar(req.id));
  }

  // POST /api/recurso
  async crear(req, res) {
    const nuevo = await this.repo.crear(req.datos);
    exito(res, 201, `${this.nombre} cread${this.o} correctamente`, nuevo);
  }

  // PUT /api/recurso/:id
  async actualizar(req, res) {
    await this.buscar(req.id);
    const actualizado = await this.repo.actualizar(req.id, req.datos);
    exito(res, 200, `${this.nombre} actualizad${this.o} correctamente`, actualizado);
  }

  // DELETE /api/recurso/:id
  async eliminar(req, res) {
    const registro = await this.buscar(req.id);
    await this.repo.eliminar(req.id);
    exito(res, 200, `${this.nombre} eliminad${this.o} correctamente`, registro);
  }
}

module.exports = BaseController;
