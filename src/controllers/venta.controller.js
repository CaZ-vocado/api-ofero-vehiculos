const BaseController = require('./base.controller');
const repo = require('../repositories/venta.repository');
const vehiculos = require('../repositories/vehiculo.repository');
const { ErrorApi, exito } = require('../middlewares/respuesta');

/**
 * Reglas de negocio de las ventas:
 *  - solo se vende un vehículo que no esté Vendido (y la llave UNIQUE impide venderlo dos veces);
 *  - si no se envía precio_vehiculo, se toma el precio del inventario;
 *  - al vender, el vehículo pasa a Vendido; si se elimina la venta, vuelve a Disponible;
 *  - el total = precio del vehículo + accesorios, y lo calcula la API.
 */
class VentaController extends BaseController {
  constructor() { super(repo, 'Venta', ['id_cliente', 'id_vehiculo', 'metodo_pago'], true); }

  async revisarVehiculo(id) {
    const vehiculo = await repo.vehiculo(id);
    if (!vehiculo) throw new ErrorApi(400, `El vehículo con id ${id} no existe`);
    if (vehiculo.estado === 'Vendido') throw new ErrorApi(409, 'El vehículo ya fue vendido');
    return vehiculo;
  }

  async crear(req, res) {
    const datos = { ...req.datos };
    const vehiculo = await this.revisarVehiculo(datos.id_vehiculo);
    if (datos.precio_vehiculo === undefined) datos.precio_vehiculo = vehiculo.precio;
    datos.total = datos.precio_vehiculo;
    const nueva = await repo.crear(datos);
    await vehiculos.cambiarEstado(nueva.id_vehiculo, 'Vendido');
    exito(res, 201, 'Venta creada correctamente', await repo.obtener(nueva.id_venta));
  }

  async actualizar(req, res) {
    const anterior = await this.buscar(req.id);
    const cambiaVehiculo = req.datos.id_vehiculo !== undefined && req.datos.id_vehiculo !== anterior.id_vehiculo;
    if (cambiaVehiculo) await this.revisarVehiculo(req.datos.id_vehiculo);
    await repo.actualizar(req.id, req.datos);
    if (cambiaVehiculo) {
      await vehiculos.cambiarEstado(anterior.id_vehiculo, 'Disponible');
      await vehiculos.cambiarEstado(req.datos.id_vehiculo, 'Vendido');
    }
    await repo.recalcularTotal(req.id);
    exito(res, 200, 'Venta actualizada correctamente', await repo.obtener(req.id));
  }

  async eliminar(req, res) {
    const registro = await this.buscar(req.id);
    await repo.eliminar(req.id);                                   // sus accesorios se borran en cascada
    await vehiculos.cambiarEstado(registro.id_vehiculo, 'Disponible');
    exito(res, 200, 'Venta eliminada correctamente; el vehículo vuelve a estar disponible', registro);
  }
}

module.exports = new VentaController();
