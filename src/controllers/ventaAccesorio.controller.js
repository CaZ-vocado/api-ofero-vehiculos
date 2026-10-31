const BaseController = require('./base.controller');
const repo = require('../repositories/ventaAccesorio.repository');
const ventas = require('../repositories/venta.repository');
const { ErrorApi, exito } = require('../middlewares/respuesta');

/**
 * Accesorios de una venta:
 *  - si no se envía precio_unitario, se toma el precio actual del accesorio;
 *  - cada vez que cambia una línea, se recalcula el total de la venta.
 */
class VentaAccesorioController extends BaseController {
  constructor() { super(repo, 'Accesorio de la venta', ['id_venta', 'id_accesorio']); }

  async crear(req, res) {
    const datos = { ...req.datos };
    if (datos.precio_unitario === undefined) {
      datos.precio_unitario = await repo.precioAccesorio(datos.id_accesorio);
      if (datos.precio_unitario === null) throw new ErrorApi(400, `El accesorio con id ${datos.id_accesorio} no existe`);
    }
    const nuevo = await repo.crear(datos);
    await ventas.recalcularTotal(nuevo.id_venta);
    exito(res, 201, 'Accesorio agregado a la venta', nuevo);
  }

  async actualizar(req, res) {
    const anterior = await this.buscar(req.id);
    const actualizado = await repo.actualizar(req.id, req.datos);
    await ventas.recalcularTotal(actualizado.id_venta);
    if (anterior.id_venta !== actualizado.id_venta) await ventas.recalcularTotal(anterior.id_venta);
    exito(res, 200, 'Accesorio de la venta actualizado correctamente', actualizado);
  }

  async eliminar(req, res) {
    const registro = await this.buscar(req.id);
    await repo.eliminar(req.id);
    await ventas.recalcularTotal(registro.id_venta);
    exito(res, 200, 'Accesorio retirado de la venta', registro);
  }
}

module.exports = new VentaAccesorioController();
