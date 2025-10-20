import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { requireLojaId } from '../../../server/auth'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const p = await prisma.personalizacao.findUnique({ where: { loja_id: lojaId } })
    return NextResponse.json(p)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao obter personalização' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    const defaults = {
      cor_primaria: '#667eea', cor_secundaria: '#764ba2', cor_fundo: '#ffffff', cor_header: '#333333', cor_texto: '#333333', fonte_titulo: 'system-ui', fonte_corpo: 'system-ui', layout_grade: 'grid', produtos_por_linha: 3, animacoes_ativadas: true, efeito_hover: 'zoom'
    }
    const data = { ...defaults, ...body }
    const p = await prisma.personalizacao.upsert({ where: { loja_id: lojaId }, update: data, create: { ...data, loja_id: lojaId } })
    return NextResponse.json(p)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao salvar personalização' }, { status: 500 })
  }
}
