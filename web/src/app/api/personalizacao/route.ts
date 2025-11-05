import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { requireLojaId } from '../../../server/auth'
import { defaultSettings } from '../../../server/defaultSettings'
import { deepMerge } from '../../../utils/deepMerge'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const loja = await prisma.loja.findUnique({ where: { id: lojaId }, select: { nome_loja: true, whatsapp: true, personalizacao: true } })
    if (!loja) return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 })

    const persisted = (loja.personalizacao ?? {}) as any
    const s = deepMerge(defaultSettings as any, persisted)

    // Flatten para compatibilidade com UI atual
    const flat = {
      logo_url: s.identidade.logo_url,
      slogan: s.identidade.slogan,
      nome_header: s.identidade.nome_header || loja.nome_loja,
      preset_cores: s.identidade.preset_cores,
      cor_primaria: s.identidade.cores.cor_primaria,
      cor_secundaria: s.identidade.cores.cor_secundaria,
      cor_fundo: s.identidade.cores.cor_fundo,
      cor_header: s.identidade.cores.cor_header,
      cor_texto: s.identidade.cores.cor_texto,
      cor_texto_produto: s.identidade.cores.cor_texto_produto,
      cor_fundo_card: s.identidade.cores.cor_fundo_card,
      cor_borda_card: s.identidade.cores.cor_borda_card,
      cor_texto_card: s.identidade.cores.cor_texto_card,
      borda_radius_card: s.identidade.cores.borda_radius_card,
      sombra_card: s.identidade.cores.sombra_card,
      fonte_titulo: (s as any)?.identidade?.fontes?.fonte_titulo,
      fonte_corpo: (s as any)?.identidade?.fontes?.fonte_corpo,
      produtos_por_linha: s.layout.produtos_por_linha,
      mostrar_categorias: s.layout.mostrar_categorias,
      carrossel_ativo: s.layout.carrossel_ativo,
      localizacao_ativo: s.layout.localizacao_ativo,
      carrossel_ativado: s.conteudo.carrossel_ativado,
      carrossel_produtos: s.conteudo.carrossel_produtos,
      carrossel_foto1: s.conteudo.carrossel_foto1,
      carrossel_foto2: s.conteudo.carrossel_foto2,
      carrossel_foto3: s.conteudo.carrossel_foto3,
      cor_fundo_carrossel: s.conteudo.cor_fundo_carrossel,
      exibir_tipo: s.conteudo.exibir_tipo,
      ordem_exibicao: s.conteudo.ordem_exibicao,
      instagram: s.integracoes.instagram,
      facebook: s.integracoes.facebook,
    }
    return NextResponse.json(flat)
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao obter personalização' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()

    // Mapeia plano (flat) -> nested JSON
    const updateObj: any = {
      identidade: {
        logo_url: body.logo_url ?? undefined,
        nome_header: body.nome_header ?? undefined,
        slogan: body.slogan ?? undefined,
        preset_cores: body.preset_cores ?? undefined,
        cores: {
          cor_primaria: body.cor_primaria ?? undefined,
          cor_secundaria: body.cor_secundaria ?? undefined,
          cor_fundo: body.cor_fundo ?? undefined,
          cor_header: body.cor_header ?? undefined,
          cor_texto: body.cor_texto ?? undefined,
          cor_texto_produto: body.cor_texto_produto ?? undefined,
          cor_fundo_card: body.cor_fundo_card ?? undefined,
          cor_borda_card: body.cor_borda_card ?? undefined,
          cor_texto_card: body.cor_texto_card ?? undefined,
          borda_radius_card: body.borda_radius_card ?? undefined,
          sombra_card: body.sombra_card ?? undefined,
        },
        fontes: {
          fonte_titulo: body.fonte_titulo ?? undefined,
          fonte_corpo: body.fonte_corpo ?? undefined,
        }
      },
      layout: {
        produtos_por_linha: body.produtos_por_linha ?? undefined,
        mostrar_categorias: body.mostrar_categorias ?? undefined,
        carrossel_ativo: body.carrossel_ativo ?? undefined,
        localizacao_ativo: body.localizacao_ativo ?? undefined,
      },
      conteudo: {
        carrossel_ativado: body.carrossel_ativado ?? undefined,
        carrossel_produtos: body.carrossel_produtos ?? undefined,
        carrossel_foto1: body.carrossel_foto1 ?? undefined,
        carrossel_foto2: body.carrossel_foto2 ?? undefined,
        carrossel_foto3: body.carrossel_foto3 ?? undefined,
        cor_fundo_carrossel: body.cor_fundo_carrossel ?? undefined,
        exibir_tipo: body.exibir_tipo ?? undefined,
        ordem_exibicao: body.ordem_exibicao ?? undefined,
      },
      integracoes: {
        instagram: body.instagram ?? undefined,
        facebook: body.facebook ?? undefined,
      },
    }

    const loja = await prisma.loja.findUnique({ where: { id: lojaId }, select: { personalizacao: true } })
    const current = (loja?.personalizacao ?? {}) as any
    const merged = deepMerge(current, updateObj)

    await prisma.loja.update({ where: { id: lojaId }, data: { personalizacao: merged } })
    console.log('✅ Personalização salva (JSONB)')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('❌ Erro ao salvar personalização:', e)
    console.error('Stack:', e.stack)
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao salvar personalização', details: e.message }, { status: 500 })
  }
}
