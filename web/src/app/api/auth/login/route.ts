import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../server/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { login, senha } = body || {}
    if (!login || !senha) return NextResponse.json({ error: 'Login e senha são obrigatórios' }, { status: 400 })
    const loja = await prisma.loja.findFirst({ where: { OR: [{ email: login }, { telefone: login }] }, include: { personalizacao: true } })
    if (!loja) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    const ok = await bcrypt.compare(senha, loja.senha)
    if (!ok) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    const token = signToken(loja.id)
    return NextResponse.json({ token, loja })
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}
