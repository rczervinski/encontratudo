# 🎯 CONTEXTO ATUAL DO PROJETO - EncontraTudo

## 📅 Última Atualização: 20 de Outubro de 2025

---

## 🚀 O QUE FOI FEITO HOJE

### ✅ Sistema de Personalização Completo Implementado

#### 1. **Componente de Personalização** (`web/src/components/TabPersonalizacao.tsx`)
Um site builder completo com 800+ linhas de código, incluindo:

**🎨 Presets de Cores Profissionais (8 combinações prontas)**:
- Preto & Amarelo - Elegante e vibrante
- Preto & Laranja - Energia e sofisticação
- Branco & Vermelho - Clássico e impactante
- Azul & Ciano - Moderno e profissional
- Verde & Lima - Fresco e natural
- Roxo & Rosa - Criativo e moderno
- Dourado & Branco - Luxo e elegância
- Navy & Ouro - Sofisticado e premium

**🖼️ Identidade Visual**:
- Upload de logo (PNG, JPG, SVG, WebP - máx 2MB)
- Nome personalizado do header
- Slogan/descrição da loja

**🌈 Cores Personalizadas** (5 color pickers):
- Cor primária
- Cor secundária
- Cor de fundo
- Cor do header
- Cor do texto

**📝 Tipografia**:
- Fontes para títulos: System, Inter, Poppins, Montserrat, Playfair, Bebas Neue
- Fontes para corpo: System, Inter, Open Sans, Roboto, Lato

**📐 Layout e Organização**:
- Estilos: Grid, Lista, Masonry
- Produtos por linha: 2 a 5 (slider)
- Efeitos hover: Zoom, Lift, Glow, None
- Toggle de animações

**🏷️ Categorias**:
- Toggle mostrar/ocultar menu
- Estilos: Cards, Pills, Sidebar, Dropdown

**👁️ Pré-visualização em Tempo Real**:
- Header dinâmico mostrando logo + nome + slogan
- Grid de 3 produtos com cores e fontes aplicadas
- Atualização instantânea ao modificar

#### 2. **Schema do Banco Atualizado** (`web/prisma/schema.prisma`)
Novos campos adicionados na tabela `personalizacao`:
```prisma
slogan              String?
nome_header         String?
preset_cores        String?
mostrar_categorias  Boolean  @default(true)
estilo_categorias   String   @default("cards")
```

#### 3. **API de Upload de Logo** (`web/src/app/api/upload/logo/route.ts`)
- Validação de tipos permitidos (image/jpeg, image/png, image/svg+xml, image/webp)
- Limite de tamanho: 2MB
- Salva em: `../uploads/logos/`
- Nomenclatura: `{lojaId}-{uuid}.{extension}`
- Retorna: `{ url, filename }`
- Autenticação via JWT

#### 4. **Integração no Painel** (`web/src/app/painel/page.tsx`)
- Tab "Personalização" preparada (atualmente placeholder)
- Import do componente está configurado (precisa ajuste de módulo)

---

## 🗂️ ESTRUTURA DO PROJETO

```
encontratudo/
├── web/                          # Frontend Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── painel/          # ✅ Dashboard SPA completo
│   │   │   │   └── page.tsx     # 5 tabs: Início, Produtos, Categorias, Personalização, Analíticos
│   │   │   ├── api/
│   │   │   │   ├── personalizacao/  # ✅ GET/POST personalização
│   │   │   │   ├── upload/
│   │   │   │   │   └── logo/        # ✅ Upload de logos
│   │   │   │   ├── auth/            # ✅ Login, Register, Me
│   │   │   │   ├── produtos/        # ✅ CRUD produtos/serviços
│   │   │   │   ├── categorias/      # ✅ CRUD categorias
│   │   │   │   └── search/          # ✅ Busca de produtos
│   │   │   ├── login/           # ✅ Cores corrigidas, redirect para /painel
│   │   │   ├── registro/        # ⚠️ Steps 1-2 OK, 3-5 precisam correção de cores
│   │   │   ├── dashboard/       # ✅ Redirect para /painel
│   │   │   ├── produtos/        # ✅ Gerenciamento completo
│   │   │   ├── loja/[slug]/     # ✅ Catálogo público
│   │   │   ├── sobre/           # ✅ Página marketing
│   │   │   └── page.tsx         # ✅ Home com busca, animações, CTAs
│   │   ├── components/
│   │   │   ├── TabPersonalizacao.tsx  # ✅ 800+ linhas, site builder completo
│   │   │   └── SeletorCidade.tsx      # ✅ Seletor de cidade com GPS
│   │   ├── lib/
│   │   └── server/
│   ├── prisma/
│   │   └── schema.prisma        # ✅ Atualizado com novos campos
│   └── package.json
├── prisma/                      # Backend Prisma (raiz)
│   └── schema.prisma
├── uploads/
│   ├── logos/                   # Logos das lojas
│   ├── produtos/                # Imagens de produtos
│   └── nfe/                     # XMLs de notas fiscais
└── src/                         # Backend Node.js
```

---

## 🎨 TEMA VISUAL DO PROJETO

**Cor Principal**: Roxo (`#7c3aed`, `#9D50BB`)
- Gradientes: `from-purple-600 to-purple-700`
- Acentos: `bg-purple-100`, `text-purple-700`
- Bordas: `border-purple-200`
- Hovers: `hover:bg-purple-50`

**Padrão de Cores**:
- Texto: `text-gray-900` (não usar `text-white` em fundo branco!)
- Fundos: `bg-white`, `bg-gray-50`
- Inputs: `border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100`

---

## ⚠️ PROBLEMAS CONHECIDOS

### 1. **Import do Componente TabPersonalizacao**
**Erro**: `Cannot find module '@/components/TabPersonalizacao'`
**Status**: Arquivo existe em `web/src/components/TabPersonalizacao.tsx` com export default correto
**Causa**: Possível cache do Next.js ou problema de configuração TypeScript
**Solução Temporária**: Placeholder no painel, componente completo criado mas não integrado

### 2. **Registro - Steps 3, 4, 5**
**Problema**: Cores ainda usando `bg-white/5`, `text-white` (texto branco em fundo branco)
**Localização**: `web/src/app/registro/page.tsx` linhas após step 2
**Solução**: Aplicar mesmo padrão dos steps 1-2:
- `bg-white` → fundos
- `text-gray-900` → textos
- `border-purple-200` → bordas

### 3. **Migration Pendente**
**Status**: Schema atualizado, mas migration não criada
**Comando necessário**:
```bash
cd web
npx prisma migrate dev --name adicionar_personalizacao_completa
```

### 4. **UUID Package**
**Erro**: `Cannot find module 'uuid'`
**Localização**: `web/src/app/api/upload/logo/route.ts`
**Solução**:
```bash
cd web
npm install uuid
npm install --save-dev @types/uuid
```

---

## 📋 PRÓXIMOS PASSOS (POR ORDEM DE PRIORIDADE)

### 🔥 CRÍTICO - Fazer Primeiro

#### 1. **Instalar Dependência UUID**
```bash
cd web
npm install uuid @types/uuid
```

#### 2. **Criar Migration do Banco**
```bash
cd web
npx prisma migrate dev --name adicionar_personalizacao_completa
npx prisma generate
```

#### 3. **Corrigir Import do TabPersonalizacao**
**Opção A** - Limpar cache do Next.js:
```bash
cd web
rm -rf .next
npm run dev
```

**Opção B** - Verificar tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Opção C** - Import direto (sem dynamic):
```typescript
// No arquivo web/src/app/painel/page.tsx
import TabPersonalizacaoComponent from '../../../components/TabPersonalizacao'
```

#### 4. **Corrigir Cores do Registro (Steps 3-5)**
Arquivo: `web/src/app/registro/page.tsx`
Substituir:
- `bg-white/5` → `bg-white`
- `text-white` → `text-gray-900`
- `border-white/10` → `border-purple-200`
- `bg-primary` → `bg-purple-600`
- Linha 70: `JSON.parse` → `JSON.stringify`

---

### 🚀 IMPORTANTE - Fazer em Seguida

#### 5. **Aplicar Personalização na Página Pública da Loja**
Arquivo: `web/src/app/loja/[slug]/page.tsx`

**Carregar dados**:
```typescript
const personalizacao = await prisma.personalizacao.findUnique({
  where: { loja_id: loja.id }
})
```

**Aplicar no JSX**:
```tsx
<div style={{
  background: personalizacao?.cor_fundo,
  fontFamily: personalizacao?.fonte_corpo
}}>
  <header style={{
    background: personalizacao?.cor_header,
    color: personalizacao?.cor_texto
  }}>
    {personalizacao?.logo_url && (
      <img src={personalizacao.logo_url} alt="Logo" />
    )}
    <h1 style={{ fontFamily: personalizacao?.fonte_titulo }}>
      {personalizacao?.nome_header || loja.nome_loja}
    </h1>
    {personalizacao?.slogan && <p>{personalizacao.slogan}</p>}
  </header>
  
  {/* Grid de produtos */}
  <div className="grid" style={{
    gridTemplateColumns: `repeat(${personalizacao?.produtos_por_linha || 3}, 1fr)`
  }}>
    {/* Produtos aqui */}
  </div>
</div>
```

#### 6. **Implementar Tab Produtos no Painel**
Arquivo: `web/src/app/painel/page.tsx` função `TabProdutos`

Funcionalidades:
- Listar produtos e serviços
- Botão adicionar novo
- Editar inline
- Toggle ativo/inativo
- Upload de imagens
- Deletar com confirmação

#### 7. **Implementar Tab Categorias no Painel**
Arquivo: `web/src/app/painel/page.tsx` função `TabCategorias`

Funcionalidades:
- Árvore de categorias (pai/filhos)
- Drag & drop para ordenação
- Criar/editar/deletar
- Atribuir ícones

#### 8. **Implementar Tab Analíticos**
Arquivo: `web/src/app/painel/page.tsx` função `TabAnaliticos`

Métricas detalhadas:
- Gráfico de acessos (últimos 30 dias)
- Produtos mais visualizados
- Taxa de conversão
- Origem dos acessos (cidades)
- Horários de pico

---

### 💡 MELHORIAS FUTURAS

#### 9. **Melhorias no Sistema de Upload**
- [ ] Crop de imagens (logo quadrada)
- [ ] Compressão automática
- [ ] Múltiplos formatos (otimização WebP)
- [ ] Preview antes de salvar

#### 10. **Fontes do Google Fonts**
Adicionar no `layout.tsx`:
```tsx
import { Inter, Poppins, Montserrat } from 'next/font/google'
```

#### 11. **Preview em Tempo Real Melhorado**
- [ ] Botão "Visualizar Site Completo" (modal fullscreen)
- [ ] Simulação mobile/tablet/desktop
- [ ] Alternar entre produtos/serviços no preview

#### 12. **Templates Prontos**
Criar 5 templates completos:
- Restaurante (preto-amarelo, imagens grandes)
- Loja de Roupas (branco-rosa, grid minimalista)
- Serviços (azul-ciano, lista com descrições)
- Beleza (roxo-rosa, masonry com efeitos)
- Mercado (verde-lima, categorias em destaque)

#### 13. **SEO e Meta Tags**
Usar campos `meta_titulo` e `meta_descricao` já existentes:
```tsx
export const metadata = {
  title: personalizacao?.meta_titulo,
  description: personalizacao?.meta_descricao
}
```

#### 14. **Sistema de Temas Sazonais**
- Natal (vermelho-verde)
- Black Friday (preto-amarelo)
- Dia das Mães (rosa-branco)
- Páscoa (roxo-amarelo)

---

## 🔧 COMANDOS ÚTEIS

### Desenvolvimento
```bash
# Iniciar servidor Next.js
cd web
npm run dev

# Iniciar backend Node.js
npm run dev

# Ambos simultaneamente (da raiz)
npm run dev
```

### Banco de Dados
```bash
# Criar migration
cd web
npx prisma migrate dev --name nome_da_migration

# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (GUI do banco)
npx prisma studio

# Resetar banco (cuidado!)
npx prisma migrate reset
```

### Instalação de Pacotes
```bash
cd web
npm install <pacote>
```

---

## 📊 ESTADO DAS FUNCIONALIDADES

| Funcionalidade | Status | Observações |
|---|---|---|
| ✅ Home com busca | 100% | Animações, GPS, CTAs |
| ✅ Registro | 80% | Steps 1-2 OK, 3-5 precisam cores |
| ✅ Login | 100% | Redirect para /painel |
| ✅ Painel SPA | 90% | Estrutura completa, falta integrar |
| ✅ Tab Início | 100% | Métricas e ações rápidas |
| ⚠️ Tab Produtos | 10% | Placeholder |
| ⚠️ Tab Categorias | 10% | Placeholder |
| 🔨 Tab Personalização | 95% | Componente pronto, falta integrar |
| ⚠️ Tab Analíticos | 10% | Placeholder |
| ✅ API Personalização | 100% | GET/POST funcionando |
| ✅ API Upload Logo | 100% | Validações completas |
| ✅ Catálogo Público | 80% | Falta aplicar personalização |
| ✅ CRUD Produtos | 100% | Upload múltiplo de imagens |
| ✅ CRUD Categorias | 100% | Hierarquia funcionando |
| ✅ Busca | 100% | Por cidade/estado/termo |

---

## 🎯 OBJETIVO FINAL

Criar um **site builder completo** onde cada loja tem:
- ✅ Logo personalizada
- ✅ Cores únicas (presets ou custom)
- ✅ Fontes profissionais
- ✅ Layout configurável
- ✅ Catálogo online bonito
- ✅ Painel de administração intuitivo
- ⏳ Métricas e analytics
- ⏳ SEO otimizado

---

## 💬 DICAS PARA A IA

### Ao continuar este projeto:

1. **SEMPRE use cores Tailwind explícitas**:
   - ❌ NÃO: `bg-primary`, `text-text`, `bg-bg`
   - ✅ SIM: `bg-purple-600`, `text-gray-900`, `bg-white`

2. **Padrão de cores do projeto**:
   - Primária: Roxo (`purple-600`, `purple-700`)
   - Texto: Cinza escuro (`gray-900`)
   - Fundos: Branco (`white`) ou cinza claro (`gray-50`)
   - Bordas: Roxo claro (`purple-200`)

3. **NUNCA use texto branco em fundo branco**:
   - Se `bg-white` → use `text-gray-900`
   - Se `bg-purple-600` → use `text-white`

4. **Ao modificar arquivos**:
   - Leia o arquivo completo primeiro
   - Use `replace_string_in_file` com contexto de 3-5 linhas
   - Teste após cada modificação

5. **Estrutura do projeto**:
   - Frontend: `web/src/app/` (Next.js 14 App Router)
   - Backend APIs: `web/src/app/api/` (Route Handlers)
   - Componentes: `web/src/components/`
   - Schema: `web/prisma/schema.prisma`

6. **SEMPRE responda em português** conforme instruções

---

## 📝 NOTAS TÉCNICAS

### PostgreSQL
- Banco local em `postgresql://postgres:postgres@localhost:5432/encontratudo`
- Tabelas em **minúsculo** (regra do projeto)
- Prisma ORM para queries

### Autenticação
- JWT em `localStorage` (key: `token`)
- Dados da loja em `localStorage` (key: `loja`)
- Middleware em `web/src/server/auth.ts`

### Uploads
- Diretório raiz: `../uploads/` (relativo a `web/`)
- Subpastas: `logos/`, `produtos/`, `nfe/`
- Rota pública: `/uploads/[...path]` → `web/src/app/uploads/[...path]/route.ts`

### Next.js
- Versão 14 com App Router
- Server Components por padrão
- Use `'use client'` para componentes interativos
- Dynamic imports para componentes pesados

---

## 🐛 DEBUG

### Se der erro de módulo não encontrado:
```bash
cd web
rm -rf .next node_modules
npm install
npm run dev
```

### Se Prisma não reconhecer mudanças:
```bash
cd web
npx prisma generate
npx prisma migrate dev
```

### Se imagens não aparecerem:
Verificar se pasta `uploads/` existe na raiz do projeto:
```bash
mkdir -p uploads/logos uploads/produtos uploads/nfe
```

---

## ✅ CHECKLIST RÁPIDO PARA CONTINUAR

- [ ] Instalar `uuid`: `npm install uuid @types/uuid`
- [ ] Criar migration: `npx prisma migrate dev --name adicionar_personalizacao_completa`
- [ ] Corrigir import de `TabPersonalizacao.tsx` no painel
- [ ] Corrigir cores do registro (steps 3-5)
- [ ] Aplicar personalização na página pública `/loja/[slug]`
- [ ] Implementar Tab Produtos
- [ ] Implementar Tab Categorias
- [ ] Implementar Tab Analíticos
- [ ] Testar upload de logo
- [ ] Testar presets de cores
- [ ] Testar preview em tempo real

---

## 📞 CONTEXTO FINAL

Este projeto é um **marketplace local** onde:
- Lojas e autônomos se cadastram
- Cada um tem um catálogo online personalizável
- Clientes buscam por cidade/estado
- Há integração com GPS para localização
- Sistema de upload de produtos via NF-e
- Painel administrativo moderno (SPA)

**Stack completa**:
- Frontend: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Prisma ORM
- Banco: PostgreSQL
- Autenticação: JWT
- Deploy futuro: Hostgator com PostgreSQL

**Última sessão (20/Out/2025)**:
Implementamos sistema completo de personalização com 8 presets profissionais de cores, upload de logo, customização de fontes, layouts e preview em tempo real. Componente de 800+ linhas criado e schema do banco atualizado.

---

**BOA SORTE NA FACULDADE! 🎓**
**Quando voltar, é só seguir os próximos passos! 🚀**
