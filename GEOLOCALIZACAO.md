# Sistema de Geolocalização e Busca - ENCONTRATUDO

## 🎯 Visão Geral

Sistema completo de geolocalização automática com fallback manual, animações e busca inteligente por cidade/estado.

## 🚀 Fluxo de Funcionamento

### 1. **Detecção Automática de Localização**
- Ao entrar, o sistema solicita permissão para acessar a localização GPS
- Usa `navigator.geolocation` para obter coordenadas (lat/lng)
- Faz busca reversa usando API do OpenStreetMap (Nominatim)
- Identifica automaticamente cidade e estado do usuário

### 2. **Fallback em Caso de Erro**
Se a geolocalização falhar (permissão negada, timeout, etc.):
- Exibe tela: **"Ops... tivemos um erro ao ver sua localização"**
- Mostra componente `SeletorCidade` com:
  - Select de estado (API IBGE com fallback JSON local)
  - Select de cidade (API IBGE com fallback JSON local)

### 3. **Animação de Busca**
Quando o usuário busca por algo:
- Esconde a barra de busca
- Mostra animação roxa com spinner
- Exibe mensagem: **"Buscando produtos e serviços relacionados em {cidade}"**
- Dura 2 segundos para dar feedback visual

### 4. **Exibição de Resultados**
Após a busca:
- **Com resultados**: Lista produtos/serviços da cidade
- **Sem resultados**: Exibe **"Vixi, não temos nenhum produto relacionado nessa região"**
- Ambos os casos mostram componente para buscar em outras cidades

### 5. **Busca Manual por Outras Cidades**
Componentes de troca de cidade aparecem em:
- Link "busque por cidades" abaixo do campo de busca inicial
- Abaixo dos resultados: "Não encontrou em {cidade}? pesquise em outras cidades!"
- Na tela de sem resultados: "Quer ver em outra cidade?"

## 📁 Arquitetura de Arquivos

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal com todos os estados
│   │   └── api/
│   │       └── search/
│   │           └── route.ts      # API de busca (filtro por cidade/estado)
│   ├── components/
│   │   └── SeletorCidade.tsx     # Componente select de estado/cidade
│   └── utils/
│       └── geolocalizacao.ts     # Funções de geolocalização GPS + busca reversa
├── public/
│   └── cidades/
│       └── cidades.json          # Fallback de todas as cidades brasileiras
└── prisma/
    └── schema.prisma             # Schema com campos cidade/estado na tabela loja
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** (App Router)
- **React 18** com TypeScript
- **Tailwind CSS** (tema roxo/branco)
- **Geolocation API** (navegador)

### APIs Externas
- **API IBGE**: Estados e municípios brasileiros
- **OpenStreetMap Nominatim**: Busca reversa de coordenadas para cidade

### Backend
- **Prisma ORM**: Consultas ao banco PostgreSQL
- **Next.js API Routes**: Endpoints RESTful

## 🎨 Estados da Aplicação

A página principal (`page.tsx`) gerencia 6 estados diferentes:

1. **`detectando`**: Carregando localização GPS
2. **`erro-localizacao`**: Erro ao obter GPS
3. **`inicial`**: Página inicial com barra de busca
4. **`buscando`**: Animação de busca ativa
5. **`resultados`**: Exibindo produtos encontrados
6. **`sem-resultados`**: Nenhum produto na região

## 📦 Componente SeletorCidade

**Props:**
- `onCidadeSelect(cidade, estado)`: Callback ao selecionar cidade
- `mensagem?`: Texto customizado (default: "Selecione seu estado e cidade:")
- `estadoInicial?`: Estado pré-selecionado
- `cidadeInicial?`: Cidade pré-selecionada

**Funcionalidades:**
- Carrega estados da API IBGE (fallback: JSON local)
- Ao selecionar estado, carrega cidades da API IBGE (fallback: JSON local)
- Botão "Confirmar Localização" chama o callback

## 🔍 API de Busca

**Endpoint:** `GET /api/search`

**Query Params:**
- `q` (obrigatório): Termo de busca
- `cidade` (obrigatório): Nome da cidade
- `estado` (obrigatório): Sigla do estado (ex: PR, SP, RJ)
- `tipo` (opcional): "produto" ou "servico"

**Resposta:**
```json
{
  "total_resultados": 10,
  "busca": "pizza",
  "resultados": [
    {
      "tipo": "produto",
      "produto": {
        "id": "uuid",
        "nome": "Pizza Margherita",
        "descricao": "Pizza tradicional",
        "preco": 35.00,
        "foto_url": "/uploads/..."
      },
      "loja": {
        "id": "uuid",
        "nome": "Pizzaria do João",
        "slug": "pizzaria-do-joao",
        "endereco": "Rua X, 123",
        "telefone": "41 99999-9999",
        "whatsapp": "41999999999",
        "distancia": "2.5 km"
      }
    }
  ]
}
```

## 🌍 Geolocalização

### Funções em `geolocalizacao.ts`:

#### `obterLocalizacaoAtual()`
- Retorna `Promise<{ latitude, longitude }>`
- Usa `navigator.geolocation.getCurrentPosition`
- Timeout de 10 segundos
- Erros tratados: PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT

#### `buscarCidadePorCoordenadas(lat, lng)`
- Retorna `Promise<{ cidade, estado, siglaEstado }>`
- Usa API Nominatim do OpenStreetMap
- Busca reversa de coordenadas
- Converte nome do estado para sigla

#### `obterCidadeAutomatica()`
- Combina as duas funções acima
- Retorna cidade/estado do usuário automaticamente

## 🎯 Casos de Uso

### Caso 1: Usuário Permite GPS
1. Entra no site
2. Navegador pede permissão de localização
3. Usuário aceita
4. Sistema detecta: "Curitiba - PR"
5. Usuário busca "pizza"
6. Animação: "Buscando produtos e serviços relacionados em Curitiba"
7. Exibe resultados de pizzarias em Curitiba

### Caso 2: Usuário Nega GPS
1. Entra no site
2. Navegador pede permissão
3. Usuário nega
4. Sistema exibe: "Ops... tivemos um erro ao ver sua localização"
5. Mostra selects de estado e cidade
6. Usuário seleciona manualmente
7. Continua fluxo normal

### Caso 3: Sem Resultados
1. Usuário busca "iPhone 15" em "Pequena Cidade - Interior"
2. Animação de busca
3. Sistema não encontra nada
4. Exibe: "Vixi, não temos nenhum produto relacionado nessa região"
5. Oferece buscar em outra cidade
6. Usuário troca para "São Paulo"
7. Nova busca automática

### Caso 4: Busca em Outras Cidades
1. Usuário está em Curitiba
2. Quer ver produtos de São Paulo
3. Clica em "busque por cidades"
4. Seleciona "São Paulo - SP"
5. Localização atualiza
6. Próximas buscas serão em SP

## 🚨 Tratamento de Erros

### Erro na API IBGE
- Fallback automático para `/cidades/cidades.json`
- Arquivo local com 5000+ cidades brasileiras
- Zero downtime

### Erro na Geolocalização
- Mensagem clara ao usuário
- Seletor manual imediato
- Não bloqueia o uso da plataforma

### Erro na Busca
- Mensagem de erro exibida
- Não limpa o formulário
- Usuário pode tentar novamente

## 📊 Banco de Dados

### Tabela `loja`
```sql
CREATE TABLE loja (
  id UUID PRIMARY KEY,
  nome_loja VARCHAR,
  slug VARCHAR UNIQUE,
  cidade VARCHAR NOT NULL,  -- Ex: "Curitiba"
  estado VARCHAR(2) NOT NULL, -- Ex: "PR"
  latitude FLOAT,
  longitude FLOAT,
  ativo BOOLEAN DEFAULT true,
  ...
);

CREATE INDEX idx_loja_cidade_estado ON loja(cidade, estado);
```

### Filtro de Busca
```typescript
where: {
  disponivel: true,
  bloqueado: false,
  loja: {
    cidade: { contains: "Curitiba", mode: 'insensitive' },
    estado: "PR"
  },
  OR: [
    { nome_produto: { contains: "pizza", mode: 'insensitive' } },
    { descricao: { contains: "pizza", mode: 'insensitive' } },
    { tags: { contains: "pizza", mode: 'insensitive' } }
  ]
}
```

## 🎨 Design System

### Cores
- **Primária**: `#7c3aed` (purple-600)
- **Secundária**: `#6d28d9` (purple-700)
- **Fundo**: `#ffffff` (white)
- **Hover**: `#5b21b6` (purple-800)

### Animações
- **Spinner**: `animate-spin` (busca ativa)
- **Pulse**: `animate-pulse` (detectando GPS)
- **Fade**: Transições suaves entre estados

### Tipografia
- **Título**: 5xl-7xl, font-black, gradient roxo
- **Subtítulo**: lg, font-medium, roxo
- **Corpo**: sm-base, text-gray-600

## 📱 Responsividade

- **Mobile**: Sem sidebars de anúncio, layout vertical
- **Tablet**: Sidebars aparecem em `lg:` (1024px+)
- **Desktop**: Layout completo com anúncios laterais

## 🔐 Segurança

- Validação de entrada no backend
- Sanitização de queries SQL via Prisma
- CORS configurado para domínio específico
- Rate limiting (a implementar)

## 🚀 Como Testar

1. **Teste GPS Permitido:**
   ```bash
   npm run dev
   # Acesse http://localhost:3000
   # Aceite permissão de localização
   # Busque por algo
   ```

2. **Teste GPS Negado:**
   ```bash
   # Acesse http://localhost:3000
   # Negue permissão de localização
   # Selecione estado e cidade manualmente
   ```

3. **Teste Busca sem Resultados:**
   ```bash
   # Selecione uma cidade pequena
   # Busque por algo raro ("iPhone 15 Pro Max")
   # Veja tela de sem resultados
   ```

## 📈 Melhorias Futuras

- [ ] Cache de cidades no localStorage
- [ ] Histórico de buscas recentes
- [ ] Sugestões de busca (autocomplete)
- [ ] Filtros avançados (preço, distância, avaliação)
- [ ] Mapa com marcadores dos resultados
- [ ] Compartilhar busca via WhatsApp
- [ ] Salvar lojas favoritas
- [ ] Notificações de novos produtos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme permissões de localização
3. Teste com diferentes cidades
4. Limpe cache e cookies se necessário

---

**Versão:** 1.0.0  
**Última atualização:** 2025-10-20  
**Desenvolvido com:** ❤️ + ☕ + 💜 (muito roxo!)
