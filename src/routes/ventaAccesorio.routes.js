/**
 * Endpoints REST de /api/venta-accesorios
 */
const { Router } = require('express');
const controlador = require('../controllers/ventaAccesorio.controller');
const VentaAccesorio = require('../models/VentaAccesorio');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(VentaAccesorio), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(VentaAccesorio, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
