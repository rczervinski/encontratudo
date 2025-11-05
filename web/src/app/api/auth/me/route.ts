import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { requireLojaId } from '../../../../server/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    
    const loja = await prisma.loja.findUnique({
      where: { id: lojaId },
      include: {
        _count: {
          select: {
            produtos: true,
            categorias: true
          }
        }
      }
    })

    if (!loja) {
      return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 })
    }

    const { senha, ...lojaSemSenha } = loja

    return NextResponse.json(lojaSemSenha)
  } catch (e: any) {
    if (e instanceof Response) return e
    console.error('Erro ao buscar dados da loja:', e)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}
