import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../server/prisma'
import { defaultSettings } from '../../../../server/defaultSettings'
import { deepMerge } from '../../../../utils/deepMerge'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const loja = await prisma.loja.findFirst({
      where: { slug, ativo: true },
      include: {
        produtos: q
          ? false
          : {
              where: { disponivel: true, bloqueado: false },
              include: { imagens: { orderBy: { ordem: 'asc' }, take: 1 }, categoria: true }
            },
        categorias: { orderBy: [{ nivel: 'asc' }, { ordem: 'asc' }, { nome: 'asc' }] },
      },
    })
    if (!loja) return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 })
    // Monta settings mesclando defaults com o JSON salvo (se existir)
  const persisted = (loja as any).personalizacao ?? {}
  let settings: any = deepMerge(defaultSettings as any, persisted as any)
    // Fallbacks úteis
    if (!settings.identidade?.nome_header) {
      settings = {
        ...settings,
        identidade: { ...settings.identidade, nome_header: loja.nome_loja },
      }
    }
    if (!settings.integracoes?.whatsapp && loja.whatsapp) {
      settings = {
        ...settings,
        integracoes: { ...settings.integracoes, whatsapp: loja.whatsapp },
      }
    }

    // Se houver busca, filtra produtos por LIKE no servidor
    let produtos = (loja as any).produtos ?? []
    if (q) {
      produtos = await prisma.produto.findMany({
        where: {
          loja_id: loja.id,
          disponivel: true,
          bloqueado: false,
          OR: [
            { nome_produto: { contains: q, mode: 'insensitive' } },
            { descricao: { contains: q, mode: 'insensitive' } },
            { tags: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { imagens: { orderBy: { ordem: 'asc' }, take: 1 }, categoria: true },
        orderBy: [{ atualizado_em: 'desc' }],
      })
    }

    // Retorna payload mantendo compatibilidade com front
  const categorias = ((loja as any).categorias ?? []).filter((c: any) => !c.oculto)
  return NextResponse.json({
      id: loja.id,
      slug: loja.slug,
      nome_loja: loja.nome_loja,
      whatsapp: loja.whatsapp,
      endereco: loja.endereco,
      bairro: loja.bairro,
      cidade: loja.cidade,
      estado: loja.estado,
      cep: loja.cep,
      horario_funcionamento: loja.horario_funcionamento,
      produtos,
      categorias,
      settings,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao obter dados da loja' }, { status: 500 })
  }
}
