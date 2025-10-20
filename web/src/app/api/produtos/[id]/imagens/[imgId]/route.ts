import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../../../server/prisma'
import { requireLojaId } from '../../../../../../server/auth'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest, { params }: { params: { id: string, imgId: string } }) {
  try {
    const lojaId = requireLojaId(req as any)
    const id = String(params.id)
    const imgId = String(params.imgId)
    const produto = await prisma.produto.findUnique({ where: { id }, select: { id: true, loja_id: true } })
    if (!produto || produto.loja_id !== lojaId) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    const imagem = await prisma.imagemProduto.findUnique({ where: { id: imgId }, select: { id: true, produto_id: true, url: true } })
    if (!imagem || imagem.produto_id !== id) return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 })
    await prisma.imagemProduto.delete({ where: { id: imgId } })
    try {
      const abs = path.join(process.cwd(), imagem.url.replace(/^\//, ''))
      if (fs.existsSync(abs)) fs.unlinkSync(abs)
    } catch {}
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: 'Erro ao excluir imagem' }, { status: 500 })
  }
}
