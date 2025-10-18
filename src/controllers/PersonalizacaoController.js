const prisma = require('../config/database');

class PersonalizacaoController {
  // Obter personalização da loja
  async get(req, res) {
    try {
      const personalizacao = await prisma.personalizacao.findUnique({
        where: { loja_id: req.lojaId }
      });

      res.json(personalizacao || {});
    } catch (error) {
      console.error('Erro ao buscar personalização:', error);
      res.status(500).json({ error: 'Erro ao buscar personalização' });
    }
  }

  // Criar ou atualizar personalização
  async upsert(req, res) {
    try {
      const {
        cor_primaria,
        cor_secundaria,
        cor_fundo,
        cor_texto,
        cor_header,
        fonte_titulo,
        fonte_corpo,
        logo_url,
        meta_titulo,
        meta_descricao,
        produtos_por_linha,
        efeito_hover,
        animacoes_ativadas
      } = req.body;

      const personalizacao = await prisma.personalizacao.upsert({
        where: { loja_id: req.lojaId },
        update: {
          cor_primaria,
          cor_secundaria,
          cor_fundo,
          cor_texto,
          cor_header,
          fonte_titulo,
          fonte_corpo,
          logo_url,
          meta_titulo,
          meta_descricao,
          produtos_por_linha: produtos_por_linha ? parseInt(produtos_por_linha) : null,
          efeito_hover,
          animacoes_ativadas: animacoes_ativadas !== false
        },
        create: {
          loja_id: req.lojaId,
          cor_primaria,
          cor_secundaria,
          cor_fundo,
          cor_texto,
          cor_header,
          fonte_titulo,
          fonte_corpo,
          logo_url,
          meta_titulo,
          meta_descricao,
          produtos_por_linha: produtos_por_linha ? parseInt(produtos_por_linha) : null,
          efeito_hover,
          animacoes_ativadas: animacoes_ativadas !== false
        }
      });

      res.json({
        message: 'Personalização salva com sucesso',
        personalizacao
      });
    } catch (error) {
      console.error('Erro ao salvar personalização:', error);
      res.status(500).json({ error: 'Erro ao salvar personalização' });
    }
  }
}

module.exports = new PersonalizacaoController();
