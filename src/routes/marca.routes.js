/**
 * Endpoints REST de /api/marcas
 */
const { Router } = require('express');
const controlador = require('../controllers/marca.controller');
const Marca = require('../models/Marca');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(Marca), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(Marca, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
