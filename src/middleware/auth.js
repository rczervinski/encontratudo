const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null
  if (!token) return res.status(401).json({ error: 'Token ausente' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.lojaId = payload.id || payload.lojaId || payload.sub
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
