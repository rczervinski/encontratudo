# Arquitetura do Projeto - Encontra Tudo

## 📁 Estrutura de Pastas

```
encontratudo/
├── prisma/                      # Schema e migrações do banco
│   ├── schema.prisma           # Definição das tabelas
│   └── migrations/             # Histórico de migrações
│
├── uploads/                     # Arquivos estáticos (imagens)
│   ├── logos/
│   ├── produtos/
│   └── nfe/
│
└── web/                        # Aplicação Next.js
    ├── src/
    │   ├── app/                # App Router (Next.js 14)
    │   │   ├── api/            # API Routes
    │   │   │   ├── auth/       # Autenticação
    │   │   │   ├── produtos/   # CRUD Produtos
    │   │   │   ├── categorias/ # CRUD Categorias
    │   │   │   ├── personalizacao/
    │   │   │   ├── search/     # Busca pública
    │   │   │   └── lojas/      # Catálogo público
    │   │   │
    │   │   ├── dashboard/      # Dashboard do lojista
    │   │   ├── loja/[slug]/    # Página pública
    │   │   ├── login/          # Página de login
    │   │   ├── registro/       # Página de registro
    │   │   ├── layout.tsx      # Layout global
    │   │   └── page.tsx        # Home page
    │   │
    │   ├── server/             # Lógica de servidor
    │   │   ├── prisma.ts       # Cliente Prisma
    │   │   ├── auth.ts         # JWT e autenticação
    │   │   └── upload.ts       # Upload de imagens
    │   │
    │   ├── lib/                # Bibliotecas cliente
    │   │   └── api.ts          # Cliente HTTP
    │   │
    │   ├── utils/              # Utilitários
    │   │   └── helpers.ts      # Funções auxiliares
    │   │
    │   └── types/              # Tipos TypeScript
    │       └── env.d.ts
    │
    └── package.json
```

## 🏗️ Camadas da Aplicação

### 1. Camada de Dados (Database)
- **Prisma ORM**: Acesso type-safe ao banco de dados
- **PostgreSQL**: Banco de dados principal
- **Singleton Pattern**: Uma instância do Prisma Client

**Arquivo**: `/web/src/server/prisma.ts`

### 2. Camada de API (Backend)
- **Next.js API Routes**: Endpoints REST
- **Route Handlers**: Funções GET, POST, PATCH, DELETE
- **Middleware**: Autenticação JWT inline

**Estrutura**: `/web/src/app/api/**/route.ts`

### 3. Camada de Autenticação
- **JWT**: Tokens assinados com secret
- **bcryptjs**: Hash de senhas
- **Helper Functions**: `requireLojaId()`, `signToken()`

**Arquivo**: `/web/src/server/auth.ts`

### 4. Camada de Upload
- **Multer**: (não usado - Next.js usa FormData)
- **Sharp**: Compressão e conversão para WebP
- **File System**: Salvamento em `/uploads`

**Arquivo**: `/web/src/server/upload.ts`

### 5. Camada de Apresentação (Frontend)
- **React 18**: Server e Client Components
- **Tailwind CSS**: Estilização utilitária
- **TypeScript**: Tipagem estática

**Estrutura**: `/web/src/app/**/*.tsx`

## 🔐 Fluxo de Autenticação

```
1. Usuário → POST /api/auth/register
   ↓
2. API: Valida dados, hash senha, cria loja no DB
   ↓
3. API: Gera JWT com lojaId
   ↓
4. Cliente: Recebe token, salva no localStorage
   ↓
5. Cliente: Envia token em todas as requisições (Header: Authorization: Bearer <token>)
   ↓
6. API: Middleware valida token, extrai lojaId
   ↓
7. API: Executa ação autorizada
```

## 📡 Endpoints da API

### Autenticação (Público)
```
POST /api/auth/register    # Criar conta
POST /api/auth/login       # Login
```

### Autenticação (Privado)
```
GET /api/auth/me           # Dados da loja logada
```

### Produtos (Privado)
```
GET    /api/produtos            # Listar produtos da loja
POST   /api/produtos            # Criar produto
PATCH  /api/produtos/[id]       # Atualizar produto
DELETE /api/produtos/[id]       # Deletar produto
POST   /api/produtos/[id]/imagens  # Upload de imagem
```

### Categorias (Privado)
```
GET  /api/categorias       # Listar categorias
POST /api/categorias       # Criar categoria
```

### Personalização (Privado)
```
GET  /api/personalizacao   # Buscar personalização
POST /api/personalizacao   # Atualizar personalização
```

### Busca (Público)
```
GET /api/search?q=termo&local=lat,lng&tipo=produto  # Buscar produtos
```

### Catálogo Público
```
GET /api/lojas/[slug]      # Dados da loja pública
```

## 🗄️ Modelos do Banco (Principais)

### Loja
```prisma
model loja {
  id                String     @id @default(cuid())
  nome_loja         String
  slug              String     @unique
  email             String?    @unique
  telefone          String?
  senha             String
  cidade            String
  estado            String
  latitude          Float?
  longitude         Float?
  ativo             Boolean    @default(true)
  
  produtos          produto[]
  categorias        categoria[]
  personalizacao    personalizacao?
}
```

### Produto
```prisma
model produto {
  id          String   @id @default(cuid())
  nome        String
  descricao   String?
  preco       Decimal
  estoque     Int      @default(0)
  ativo       Boolean  @default(true)
  loja_id     String
  categoria_id String?
  
  loja        loja     @relation(fields: [loja_id], references: [id])
  categoria   categoria? @relation(fields: [categoria_id], references: [id])
  imagens     imagem[]
}
```

## 🎨 Design System (Tailwind)

### Cores Principais
```js
colors: {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  bg: '#background-color',
  text: {
    primary: '#text-primary',
    secondary: '#text-secondary'
  }
}
```

### Componentes
- Layouts responsivos
- Mobile-first
- Classes utilitárias

## 🚀 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev           # Inicia servidor de desenvolvimento
npm run db:studio     # Abre Prisma Studio
```

### Produção
```bash
npm run build         # Build otimizado
npm start             # Inicia servidor de produção
```

### Banco de Dados
```bash
npm run db:generate   # Gera tipos do Prisma
npm run db:migrate    # Executa migrações
npm run db:push       # Sincroniza schema sem migração
npm run db:reset      # Reseta banco (CUIDADO!)
```

## 🔧 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# JWT
JWT_SECRET="seu-secret-aqui"
JWT_EXPIRES_IN="7d"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 📋 Checklist de Desenvolvimento

### Nova Feature
- [ ] Criar API route em `/web/src/app/api/[feature]/route.ts`
- [ ] Implementar validações
- [ ] Adicionar autenticação se necessário (`requireLojaId`)
- [ ] Criar página/componente em `/web/src/app/[feature]`
- [ ] Testar endpoint com Postman/Thunder Client
- [ ] Testar UI no navegador

### Nova Tabela no Banco
- [ ] Adicionar model no `schema.prisma`
- [ ] Executar `npm run db:migrate`
- [ ] Gerar tipos com `npm run db:generate`
- [ ] Criar API routes CRUD
- [ ] Implementar UI

## 🧪 Dicas de Debug

### Problemas com Prisma
```bash
npx prisma generate    # Regenera tipos
npx prisma db push     # Força sync com banco
```

### Problemas com Next.js
```bash
rm -rf .next           # Remove cache
npm run dev            # Reinicia
```

### Ver logs SQL
```typescript
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
```

## 📚 Referências

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
