/**
 * Formato único de todas las respuestas JSON de la API.
 *   Éxito: { ok: true,  mensaje, datos }
 *   Error: { ok: false, error,   detalles? }
 */
class ErrorApi extends Error {
  constructor(estado, mensaje, detalles) {
    super(mensaje);
    this.estado = estado;
    this.detalles = detalles;
  }
}

const exito = (res, estado, mensaje, datos) => res.status(estado).json({ ok: true, mensaje, datos });

module.exports = { ErrorApi, exito };
