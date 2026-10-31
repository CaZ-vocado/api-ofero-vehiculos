-- =====================================================================
--  Ofero · Consultas de validación (ejecutar en la nube)
-- =====================================================================

-- 1. Conteo de registros por tabla
SELECT 'marcas' AS tabla, COUNT(*) AS registros FROM marcas
UNION ALL SELECT 'vehiculos',        COUNT(*) FROM vehiculos
UNION ALL SELECT 'clientes',         COUNT(*) FROM clientes
UNION ALL SELECT 'accesorios',       COUNT(*) FROM accesorios
UNION ALL SELECT 'ventas',           COUNT(*) FROM ventas
UNION ALL SELECT 'venta_accesorios', COUNT(*) FROM venta_accesorios;

-- 2. JOIN: inventario de vehículos con su marca
SELECT ve.vin, m.nombre AS marca, ve.referencia, ve.version, ve.tipo, ve.anio,
       ve.condicion, ve.kilometraje, ve.precio, ve.estado
FROM vehiculos ve
JOIN marcas m ON m.id_marca = ve.id_marca
ORDER BY ve.estado, m.nombre;

-- 3. JOIN: facturas con el cliente, el vehículo vendido y los accesorios
SELECT v.numero_factura, v.fecha, CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
       CONCAT(m.nombre, ' ', ve.referencia) AS vehiculo, v.precio_vehiculo,
       a.nombre AS accesorio, d.subtotal, v.total
FROM ventas v
JOIN clientes c        ON c.id_cliente   = v.id_cliente
JOIN vehiculos ve      ON ve.id_vehiculo = v.id_vehiculo
JOIN marcas m          ON m.id_marca     = ve.id_marca
LEFT JOIN venta_accesorios d ON d.id_venta     = v.id_venta
LEFT JOIN accesorios a       ON a.id_accesorio = d.id_accesorio
ORDER BY v.fecha;

-- 4. Ventas por marca (JOIN + GROUP BY)
SELECT m.nombre AS marca, COUNT(v.id_venta) AS vehiculos_vendidos, COALESCE(SUM(v.total), 0) AS total_vendido
FROM marcas m
LEFT JOIN vehiculos ve ON ve.id_marca    = m.id_marca
LEFT JOIN ventas v     ON v.id_vehiculo  = ve.id_vehiculo
GROUP BY m.nombre
ORDER BY total_vendido DESC;
