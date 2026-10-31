-- =====================================================================
--  Ofero · Datos de ejemplo (ficticios, área metropolitana de Barranquilla)
--  Se insertan respetando las dependencias:
--  marcas → vehiculos → clientes → accesorios → ventas → venta_accesorios
-- =====================================================================

SET NAMES utf8mb4;

INSERT INTO marcas (nombre, pais_origen, sitio_web) VALUES
('Toyota', 'Japón', 'https://www.toyota.com'),
('Chevrolet', 'Estados Unidos', 'https://www.chevrolet.com'),
('Renault', 'Francia', 'https://www.renault.com'),
('Mazda', 'Japón', 'https://www.mazda.com'),
('Kia', 'Corea del Sur', 'https://www.kia.com'),
('Hyundai', 'Corea del Sur', 'https://www.hyundai.com'),
('Nissan', 'Japón', 'https://www.nissan-global.com'),
('Ford', 'Estados Unidos', 'https://www.ford.com'),
('Volkswagen', 'Alemania', 'https://www.vw.com'),
('Suzuki', 'Japón', 'https://www.globalsuzuki.com');

INSERT INTO vehiculos (vin, referencia, version, tipo, anio, color, combustible, transmision, condicion, kilometraje, precio, estado, id_marca) VALUES
('9BRXK2DEG0D501001', 'Corolla Cross', 'XEI Híbrido', 'SUV', 2025, 'Blanco perla', 'Híbrido', 'Automática', 'Nuevo', 0, 142900000, 'Vendido', 1),
('9BR9PCF43ES401002', 'Hilux', '2.4 Diésel 4x4', 'Pickup', 2024, 'Gris plata', 'Diésel', 'Manual', 'Nuevo', 0, 189900000, 'Vendido', 1),
('9BGF4DHRD2D501003', 'Onix', 'LT Turbo', 'Sedán', 2025, 'Rojo', 'Gasolina', 'Manual', 'Nuevo', 0, 79900000, 'Vendido', 2),
('9BGRCJV3KHW401004', 'Tracker', 'Premier', 'SUV', 2024, 'Azul', 'Gasolina', 'Automática', 'Nuevo', 0, 112500000, 'Disponible', 2),
('93YMGN0GEDP301005', 'Duster', 'Intens 4x2', 'SUV', 2023, 'Naranja', 'Gasolina', 'Manual', 'Usado', 28500, 74900000, 'Vendido', 3),
('93Y84X660WS501006', 'Kwid', 'Outsider', 'Hatchback', 2025, 'Blanco', 'Gasolina', 'Manual', 'Nuevo', 0, 54900000, 'Vendido', 3),
('JM1MSFW8Y5V401007', 'Mazda 3', 'Grand Touring', 'Sedán', 2024, 'Rojo cristal', 'Gasolina', 'Automática', 'Nuevo', 0, 124900000, 'Vendido', 4),
('JM1EH93LYK8201008', 'CX-5', 'Touring', 'SUV', 2022, 'Gris máquina', 'Gasolina', 'Automática', 'Usado', 41200, 109000000, 'Disponible', 4),
('KNA3CEXYZ86401009', 'Picanto', 'Vibrant', 'Hatchback', 2024, 'Amarillo', 'Gasolina', 'Manual', 'Nuevo', 0, 59900000, 'Vendido', 5),
('KNAEFU7EDW5501010', 'Sportage', 'Desire Híbrida', 'SUV', 2025, 'Negro', 'Híbrido', 'Automática', 'Nuevo', 0, 164900000, 'Reservado', 5),
('KMHV1ZB6ZLH301011', 'Tucson', 'Limited', 'SUV', 2023, 'Plata', 'Gasolina', 'Automática', 'Usado', 33800, 118000000, 'Vendido', 6),
('KMH8DPVJS22401012', 'Ioniq 5', 'Long Range', 'SUV', 2024, 'Verde', 'Eléctrico', 'Automática', 'Nuevo', 0, 219900000, 'Disponible', 6),
('3N18FL52UJ4401013', 'Kicks', 'Exclusive', 'SUV', 2024, 'Blanco', 'Gasolina', 'Automática', 'Nuevo', 0, 99900000, 'Vendido', 7),
('3N1U3Z1RKFM101014', 'Frontier', 'LE 4x4', 'Pickup', 2021, 'Gris', 'Diésel', 'Automática', 'Usado', 67400, 132000000, 'Disponible', 7),
('9BFKRRA8MTV401015', 'Ranger', 'XLT 4x4', 'Pickup', 2024, 'Azul', 'Diésel', 'Automática', 'Nuevo', 0, 214900000, 'Vendido', 8),
('9BFAK30XJ9D501016', 'Territory', 'Titanium', 'SUV', 2025, 'Negro', 'Gasolina', 'Automática', 'Nuevo', 0, 139900000, 'Disponible', 8),
('9BW62222G72401017', 'T-Cross', 'Highline', 'SUV', 2024, 'Rojo', 'Gasolina', 'Automática', 'Nuevo', 0, 116900000, 'Vendido', 9),
('9BWDNEP5LHY001018', 'Gol', 'Comfortline', 'Hatchback', 2020, 'Blanco', 'Gasolina', 'Manual', 'Usado', 78900, 39900000, 'Disponible', 9),
('JS2DGAKG0BE501019', 'Swift', 'Hybrid GLX', 'Hatchback', 2025, 'Azul', 'Híbrido', 'Automática', 'Nuevo', 0, 84900000, 'Vendido', 10),
('JS2P1KTZ07H301020', 'Vitara', 'GLX AllGrip', 'SUV', 2023, 'Gris', 'Gasolina', 'Automática', 'Usado', 22100, 99500000, 'Disponible', 10);

INSERT INTO clientes (documento, nombres, apellidos, correo, telefono, direccion, ciudad) VALUES
('1043258741', 'Carlos Andrés', 'Rodríguez Peña', 'carlos.rodriguez@gmail.com', '3001472583', 'Cra. 50 # 79-32', 'Barranquilla'),
('32741852', 'Liliana María', 'Sánchez Ariza', 'lsanchez@hotmail.com', '3012583691', 'Cl. 85 # 47-15', 'Barranquilla'),
('72963741', 'Jorge Eliécer', 'Martínez Bolaño', 'jmartinez@gmail.com', '3023694712', 'Cra. 43 # 70-08', 'Barranquilla'),
('1129563478', 'Paola Andrea', 'Herrera Castillo', 'paola.herrera@outlook.com', '3034715823', 'Cl. 98 # 52-40', 'Barranquilla'),
('8745123', 'Rafael Antonio', 'Díaz Charris', 'rdiaz@yahoo.com', '3045826934', 'Cra. 19 # 30-21', 'Soledad'),
('1048276395', 'Mónica Patricia', 'Ruiz Fontalvo', 'mruiz@gmail.com', '3056937145', 'Cl. 76 # 64-11', 'Barranquilla'),
('72415963', 'Iván Darío', 'Gómez Mendoza', 'igomez@gmail.com', '3067148256', 'Cra. 27 # 44-70', 'Malambo'),
('22789456', 'Claudia Inés', 'Pérez Orozco', 'cperez@hotmail.com', '3078259367', 'Cl. 84 # 42F-25', 'Barranquilla'),
('1143852967', 'Sebastián Camilo', 'Torres Vergara', 'storres@gmail.com', '3089361478', 'Cra. 54 # 96-13', 'Barranquilla'),
('1001478523', 'Natalia Sofía', 'López Arrieta', 'nlopez@gmail.com', '3090472589', 'Cl. 1 # 20-33', 'Puerto Colombia'),
('72589631', 'Hernán José', 'Villalba Roa', 'hvillalba@outlook.com', '3101583694', 'Cra. 38 # 54-90', 'Barranquilla'),
('32569874', 'Diana Carolina', 'Navarro Polo', 'dnavarro@gmail.com', '3112694715', 'Cl. 72 # 22-14', 'Soledad');

INSERT INTO accesorios (codigo, nombre, categoria, precio, stock) VALUES
('AC-POL-01', 'Polarizado de vidrios', 'Exterior', 450000, 40),
('AC-ALA-01', 'Alarma con rastreo GPS', 'Seguridad', 890000, 25),
('AC-CAM-01', 'Cámara de reversa', 'Tecnología', 380000, 30),
('AC-SEN-01', 'Sensores de parqueo', 'Seguridad', 420000, 35),
('AC-TAP-01', 'Tapetes de caucho a la medida', 'Confort', 180000, 60),
('AC-FOR-01', 'Forros en cuero sintético', 'Confort', 1250000, 15),
('AC-PEL-01', 'Película de seguridad antirrobo', 'Seguridad', 650000, 20),
('AC-RIN-17', 'Rines de aleación 17 pulgadas', 'Exterior', 2800000, 8),
('AC-BAR-01', 'Barras de techo', 'Exterior', 720000, 12),
('AC-PAN-01', 'Pantalla multimedia de 9 pulgadas', 'Tecnología', 1150000, 18),
('AC-KIT-01', 'Kit de carretera', 'Seguridad', 160000, 80),
('AC-MAN-01', 'Mantenimiento prepagado 10.000 km', 'Mantenimiento', 590000, 50);

-- precio_vehiculo = precio del inventario menos el descuento negociado
INSERT INTO ventas (numero_factura, fecha, metodo_pago, precio_vehiculo, id_cliente, id_vehiculo) VALUES
('FV-OF-2026-0001', '2026-08-04 10:15:00', 'Contado', 142900000, 1, 1),
('FV-OF-2026-0002', '2026-08-11 16:40:00', 'Crédito bancario', 187900000, 2, 2),
('FV-OF-2026-0003', '2026-08-19 11:05:00', 'Crédito bancario', 79900000, 3, 3),
('FV-OF-2026-0004', '2026-08-27 15:20:00', 'Leasing', 73400000, 4, 5),
('FV-OF-2026-0005', '2026-09-03 09:30:00', 'Contado', 54900000, 5, 6),
('FV-OF-2026-0006', '2026-09-10 17:10:00', 'Permuta', 124900000, 6, 7),
('FV-OF-2026-0007', '2026-09-18 12:00:00', 'Crédito bancario', 56900000, 7, 9),
('FV-OF-2026-0008', '2026-09-24 10:45:00', 'Contado', 118000000, 8, 11),
('FV-OF-2026-0009', '2026-10-01 14:30:00', 'Leasing', 98900000, 9, 13),
('FV-OF-2026-0010', '2026-10-08 11:50:00', 'Crédito bancario', 214900000, 10, 15),
('FV-OF-2026-0011', '2026-10-15 16:05:00', 'Contado', 112900000, 11, 17),
('FV-OF-2026-0012', '2026-10-22 09:55:00', 'Permuta', 84900000, 2, 19);

INSERT INTO venta_accesorios (id_venta, id_accesorio, cantidad, precio_unitario) VALUES
(1, 1, 1, 450000),
(1, 11, 1, 160000),
(2, 9, 1, 720000),
(2, 2, 1, 890000),
(2, 12, 1, 590000),
(3, 5, 1, 180000),
(4, 3, 1, 380000),
(4, 4, 1, 420000),
(5, 11, 1, 160000),
(6, 1, 1, 450000),
(7, 10, 1, 1150000),
(8, 6, 1, 1250000),
(9, 5, 1, 180000),
(10, 7, 1, 650000),
(10, 2, 1, 890000),
(11, 8, 1, 2800000),
(12, 4, 1, 420000);

-- El total de cada venta = precio del vehículo + accesorios
UPDATE ventas v SET total = v.precio_vehiculo +
  (SELECT COALESCE(SUM(d.subtotal), 0) FROM venta_accesorios d WHERE d.id_venta = v.id_venta);
