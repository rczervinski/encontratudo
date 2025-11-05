import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../server/prisma'
import { requireLojaId } from '../../../../../server/auth'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    const body = await req.json()
    const data: any = {}
    if (body.disponivel !== undefined) data.disponivel = !!body.disponivel
    if (body.bloqueado !== undefined) data.bloqueado = !!body.bloqueado
    if (body.destaque !== undefined) data.destaque = !!body.destaque
    const produto = await prisma.produto.update({ where: { id }, data })
    return NextResponse.json(produto)
  } catch (e: any) {
    if (e instanceof Response) return e
    console.error('Erro ao atualizar status:', e)
    return NextResponse.json({ error: 'Erro ao atualizar status do produto' }, { status: 500 })
  }
}
