import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const loja = await prisma.loja.findUnique({
      where: { slug, ativo: true },
      include: { personalizacao: true, produtos: { where: { disponivel: true, bloqueado: false }, include: { imagens: { orderBy: { ordem: 'asc' }, take: 1 }, categoria: true } } }
    })
    if (!loja) return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 })
    return NextResponse.json(loja)
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao obter dados da loja' }, { status: 500 })
  }
}
