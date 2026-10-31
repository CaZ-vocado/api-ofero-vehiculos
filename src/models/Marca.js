/**
 * Modelo de la tabla `marcas`: UNA clase con todos sus atributos.
 * Fabricantes de los vehículos (Toyota, Chevrolet, Renault...).
 */
class Marca {
  static tabla = 'marcas';
  static llave = 'id_marca';
  static campos = {
    nombre:      { tipo: 'texto', requerido: true, max: 60 },
    pais_origen: { tipo: 'texto', requerido: true, max: 60 },
    sitio_web:   { tipo: 'url',   max: 150 }
  };

  constructor(datos = {}) {
    this.id_marca = datos.id_marca;
    this.nombre = datos.nombre;
    this.pais_origen = datos.pais_origen;
    this.sitio_web = datos.sitio_web;
    this.creado = datos.creado;
    // dato calculado (solo lectura)
    this.total_vehiculos = datos.total_vehiculos;
  }
}

module.exports = Marca;
