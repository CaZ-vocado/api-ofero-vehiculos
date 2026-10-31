/** Pasa los errores de las funciones async al manejador de errores (Express 4 no lo hace solo). */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
