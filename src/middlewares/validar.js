/**
 * Validación de los datos de entrada según las reglas declaradas en cada modelo (Modelo.campos).
 *   validar(Venta)         → POST: exige los campos requeridos
 *   validar(Venta, true)   → PUT: actualización parcial, todo opcional (pero al menos un campo)
 * Solo deja pasar los campos editables: id, creado, total, subtotal... se ignoran si llegan.
 */
const { ErrorApi } = require('./respuesta');

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_VALIDA = /^https?:\/\/\S+$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function revisarCampo(nombre, regla, valor) {
  switch (regla.tipo) {
    case 'texto':
    case 'correo':
    case 'url':
      if (typeof valor !== 'string') return `${nombre} debe ser texto`;
      if (regla.requerido && !valor.trim()) return `${nombre} no puede estar vacío`;
      if (regla.max && valor.length > regla.max) return `${nombre} admite máximo ${regla.max} caracteres`;
      if (regla.tipo === 'correo' && !CORREO.test(valor)) return `${nombre} no es un correo válido`;
      if (regla.tipo === 'url' && valor && !URL_VALIDA.test(valor)) return `${nombre} debe empezar por http:// o https://`;
      if (regla.patron && !regla.patron.test(valor)) return `${nombre}: ${regla.mensajePatron}`;
      return null;
    case 'entero':
    case 'numero': {
      const n = Number(valor);
      if (valor === '' || typeof valor === 'boolean' || Number.isNaN(n)) return `${nombre} debe ser un número`;
      if (regla.tipo === 'entero' && !Number.isInteger(n)) return `${nombre} debe ser un número entero`;
      if (regla.min !== undefined && n < regla.min) return `${nombre} debe ser mayor o igual a ${regla.min}`;
      if (regla.max !== undefined && n > regla.max) return `${nombre} debe ser menor o igual a ${regla.max}`;
      return null;
    }
    case 'opcion':
      return regla.opciones.includes(valor) ? null : `${nombre} debe ser uno de: ${regla.opciones.join(', ')}`;
    case 'fecha':
      return typeof valor === 'string' && FECHA.test(valor) && !Number.isNaN(Date.parse(valor))
        ? null : `${nombre} debe ser una fecha válida (AAAA-MM-DD)`;
    case 'fechaHora':
      return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/.test(valor) && !Number.isNaN(Date.parse(valor.replace(' ', 'T')))
        ? null : `${nombre} debe ser una fecha válida (AAAA-MM-DD HH:MM)`;
    case 'hora': {
      if (typeof valor !== 'string' || !HORA.test(valor)) return `${nombre} debe ser una hora válida (HH:MM)`;
      if (regla.min && valor.slice(0, 5) < regla.min) return `${nombre} debe ser desde las ${regla.min}`;
      if (regla.max && valor.slice(0, 5) > regla.max) return `${nombre} debe ser hasta las ${regla.max}`;
      return null;
    }
    case 'booleano':
      return typeof valor === 'boolean' || valor === 0 || valor === 1 ? null : `${nombre} debe ser true o false`;
    default:
      return null;
  }
}

function validar(Modelo, parcial = false) {
  return (req, res, next) => {
    const cuerpo = req.body || {};
    const errores = [];
    const limpio = {};

    for (const [nombre, regla] of Object.entries(Modelo.campos)) {
      const valor = cuerpo[nombre];
      const falta = valor === undefined || valor === null || valor === '';
      if (falta) {
        if (regla.requerido && !parcial) errores.push(`${nombre} es obligatorio`);
        else if (valor === null && parcial && !regla.requerido) limpio[nombre] = null;   // permite borrar un opcional
        continue;
      }
      const error = revisarCampo(nombre, regla, valor);
      if (error) errores.push(error);
      else if (['entero', 'numero'].includes(regla.tipo)) limpio[nombre] = Number(valor);
      else if (regla.tipo === 'booleano') limpio[nombre] = Boolean(valor);
      else limpio[nombre] = valor;
    }

    if (errores.length) return next(new ErrorApi(400, 'Datos inválidos', errores));
    if (parcial && !Object.keys(limpio).length) {
      return next(new ErrorApi(400, 'Envía al menos un campo para actualizar',
        [`Campos permitidos: ${Object.keys(Modelo.campos).join(', ')}`]));
    }
    req.datos = limpio;
    next();
  };
}

/** Verifica que el :id de la URL sea un entero positivo. */
function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return next(new ErrorApi(400, 'El id debe ser un número entero positivo'));
  req.id = id;
  next();
}

module.exports = { validar, validarId };
