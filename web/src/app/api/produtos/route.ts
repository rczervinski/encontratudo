import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { requireLojaId } from '../../../server/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const produtos = await prisma.produto.findMany({
      where: { loja_id: lojaId },
      include: { imagens: { orderBy: { ordem: 'asc' } }, categoria: true }
    })
    return NextResponse.json(produtos)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao listar produtos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    const { nome_produto, descricao, preco, preco_promocional, categoria_id, tipo, tags } = body || {}
    if (!nome_produto || preco === undefined || preco === null || `${preco}` === '') {
      return NextResponse.json({ error: 'nome_produto e preco são obrigatórios' }, { status: 400 })
    }
    const precoNumber = Number(preco)
    if (Number.isNaN(precoNumber)) return NextResponse.json({ error: 'preco inválido' }, { status: 400 })
    const precoPromNumber = preco_promocional != null && `${preco_promocional}` !== '' ? Number(preco_promocional) : null
    if (precoPromNumber !== null && Number.isNaN(precoPromNumber)) return NextResponse.json({ error: 'preco_promocional inválido' }, { status: 400 })
    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '')
    const categoriaId = categoria_id && `${categoria_id}`.trim() !== '' ? `${categoria_id}` : null
    const produto = await prisma.produto.create({
      data: { loja_id: lojaId, nome_produto, descricao: descricao || null, preco: precoNumber, preco_promocional: precoPromNumber, categoria_id: categoriaId, tipo: tipo || 'produto', tags: tagsStr, disponivel: true, bloqueado: false }
    })
    return NextResponse.json(produto, { status: 201 })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
