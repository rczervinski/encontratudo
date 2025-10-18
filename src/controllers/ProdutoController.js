const prisma = require('../config/database');
const { compressImage } = require('../utils/helpers');
const path = require('path');
const fs = require('fs').promises;

class ProdutoController {
  // Listar todos os produtos/serviços da loja
  async index(req, res) {
    try {
      const { page = 1, limit = 20, categoria_id, disponivel, busca, tipo } = req.query;
      const skip = (page - 1) * limit;

      const where = {
        loja_id: req.lojaId
      };

      if (categoria_id) where.categoria_id = categoria_id;
      if (disponivel !== undefined) where.disponivel = disponivel === 'true';
      if (tipo) where.tipo = tipo; // Filtrar por "produto" ou "servico"
      
      if (busca) {
        where.OR = [
          { nome_produto: { contains: busca } },
          { descricao: { contains: busca } },
          { tags: { contains: busca } }
        ];
      }

      const [produtos, total] = await Promise.all([
        prisma.produto.findMany({
          where,
          include: {
            imagens: {
              orderBy: { ordem: 'asc' }
            },
            categoria: true
          },
          orderBy: { criado_em: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit)
        }),
        prisma.produto.count({ where })
      ]);

      res.json({
        produtos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  }

  // Buscar produto por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        },
        include: {
          imagens: {
            orderBy: { ordem: 'asc' }
          },
          categoria: {
            include: {
              pai: {
                include: {
                  pai: true
                }
              }
            }
          }
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(produto);

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  // Criar novo produto ou serviço
  async create(req, res) {
    try {
      const {
        tipo = 'produto', // NOVO: produto ou servico
        nome_produto,
        descricao,
        preco,
        preco_promocional,
        tags,
        categoria_id,
        estoque_quantidade,
        // Campos específicos para SERVIÇOS
        duracao_estimada,
        area_atendimento,
        aceita_urgencia
      } = req.body;

      // Validações
      if (!nome_produto || !preco || !tags) {
        return res.status(400).json({
          error: 'Campos obrigatórios faltando',
          required: ['nome_produto', 'preco', 'tags']
        });
      }

      // Validar tipo
      if (!['produto', 'servico'].includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo inválido. Use "produto" ou "servico"'
        });
      }

      // Criar produto/serviço
      const produto = await prisma.produto.create({
        data: {
          tipo,
          nome_produto,
          descricao,
          preco: parseFloat(preco),
          preco_promocional: preco_promocional ? parseFloat(preco_promocional) : null,
          tags,
          categoria_id: categoria_id || null,
          estoque_quantidade: estoque_quantidade ? parseInt(estoque_quantidade) : null,
          // Campos de serviço (ignorados se tipo = produto)
          duracao_estimada: tipo === 'servico' ? duracao_estimada : null,
          area_atendimento: tipo === 'servico' ? area_atendimento : null,
          aceita_urgencia: tipo === 'servico' ? (aceita_urgencia === true || aceita_urgencia === 'true') : false,
          loja_id: req.lojaId
        }
      });

      // Processar imagens se enviadas
      if (req.files && req.files.length > 0) {
        const imagensData = [];

        for (let i = 0; i < Math.min(req.files.length, 3); i++) {
          const file = req.files[i];
          const filePath = file.path;

          // Comprimir imagem
          const tamanhoKB = await compressImage(filePath, 1024);

          imagensData.push({
            produto_id: produto.id,
            url: `/uploads/produtos/${file.filename}`,
            ordem: i,
            tamanho_kb: tamanhoKB
          });
        }

        await prisma.imagemProduto.createMany({
          data: imagensData
        });
      }

      // Buscar produto completo com imagens
      const produtoCompleto = await prisma.produto.findUnique({
        where: { id: produto.id },
        include: {
          imagens: {
            orderBy: { ordem: 'asc' }
          },
          categoria: true
        }
      });

      res.status(201).json({
        message: `${tipo === 'servico' ? 'Serviço' : 'Produto'} criado com sucesso!`,
        produto: produtoCompleto
      });

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  // Atualizar produto
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        nome_produto,
        descricao,
        preco,
        preco_promocional,
        tags,
        categoria_id,
        estoque_quantidade,
        disponivel,
        bloqueado,
        // NOVO: Campos de serviço
        duracao_estimada,
        area_atendimento,
        aceita_urgencia
      } = req.body;

      // Verificar se produto existe e pertence à loja
      const produtoExiste = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        }
      });

      if (!produtoExiste) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Preparar dados para atualização
      const dadosAtualizacao = {};

      if (nome_produto) dadosAtualizacao.nome_produto = nome_produto;
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (preco) dadosAtualizacao.preco = parseFloat(preco);
      if (preco_promocional !== undefined) {
        dadosAtualizacao.preco_promocional = preco_promocional ? parseFloat(preco_promocional) : null;
      }
      if (tags) dadosAtualizacao.tags = tags;
      if (categoria_id !== undefined) dadosAtualizacao.categoria_id = categoria_id || null;
      if (estoque_quantidade !== undefined) {
        dadosAtualizacao.estoque_quantidade = estoque_quantidade ? parseInt(estoque_quantidade) : null;
      }
      if (disponivel !== undefined) dadosAtualizacao.disponivel = disponivel === true || disponivel === 'true';
      if (bloqueado !== undefined) dadosAtualizacao.bloqueado = bloqueado === true || bloqueado === 'true';

      // NOVO: Atualizar campos de serviço (se for um serviço)
      if (produtoExiste.tipo === 'servico') {
        if (duracao_estimada !== undefined) dadosAtualizacao.duracao_estimada = duracao_estimada;
        if (area_atendimento !== undefined) dadosAtualizacao.area_atendimento = area_atendimento;
        if (aceita_urgencia !== undefined) dadosAtualizacao.aceita_urgencia = aceita_urgencia === true || aceita_urgencia === 'true';
      }

      // Atualizar
      const produto = await prisma.produto.update({
        where: { id },
        data: dadosAtualizacao,
        include: {
          imagens: {
            orderBy: { ordem: 'asc' }
          },
          categoria: true
        }
      });

      res.json({
        message: 'Produto atualizado com sucesso',
        produto
      });

    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  // Deletar produto
  async delete(req, res) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        },
        include: {
          imagens: true
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Deletar arquivos de imagem
      for (const imagem of produto.imagens) {
        const filePath = path.join(__dirname, '../../', imagem.url);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Erro ao deletar imagem:', err);
        }
      }

      // Deletar produto (cascade deleta imagens no DB)
      await prisma.produto.delete({
        where: { id }
      });

      res.json({ message: 'Produto deletado com sucesso' });

    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }

  // Adicionar imagens a um produto existente
  async addImages(req, res) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        },
        include: {
          imagens: true
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const imagensAtuais = produto.imagens.length;

      if (imagensAtuais >= 3) {
        return res.status(400).json({ error: 'Produto já possui o máximo de 3 imagens' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }

      const imagensPermitidas = Math.min(req.files.length, 3 - imagensAtuais);
      const imagensData = [];

      for (let i = 0; i < imagensPermitidas; i++) {
        const file = req.files[i];
        const filePath = file.path;

        // Comprimir
        const tamanhoKB = await compressImage(filePath, 1024);

        imagensData.push({
          produto_id: produto.id,
          url: `/uploads/produtos/${file.filename}`,
          ordem: imagensAtuais + i,
          tamanho_kb: tamanhoKB
        });
      }

      await prisma.imagemProduto.createMany({
        data: imagensData
      });

      // Buscar produto atualizado
      const produtoAtualizado = await prisma.produto.findUnique({
        where: { id },
        include: {
          imagens: {
            orderBy: { ordem: 'asc' }
          }
        }
      });

      res.json({
        message: `${imagensPermitidas} imagem(ns) adicionada(s) com sucesso`,
        produto: produtoAtualizado
      });

    } catch (error) {
      console.error('Erro ao adicionar imagens:', error);
      res.status(500).json({ error: 'Erro ao adicionar imagens' });
    }
  }

  // Deletar imagem específica
  async deleteImage(req, res) {
    try {
      const { id, imagemId } = req.params;

      // Verificar se produto pertence à loja
      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Buscar imagem
      const imagem = await prisma.imagemProduto.findFirst({
        where: {
          id: imagemId,
          produto_id: id
        }
      });

      if (!imagem) {
        return res.status(404).json({ error: 'Imagem não encontrada' });
      }

      // Deletar arquivo físico
      const filePath = path.join(__dirname, '../../', imagem.url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Erro ao deletar arquivo:', err);
      }

      // Deletar do banco
      await prisma.imagemProduto.delete({
        where: { id: imagemId }
      });

      // Reorganizar ordem das imagens restantes
      const imagensRestantes = await prisma.imagemProduto.findMany({
        where: { produto_id: id },
        orderBy: { ordem: 'asc' }
      });

      for (let i = 0; i < imagensRestantes.length; i++) {
        await prisma.imagemProduto.update({
          where: { id: imagensRestantes[i].id },
          data: { ordem: i }
        });
      }

      res.json({ message: 'Imagem deletada com sucesso' });

    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      res.status(500).json({ error: 'Erro ao deletar imagem' });
    }
  }

  // Toggle disponibilidade
  async toggleDisponivel(req, res) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: { disponivel: !produto.disponivel }
      });

      res.json({
        message: `Produto ${produtoAtualizado.disponivel ? 'disponibilizado' : 'indisponibilizado'} com sucesso`,
        disponivel: produtoAtualizado.disponivel
      });

    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
      res.status(500).json({ error: 'Erro ao alterar disponibilidade' });
    }
  }

  // Toggle bloqueio
  async toggleBloqueado(req, res) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findFirst({
        where: {
          id,
          loja_id: req.lojaId
        }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: { bloqueado: !produto.bloqueado }
      });

      res.json({
        message: `Produto ${produtoAtualizado.bloqueado ? 'bloqueado' : 'desbloqueado'} com sucesso`,
        bloqueado: produtoAtualizado.bloqueado
      });

    } catch (error) {
      console.error('Erro ao alterar bloqueio:', error);
      res.status(500).json({ error: 'Erro ao alterar bloqueio' });
    }
  }
}

module.exports = new ProdutoController();
