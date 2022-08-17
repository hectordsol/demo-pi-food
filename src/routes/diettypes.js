const { Router } = require('express');
const router = Router();
const dietTypeController = require('../controllers/dietType')

// router.post('/', dietTypeController.post);
router.get('/', dietTypeController.getAll);

module.exports = router;