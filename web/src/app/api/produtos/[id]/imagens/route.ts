import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../server/prisma'
import { requireLojaId } from '../../../../../server/auth'
import { saveAndCompressImage } from '../../../../../server/upload'

export const runtime = 'nodejs'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = String(params.id)
    const produto = await prisma.produto.findUnique({ where: { id } })
    if (!produto || produto.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    const form = await req.formData()
    const files = form.getAll('imagens').filter((f): f is File => f instanceof File)
    const base = await prisma.imagemProduto.count({ where: { produto_id: id } })
    const created: any[] = []
    for (const [index, f] of files.entries()) {
      const { url, sizeKb } = await saveAndCompressImage(f)
      const img = await prisma.imagemProduto.create({ data: { produto_id: id, url, ordem: base + index, tamanho_kb: sizeKb } })
      created.push(img)
    }
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao enviar imagens' }, { status: 500 })
  }
}
