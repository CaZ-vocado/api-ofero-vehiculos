/**
 * Modelo de la tabla `vehiculos`: UNA clase con todos sus atributos.
 * Inventario de la tienda: cada vehículo es único y se identifica por su VIN.
 */
class Vehiculo {
  static tabla = 'vehiculos';
  static llave = 'id_vehiculo';
  static campos = {
    vin:         { tipo: 'texto',  requerido: true, max: 17, patron: /^[A-HJ-NPR-Z0-9]{17}$/,
                   mensajePatron: '17 caracteres en mayúscula, sin las letras I, O ni Q' },
    referencia:  { tipo: 'texto',  requerido: true, max: 60 },
    version:     { tipo: 'texto',  requerido: true, max: 60 },
    tipo:        { tipo: 'opcion', requerido: true, opciones: ['Sedán', 'Hatchback', 'SUV', 'Pickup', 'Van', 'Deportivo'] },
    anio:        { tipo: 'entero', requerido: true, min: 2000, max: 2027 },
    color:       { tipo: 'texto',  requerido: true, max: 40 },
    combustible: { tipo: 'opcion', requerido: true, opciones: ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico'] },
    transmision: { tipo: 'opcion', requerido: true, opciones: ['Manual', 'Automática'] },
    condicion:   { tipo: 'opcion', opciones: ['Nuevo', 'Usado'] },
    kilometraje: { tipo: 'entero', min: 0 },
    precio:      { tipo: 'numero', requerido: true, min: 1 },
    estado:      { tipo: 'opcion', opciones: ['Disponible', 'Reservado', 'Vendido'] },
    id_marca:    { tipo: 'entero', requerido: true, min: 1 }   // FK → marcas
  };

  constructor(datos = {}) {
    this.id_vehiculo = datos.id_vehiculo;
    this.vin = datos.vin;
    this.referencia = datos.referencia;
    this.version = datos.version;
    this.tipo = datos.tipo;
    this.anio = datos.anio;
    this.color = datos.color;
    this.combustible = datos.combustible;
    this.transmision = datos.transmision;
    this.condicion = datos.condicion;
    this.kilometraje = datos.kilometraje;
    this.precio = datos.precio;
    this.estado = datos.estado;
    this.id_marca = datos.id_marca;
    this.creado = datos.creado;
    // nombre traído con JOIN (solo lectura, lo usa WordPress)
    this.marca = datos.marca;
  }
}

module.exports = Vehiculo;
