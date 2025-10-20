const express = require('express')
const router = express.Router()
const prisma = require('../config/database')
const auth = require('../middleware/auth')
const { upload, compressImage } = require('../middleware/upload')
const fs = require('fs')
const path = require('path')

// Todas as rotas abaixo exigem autenticação
router.use(auth)

// GET /api/produtos - lista produtos da loja do token
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { loja_id: req.lojaId },
      include: { imagens: { orderBy: { ordem: 'asc' } }, categoria: true }
    })
    res.json(produtos)
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar produtos' })
  }
})

// POST /api/produtos - cria um novo produto/serviço
router.post('/', async (req, res) => {
  try {
    const { nome_produto, descricao, preco, preco_promocional, categoria_id, tipo, tags } = req.body
    if (!nome_produto || preco === undefined || preco === null || preco === '') {
      return res.status(400).json({ error: 'nome_produto e preco são obrigatórios' })
    }
    const precoNumber = Number(preco)
    if (Number.isNaN(precoNumber)) {
      return res.status(400).json({ error: 'preco inválido' })
    }
    const precoPromNumber = preco_promocional !== undefined && preco_promocional !== null && `${preco_promocional}` !== ''
      ? Number(preco_promocional)
      : null
    if (precoPromNumber !== null && Number.isNaN(precoPromNumber)) {
      return res.status(400).json({ error: 'preco_promocional inválido' })
    }
    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '')
    const categoriaId = categoria_id && `${categoria_id}`.trim() !== '' ? `${categoria_id}` : null
    const produto = await prisma.produto.create({
      data: {
        loja_id: req.lojaId,
        nome_produto,
        descricao: descricao || null,
        preco: precoNumber,
        preco_promocional: precoPromNumber,
        categoria_id: categoriaId,
        tipo: tipo || 'produto',
        tags: tagsStr,
        disponivel: true,
        bloqueado: false
      }
    })
    res.status(201).json(produto)
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
})

// PUT /api/produtos/:id - atualiza um produto
router.put('/:id', async (req, res) => {
  try {
    const id = `${req.params.id}`
    // garantir que o produto pertence à loja do token
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== req.lojaId) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    const { nome_produto, descricao, preco, preco_promocional, categoria_id, tipo, tags, disponivel } = req.body
    const data = {}
    if (nome_produto !== undefined) data.nome_produto = nome_produto
    if (descricao !== undefined) data.descricao = descricao
    if (preco !== undefined) {
      const p = Number(preco)
      if (Number.isNaN(p)) return res.status(400).json({ error: 'preco inválido' })
      data.preco = p
    }
    if (preco_promocional !== undefined) {
      if (preco_promocional === null || `${preco_promocional}` === '') {
        data.preco_promocional = null
      } else {
        const pp = Number(preco_promocional)
        if (Number.isNaN(pp)) return res.status(400).json({ error: 'preco_promocional inválido' })
        data.preco_promocional = pp
      }
    }
    if (categoria_id !== undefined) data.categoria_id = categoria_id && `${categoria_id}`.trim() !== '' ? `${categoria_id}` : null
    if (tipo !== undefined) data.tipo = tipo
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.join(',') : (tags || '')
    if (disponivel !== undefined) data.disponivel = !!disponivel
    const produto = await prisma.produto.update({ where: { id }, data })
    res.json(produto)
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
})

// DELETE /api/produtos/:id - remove um produto da loja
router.delete('/:id', async (req, res) => {
  try {
    const id = `${req.params.id}`
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== req.lojaId) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    await prisma.produto.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Erro ao remover produto' })
  }
})

// PATCH /api/produtos/:id/status - atualiza disponibilidade/bloqueio
router.patch('/:id/status', async (req, res) => {
  try {
    const id = `${req.params.id}`
    const { disponivel, bloqueado } = req.body
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== req.lojaId) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    const data = {}
    if (disponivel !== undefined) data.disponivel = !!disponivel
    if (bloqueado !== undefined) data.bloqueado = !!bloqueado
    const produto = await prisma.produto.update({ where: { id }, data })
    res.json(produto)
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar status do produto' })
  }
})

// POST /api/produtos/:id/imagens - upload de 1..N imagens
router.post('/:id/imagens', upload.array('imagens', parseInt(process.env.MAX_IMAGES_PER_PRODUCT || '3')), async (req, res) => {
  try {
    const id = `${req.params.id}`
    const produto = await prisma.produto.findUnique({ where: { id } })
    if (!produto || produto.loja_id !== req.lojaId) return res.status(404).json({ error: 'Produto não encontrado' })

    const files = req.files || []
    const created = []
    const base = await prisma.imagemProduto.count({ where: { produto_id: id } })
    for (const [index, f] of files.entries()) {
      const finalPath = await compressImage(f.path)
      const url = `/uploads/${path.basename(finalPath)}`
      let tamanhoKb = 0
      try {
        const stat = fs.statSync(finalPath)
        tamanhoKb = Math.max(1, Math.round(stat.size / 1024))
      } catch {}
      const img = await prisma.imagemProduto.create({
        data: { produto_id: id, url, ordem: base + index, tamanho_kb: tamanhoKb }
      })
      created.push(img)
    }
    res.status(201).json(created)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Erro ao enviar imagens' })
  }
})

// PATCH /api/produtos/:id/imagens/ordenar - reordenar
router.patch('/:id/imagens/ordenar', async (req, res) => {
  try {
    const id = `${req.params.id}`
    const { ordem } = req.body // ex: [{id: 10, ordem:0}, ...]
    if (!Array.isArray(ordem)) return res.status(400).json({ error: 'Formato inválido' })
    const produto = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!produto || produto.loja_id !== req.lojaId) return res.status(404).json({ error: 'Produto não encontrado' })
    // valida que todas as imagens pertencem ao produto
    const imgIds = ordem.map(o => `${o.id}`)
    const imagens = await prisma.imagemProduto.findMany({ where: { id: { in: imgIds } }, select: { id: true, produto_id: true } })
    const todasDoProduto = imagens.every(i => i.produto_id === id)
    if (!todasDoProduto) return res.status(400).json({ error: 'Imagens inválidas para este produto' })
    const tasks = ordem.map(o => prisma.imagemProduto.update({ where: { id: `${o.id}` }, data: { ordem: Number(o.ordem) || 0 } }))
    await Promise.all(tasks)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Erro ao ordenar imagens' })
  }
})

// DELETE /api/produtos/:id/imagens/:imgId - apagar imagem
router.delete('/:id/imagens/:imgId', async (req, res) => {
  try {
    const id = `${req.params.id}`
    const imgId = `${req.params.imgId}`
    // checa propriedade
    const produto = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!produto || produto.loja_id !== req.lojaId) return res.status(404).json({ error: 'Produto não encontrado' })
    const imagem = await prisma.imagemProduto.findUnique({ where: { id: imgId }, select: { id: true, produto_id: true, url: true } })
    if (!imagem || imagem.produto_id !== id) return res.status(404).json({ error: 'Imagem não encontrada' })
    await prisma.imagemProduto.delete({ where: { id: imgId } })
    // tentativa de apagar arquivo do disco (best-effort)
    try {
      const abs = path.join(process.cwd(), imagem.url.replace(/^\//, ''))
      if (fs.existsSync(abs)) fs.unlinkSync(abs)
    } catch {}
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Erro ao excluir imagem' })
  }
})

module.exports = router
