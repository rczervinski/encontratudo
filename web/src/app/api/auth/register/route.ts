import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { signToken } from '../../../../server/auth'
import { slugify } from '../../../../utils/helpers'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      telefone,
      senha,
      nome,
      tipo_estabelecimento,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      latitude,
      longitude
    } = body || {}

    // Validar campos obrigatórios
    if (!senha || !nome || !cidade || !estado) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: senha, nome, cidade, estado' },
        { status: 400 }
      )
    }

    // Verificar se ao menos um contato foi fornecido
    if (!email && !telefone) {
      return NextResponse.json(
        { error: 'Forneça ao menos um meio de contato (email ou telefone)' },
        { status: 400 }
      )
    }

    // Verificar duplicados
    if (email) {
      const emailExiste = await prisma.loja.findUnique({ where: { email } })
      if (emailExiste) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
      }
    }

    if (telefone) {
      const telefoneExiste = await prisma.loja.findFirst({ where: { telefone_loja: telefone } })
      if (telefoneExiste) {
        return NextResponse.json({ error: 'Telefone já cadastrado' }, { status: 400 })
      }
    }

    // Gerar slug único
    const slugBase = slugify(nome)
    let slug = slugBase
    let contador = 1
    while (await prisma.loja.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${contador++}`
    }

    // Montar endereço completo para lojas físicas
    let enderecoCompleto = null
    if (tipo_estabelecimento === 'loja' && logradouro) {
      enderecoCompleto = `${logradouro}, ${numero}${complemento ? ', ' + complemento : ''}`
    }

    // Criar loja com JSON de personalização vazio (defaults serão mesclados na leitura)
    const loja = await prisma.loja.create({
      data: {
        email: email || null,
        telefone: telefone || null,
        senha: senha, // Senha sem criptografia
        nome_loja: nome,
        slug,
        endereco: enderecoCompleto,
        cidade,
        estado,
        bairro: bairro || null,
        cep: cep || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        telefone_loja: telefone || null,
        whatsapp: telefone || null,
        personalizacao: {}
      }
    })

    const token = signToken(loja.id)
    const { senha: _, ...lojaSemSenha } = loja

    return NextResponse.json({
      message: 'Cadastro realizado com sucesso!',
      loja: lojaSemSenha,
      token,
      catalog_url: `/loja/${slug}`
    }, { status: 201 })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro ao criar cadastro' }, { status: 500 })
  }
}
