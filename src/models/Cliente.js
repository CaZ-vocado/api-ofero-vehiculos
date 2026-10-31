/**
 * Modelo de la tabla `clientes`: UNA clase con todos sus atributos.
 */
class Cliente {
  static tabla = 'clientes';
  static llave = 'id_cliente';
  static campos = {
    documento: { tipo: 'texto',  requerido: true, max: 20, patron: /^[0-9]{5,20}$/, mensajePatron: 'solo números (5 a 20 dígitos)' },
    nombres:   { tipo: 'texto',  requerido: true, max: 80 },
    apellidos: { tipo: 'texto',  requerido: true, max: 80 },
    correo:    { tipo: 'correo', requerido: true, max: 120 },
    telefono:  { tipo: 'texto',  requerido: true, max: 20 },
    direccion: { tipo: 'texto',  max: 150 },
    ciudad:    { tipo: 'texto',  max: 60 }
  };

  constructor(datos = {}) {
    this.id_cliente = datos.id_cliente;
    this.documento = datos.documento;
    this.nombres = datos.nombres;
    this.apellidos = datos.apellidos;
    this.correo = datos.correo;
    this.telefono = datos.telefono;
    this.direccion = datos.direccion;
    this.ciudad = datos.ciudad;
    this.creado = datos.creado;
    // dato calculado (solo lectura)
    this.total_compras = datos.total_compras;
  }
}

module.exports = Cliente;
