# Migração para Next.js - Estrutura Atualizada

## Resumo da Migração

O projeto foi modernizado de Express.js para **Next.js 14 com App Router**, React, TypeScript e Tailwind CSS.

## Estrutura Antiga vs Nova

### ❌ Estrutura Antiga (Removida)
```
/src
  /config
    database.js          → Configuração do Prisma
  /controllers
    AuthController.js    → Lógica de autenticação
    PersonalizacaoController.js
  /middleware
    auth.js             → Middleware de autenticação JWT
    upload.js           → Upload e compressão de imagens
  /routes
    auth.js             → Rotas Express
    categorias.js
    personalizacao.js
    produtos.js
  /utils
    helpers.js          → Funções auxiliares
```

### ✅ Estrutura Nova (Next.js)
```
/web
  /src
    /app                 → App Router (Next.js 14)
      /api               → API Routes
        /auth
          /login         → POST /api/auth/login
          /register      → POST /api/auth/register
          /me            → GET /api/auth/me
        /categorias      → CRUD de categorias
        /personalizacao  → Personalização da loja
        /produtos        → CRUD de produtos
        /search          → Busca pública
        /lojas           → Catálogo público
      /dashboard         → Dashboard do lojista
      /loja/[slug]       → Página pública do catálogo
      /login             → Login UI
      /registro          → Registro UI
      
    /server              → Lógica de servidor
      prisma.ts          → Cliente Prisma (singleton)
      auth.ts            → Autenticação JWT
      upload.ts          → Upload e compressão de imagens
      
    /utils
      helpers.ts         → Funções auxiliares
      
    /lib
      api.ts             → Cliente HTTP para frontend
      
    /types
      env.d.ts           → Tipagens TypeScript
```

## Mapeamento de Funcionalidades

| Arquivo Antigo | Novo Equivalente | Status |
|---------------|------------------|--------|
| `/src/config/database.js` | `/web/src/server/prisma.ts` | ✅ Migrado |
| `/src/middleware/auth.js` | `/web/src/server/auth.ts` | ✅ Migrado |
| `/src/middleware/upload.js` | `/web/src/server/upload.ts` | ✅ Melhorado |
| `/src/controllers/AuthController.js` | `/web/src/app/api/auth/*` | ✅ Migrado |
| `/src/routes/*.js` | `/web/src/app/api/*` | ✅ Migrado |
| `/src/utils/helpers.js` | `/web/src/utils/helpers.ts` | ✅ Migrado + Tipado |

## Principais Melhorias

### 1. **TypeScript**
- Tipagem estática em todo o código
- Melhor IntelliSense e autocomplete
- Menos bugs em produção

### 2. **Next.js App Router**
- Server Components por padrão
- Streaming e Suspense nativos
- Rotas de API integradas
- Otimização automática de imagens

### 3. **Tailwind CSS**
- Design system consistente
- Classes utilitárias
- Responsividade simplificada

### 4. **Estrutura Modular**
- Separação clara entre servidor e cliente
- Reuso de código facilitado
- Manutenção simplificada

## Como Usar

### Desenvolvimento
```bash
cd web
npm run dev
```

### Build de Produção
```bash
cd web
npm run build
npm start
```

### Comandos do Prisma
```bash
# Gerar tipos do Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio
```

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar nova loja
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados da loja logada

### Produtos
- `GET /api/produtos` - Listar produtos da loja
- `POST /api/produtos` - Criar produto
- `PATCH /api/produtos/[id]` - Atualizar produto
- `DELETE /api/produtos/[id]` - Deletar produto
- `POST /api/produtos/[id]/imagens` - Upload de imagem

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria

### Personalização
- `GET /api/personalizacao` - Buscar personalização
- `POST /api/personalizacao` - Atualizar personalização

### Busca Pública
- `GET /api/search?q=termo&local=lat,lng` - Buscar produtos

## Notas Importantes

1. **Prisma Schema**: Continua na raiz do projeto (`/prisma/schema.prisma`)
2. **Uploads**: Arquivos salvos em `/uploads` (fora do `/web`)
3. **Ambiente**: Variáveis em `.env` na raiz do projeto
4. **Base URL**: Desenvolvimento em `http://localhost:3000`

## Próximos Passos

- [ ] Remover arquivos antigos (`/src`, `server.js`, `server-new.js`)
- [ ] Atualizar documentação da API
- [ ] Implementar testes automatizados
- [ ] Configurar CI/CD

## Suporte

Em caso de dúvidas sobre a nova estrutura, consulte:
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Tailwind](https://tailwindcss.com/docs)
