require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./src/config/database');
const { calcularDistancia } = require('./src/utils/helpers');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ============================================
// ROTAS DA API
// ============================================

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/produtos', require('./src/routes/produtos'));
app.use('/api/categorias', require('./src/routes/categorias'));
app.use('/api/personalizacao', require('./src/routes/personalizacao'));

// ============================================
// API DE BUSCA PÚBLICA (Atualizada para Prisma)
// ============================================

app.get('/api/search', async (req, res) => {
  try {
    const { q, local, tipo } = req.query; // NOVO: tipo opcional

    if (!q || !local) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: q (busca) e local (latitude,longitude)' 
      });
    }

    const [userLat, userLon] = local.split(',').map(Number);
    
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ 
        error: 'Formato de localização inválido' 
      });
    }

    const buscaNormalizada = q.toLowerCase().trim();

    // Construir where clause
    const where = {
      disponivel: true,
      bloqueado: false,
      OR: [
        { nome_produto: { contains: buscaNormalizada, mode: 'insensitive' } },
        { descricao: { contains: buscaNormalizada, mode: 'insensitive' } },
        { tags: { contains: buscaNormalizada, mode: 'insensitive' } }
      ]
    };

    // Filtrar por tipo se especificado (senão busca ambos)
    if (tipo && ['produto', 'servico'].includes(tipo)) {
      where.tipo = tipo;
    }

    // Buscar produtos E serviços disponíveis e não bloqueados
    const produtos = await prisma.produto.findMany({
      where,
      include: {
        loja: {
          where: { ativo: true }
        },
        imagens: {
          orderBy: { ordem: 'asc' },
          take: 1 // Apenas primeira imagem
        }
      }
    });

    // Filtrar produtos que têm loja ativa e calcular distância
    const resultados = produtos
      .filter(p => p.loja)
      .map(produto => {
        const distancia = calcularDistancia(
          userLat, userLon,
          produto.loja.latitude, produto.loja.longitude
        );

        return {
          tipo: produto.tipo, // NOVO: indica se é produto ou serviço
          produto: {
            id: produto.id,
            nome: produto.nome_produto,
            descricao: produto.descricao,
            preco: produto.preco,
            preco_promocional: produto.preco_promocional,
            foto_url: produto.imagens[0]?.url || null,
            // Campos específicos de serviço
            ...(produto.tipo === 'servico' && {
              duracao_estimada: produto.duracao_estimada,
              area_atendimento: produto.area_atendimento,
              aceita_urgencia: produto.aceita_urgencia
            })
          },
          loja: {
            id: produto.loja.id,
            nome: produto.loja.nome_loja,
            slug: produto.loja.slug,
            endereco: produto.loja.endereco,
            telefone: produto.loja.telefone_loja,
            whatsapp: produto.loja.whatsapp,
            horario: produto.loja.horario_funcionamento,
            distancia: distancia.toFixed(2) + ' km',
            distancia_num: distancia
          }
        };
      })
      .sort((a, b) => a.loja.distancia_num - b.loja.distancia_num);

    // Registrar analytics
    for (const resultado of resultados) {
      await prisma.analytics.create({
        data: {
          loja_id: resultado.loja.id,
          tipo: 'busca_ia',
          produto_id: resultado.produto.id,
          termo_busca: q,
          latitude: userLat,
          longitude: userLon
        }
      });
    }

    res.json({
      total_resultados: resultados.length,
      busca: q,
      resultados: resultados.map(r => {
        const { distancia_num, ...loja } = r.loja;
        return { ...r, loja };
      })
    });

  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// ============================================
// CATÁLOGO ONLINE PÚBLICO
// ============================================

// Novo: API para obter dados completos da loja por slug (para o Next.js)
app.get('/api/lojas/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const loja = await prisma.loja.findUnique({
      where: { slug, ativo: true },
      include: {
        personalizacao: true,
        produtos: {
          where: { disponivel: true, bloqueado: false },
          include: {
            imagens: { orderBy: { ordem: 'asc' }, take: 1 },
            categoria: true
          }
        }
      }
    });

    if (!loja) return res.status(404).json({ error: 'Loja não encontrada' });

    // Registrar analytics simplificado
    await prisma.analytics.create({
      data: { loja_id: loja.id, tipo: 'catalogo_api' }
    }).catch(()=>{});

    res.json(loja);
  } catch (error) {
    console.error('Erro ao obter loja:', error);
    res.status(500).json({ error: 'Erro ao obter dados da loja' });
  }
});

// ============================================
// PÁGINA INICIAL (Landing Page)
// ============================================

// Redirecionar rotas de UI para o frontend Next.js (porta 3001 no dev)
app.get('/', (req, res) => {
  const nextUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3001/';
  res.redirect(302, nextUrl);
});

// ============================================
// DASHBOARD LOJISTA
// ============================================

app.get('/dashboard', (req, res) => {
  const nextUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3001/dashboard';
  res.redirect(302, nextUrl);
});

// Catálogo público agora renderizado pelo Next.js
app.get('/loja/:slug', (req, res) => {
  const { slug } = req.params;
  const nextUrl = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3001'}/loja/${slug}`;
  res.redirect(302, nextUrl);
});

// ============================================
// FUNÇÃO AUXILIAR: GERAR HTML DO CATÁLOGO
// ============================================

// Removido: renderização HTML direta do catálogo legacy (agora feito no Next.js)

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🚀 Encontra Tudo - Sistema Completo   ║
╚══════════════════════════════════════════╝

🌐 Servidor rodando em: http://localhost:${PORT}
📡 API disponível em: http://localhost:${PORT}/api
📊 Dashboard: http://localhost:${PORT}/dashboard

🔥 Recursos ativos:
   ✅ Autenticação com JWT
   ✅ CRUD de Produtos
   ✅ Upload e compressão de imagens
   ✅ Sistema de categorias hierárquico
   ✅ Catálogo online personalizado
   ✅ Analytics e métricas
   ✅ API de busca pública

🎯 Próximos passos:
   - Implementar importação de NFe
   - Criar painel de personalização visual
   - Adicionar geração de tags com IA
  `);
});

module.exports = app;
