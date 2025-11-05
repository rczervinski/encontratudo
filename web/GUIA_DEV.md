# Guia de Desenvolvimento - Encontra Tudo

## 🎯 Padrões e Convenções

### 1. Nomenclatura

#### Arquivos
```
✅ Correto                    ❌ Evite
route.ts                     api.ts
page.tsx                     index.tsx
helpers.ts                   utils.ts (se já existe helpers)
AuthController.ts            auth-controller.ts (não use mais controllers)
```

#### Variáveis e Funções
```typescript
// ✅ Correto: camelCase
const lojaId = '123'
function calcularDistancia() {}

// ❌ Evite: snake_case em JS/TS
const loja_id = '123'
function calcular_distancia() {}
```

#### Tipos e Interfaces
```typescript
// ✅ Correto: PascalCase
interface Produto {
  nome: string
}

type LojaData = {
  id: string
}
```

#### Tabelas do Banco (Prisma)
```prisma
// ✅ Correto: minúsculo
model loja {
  id String @id
}

model produto {
  nome String
}

// ❌ Evite: maiúsculo
model Loja { } // NÃO
model PRODUTO { } // NÃO
```

### 2. Estrutura de Arquivos API

#### Padrão de API Route
```typescript
// /web/src/app/api/produtos/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../server/prisma'
import { requireLojaId } from '../../../server/auth'

export const runtime = 'nodejs'

// GET /api/produtos
export async function GET(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    
    const produtos = await prisma.produto.findMany({
      where: { loja_id: lojaId }
    })
    
    return NextResponse.json(produtos)
  } catch (e: any) {
    if (e instanceof Response) return e
    console.error('Erro ao buscar produtos:', e)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/produtos
export async function POST(req: NextRequest) {
  try {
    const lojaId = requireLojaId(req as any)
    const body = await req.json()
    
    // Validação
    if (!body.nome || !body.preco) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
        { status: 400 }
      )
    }
    
    const produto = await prisma.produto.create({
      data: {
        ...body,
        loja_id: lojaId
      }
    })
    
    return NextResponse.json(produto, { status: 201 })
  } catch (e: any) {
    if (e instanceof Response) return e
    console.error('Erro ao criar produto:', e)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
```

#### API Route com Parâmetros Dinâmicos
```typescript
// /web/src/app/api/produtos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params
  const lojaId = requireLojaId(req as any)
  
  // ... lógica aqui
}
```

### 3. Tratamento de Erros

#### Padrão de Error Handling
```typescript
try {
  // lógica aqui
} catch (e: any) {
  // 1. Se for erro de autenticação (Response)
  if (e instanceof Response) return e
  
  // 2. Log do erro real
  console.error('Descrição do erro:', e)
  
  // 3. Retorno genérico para cliente
  return NextResponse.json(
    { error: 'Mensagem amigável' },
    { status: 500 }
  )
}
```

#### Status Codes Corretos
```typescript
// 200: Sucesso
return NextResponse.json(data)

// 201: Criado
return NextResponse.json(data, { status: 201 })

// 400: Erro de validação
return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

// 401: Não autenticado
return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

// 403: Não autorizado
return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })

// 404: Não encontrado
return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

// 500: Erro interno
return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
```

### 4. Consultas Prisma

#### Básicas
```typescript
// Buscar todos
const produtos = await prisma.produto.findMany()

// Buscar um
const produto = await prisma.produto.findUnique({
  where: { id: 'abc' }
})

// Buscar primeiro
const loja = await prisma.loja.findFirst({
  where: {
    OR: [
      { email: login },
      { telefone_loja: login }
    ]
  }
})

// Criar
const produto = await prisma.produto.create({
  data: { nome: 'Produto', preco: 10 }
})

// Atualizar
const produto = await prisma.produto.update({
  where: { id: 'abc' },
  data: { preco: 15 }
})

// Deletar
await prisma.produto.delete({
  where: { id: 'abc' }
})
```

#### Com Relações
```typescript
// Incluir relações
const loja = await prisma.loja.findUnique({
  where: { id: lojaId },
  include: {
    produtos: true,
    personalizacao: true
  }
})

// Contar relações
const loja = await prisma.loja.findUnique({
  where: { id: lojaId },
  include: {
    _count: {
      select: {
        produtos: true,
        categorias: true
      }
    }
  }
})
```

#### Transações
```typescript
const [produto, categoria] = await prisma.$transaction([
  prisma.produto.create({ data: produtoData }),
  prisma.categoria.create({ data: categoriaData })
])
```

### 5. Upload de Imagens

```typescript
import { saveAndCompressImage } from '../../../server/upload'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('imagem') as File
  
  if (!file) {
    return NextResponse.json(
      { error: 'Imagem não enviada' },
      { status: 400 }
    )
  }
  
  const { url, sizeKb } = await saveAndCompressImage(file)
  
  // Salvar URL no banco
  await prisma.imagem.create({
    data: {
      url,
      tamanho_kb: sizeKb,
      produto_id: produtoId
    }
  })
  
  return NextResponse.json({ url })
}
```

### 6. Componentes React

#### Server Component (padrão)
```typescript
// /web/src/app/dashboard/page.tsx

import prisma from '../../server/prisma'

export default async function DashboardPage() {
  // Pode fazer queries direto (server-side)
  const produtos = await prisma.produto.findMany()
  
  return (
    <div>
      <h1>Dashboard</h1>
      {produtos.map(p => (
        <div key={p.id}>{p.nome}</div>
      ))}
    </div>
  )
}
```

#### Client Component (interativo)
```typescript
// /web/src/app/dashboard/FormProduto.tsx
'use client'

import { useState } from 'react'

export default function FormProduto() {
  const [nome, setNome] = useState('')
  
  const handleSubmit = async () => {
    await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={e => setNome(e.target.value)} />
      <button type="submit">Criar</button>
    </form>
  )
}
```

### 7. Estilização com Tailwind

```tsx
// ✅ Correto: Classes utilitárias
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Título</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Ação
  </button>
</div>

// ❌ Evite: CSS inline
<div style={{ display: 'flex', padding: '24px' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Título</h1>
</div>
```

### 8. Validações

```typescript
// Validação simples
if (!nome || !preco) {
  return NextResponse.json(
    { error: 'Campos obrigatórios: nome, preco' },
    { status: 400 }
  )
}

// Validação de tipo
if (typeof preco !== 'number' || preco <= 0) {
  return NextResponse.json(
    { error: 'Preço deve ser um número positivo' },
    { status: 400 }
  )
}

// Validação de formato
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  return NextResponse.json(
    { error: 'Email inválido' },
    { status: 400 }
  )
}
```

### 9. Autenticação no Cliente

```typescript
// Salvar token
localStorage.setItem('token', token)

// Enviar token nas requisições
const response = await fetch('/api/produtos', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
```

### 10. Migrations Prisma

```bash
# Criar migração após alterar schema
npm run db:migrate

# Nomear a migração descritivamente
# Exemplo: "adicionar_campo_desconto_produto"

# Nunca edite migrações já aplicadas
# Sempre crie uma nova migração para alterações
```

## ⚠️ O Que EVITAR

### ❌ Não use Express/Controllers
```typescript
// ❌ ANTIGO (Express)
class ProdutoController {
  async index(req, res) {
    res.json(produtos)
  }
}

// ✅ NOVO (Next.js)
export async function GET(req: NextRequest) {
  return NextResponse.json(produtos)
}
```

### ❌ Não crie arquivos fora do /web
```
❌ /src/controllers/...
❌ /api/routes/...
❌ /server.js

✅ /web/src/app/api/...
✅ /web/src/server/...
```

### ❌ Não use módulos CommonJS
```typescript
// ❌ EVITE
const express = require('express')
module.exports = { func }

// ✅ USE
import express from 'express'
export { func }
```

## 📝 Checklist de PR/Commit

- [ ] Código em TypeScript (exceto config files)
- [ ] API routes em `/web/src/app/api`
- [ ] Tabelas do banco em minúsculo
- [ ] Erros tratados com try/catch
- [ ] Validações implementadas
- [ ] Tipos TypeScript corretos
- [ ] Tailwind para estilização
- [ ] Sem console.log desnecessários
- [ ] Mensagens de erro em português
- [ ] Código formatado e limpo

## 🚀 Pronto para começar!

Siga essas convenções e seu código ficará consistente e manutenível.
