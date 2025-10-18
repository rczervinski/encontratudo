const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se a loja existe e está ativa
    const loja = await prisma.loja.findUnique({
      where: { id: decoded.lojaId }
    });

    if (!loja || !loja.ativo) {
      return res.status(401).json({ error: 'Loja não encontrada ou inativa' });
    }

    // Adicionar dados da loja no request
    req.loja = loja;
    req.lojaId = loja.id;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = auth;
