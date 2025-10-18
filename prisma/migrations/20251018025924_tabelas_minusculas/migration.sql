-- CreateTable
CREATE TABLE "loja" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "senha" TEXT NOT NULL,
    "nome_loja" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "endereco" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "telefone_loja" TEXT,
    "whatsapp" TEXT,
    "horario_funcionamento" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "plano" TEXT NOT NULL DEFAULT 'gratuito',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "bairro" TEXT,

    CONSTRAINT "loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "pai_id" TEXT,
    "loja_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'produto',
    "nome_produto" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "preco_promocional" DOUBLE PRECISION,
    "tags" TEXT NOT NULL,
    "categoria_id" TEXT,
    "estoque_quantidade" INTEGER,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "duracao_estimada" TEXT,
    "area_atendimento" TEXT,
    "aceita_urgencia" BOOLEAN NOT NULL DEFAULT false,
    "importado_nfe" BOOLEAN NOT NULL DEFAULT false,
    "nfe_chave" TEXT,
    "loja_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagem_produto" (
    "id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "tamanho_kb" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagem_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalizacao" (
    "id" TEXT NOT NULL,
    "loja_id" TEXT NOT NULL,
    "logo_url" TEXT,
    "cor_primaria" TEXT NOT NULL DEFAULT '#667eea',
    "cor_secundaria" TEXT NOT NULL DEFAULT '#764ba2',
    "cor_fundo" TEXT NOT NULL DEFAULT '#ffffff',
    "cor_header" TEXT NOT NULL DEFAULT '#333333',
    "cor_texto" TEXT NOT NULL DEFAULT '#333333',
    "fonte_titulo" TEXT NOT NULL DEFAULT 'system-ui',
    "fonte_corpo" TEXT NOT NULL DEFAULT 'system-ui',
    "layout_grade" TEXT NOT NULL DEFAULT 'grid',
    "produtos_por_linha" INTEGER NOT NULL DEFAULT 3,
    "animacoes_ativadas" BOOLEAN NOT NULL DEFAULT true,
    "efeito_hover" TEXT NOT NULL DEFAULT 'zoom',
    "meta_titulo" TEXT,
    "meta_descricao" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "loja_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "produto_id" TEXT,
    "termo_busca" TEXT,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "visualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessao" (
    "id" TEXT NOT NULL,
    "loja_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nota_fiscal" (
    "id" TEXT NOT NULL,
    "loja_id" TEXT NOT NULL,
    "chave_acesso" TEXT NOT NULL,
    "numero_nfe" TEXT NOT NULL,
    "serie" TEXT,
    "fornecedor_nome" TEXT NOT NULL,
    "fornecedor_cnpj" TEXT,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "quantidade_itens" INTEGER NOT NULL,
    "processada" BOOLEAN NOT NULL DEFAULT false,
    "produtos_importados" INTEGER NOT NULL DEFAULT 0,
    "xml_path" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nota_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loja_email_key" ON "loja"("email");

-- CreateIndex
CREATE UNIQUE INDEX "loja_slug_key" ON "loja"("slug");

-- CreateIndex
CREATE INDEX "loja_slug_idx" ON "loja"("slug");

-- CreateIndex
CREATE INDEX "loja_cidade_estado_idx" ON "loja"("cidade", "estado");

-- CreateIndex
CREATE INDEX "categoria_loja_id_pai_id_idx" ON "categoria"("loja_id", "pai_id");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_loja_id_slug_nivel_key" ON "categoria"("loja_id", "slug", "nivel");

-- CreateIndex
CREATE INDEX "produto_loja_id_tipo_disponivel_bloqueado_idx" ON "produto"("loja_id", "tipo", "disponivel", "bloqueado");

-- CreateIndex
CREATE INDEX "produto_categoria_id_idx" ON "produto"("categoria_id");

-- CreateIndex
CREATE INDEX "produto_tipo_idx" ON "produto"("tipo");

-- CreateIndex
CREATE INDEX "imagem_produto_produto_id_ordem_idx" ON "imagem_produto"("produto_id", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "personalizacao_loja_id_key" ON "personalizacao"("loja_id");

-- CreateIndex
CREATE INDEX "analytics_loja_id_tipo_visualizado_em_idx" ON "analytics"("loja_id", "tipo", "visualizado_em");

-- CreateIndex
CREATE INDEX "analytics_loja_id_produto_id_idx" ON "analytics"("loja_id", "produto_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessao_token_key" ON "sessao"("token");

-- CreateIndex
CREATE INDEX "sessao_token_idx" ON "sessao"("token");

-- CreateIndex
CREATE INDEX "sessao_loja_id_idx" ON "sessao"("loja_id");

-- CreateIndex
CREATE UNIQUE INDEX "nota_fiscal_chave_acesso_key" ON "nota_fiscal"("chave_acesso");

-- CreateIndex
CREATE INDEX "nota_fiscal_loja_id_processada_idx" ON "nota_fiscal"("loja_id", "processada");

-- CreateIndex
CREATE INDEX "nota_fiscal_chave_acesso_idx" ON "nota_fiscal"("chave_acesso");

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_pai_id_fkey" FOREIGN KEY ("pai_id") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_produto" ADD CONSTRAINT "imagem_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalizacao" ADD CONSTRAINT "personalizacao_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "loja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
