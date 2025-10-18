const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriaController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', CategoriaController.index);
router.post('/', CategoriaController.create);
router.delete('/:id', CategoriaController.delete);

module.exports = router;
