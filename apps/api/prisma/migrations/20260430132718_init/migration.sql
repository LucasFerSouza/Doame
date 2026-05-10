-- CreateEnum
CREATE TYPE "PapelAdmin" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "CategoriaDoacao" AS ENUM ('ALIMENTO', 'AGASALHO', 'FINANCEIRA');

-- CreateEnum
CREATE TYPE "StatusDoacao" AS ENUM ('PENDENTE', 'AGUARDANDO', 'CONFIRMADO', 'NEGADO', 'ATRIBUIDO', 'COLETADO', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "StatusAtribuicao" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('PIX', 'DINHEIRO');

-- CreateTable
CREATE TABLE "igrejas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "raioMetropolitanoKm" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "igrejas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "PapelAdmin" NOT NULL DEFAULT 'ADMIN',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "igrejaId" TEXT NOT NULL,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voluntarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "endereco" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "igrejaId" TEXT NOT NULL,

    CONSTRAINT "voluntarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doacoes" (
    "id" TEXT NOT NULL,
    "nomeDoador" TEXT NOT NULL,
    "telefoneDoador" TEXT NOT NULL,
    "whatsappDoador" TEXT,
    "enderecoDoador" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "dataColeta" TIMESTAMP(3) NOT NULL,
    "horarioColeta" TEXT NOT NULL,
    "status" "StatusDoacao" NOT NULL DEFAULT 'PENDENTE',
    "anonimizacaoEm" TIMESTAMP(3),
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "igrejaId" TEXT NOT NULL,
    "palavraChaveId" TEXT,

    CONSTRAINT "doacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_doacao" (
    "id" TEXT NOT NULL,
    "categoria" "CategoriaDoacao" NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "doacaoId" TEXT NOT NULL,

    CONSTRAINT "itens_doacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doacoes_financeiras" (
    "id" TEXT NOT NULL,
    "tipo" "TipoPagamento" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "doacaoId" TEXT NOT NULL,

    CONSTRAINT "doacoes_financeiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atribuicoes_voluntario_doacao" (
    "id" TEXT NOT NULL,
    "status" "StatusAtribuicao" NOT NULL DEFAULT 'PENDENTE',
    "raioVarreduraKm" DOUBLE PRECISION NOT NULL,
    "distanciaMetros" DOUBLE PRECISION,
    "atribuidaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondidaEm" TIMESTAMP(3),
    "doacaoId" TEXT NOT NULL,
    "voluntarioId" TEXT NOT NULL,

    CONSTRAINT "atribuicoes_voluntario_doacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palavras_chave" (
    "id" TEXT NOT NULL,
    "termo" TEXT NOT NULL,
    "referenciaBiblica" TEXT NOT NULL,
    "significado" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "emUso" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "palavras_chave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regioes_geograficas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "igrejaId" TEXT NOT NULL,

    CONSTRAINT "regioes_geograficas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "administradores_email_key" ON "administradores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "voluntarios_email_key" ON "voluntarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doacoes_financeiras_doacaoId_key" ON "doacoes_financeiras"("doacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "palavras_chave_termo_key" ON "palavras_chave"("termo");

-- AddForeignKey
ALTER TABLE "administradores" ADD CONSTRAINT "administradores_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "igrejas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voluntarios" ADD CONSTRAINT "voluntarios_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "igrejas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacoes" ADD CONSTRAINT "doacoes_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "igrejas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacoes" ADD CONSTRAINT "doacoes_palavraChaveId_fkey" FOREIGN KEY ("palavraChaveId") REFERENCES "palavras_chave"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_doacao" ADD CONSTRAINT "itens_doacao_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "doacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacoes_financeiras" ADD CONSTRAINT "doacoes_financeiras_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "doacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicoes_voluntario_doacao" ADD CONSTRAINT "atribuicoes_voluntario_doacao_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "doacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicoes_voluntario_doacao" ADD CONSTRAINT "atribuicoes_voluntario_doacao_voluntarioId_fkey" FOREIGN KEY ("voluntarioId") REFERENCES "voluntarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regioes_geograficas" ADD CONSTRAINT "regioes_geograficas_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "igrejas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
