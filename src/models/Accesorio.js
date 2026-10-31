/**
 * Modelo de la tabla `accesorios`: UNA clase con todos sus atributos.
 * Productos adicionales que se venden junto con el vehículo.
 */
class Accesorio {
  static tabla = 'accesorios';
  static llave = 'id_accesorio';
  static campos = {
    codigo:    { tipo: 'texto',  requerido: true, max: 20 },
    nombre:    { tipo: 'texto',  requerido: true, max: 100 },
    categoria: { tipo: 'opcion', requerido: true, opciones: ['Seguridad', 'Confort', 'Tecnología', 'Exterior', 'Mantenimiento'] },
    precio:    { tipo: 'numero', requerido: true, min: 1 },
    stock:     { tipo: 'entero', min: 0 }
  };

  constructor(datos = {}) {
    this.id_accesorio = datos.id_accesorio;
    this.codigo = datos.codigo;
    this.nombre = datos.nombre;
    this.categoria = datos.categoria;
    this.precio = datos.precio;
    this.stock = datos.stock;
    this.creado = datos.creado;
  }
}

module.exports = Accesorio;
