const express = require('express');
const router = express.Router();
const PersonalizacaoController = require('../controllers/PersonalizacaoController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/personalizacao - Obter personalização
router.get('/', PersonalizacaoController.get);

// POST /api/personalizacao - Criar ou atualizar
router.post('/', PersonalizacaoController.upsert);

module.exports = router;
