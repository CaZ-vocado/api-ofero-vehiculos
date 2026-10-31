/**
 * Modelo de la tabla `ventas`: UNA clase con todos sus atributos.
 * Factura de venta de un vehículo a un cliente. Es la tabla con más relaciones.
 */
class Venta {
  static tabla = 'ventas';
  static llave = 'id_venta';
  static campos = {
    numero_factura:  { tipo: 'texto',  requerido: true, max: 20 },
    fecha:           { tipo: 'fechaHora' },                        // vacío = ahora
    metodo_pago:     { tipo: 'opcion', requerido: true, opciones: ['Contado', 'Crédito bancario', 'Leasing', 'Permuta'] },
    precio_vehiculo: { tipo: 'numero', min: 1 },                   // vacío = precio del inventario
    id_cliente:      { tipo: 'entero', requerido: true, min: 1 },  // FK → clientes
    id_vehiculo:     { tipo: 'entero', requerido: true, min: 1 }   // FK → vehiculos
  };

  constructor(datos = {}) {
    this.id_venta = datos.id_venta;
    this.numero_factura = datos.numero_factura;
    this.fecha = datos.fecha;
    this.metodo_pago = datos.metodo_pago;
    this.precio_vehiculo = datos.precio_vehiculo;
    this.total = datos.total;
    this.id_cliente = datos.id_cliente;
    this.id_vehiculo = datos.id_vehiculo;
    this.creado = datos.creado;
    // nombres traídos con JOIN (solo lectura)
    this.cliente = datos.cliente;
    this.vehiculo = datos.vehiculo;
  }
}

module.exports = Venta;
