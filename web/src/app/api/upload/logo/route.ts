import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import jwt from 'jsonwebtoken'
import { ensureUploadDir, saveAndCompressImage } from '../../../../server/upload'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-jwt-aqui'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const lojaId = decoded.lojaId

    // Obter arquivo (aceita campo 'file' ou 'logo' para compatibilidade)
    const formData = await request.formData()
    const file = (formData.get('file') || formData.get('logo')) as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPG, PNG, SVG ou WebP' },
        { status: 400 }
      )
    }
    // Salvar com compressão quando necessário
    ensureUploadDir()
    const isSvg = file.type === 'image/svg+xml'
    if (isSvg) {
      // SVG não é rasterizado/comprimido pelo sharp; apenas salvar no uploads
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base = (file.name || 'file').replace(/[^a-z0-9-_.]+/gi, '-')
      const filename = `${lojaId}-${Date.now()}-${base}`
      const abs = path.join(process.cwd(), 'uploads', filename)
      const fs = await import('fs/promises')
      await fs.writeFile(abs, buffer)
      const url = `/uploads/${filename}`
      // Se > 4MB, rejeita SVG acima do limite
      if (buffer.byteLength > 4 * 1024 * 1024) {
        await fs.unlink(abs).catch(() => {})
        return NextResponse.json({ error: 'Arquivo SVG acima de 4MB. Otimize e tente novamente.' }, { status: 400 })
      }
      return NextResponse.json({ url, filename, sizeKb: Math.ceil(buffer.byteLength / 1024) })
    }

    // Para imagens raster: comprime para WebP e aplica limite de 4MB após compressão
    const saved = await saveAndCompressImage(file)
    if (saved.sizeKb > 4096) {
      // ainda acima de 4MB após compressão
      const fs = await import('fs/promises')
      await fs.unlink(saved.absPath).catch(() => {})
      return NextResponse.json({ error: 'Arquivo muito grande mesmo após compressão (limite 4MB).' }, { status: 400 })
    }
    return NextResponse.json({ url: saved.url, filename: path.basename(saved.absPath), sizeKb: saved.sizeKb })
  } catch (error: any) {
    console.error('Erro ao fazer upload de logo:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload', details: error.message },
      { status: 500 }
    )
  }
}
