/**
 * Modelo de la tabla `venta_accesorios`: UNA clase con todos sus atributos.
 * Tabla intermedia entre ventas y accesorios. El subtotal lo calcula la base de datos.
 */
class VentaAccesorio {
  static tabla = 'venta_accesorios';
  static llave = 'id_detalle';
  static campos = {
    id_venta:        { tipo: 'entero', requerido: true, min: 1 },  // FK → ventas
    id_accesorio:    { tipo: 'entero', requerido: true, min: 1 },  // FK → accesorios
    cantidad:        { tipo: 'entero', requerido: true, min: 1 },
    precio_unitario: { tipo: 'numero', min: 1 }                    // vacío = precio actual del accesorio
  };

  constructor(datos = {}) {
    this.id_detalle = datos.id_detalle;
    this.id_venta = datos.id_venta;
    this.id_accesorio = datos.id_accesorio;
    this.cantidad = datos.cantidad;
    this.precio_unitario = datos.precio_unitario;
    this.subtotal = datos.subtotal;
    // datos traídos con JOIN (solo lectura)
    this.numero_factura = datos.numero_factura;
    this.accesorio = datos.accesorio;
  }
}

module.exports = VentaAccesorio;
