import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { calcularDistancia } from '../../../utils/helpers'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const local = searchParams.get('local')
    const tipo = searchParams.get('tipo')
    if (!q || !local) return NextResponse.json({ error: 'Parâmetros obrigatórios: q e local' }, { status: 400 })
    const [userLat, userLon] = local.split(',').map(Number)
    if (isNaN(userLat) || isNaN(userLon)) return NextResponse.json({ error: 'Formato de localização inválido' }, { status: 400 })
    const where: any = { disponivel: true, bloqueado: false, OR: [
      { nome_produto: { contains: q, mode: 'insensitive' } },
      { descricao: { contains: q, mode: 'insensitive' } },
      { tags: { contains: q, mode: 'insensitive' } }
    ] }
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
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}
