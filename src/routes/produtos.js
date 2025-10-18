const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Todas as rotas protegidas
router.use(auth);

// CRUD de produtos
router.get('/', ProdutoController.index);
router.get('/:id', ProdutoController.show);
router.post('/', upload.array('imagens', 3), ProdutoController.create);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);

// Gerenciamento de imagens
router.post('/:id/imagens', upload.array('imagens', 3), ProdutoController.addImages);
router.delete('/:id/imagens/:imagemId', ProdutoController.deleteImage);

// Ações rápidas
router.patch('/:id/toggle-disponivel', ProdutoController.toggleDisponivel);
router.patch('/:id/toggle-bloqueado', ProdutoController.toggleBloqueado);

module.exports = router;
