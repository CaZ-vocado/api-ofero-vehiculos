/**
 * Endpoints REST de /api/ventas
 */
const { Router } = require('express');
const controlador = require('../controllers/venta.controller');
const Venta = require('../models/Venta');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(Venta), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(Venta, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
