# Despliegue paso a paso · Ofero

## 0. Preparar el computador (ya se usó para otros dos proyectos)
1. **Chrome:** crea un perfil nuevo para Daniel (ícono de perfil → Agregar) y haz todo lo de este proyecto en ese perfil. Así no se mezclan las sesiones de GitHub, Clever Cloud y Render de los proyectos anteriores.
2. **Git:** en la terminal de VS Code:
   ```bash
   git config --global user.name "Daniel Carrasquilla"
   git config --global user.email "CORREO_DE_GITHUB_DE_DANIEL"
   git config --global --list
   ```
   La lista no debe mostrar otro nombre.
3. **Credencial de GitHub guardada en Windows:**
   ```bash
   cmdkey /delete:git:https://github.com
   ```
   (o Administrador de credenciales → Credenciales de Windows → eliminar `git:https://github.com`).
4. **VS Code:** Cuentas (abajo a la izquierda) → cierra la sesión de GitHub anterior si aparece. Archivo → Cerrar carpeta.
5. **Postman:** si hay una cuenta iniciada de otra persona, avatar → Sign out, y entra con la de Daniel (o usa Postman sin cuenta).
6. **Carpeta:** descomprime este proyecto en una carpeta nueva y crea su propio `.env`. No copies el `.env` de otro proyecto.
7. **XAMPP:** no se borra nada; Ofero usa su propia carpeta (`htdocs\ofero`) y su propia base (`wp_ofero`).

## 1. Base de datos MySQL en Clever Cloud (gratis)
1. Entra a https://console.clever-cloud.com y crea la cuenta de Daniel (con su GitHub o su correo).
2. **Create → an add-on → MySQL** → plan **DEV** (gratis: 10 MB y 5 conexiones) → **Next**.
3. Nombre: `ofero-db` · Región: la que ofrezca → **Next / Create**.
4. Abre el add-on → pestaña **Information** (o **Add-on dashboard**): ahí están `MYSQL_ADDON_HOST`, `MYSQL_ADDON_DB`, `MYSQL_ADDON_USER`, `MYSQL_ADDON_PASSWORD` y `MYSQL_ADDON_PORT`.
5. El botón **PHPMyAdmin** abre la base. Úsalo en una ventana normal de Chrome: en incógnito falla con "Connection to the MySQL server failed".

## 2. Cargar las tablas y los datos
Opción A — desde el proyecto:
```bash
npm install
copy .env.example .env      # llena DB_HOST, DB_USER, DB_PASSWORD, DB_NAME con los datos del paso 1.4
npm run db:crear
```
Debe mostrar el conteo: 10, 20, 12, 12, 12 y 17 registros.

Opción B — phpMyAdmin de Clever Cloud: haz clic en la base (bxxxx…) del panel izquierdo → **Importar** → `database/schema.sql` → **Continuar**; repite con `database/datos.sql`. Si sale "#1046 No database selected", primero selecciona la base en el panel izquierdo.

## 3. Subir el código a GitHub (cuenta de Daniel)
1. En https://github.com crea un repositorio vacío llamado `api-ofero-vehiculos` (sin README).
2. En la carpeta del proyecto:
```bash
git init
git add .
git commit -m "API REST Ofero"
git branch -M main
git remote add origin https://USUARIO@github.com/USUARIO/api-ofero-vehiculos.git
git push -u origin main
```
(`USUARIO` = el usuario de GitHub de Daniel). Al hacer push, Windows pide iniciar sesión: entra con la cuenta de Daniel.
3. Verifica en GitHub que **no** aparezca el archivo `.env`.

## 4. Publicar la API en Render
1. Entra a https://render.com con el GitHub de Daniel → **New → Web Service** → elige `api-ofero-vehiculos`.
2. Runtime **Node** · Build Command `npm install` · Start Command `npm start` · Instance **Free**.
3. En **Environment** agrega: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT=3` y `DB_SSL=false` (los valores del `.env`).
4. **Create Web Service**. Cuando diga **Live**, abre la URL: debe responder `"base_de_datos": "conectada"`.
5. Prueba `https://TU-URL.onrender.com/api/vehiculos`.

> En el plan gratis Render "duerme" la API tras 15 minutos sin uso; la primera petición tarda unos 30 segundos. Ábrela antes de grabar.

## 5. Actualizar las URL
- `README.md`: la URL pública (y haz `git add . && git commit -m "URL" && git push`).
- Postman: variable `base_url` de la colección.
- WordPress: `API_URL` en el bloque HTML de la página "Inventario en línea" (`wordpress/inventario-vehiculos.html`).
