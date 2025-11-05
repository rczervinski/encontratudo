const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { generateSlug } = require('../utils/helpers');

class AuthController {
  // Registro de nova loja
  async register(req, res) {
    try {
      const {
        email,
        telefone,
        senha,
        nome,
        tipo_estabelecimento,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        latitude,
        longitude
      } = req.body;

      // Validar campos obrigatórios básicos
      if (!senha || !nome || !cidade || !estado) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios faltando',
          required: ['senha', 'nome', 'cidade', 'estado']
        });
      }

      // Verificar se ao menos um contato foi fornecido
      if (!email && !telefone) {
        return res.status(400).json({ 
          erro: 'Forneça ao menos um meio de contato (email ou telefone)'
        });
      }

      // Verificar se email já existe (se fornecido)
      if (email) {
        const emailExiste = await prisma.loja.findUnique({
          where: { email }
        });

        if (emailExiste) {
          return res.status(400).json({ erro: 'Email já cadastrado' });
        }
      }

      // Verificar se telefone já existe (se fornecido)
      if (telefone) {
        const telefoneExiste = await prisma.loja.findFirst({
          where: { telefone_loja: telefone }
        });

        if (telefoneExiste) {
          return res.status(400).json({ erro: 'Telefone já cadastrado' });
        }
      }

      // Gerar slug único
      let slug = generateSlug(nome);
      let slugExiste = await prisma.loja.findUnique({ where: { slug } });
      let contador = 1;

      while (slugExiste) {
        slug = `${generateSlug(nome)}-${contador}`;
        slugExiste = await prisma.loja.findUnique({ where: { slug } });
        contador++;
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Montar endereço completo para lojas físicas
      let enderecoCompleto = null;
      if (tipo_estabelecimento === 'loja' && logradouro) {
        enderecoCompleto = `${logradouro}, ${numero}${complemento ? ', ' + complemento : ''}`;
      }

      // Criar loja (personalizacao em JSONB)
      const loja = await prisma.loja.create({
        data: {
          email: email || null,
          telefone: telefone || null,
          senha: senhaHash,
          nome_loja: nome,
          slug,
          endereco: enderecoCompleto,
          cidade,
          estado,
          bairro: bairro || null,
          cep: cep || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          telefone_loja: telefone || null,
          whatsapp: telefone || null,
          // JSONB default vazio; defaults aplicados na leitura
          personalizacao: {}
        }
      });

      // Gerar token JWT
      const token = jwt.sign(
        { lojaId: loja.id, email: loja.email || loja.telefone },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover senha da resposta
      const { senha: _, ...lojaSemSenha } = loja;

      res.status(201).json({
        message: 'Cadastro realizado com sucesso!',
        loja: lojaSemSenha,
        token,
        catalog_url: `${process.env.BASE_URL}/loja/${slug}`
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ erro: 'Erro ao criar cadastro: ' + error.message });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ erro: 'Login (email ou telefone) e senha são obrigatórios' });
      }

      // Buscar loja por email OU telefone
      const loja = await prisma.loja.findFirst({
        where: { 
          OR: [
            { email: login },
            { telefone_loja: login }
          ]
        }
      });

      if (!loja) {
        return res.status(401).json({ erro: 'Login ou senha incorretos' });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, loja.senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Login ou senha incorretos' });
      }

      if (!loja.ativo) {
        return res.status(403).json({ erro: 'Conta desativada. Entre em contato com o suporte.' });
      }

      // Gerar token
      const token = jwt.sign(
        { lojaId: loja.id, email: loja.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remover senha
      const { senha: _, ...lojaSemSenha } = loja;

      res.json({
        message: 'Login realizado com sucesso',
        loja: lojaSemSenha,
        token,
        catalog_url: `${process.env.BASE_URL}/loja/${loja.slug}`
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Obter dados da loja logada
  async me(req, res) {
    try {
      const loja = await prisma.loja.findUnique({
        where: { id: req.lojaId },
        include: {
          _count: {
            select: {
              produtos: true,
              categorias: true
            }
          }
        }
      });

      const { senha, ...lojaSemSenha } = loja;

      res.json(lojaSemSenha);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }

  // Atualizar dados da loja
  async update(req, res) {
    try {
      const {
        nome_loja,
        descricao,
        endereco,
        cidade,
        estado,
        cep,
        latitude,
        longitude,
        telefone_loja,
        whatsapp,
        horario_funcionamento
      } = req.body;

      const dadosAtualizacao = {};

      if (nome_loja) dadosAtualizacao.nome_loja = nome_loja;
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (endereco) dadosAtualizacao.endereco = endereco;
      if (cidade) dadosAtualizacao.cidade = cidade;
      if (estado) dadosAtualizacao.estado = estado;
      if (cep) dadosAtualizacao.cep = cep;
      if (latitude) dadosAtualizacao.latitude = parseFloat(latitude);
      if (longitude) dadosAtualizacao.longitude = parseFloat(longitude);
      if (telefone_loja) dadosAtualizacao.telefone_loja = telefone_loja;
      if (whatsapp) dadosAtualizacao.whatsapp = whatsapp;
      if (horario_funcionamento) dadosAtualizacao.horario_funcionamento = horario_funcionamento;

      const loja = await prisma.loja.update({
        where: { id: req.lojaId },
        data: dadosAtualizacao
      });

      const { senha, ...lojaSemSenha } = loja;

      res.json({
        message: 'Dados atualizados com sucesso',
        loja: lojaSemSenha
      });

    } catch (error) {
      console.error('Erro ao atualizar:', error);
      res.status(500).json({ error: 'Erro ao atualizar dados' });
    }
  }
}

module.exports = new AuthController();
