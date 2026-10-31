/**
 * Conexión a MySQL (módulo independiente).
 * Lee las credenciales del archivo .env (local) o de las variables de entorno (Render).
 * Acepta los nombres propios (DB_HOST...) o los que entrega Clever Cloud (MYSQL_ADDON_HOST...).
 * Usa un "pool": reutiliza conexiones abiertas en lugar de abrir una nueva por consulta.
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

function configuracionSSL() {
  if (process.env.DB_SSL !== 'true') return undefined;
  if (process.env.DB_SSL_CA) {
    // Certificado del proveedor: conexión cifrada y verificada
    return { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false }; // cifrada, sin verificar el certificado
}

const env = process.env;

const pool = mysql.createPool({
  host: env.DB_HOST || env.MYSQL_ADDON_HOST,
  port: Number(env.DB_PORT || env.MYSQL_ADDON_PORT || 3306),
  user: env.DB_USER || env.MYSQL_ADDON_USER,
  password: env.DB_PASSWORD || env.MYSQL_ADDON_PASSWORD,
  database: env.DB_NAME || env.MYSQL_ADDON_DB,
  ssl: configuracionSSL(),
  waitForConnections: true,          // si las conexiones están ocupadas, la petición espera su turno
  // Clever Cloud (plan gratis DEV) permite máximo 5 conexiones simultáneas:
  // la API usa 3 y deja 2 libres para phpMyAdmin o Workbench.
  connectionLimit: Number(env.DB_CONNECTION_LIMIT || 3),
  maxIdle: 3,
  idleTimeout: 60000,                // libera conexiones inactivas después de 1 minuto
  enableKeepAlive: true,
  decimalNumbers: true,   // DECIMAL llega como número, no como texto
  dateStrings: true,      // fechas tal como están en la BD
  charset: 'utf8mb4'
});

async function probarConexion() {
  const [filas] = await pool.query('SELECT NOW() AS hora, DATABASE() AS base');
  return filas[0];
}

module.exports = { pool, probarConexion };
