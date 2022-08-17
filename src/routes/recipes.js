const { Router } = require('express');
const router = Router();
const recipesController = require('../controllers/recipes'); 

router.get('/recipeId/:recipeId/typeId/:typeId', recipesController.addTypeToRecipe);
router.get('/:idReceta', recipesController.getByIdParams);
router.get('/', recipesController.getAll);

module.exports = router;