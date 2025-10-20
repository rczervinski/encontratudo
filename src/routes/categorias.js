const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const prisma = require('../config/database')

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

router.get('/', auth, async (req, res) => {
  try {
    const cats = await prisma.categoria.findMany({
      where: { loja_id: req.lojaId },
      orderBy: [{ nivel: 'asc' }, { ordem: 'asc' }, { nome: 'asc' }]
    })
    res.json(cats)
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar categorias' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { nome, pai_id } = req.body
    if (!nome) return res.status(400).json({ error: 'nome é obrigatório' })
    const paiId = pai_id && `${pai_id}`.trim() !== '' ? `${pai_id}` : null
    let nivel = 1
    if (paiId) {
      const pai = await prisma.categoria.findUnique({ where: { id: paiId }, select: { id: true, loja_id: true, nivel: true } })
      if (!pai || pai.loja_id !== req.lojaId) return res.status(400).json({ error: 'Categoria pai inválida' })
      nivel = (pai.nivel || 0) + 1
    }
    const slug = slugify(nome)
    const maxOrdem = await prisma.categoria.aggregate({
      where: { loja_id: req.lojaId, pai_id: paiId },
      _max: { ordem: true }
    })
    const ordem = (maxOrdem._max.ordem || 0) + 1
    const c = await prisma.categoria.create({
      data: { nome, slug, nivel, ordem, pai_id: paiId, loja_id: req.lojaId }
    })
    res.status(201).json(c)
  } catch (e) {
    if (e?.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe uma categoria com esse nome/slug neste nível' })
    }
    res.status(500).json({ error: 'Erro ao criar categoria' })
  }
})

module.exports = router
