/**
 * Agrupa las rutas de las 6 tablas bajo /api.
 */
const { Router } = require('express');

const router = Router();

router.use('/marcas', require('./marca.routes'));
router.use('/vehiculos', require('./vehiculo.routes'));
router.use('/clientes', require('./cliente.routes'));
router.use('/accesorios', require('./accesorio.routes'));
router.use('/ventas', require('./venta.routes'));
router.use('/venta-accesorios', require('./ventaAccesorio.routes'));

// GET /api → lista de recursos disponibles
router.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API REST Ofero',
    datos: ['marcas', 'vehiculos', 'clientes', 'accesorios', 'ventas', 'venta-accesorios'].map((r) => `/api/${r}`)
  });
});

module.exports = router;
