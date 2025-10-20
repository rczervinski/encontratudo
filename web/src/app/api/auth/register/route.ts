import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../server/auth'
import { slugify } from '../../../../utils/helpers'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, telefone, senha, nome, cidade, estado } = body || {}
    if (!senha || !nome || !cidade || !estado) return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 })
    const senhaHash = await bcrypt.hash(senha, 10)
    const slugBase = slugify(nome)
    let slug = slugBase
    let i = 1
    while (await prisma.loja.findUnique({ where: { slug } })) slug = `${slugBase}-${i++}`
    const loja = await prisma.loja.create({ data: { senha: senhaHash, nome_loja: nome, slug, cidade, estado, email: email || null, telefone: telefone || null } })
    const token = signToken(loja.id)
    return NextResponse.json({ token, loja })
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao registrar' }, { status: 500 })
  }
}
