const prisma = require('../config/database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function gerarSlug(nome) {
  return nome.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

class AuthController {
  async register(req, res) {
    try {
      const { nome_loja, email, telefone_loja, senha } = req.body
      if (!nome_loja || !senha) return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
      const senha_hash = await bcrypt.hash(senha, 10)

      const loja = await prisma.loja.create({
        data: {
          nome_loja,
          email,
          telefone_loja,
          senha_hash,
          slug: gerarSlug(nome_loja),
          ativo: true
        }
      })

      const token = jwt.sign({ id: loja.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
      res.json({ token, loja })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Erro ao registrar' })
    }
  }

  async login(req, res) {
    try {
      const { login, senha } = req.body
      const loja = await prisma.loja.findFirst({ where: { OR: [{ email: login }, { telefone_loja: login }] } })
      if (!loja) return res.status(401).json({ error: 'Credenciais inválidas' })
      const ok = await bcrypt.compare(senha, loja.senha_hash || '')
      if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' })
      const token = jwt.sign({ id: loja.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
      res.json({ token, loja })
    } catch (e) {
      res.status(500).json({ error: 'Erro ao logar' })
    }
  }

  async me(req, res) {
    try {
      const loja = await prisma.loja.findUnique({ where: { id: req.lojaId }, include: { personalizacao: true } })
      if (!loja) return res.status(404).json({ error: 'Loja não encontrada' })
      res.json(loja)
    } catch (e) {
      res.status(500).json({ error: 'Erro ao carregar perfil' })
    }
  }
}

module.exports = new AuthController()
