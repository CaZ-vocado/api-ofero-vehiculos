-- =====================================================================
--  Ofero · Base de datos de la tienda de vehículos
--  Autor: Daniel Carrasquilla
--  MySQL 8 (Clever Cloud). 6 tablas normalizadas hasta 3FN.
--
--  Orden de creación: primero las tablas que no dependen de otras
--  (marcas, clientes, accesorios) y luego las que sí.
-- =====================================================================

-- Clever Cloud ya crea la base de datos (su nombre está en MYSQL_ADDON_DB).
-- Solo si trabajas en un MySQL local, descomenta estas dos líneas:
-- CREATE DATABASE IF NOT EXISTS ofero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE ofero;

DROP TABLE IF EXISTS venta_accesorios;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS accesorios;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS marcas;

-- 1. marcas: fabricantes de los vehículos
CREATE TABLE marcas (
    id_marca     INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(60)  NOT NULL,
    pais_origen  VARCHAR(60)  NOT NULL,
    sitio_web    VARCHAR(150),
    creado       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_marcas_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. vehiculos: inventario de la tienda (cada vehículo es único, identificado por su VIN)
CREATE TABLE vehiculos (
    id_vehiculo  INT AUTO_INCREMENT PRIMARY KEY,
    vin          CHAR(17)      NOT NULL,                 -- número de identificación vehicular
    referencia   VARCHAR(60)   NOT NULL,                 -- ej. Corolla Cross
    version      VARCHAR(60)   NOT NULL,                 -- ej. XEI Híbrido
    tipo         ENUM('Sedán', 'Hatchback', 'SUV', 'Pickup', 'Van', 'Deportivo') NOT NULL,
    anio         SMALLINT      NOT NULL,
    color        VARCHAR(40)   NOT NULL,
    combustible  ENUM('Gasolina', 'Diésel', 'Híbrido', 'Eléctrico') NOT NULL,
    transmision  ENUM('Manual', 'Automática') NOT NULL,
    condicion    ENUM('Nuevo', 'Usado') NOT NULL DEFAULT 'Nuevo',
    kilometraje  INT           NOT NULL DEFAULT 0,
    precio       DECIMAL(14,2) NOT NULL,
    estado       ENUM('Disponible', 'Reservado', 'Vendido') NOT NULL DEFAULT 'Disponible',
    id_marca     INT           NOT NULL,
    creado       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_vehiculos_vin UNIQUE (vin),
    CONSTRAINT ck_vehiculos_anio        CHECK (anio BETWEEN 2000 AND 2027),
    CONSTRAINT ck_vehiculos_kilometraje CHECK (kilometraje >= 0),
    CONSTRAINT ck_vehiculos_precio      CHECK (precio > 0),
    CONSTRAINT fk_vehiculos_marca FOREIGN KEY (id_marca) REFERENCES marcas (id_marca)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. clientes: personas que compran en la tienda
CREATE TABLE clientes (
    id_cliente   INT AUTO_INCREMENT PRIMARY KEY,
    documento    VARCHAR(20)   NOT NULL,
    nombres      VARCHAR(80)   NOT NULL,
    apellidos    VARCHAR(80)   NOT NULL,
    correo       VARCHAR(120)  NOT NULL,
    telefono     VARCHAR(20)   NOT NULL,
    direccion    VARCHAR(150),
    ciudad       VARCHAR(60)   NOT NULL DEFAULT 'Barranquilla',
    creado       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_clientes_documento UNIQUE (documento),
    CONSTRAINT uq_clientes_correo    UNIQUE (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. accesorios: productos adicionales que se venden con el vehículo
CREATE TABLE accesorios (
    id_accesorio INT AUTO_INCREMENT PRIMARY KEY,
    codigo       VARCHAR(20)   NOT NULL,                 -- ej. AC-ALA-01
    nombre       VARCHAR(100)  NOT NULL,
    categoria    ENUM('Seguridad', 'Confort', 'Tecnología', 'Exterior', 'Mantenimiento') NOT NULL,
    precio       DECIMAL(12,2) NOT NULL,
    stock        INT           NOT NULL DEFAULT 0,
    creado       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_accesorios_codigo UNIQUE (codigo),
    CONSTRAINT ck_accesorios_precio CHECK (precio > 0),
    CONSTRAINT ck_accesorios_stock  CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ventas: factura de venta de un vehículo a un cliente
CREATE TABLE ventas (
    id_venta        INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura  VARCHAR(20)   NOT NULL,
    fecha           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pago     ENUM('Contado', 'Crédito bancario', 'Leasing', 'Permuta') NOT NULL,
    precio_vehiculo DECIMAL(14,2) NOT NULL,              -- precio pactado el día de la venta
    total           DECIMAL(14,2) NOT NULL DEFAULT 0,    -- vehículo + accesorios (lo calcula la API)
    id_cliente      INT           NOT NULL,
    id_vehiculo     INT           NOT NULL,
    creado          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ventas_factura  UNIQUE (numero_factura),
    CONSTRAINT uq_ventas_vehiculo UNIQUE (id_vehiculo),  -- un vehículo se vende una sola vez
    CONSTRAINT ck_ventas_precio CHECK (precio_vehiculo > 0),
    CONSTRAINT ck_ventas_total  CHECK (total >= 0),
    CONSTRAINT fk_ventas_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_ventas_vehiculo FOREIGN KEY (id_vehiculo) REFERENCES vehiculos (id_vehiculo)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. venta_accesorios: accesorios incluidos en cada venta (tabla intermedia N:M ventas ↔ accesorios)
CREATE TABLE venta_accesorios (
    id_detalle      INT AUTO_INCREMENT PRIMARY KEY,
    id_venta        INT           NOT NULL,
    id_accesorio    INT           NOT NULL,
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,              -- precio del accesorio el día de la venta
    subtotal        DECIMAL(14,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    CONSTRAINT uq_venta_accesorio UNIQUE (id_venta, id_accesorio),
    CONSTRAINT ck_va_cantidad CHECK (cantidad > 0),
    CONSTRAINT ck_va_precio   CHECK (precio_unitario > 0),
    CONSTRAINT fk_va_venta FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_va_accesorio FOREIGN KEY (id_accesorio) REFERENCES accesorios (id_accesorio)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
