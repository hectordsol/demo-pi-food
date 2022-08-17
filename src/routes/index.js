const { Router } = require('express');
const router = Router();

// traemos los archivos de las rutas.
// Importando todos los routers;
const recipes = require('./recipes');
const create = require('./create');
const diettypes = require('./diettypes');

// Configurar los routers
router.use('/create', create);
router.use('/recipes', recipes);
router.use('/diettypes', diettypes);

module.exports = router;