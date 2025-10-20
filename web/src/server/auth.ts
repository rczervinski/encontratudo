import jwt from 'jsonwebtoken'

export function getAuthToken(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
}

export function requireLojaId(req: Request): string {
  const token = getAuthToken(req)
  if (!token) throw new Response(JSON.stringify({ error: 'Token ausente' }), { status: 401 })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const lojaId = payload.id || payload.lojaId || payload.sub
    if (!lojaId) throw new Error('Token inválido')
    return String(lojaId)
  } catch (e) {
    throw new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 })
  }
}

export function signToken(lojaId: string) {
  return jwt.sign({ id: lojaId }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}
