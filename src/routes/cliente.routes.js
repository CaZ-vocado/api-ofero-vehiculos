/**
 * Endpoints REST de /api/clientes
 */
const { Router } = require('express');
const controlador = require('../controllers/cliente.controller');
const Cliente = require('../models/Cliente');
const { validar, validarId } = require('../middlewares/validar');
const envolver = require('../middlewares/envolver');

const router = Router();

router.get('/', envolver(controlador.listar));                                        // listar todos
router.get('/:id', validarId, envolver(controlador.obtener));                          // obtener uno
router.post('/', validar(Cliente), envolver(controlador.crear));                              // crear
router.put('/:id', validarId, validar(Cliente, true), envolver(controlador.actualizar));       // actualizar
router.delete('/:id', validarId, envolver(controlador.eliminar));                      // eliminar

module.exports = router;
