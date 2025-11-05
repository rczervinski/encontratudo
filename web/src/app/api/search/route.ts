import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { calcularDistancia } from '../../../utils/helpers'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const cidade = searchParams.get('cidade')
    const estado = searchParams.get('estado')
    const tipo = searchParams.get('tipo')
    
    if (!q) {
      return NextResponse.json({ error: 'Parâmetro obrigatório: q' }, { status: 400 })
    }
    
    if (!cidade || !estado) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios: cidade e estado' }, { status: 400 })
    }
    
    // Usa coordenadas de referência da cidade (poderia usar API para pegar lat/lng real)
    const [userLat, userLon] = [0, 0] // Placeholder - vamos buscar por cidade mesmo
    
    const where: any = { 
      disponivel: true, 
      bloqueado: false,
      loja: {
        cidade: { contains: cidade, mode: 'insensitive' },
        estado: estado
      },
      OR: [
        { nome_produto: { contains: q, mode: 'insensitive' } },
        { descricao: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } }
      ]
    }
    if (tipo && ['produto','servico'].includes(tipo)) where.tipo = tipo
    const produtos = await prisma.produto.findMany({
      where,
      include: {
        loja: true,
        imagens: { orderBy: { ordem: 'asc' }, take: 1 }
      }
    })
    const ativos = produtos.filter(p => p.loja && p.loja.ativo)
    const resultados = ativos.map((produto) => {
      const distancia = calcularDistancia(userLat, userLon, produto.loja!.latitude, produto.loja!.longitude)
      return {
        tipo: produto.tipo,
        produto: { id: produto.id, nome: produto.nome_produto, descricao: produto.descricao, preco: produto.preco, preco_promocional: produto.preco_promocional, foto_url: produto.imagens[0]?.url || null },
        loja: { id: produto.loja!.id, nome: produto.loja!.nome_loja, slug: produto.loja!.slug, endereco: produto.loja!.endereco, telefone: produto.loja!.telefone_loja, whatsapp: produto.loja!.whatsapp, horario: produto.loja!.horario_funcionamento, distancia: distancia.toFixed(2) + ' km', distancia_num: distancia }
      }
    }).sort((a, b) => a.loja.distancia_num - b.loja.distancia_num)
    return NextResponse.json({ total_resultados: resultados.length, busca: q, resultados: resultados.map(r => { const { distancia_num, ...loja } = r.loja; return { ...r, loja } }) })
  } catch (e) {
    console.error('Erro na API /api/search:', e)
    const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: 'Erro ao buscar produtos', details: errorMessage }, { status: 500 })
  }
}
