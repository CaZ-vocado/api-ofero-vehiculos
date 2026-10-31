/**
 * Manejo centralizado de errores: convierte cualquier error en una respuesta JSON clara.
 * Traduce los errores de MySQL (llaves únicas, foráneas, restricciones) a códigos HTTP.
 */
const { ErrorApi } = require('./respuesta');

const MENSAJES_UNIQUE = {
  uq_marcas_nombre: 'Ya existe una marca con ese nombre',
  uq_vehiculos_vin: 'Ya existe un vehículo con ese VIN',
  uq_clientes_documento: 'Ya existe un cliente con ese documento',
  uq_clientes_correo: 'Ya existe un cliente con ese correo',
  uq_accesorios_codigo: 'Ya existe un accesorio con ese código',
  uq_ventas_factura: 'Ya existe una venta con ese número de factura',
  uq_ventas_vehiculo: 'Ese vehículo ya tiene una venta registrada',
  uq_venta_accesorio: 'Ese accesorio ya está en la venta; actualiza la cantidad en su lugar'
};

function traducirMySQL(err) {
  switch (err.code) {
    case 'ER_DUP_ENTRY': {
      const restriccion = Object.keys(MENSAJES_UNIQUE).find((k) => err.sqlMessage.includes(k));
      return new ErrorApi(409, MENSAJES_UNIQUE[restriccion] || 'Registro duplicado (viola una llave única)');
    }
    case 'ER_NO_REFERENCED_ROW_2':
    case 'ER_NO_REFERENCED_ROW':
      return new ErrorApi(400, 'La llave foránea apunta a un registro que no existe',
        [err.sqlMessage.match(/FOREIGN KEY \(`(\w+)`\)/)?.[1] ? `Revisa ${err.sqlMessage.match(/FOREIGN KEY \(`(\w+)`\)/)[1]}` : err.sqlMessage]);
    case 'ER_ROW_IS_REFERENCED_2':
    case 'ER_ROW_IS_REFERENCED':
      return new ErrorApi(409, 'No se puede eliminar: el registro está siendo usado por otra tabla');
    case 'ER_CHECK_CONSTRAINT_VIOLATED':
    case 'ER_CONSTRAINT_FAILED':
      return new ErrorApi(400, 'El dato no cumple una restricción de la base de datos', [err.sqlMessage]);
    case 'ER_TRUNCATED_WRONG_VALUE':
    case 'WARN_DATA_TRUNCATED':
    case 'ER_DATA_TOO_LONG':
      return new ErrorApi(400, 'Dato con formato o tamaño inválido', [err.sqlMessage]);
    case 'ECONNREFUSED':
    case 'ETIMEDOUT':
    case 'PROTOCOL_CONNECTION_LOST':
    case 'ER_ACCESS_DENIED_ERROR':
      return new ErrorApi(503, 'No hay conexión con la base de datos');
    default:
      return null;
  }
}

// 404 para rutas que no existen
function rutaNoEncontrada(req, res, next) {
  next(new ErrorApi(404, `La ruta ${req.method} ${req.originalUrl} no existe`));
}

// eslint-disable-next-line no-unused-vars
function manejarErrores(err, req, res, next) {
  let error = err instanceof ErrorApi ? err : traducirMySQL(err);
  if (!error && err.type === 'entity.parse.failed') error = new ErrorApi(400, 'El cuerpo de la petición no es un JSON válido');
  if (!error) {
    console.error(err);
    error = new ErrorApi(500, 'Error interno del servidor');
  }
  const cuerpo = { ok: false, error: error.message };
  if (error.detalles) cuerpo.detalles = error.detalles;
  res.status(error.estado).json(cuerpo);
}

module.exports = { rutaNoEncontrada, manejarErrores };
