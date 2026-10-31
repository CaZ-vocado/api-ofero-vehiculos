/**
 * Endpoints REST de /api/vehiculos
 */
const { Router } = require('express');
const controlador = require('../controllers/vehiculo.controller');
const Vehiculo = require('../models/Vehiculo');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(Vehiculo), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(Vehiculo, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
