# Regras do Projeto Encontra Tudo

## Convenções de Código

### Geral
- NAO CRIE NOVOS ARQUIVOS PARA ALTERACOES, use o mesmo arquivo apenas refaça o código dele
- Use TypeScript para novos arquivos
- Sempre responda em PORTUGUÊS

### Banco de Dados
- BANCO: AS TABELAS TEM QUE SER EM MINUSCULO
- Use Prisma para acesso ao banco
- Nunca altere diretamente o schema sem criar migração

### Estrutura de Pastas
- Todo código Next.js fica em `/web/src`
- Código de servidor em `/web/src/server`
- API routes em `/web/src/app/api`
- Componentes UI em `/web/src/app`
- Utilities em `/web/src/utils`

### Uploads
- Imagens são salvas em `/uploads` (fora do /web)
- Sempre comprimir imagens para WebP
- Usar Sharp para processamento

### Autenticação
- Use JWT armazenado no localStorage (frontend)
- Token Bearer no header Authorization
- Middleware `requireLojaId()` para rotas protegidas

### Estilo
- Use Tailwind CSS para estilização
- Siga o design system definido em `tailwind.config.ts`
- Classes utilitárias, não CSS customizado

### API
- Rotas públicas: `/api/search`, `/api/lojas/[slug]`
- Rotas privadas: Requerem autenticação JWT
- Retorne sempre JSON estruturado
- Use status codes HTTP corretos