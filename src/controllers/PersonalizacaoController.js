const prisma = require('../config/database')

class PersonalizacaoController {
  async get(req, res) {
    try {
      const personalizacao = await prisma.personalizacao.findUnique({ where: { loja_id: req.lojaId } })
      res.json(personalizacao || {})
    } catch (e) {
      res.status(500).json({ error: 'Erro ao buscar personalização' })
    }
  }

  async upsert(req, res) {
    try {
      const data = { ...req.body }
      if (data.produtos_por_linha) data.produtos_por_linha = parseInt(data.produtos_por_linha)
      if (typeof data.animacoes_ativadas === 'undefined') data.animacoes_ativadas = true

      const personalizacao = await prisma.personalizacao.upsert({
        where: { loja_id: req.lojaId },
        update: data,
        create: { loja_id: req.lojaId, ...data }
      })
      res.json({ message: 'Personalização salva com sucesso', personalizacao })
    } catch (e) {
      res.status(500).json({ error: 'Erro ao salvar personalização' })
    }
  }
}

module.exports = new PersonalizacaoController()
