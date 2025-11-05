import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { requireLojaId } from '../../../server/auth'
import { slugify } from '../../../utils/helpers'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const cats = await prisma.categoria.findMany({
      where: { loja_id: lojaId },
      orderBy: [{ nivel: 'asc' }, { ordem: 'asc' }, { nome: 'asc' }]
    })
    return NextResponse.json(cats)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao listar categorias' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    const { nome, pai_id } = body || {}
    if (!nome) return NextResponse.json({ error: 'nome é obrigatório' }, { status: 400 })
    const paiId = pai_id && String(pai_id).trim() !== '' ? parseInt(pai_id) : null
    let nivel = 1
    if (paiId) {
      const pai = await prisma.categoria.findUnique({ where: { id: paiId }, select: { id: true, loja_id: true, nivel: true } })
      if (!pai || pai.loja_id !== lojaId) return NextResponse.json({ error: 'Categoria pai inválida' }, { status: 400 })
      nivel = (pai.nivel || 0) + 1
    }
    const slug = slugify(nome)
    const maxOrdem = await prisma.categoria.aggregate({ where: { loja_id: lojaId, pai_id: paiId }, _max: { ordem: true } })
    const ordem = (maxOrdem._max.ordem || 0) + 1
    const c = await prisma.categoria.create({ data: { nome, slug, nivel, ordem, pai_id: paiId, loja_id: lojaId } })
    return NextResponse.json(c, { status: 201 })
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'Já existe uma categoria com esse slug/nivel' }, { status: 409 })
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    const { id, nome, oculto } = body || {}
    if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    const cat = await prisma.categoria.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!cat || cat.loja_id !== lojaId) return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    const data: any = {}
    if (nome !== undefined) {
      data.nome = String(nome)
      data.slug = slugify(String(nome))
    }
    if (oculto !== undefined) data.oculto = !!oculto
    const updated = await prisma.categoria.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    const { id } = body || {}
    if (!id) return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    const cat = await prisma.categoria.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!cat || cat.loja_id !== lojaId) return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    await prisma.categoria.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao remover categoria' }, { status: 500 })
  }
}
