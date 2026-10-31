/**
 * Configuración de la aplicación Express.
 */
const express = require('express');
const cors = require('cors');
const rutas = require('./routes');
const { probarConexion } = require('./config/db');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/errores');

const app = express();

app.use(cors());              // permite que WordPress (otro dominio) consuma la API
app.use(express.json());      // lee el cuerpo JSON de las peticiones

// Raíz: estado de la API y de la base de datos
app.get('/', async (req, res) => {
  try {
    const bd = await probarConexion();
    res.json({ ok: true, mensaje: 'API Ofero en línea', datos: { base_de_datos: 'conectada', hora_bd: bd.hora } });
  } catch (err) {
    res.status(503).json({ ok: false, error: 'API en línea, pero sin conexión con la base de datos' });
  }
});

app.use('/api', rutas);
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
