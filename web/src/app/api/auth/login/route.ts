import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { signToken } from '../../../../server/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { login, senha } = body || {}

    if (!login || !senha) {
      return NextResponse.json(
        { error: 'Login (email ou telefone) e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar loja por email OU telefone
    const loja = await prisma.loja.findFirst({
      where: {
        OR: [
          { email: login },
          { telefone_loja: login }
        ]
      }
    })

    if (!loja) {
      return NextResponse.json({ error: 'Login ou senha incorretos' }, { status: 401 })
    }

    // Verificar senha (comparação direta, sem hash)
    if (senha !== loja.senha) {
      return NextResponse.json({ error: 'Login ou senha incorretos' }, { status: 401 })
    }

    // Verificar se conta está ativa
    if (!loja.ativo) {
      return NextResponse.json(
        { error: 'Conta desativada. Entre em contato com o suporte.' },
        { status: 403 }
      )
    }

    const token = signToken(loja.id)
    const { senha: _, ...lojaSemSenha } = loja

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      loja: lojaSemSenha,
      token,
      catalog_url: `/loja/${loja.slug}`
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}
