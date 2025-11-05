import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../server/prisma'
import { deepMerge } from '../../../../../utils/helpers'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    const loja = await prisma.loja.findUnique({
      where: { slug: params.slug },
      select: { id: true, personalizacao: true },
    })
    if (!loja) return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 })

    const current = (loja.personalizacao ?? {}) as any
    const merged = deepMerge(current, body)

    await prisma.loja.update({
      where: { id: loja.id },
      data: { personalizacao: merged as any },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao salvar personalização' }, { status: 500 })
  }
}
