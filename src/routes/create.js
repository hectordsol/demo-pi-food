const { Router } = require('express');
const router = Router();

const recipesController = require('../controllers/recipes');
router.post('/', recipesController.post);

module.exports = router;