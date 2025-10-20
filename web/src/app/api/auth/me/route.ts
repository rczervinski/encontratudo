import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { requireLojaId } from '../../../../server/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const loja = await prisma.loja.findUnique({ where: { id: lojaId }, include: { personalizacao: true } })
    if (!loja) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(loja)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao obter loja' }, { status: 500 })
  }
}
