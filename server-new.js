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
app.use(express.static('public'));

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

app.get('/loja/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const loja = await prisma.loja.findUnique({
      where: { slug, ativo: true },
      include: {
        personalizacao: true,
        produtos: {
          where: {
            disponivel: true,
            bloqueado: false
          },
          include: {
            imagens: {
              orderBy: { ordem: 'asc' },
              take: 1
            },
            categoria: true
          }
        }
      }
    });

    if (!loja) {
      return res.status(404).send('<h1>Loja não encontrada</h1>');
    }

    // Registrar analytics
    await prisma.analytics.create({
      data: {
        loja_id: loja.id,
        tipo: 'catalogo_direto'
      }
    });

    // Renderizar catálogo (HTML inline por simplicidade)
    res.send(gerarHtmlCatalogo(loja));

  } catch (error) {
    console.error('Erro ao carregar catálogo:', error);
    res.status(500).send('<h1>Erro ao carregar catálogo</h1>');
  }
});

// ============================================
// PÁGINA INICIAL (Landing Page)
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// ============================================
// DASHBOARD LOJISTA
// ============================================

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ============================================
// FUNÇÃO AUXILIAR: GERAR HTML DO CATÁLOGO
// ============================================

function gerarHtmlCatalogo(loja) {
  const p = loja.personalizacao || {};
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${p.meta_titulo || loja.nome_loja} - Catálogo Online</title>
    <meta name="description" content="${p.meta_descricao || loja.descricao || ''}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ${p.fonte_corpo || 'system-ui'};
            background: ${p.cor_fundo || '#f5f5f5'};
            color: ${p.cor_texto || '#333'};
        }
        header {
            background: ${p.cor_header || '#333'};
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        header h1 {
            font-family: ${p.fonte_titulo || 'system-ui'};
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .info { background: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .produtos {
            display: grid;
            grid-template-columns: repeat(${p.produtos_por_linha || 3}, 1fr);
            gap: 20px;
        }
        .product-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        ${p.animacoes_ativadas !== false ? `
        .product-card:hover {
            transform: ${p.efeito_hover === 'zoom' ? 'scale(1.05)' : 'translateY(-5px)'};
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        ` : ''}
        .product-card img { width: 100%; height: 200px; object-fit: cover; }
        .product-content { padding: 15px; }
        .product-name { font-weight: bold; margin-bottom: 10px; }
        .product-price { 
            font-size: 1.5rem; 
            color: ${p.cor_primaria || '#667eea'}; 
            font-weight: bold;
        }
        @media (max-width: 768px) {
            .produtos { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        ${p.logo_url ? `<img src="${p.logo_url}" alt="${loja.nome_loja}" style="max-height: 80px; margin-bottom: 15px;">` : ''}
        <h1>${loja.nome_loja}</h1>
        <p>${loja.descricao || ''}</p>
    </header>
    
    <div class="container">
        <div class="info">
            <h2>📍 ${loja.endereco}, ${loja.cidade} - ${loja.estado}</h2>
            <p>📞 ${loja.telefone_loja}</p>
            ${loja.whatsapp ? `<p>💬 WhatsApp: ${loja.whatsapp}</p>` : ''}
            <p>🕐 ${loja.horario_funcionamento || 'Consultar horário'}</p>
        </div>
        
        <h2 style="margin-bottom: 20px;">
            ${loja.produtos.some(p => p.tipo === 'produto') && loja.produtos.some(p => p.tipo === 'servico') 
              ? 'Produtos e Serviços' 
              : loja.produtos.some(p => p.tipo === 'servico') 
                ? 'Nossos Serviços' 
                : 'Nossos Produtos'}
        </h2>
        <div class="produtos">
            ${loja.produtos.map(p => `
                <div class="product-card">
                    ${p.imagens[0] ? `<img src="${p.imagens[0].url}" alt="${p.nome_produto}">` : '<div style="height: 200px; background: #eee; display: flex; align-items: center; justify-content: center;">Sem imagem</div>'}
                    <div class="product-content">
                        ${p.tipo === 'servico' ? '<span style="background: #667eea; color: white; padding: 3px 8px; border-radius: 5px; font-size: 0.75rem; display: inline-block; margin-bottom: 8px;">🛠️ SERVIÇO</span>' : ''}
                        <div class="product-name">${p.nome_produto}</div>
                        ${p.descricao ? `<p style="font-size: 0.9rem; color: #666; margin: 8px 0;">${p.descricao.substring(0, 100)}${p.descricao.length > 100 ? '...' : ''}</p>` : ''}
                        
                        ${p.tipo === 'servico' ? `
                            <div style="margin-top: 10px; font-size: 0.85rem; color: #555;">
                                ${p.duracao_estimada ? `<div>⏱️ Duração: ${p.duracao_estimada}</div>` : ''}
                                ${p.area_atendimento ? `<div>📍 Área: ${p.area_atendimento}</div>` : ''}
                                ${p.aceita_urgencia ? '<div style="color: #e74c3c;">🚨 Atende urgências</div>' : ''}
                            </div>
                        ` : ''}
                        
                        <div class="product-price">R$ ${p.preco_promocional || p.preco}</div>
                        ${p.preco_promocional ? `<div style="text-decoration: line-through; color: #999;">De R$ ${p.preco}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
}

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
