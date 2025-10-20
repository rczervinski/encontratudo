import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { requireLojaId } from '../../../../server/auth'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = String(params.id)
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    const body = await req.json()
    const { nome_produto, descricao, preco, preco_promocional, categoria_id, tipo, tags, disponivel } = body || {}
    const data: any = {}
    if (nome_produto !== undefined) data.nome_produto = nome_produto
    if (descricao !== undefined) data.descricao = descricao
    if (preco !== undefined) {
      const p = Number(preco)
      if (Number.isNaN(p)) return NextResponse.json({ error: 'preco inválido' }, { status: 400 })
      data.preco = p
    }
    if (preco_promocional !== undefined) {
      if (preco_promocional === null || `${preco_promocional}` === '') data.preco_promocional = null
      else {
        const pp = Number(preco_promocional)
        if (Number.isNaN(pp)) return NextResponse.json({ error: 'preco_promocional inválido' }, { status: 400 })
        data.preco_promocional = pp
      }
    }
    if (categoria_id !== undefined) data.categoria_id = categoria_id && `${categoria_id}`.trim() !== '' ? `${categoria_id}` : null
    if (tipo !== undefined) data.tipo = tipo
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.join(',') : (tags || '')
    if (disponivel !== undefined) data.disponivel = !!disponivel
    const produto = await prisma.produto.update({ where: { id }, data })
    return NextResponse.json(produto)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = String(params.id)
    const existente = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!existente || existente.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    await prisma.produto.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao remover produto' }, { status: 500 })
  }
}
