# API REST · Ofero

API de **Ofero**, tienda de vehículos, construida con **Node.js, Express y MySQL** (base de datos en la nube en Clever Cloud). Gestiona marcas, inventario de vehículos, clientes, accesorios, ventas y accesorios por venta.
Autor: **Daniel Carrasquilla**.

- **URL pública:** `https://api-ofero-vehiculos.onrender.com` *(reemplazar por la URL real de Render)*
- **Base de datos:** MySQL 8 en Clever Cloud (plan gratis DEV), 6 tablas (`database/schema.sql`)

## Estructura del proyecto

```
api-ofero-vehiculos/
├── server.js                  → arranca el servidor
├── src/
│   ├── app.js                 → Express, CORS, rutas y manejo de errores
│   ├── config/db.js           → conexión a MySQL (lee las variables de entorno)
│   ├── models/                → UNA clase por tabla con todos sus atributos y reglas
│   ├── repositories/          → consultas SQL (base.repository.js + uno por tabla)
│   ├── controllers/           → lógica de cada endpoint (base.controller.js + uno por tabla)
│   ├── routes/                → endpoints REST de cada tabla
│   └── middlewares/           → validación de datos, formato de respuesta y errores
├── database/
│   ├── schema.sql             → crea las tablas, llaves y restricciones
│   ├── datos.sql              → registros de ejemplo (10 o más por tabla)
│   ├── consultas_validacion.sql → conteos y consultas con JOIN
│   ├── diagrama_er.dbml       → diagrama E-R para dbdiagram.io
│   └── ejecutar.js            → carga schema + datos en la nube (npm run db:crear)
├── postman/                   → colección exportada de Postman
├── wordpress/                 → tabla del inventario de vehículos para WordPress
└── .env.example               → variables de entorno requeridas
```

Así viaja una petición: **ruta → validación → controlador → repositorio (SQL) → MySQL → respuesta JSON**.

## Instalación y ejecución local

Requisitos: Node.js 18 o superior (LTS).

```bash
git clone https://github.com/USUARIO/api-ofero-vehiculos.git
cd api-ofero-vehiculos
npm install
cp .env.example .env        # en Windows: copy .env.example .env  → y llena tus datos de Clever Cloud
npm run db:crear            # crea las tablas y carga los datos (solo la primera vez)
npm start                   # → http://localhost:3000
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto local | `3000` |
| `DB_HOST` | Host de MySQL (`MYSQL_ADDON_HOST` en Clever Cloud) | `bxxxx-mysql.services.clever-cloud.com` |
| `DB_PORT` | Puerto (`MYSQL_ADDON_PORT`) | `3306` |
| `DB_USER` | Usuario (`MYSQL_ADDON_USER`) | `uxxxx` |
| `DB_PASSWORD` | Contraseña (`MYSQL_ADDON_PASSWORD`) | *(secreta)* |
| `DB_NAME` | Base de datos (`MYSQL_ADDON_DB`) | `bxxxx` |
| `DB_CONNECTION_LIMIT` | Conexiones que usa la API (el plan gratis permite 5) | `3` |
| `DB_SSL` | Conexión cifrada (Clever Cloud no la exige) | `false` |

La API también acepta directamente los nombres `MYSQL_ADDON_*` que entrega Clever Cloud.

El archivo `.env` está en `.gitignore`: las credenciales nunca se suben al repositorio.

## Formato de las respuestas

Todas las respuestas son JSON con la misma estructura:

```json
{ "ok": true,  "mensaje": "Venta encontrada", "datos": { ... } }
{ "ok": false, "error": "Datos inválidos", "detalles": ["metodo_pago debe ser uno de: Contado, Crédito bancario, Leasing, Permuta"] }
```

| Código | Cuándo |
|---|---|
| 200 | Consulta, actualización o eliminación correcta |
| 201 | Registro creado |
| 400 | Datos inválidos, id no numérico, JSON mal formado o llave foránea inexistente |
| 404 | Registro o ruta no encontrados |
| 409 | Valor duplicado (UNIQUE), vehículo ya vendido o registro que otra tabla usa |
| 500 / 503 | Error interno / sin conexión con la base de datos |

## Endpoints

Cada tabla tiene el CRUD completo:

| Método | Endpoint | Acción |
|---|---|---|
| GET | `/api/{recurso}` | Listar todos (acepta filtros por query) |
| GET | `/api/{recurso}/:id` | Obtener uno |
| POST | `/api/{recurso}` | Crear |
| PUT | `/api/{recurso}/:id` | Actualizar (parcial: solo los campos enviados) |
| DELETE | `/api/{recurso}/:id` | Eliminar |

| Recurso | Campos para crear (* obligatorio) | Filtros en GET |
|---|---|---|
| `marcas` | nombre*, pais_origen*, sitio_web | — |
| `vehiculos` | vin* (17 caracteres), referencia*, version*, tipo* (Sedán, Hatchback, SUV, Pickup, Van, Deportivo), anio* (2000 a 2027), color*, combustible* (Gasolina, Diésel, Híbrido, Eléctrico), transmision* (Manual, Automática), condicion (Nuevo, Usado), kilometraje, precio*, estado (Disponible, Reservado, Vendido), id_marca* | `id_marca`, `tipo`, `combustible`, `condicion`, `estado` |
| `clientes` | documento*, nombres*, apellidos*, correo*, telefono*, direccion, ciudad | `ciudad` |
| `accesorios` | codigo*, nombre*, categoria* (Seguridad, Confort, Tecnología, Exterior, Mantenimiento), precio*, stock | `categoria` |
| `ventas` | numero_factura*, fecha (AAAA-MM-DD HH:MM), metodo_pago* (Contado, Crédito bancario, Leasing, Permuta), precio_vehiculo, id_cliente*, id_vehiculo* | `id_cliente`, `id_vehiculo`, `metodo_pago` |
| `venta-accesorios` | id_venta*, id_accesorio*, cantidad*, precio_unitario | `id_venta`, `id_accesorio` |

Reglas de negocio:
- Un vehículo **Vendido** no se puede vender otra vez (409), y la llave UNIQUE sobre `id_vehiculo` en ventas lo garantiza en la base.
- Al registrar una venta, el vehículo pasa a **Vendido**; si la venta se elimina, vuelve a **Disponible**.
- Si no se envía `precio_vehiculo`, se toma el precio del inventario; si no se envía `precio_unitario` de un accesorio, se toma su precio actual.
- El `total` de la venta = precio del vehículo + accesorios; la API lo recalcula cada vez que cambia un accesorio.
- `GET /` muestra el estado de la API y de la base de datos; `GET /api` lista los recursos.
- Los datos automáticos (`id`, `creado`, `total`, `subtotal`) se ignoran si se envían.

### Ejemplo: registrar una venta

```http
POST /api/ventas
Content-Type: application/json

{ "numero_factura": "FV-OF-2026-0013", "metodo_pago": "Contado", "id_cliente": 3, "id_vehiculo": 4 }
```

## Pruebas con Postman

Importa `postman/Ofero.postman_collection.json` y cambia la variable `base_url` por la URL de Render. Incluye el CRUD completo de `ventas` (la tabla con más relaciones), los casos de error, consultas a las otras tablas y la demo del inventario en WordPress.
