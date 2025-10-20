const express = require('express')
const router = express.Router()
const PersonalizacaoController = require('../controllers/PersonalizacaoController')
const auth = require('../middleware/auth')

router.use(auth)
router.get('/', PersonalizacaoController.get)
router.post('/', PersonalizacaoController.upsert)

module.exports = router
