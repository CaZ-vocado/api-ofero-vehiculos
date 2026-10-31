/**
 * Endpoints REST de /api/accesorios
 */
const { Router } = require('express');
const controlador = require('../controllers/accesorio.controller');
const Accesorio = require('../models/Accesorio');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(Accesorio), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(Accesorio, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
