import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const uploadDir = path.join(process.cwd(), 'uploads')

export function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
}

export async function saveAndCompressImage(file: File) {
  ensureUploadDir()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const base = (file.name || 'file').replace(/[^a-z0-9-_.]+/gi, '-')
  const ts = Date.now()
  const tempPath = path.join(uploadDir, `${ts}-${base}`)
  fs.writeFileSync(tempPath, buffer)
  const outPath = tempPath.replace(path.extname(tempPath), '.webp')
  try {
    await sharp(tempPath).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outPath)
    fs.unlinkSync(tempPath)
  } catch {
    // fallback mantém arquivo original
    return { absPath: tempPath, url: `/uploads/${path.basename(tempPath)}`, sizeKb: Math.max(1, Math.round(buffer.byteLength / 1024)) }
  }
  const stat = fs.statSync(outPath)
  return { absPath: outPath, url: `/uploads/${path.basename(outPath)}`, sizeKb: Math.max(1, Math.round(stat.size / 1024)) }
}
