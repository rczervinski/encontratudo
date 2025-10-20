import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const filePath = path.join(process.cwd(), 'uploads', ...params.path)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const data = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const type = ext === '.webp' ? 'image/webp' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'application/octet-stream'
  return new NextResponse(data, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' } })
}
