const prisma = require('../config/database');
const { generateSlug } = require('../utils/helpers');

class CategoriaController {
  // Listar categorias hierarquicamente
  async index(req, res) {
    try {
      const categorias = await prisma.categoria.findMany({
        where: {
          loja_id: req.lojaId,
          pai_id: null // Apenas raiz (nível 1)
        },
        include: {
          filhos: {
            include: {
              filhos: true // 3 níveis
            }
          },
          _count: {
            select: { produtos: true }
          }
        },
        orderBy: { ordem: 'asc' }
      });

      res.json(categorias);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  }

  // Criar categoria
  async create(req, res) {
    try {
      const { nome, pai_id, ordem = 0 } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      // Determinar nível
      let nivel = 1;
      if (pai_id) {
        const pai = await prisma.categoria.findFirst({
          where: { id: pai_id, loja_id: req.lojaId }
        });

        if (!pai) {
          return res.status(404).json({ error: 'Categoria pai não encontrada' });
        }

        nivel = pai.nivel + 1;

        if (nivel > 3) {
          return res.status(400).json({ error: 'Máximo de 3 níveis de categorias' });
        }
      }

      const slug = generateSlug(nome);

      const categoria = await prisma.categoria.create({
        data: {
          nome,
          slug,
          nivel,
          ordem,
          pai_id,
          loja_id: req.lojaId
        },
        include: {
          pai: true,
          filhos: true
        }
      });

      res.status(201).json(categoria);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }

  // Deletar categoria
  async delete(req, res) {
    try {
      const { id } = req.params;

      const categoria = await prisma.categoria.findFirst({
        where: { id, loja_id: req.lojaId },
        include: { produtos: true, filhos: true }
      });

      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      if (categoria.produtos.length > 0) {
        return res.status(400).json({ 
          error: 'Não é possível deletar categoria com produtos vinculados' 
        });
      }

      if (categoria.filhos.length > 0) {
        return res.status(400).json({ 
          error: 'Não é possível deletar categoria com subcategorias' 
        });
      }

      await prisma.categoria.delete({ where: { id } });

      res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
  }
}

module.exports = new CategoriaController();
