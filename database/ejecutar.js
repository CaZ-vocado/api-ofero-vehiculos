/**
 * Crea las tablas y carga los datos en la base de la nube sin instalar MySQL:
 *   npm run db:crear
 * Ejecuta database/schema.sql y database/datos.sql y luego muestra el conteo por tabla.
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const ssl = process.env.DB_SSL === 'true'
    ? (process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') } : { rejectUnauthorized: false })
    : undefined;
  const env = process.env;
  const conexion = await mysql.createConnection({
    host: env.DB_HOST || env.MYSQL_ADDON_HOST, port: Number(env.DB_PORT || env.MYSQL_ADDON_PORT || 3306),
    user: env.DB_USER || env.MYSQL_ADDON_USER, password: env.DB_PASSWORD || env.MYSQL_ADDON_PASSWORD,
    database: env.DB_NAME || env.MYSQL_ADDON_DB,
    ssl, multipleStatements: true, charset: 'utf8mb4'
  });
  for (const archivo of ['schema.sql', 'datos.sql']) {
    await conexion.query(fs.readFileSync(path.join(__dirname, archivo), 'utf8'));
    console.log(`✔ ${archivo} ejecutado`);
  }
  const [filas] = await conexion.query(
    "SELECT 'marcas' tabla, COUNT(*) n FROM marcas UNION ALL SELECT 'vehiculos', COUNT(*) FROM vehiculos " +
    "UNION ALL SELECT 'clientes', COUNT(*) FROM clientes UNION ALL SELECT 'accesorios', COUNT(*) FROM accesorios " +
    "UNION ALL SELECT 'ventas', COUNT(*) FROM ventas UNION ALL SELECT 'venta_accesorios', COUNT(*) FROM venta_accesorios");
  console.table(filas);
  await conexion.end();
})().catch((err) => { console.error('✘ Error:', err.message); process.exit(1); });
