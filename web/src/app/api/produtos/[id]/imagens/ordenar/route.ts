import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../../server/prisma'
import { requireLojaId } from '../../../../../../server/auth'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = String(params.id)
    const body = await req.json()
    const ordem = Array.isArray(body?.ordem) ? body.ordem : null
    if (!ordem) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    const produto = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!produto || produto.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    const imgIds = ordem.map((o: any) => String(o.id))
    const imagens = await prisma.imagemProduto.findMany({ where: { id: { in: imgIds } }, select: { id: true, produto_id: true } })
    const todasDoProduto = imagens.every(i => i.produto_id === id)
    if (!todasDoProduto) return NextResponse.json({ error: 'Imagens inválidas para este produto' }, { status: 400 })
    await Promise.all(ordem.map((o: any, i: number) => prisma.imagemProduto.update({ where: { id: String(o.id) }, data: { ordem: Number(o.ordem) ?? i } })))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao ordenar imagens' }, { status: 500 })
  }
}
