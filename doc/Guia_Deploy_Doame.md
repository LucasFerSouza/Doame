# 🚀 Guia de Deploy — Projeto Doame

> Documento consolidado das instruções de implantação do Módulo de Comunicação (Evolution API) e deploy na Vercel.
> Última atualização: 11/05/2026

---

## Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Módulo de Comunicação — Evolution API](#2-módulo-de-comunicação--evolution-api)
   - [Fase 1 — Infraestrutura Docker](#fase-1--infraestrutura-docker)
   - [Fase 2 — Pareamento do Celular Oficial](#fase-2--pareamento-do-celular-oficial)
   - [Fase 3 — WhatsappModule no NestJS](#fase-3--whatsappmodule-no-nestjs)
   - [Fase 4 — Integração com os Fluxos de Negócio](#fase-4--integração-com-os-fluxos-de-negócio)
   - [Fase 5 — Frontend e UX](#fase-5--frontend-e-ux)
3. [Deploy na Vercel](#3-deploy-na-vercel)
   - [Entendendo a Arquitetura de Deploy](#entendendo-a-arquitetura-de-deploy)
   - [Etapa 1 — Banco de Dados](#etapa-1--banco-de-dados)
   - [Etapa 2 — Preparar o NestJS para a Vercel](#etapa-2--preparar-o-nestjs-para-a-vercel)
   - [Etapa 3 — Configurar o turbo.json](#etapa-3--configurar-o-turbojson)
   - [Etapa 4 — Deploy da API](#etapa-4--deploy-da-api-nestjs)
   - [Etapa 5 — Deploy do Front-end](#etapa-5--deploy-do-front-end-nextjs)
   - [Etapa 6 — CI/CD Contínuo](#etapa-6--fluxo-de-deploy-contínuo-cicd)
   - [Etapa 7 — Evolution API com ngrok](#etapa-7--evolution-api-em-desenvolvimento-ngrok)
4. [Ordem de Execução Recomendada](#4-ordem-de-execução-recomendada)
5. [Referência de Variáveis de Ambiente](#5-referência-de-variáveis-de-ambiente)

---

## 1. Visão Geral da Arquitetura

### Arquitetura completa em produção

```
┌─────────────────────────────────────────────────────────┐
│                        VERCEL                           │
│                                                         │
│   apps/web  (Next.js)  ←── NEXT_PUBLIC_API_URL          │
│   apps/api  (NestJS)   ←── DATABASE_URL + JWT_SECRET    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP calls
                           ▼
┌─────────────────────────────────────────────────────────┐
│               VPS / SERVIDOR EXTERNO                    │
│                                                         │
│   Evolution API  (Docker)                               │
│   Redis          (Docker)                               │
│   PostgreSQL     (Docker)  ← banco junto ao servidor    │
│                                                         │
│   Exposto via ngrok (dev) ou IP fixo (produção)         │
└─────────────────────────────────────────────────────────┘
```

### Por que essa divisão?

A Vercel é uma plataforma **serverless** — não mantém processos rodando continuamente. A Evolution API exige uma **conexão WebSocket permanente** com o WhatsApp. As duas coisas são incompatíveis, por isso a Evolution API precisa rodar em um servidor externo (VPS ou localmente com ngrok).

O banco PostgreSQL pode ficar junto no VPS (junto com a Evolution API e o Redis), o que é totalmente válido e até mais coerente com o `docker-compose.yaml` já planejado. A única desvantagem em relação a um banco gerenciado como o Supabase é que você mesmo fica responsável por backups e disponibilidade.

### Resumo de responsabilidades por serviço

| Serviço | Onde roda | Custo estimado |
|---|---|---|
| Next.js (front-end) | Vercel | Gratuito |
| NestJS (API) | Vercel | Gratuito |
| PostgreSQL | VPS (Docker) ou Supabase | VPS: custo do servidor / Supabase: gratuito até 500 MB |
| Evolution API + Redis | VPS (Docker) + ngrok | Gratuito em dev / VPS pago em produção |

---

## 2. Módulo de Comunicação — Evolution API

### Fase 1 — Infraestrutura Docker

Este é o alicerce. Nada das fases seguintes funciona sem ele.

#### 1.1 — Serviços do `docker-compose.yaml`

Criar o arquivo na raiz do monorepo (`doame/`) com 5 serviços:

| Serviço | Imagem | Função |
|---|---|---|
| `postgres` | `postgres:16-alpine` | Banco de dados da aplicação |
| `redis` | `redis:7-alpine` | Cache obrigatório para a Evolution API |
| `evolution` | `atendai/evolution-api:latest` | Instância WhatsApp |
| `api` | Build local (`doame/apps/api`) | Backend NestJS |
| `web` | Build local (`doame/apps/web`) | Front-end Next.js |

#### 1.2 — Dockerfiles de cada app

Criar dois arquivos novos:

- `doame/apps/api/Dockerfile` — build multi-stage do NestJS (instala deps → compila TypeScript → roda `dist/main.js`)
- `doame/apps/web/Dockerfile` — build multi-stage do Next.js (`next build` → `next start`)

> ⚠️ Como é um monorepo com Turborepo + pnpm, o build precisa copiar o `pnpm-workspace.yaml` e o `packages/shared` antes de instalar as dependências de cada app.

#### 1.3 — Arquivo `.env` na raiz

```env
POSTGRES_USER=doame
POSTGRES_PASSWORD=suasenha
POSTGRES_DB=doamedb

EVOLUTION_API_KEY=sua_chave_secreta

DATABASE_URL=postgresql://doame:suasenha@postgres:5432/doamedb
JWT_SECRET=sua_chave_jwt

NEXT_PUBLIC_API_URL=http://api:3001
```

#### 1.4 — Validar que tudo sobe

```bash
docker compose up --build
```

Após subir, verificar:

| URL | O que confirma |
|---|---|
| `http://localhost:8080` | Dashboard da Evolution API está viva |
| `http://localhost:3001/api` | Swagger do NestJS responde |
| `http://localhost:3000` | Front-end Next.js carrega |

> ⚠️ **Atenção Prisma:** dentro do container da API, rodar `prisma migrate deploy` (não `migrate dev`). Pode ser feito como entrypoint no Dockerfile ou manualmente após `docker compose up`.

---

### Fase 2 — Pareamento do Celular Oficial

#### 2.1 — Criar a instância `DOAME_ADMIN`

Com os containers rodando, fazer uma requisição `POST` para a Evolution API:

```
POST http://localhost:8080/instance/create
Headers: apikey: {EVOLUTION_API_KEY}
Body: { "instanceName": "DOAME_ADMIN", "qrcode": true }
```

Pode ser feito via Insomnia, Postman ou pelo Swagger da Evolution API.

#### 2.2 — Ler o QR Code

A resposta retorna um QR Code em base64. Abrir o WhatsApp no celular da ASA → **Aparelhos conectados** → **Conectar aparelho** → escanear.

#### 2.3 — Health check de conexão

```
GET http://localhost:8080/instance/connectionState/DOAME_ADMIN
Headers: apikey: {EVOLUTION_API_KEY}
```

A resposta deve ter `"state": "open"`. Se não estiver `open`, o celular não está pareado corretamente.

---

### Fase 3 — WhatsappModule no NestJS

#### 3.1 — Estrutura de pastas a criar

```
src/whatsapp/
  whatsapp.module.ts
  whatsapp.service.ts
  whatsapp.controller.ts
  message-formatter.ts
```

#### 3.2 — `WhatsappService`

Usar o `HttpService` do NestJS (Axios por baixo) para chamar a Evolution API. Dois métodos principais:

- `sendText(to: string, message: string)` — envia texto puro para um número
- `sendTemplate(to: string, type: 'DOACAO_CONFIRMADA' | 'BOAS_VINDAS' | 'COLETA_ATRIBUIDA')` — chama `MessageFormatter` para montar a mensagem e delega ao `sendText`

> O número `to` deve estar no formato E.164: `5511999999999` (sem `+`, sem espaço).

#### 3.3 — `MessageFormatter`

Classe (ou conjunto de funções puras) que recebe os dados do domínio e retorna a string formatada com emojis e quebras de linha. Fica isolada para nunca sujar o `WhatsappService` com lógica de texto.

#### 3.4 — Tratamento de erros

A Evolution API retorna erro quando o celular está offline ou o número não existe no WhatsApp. O `WhatsappService` deve capturar esses erros e **logar sem derrubar o fluxo principal** — uma doação não pode falhar porque o WhatsApp estava fora do ar.

---

### Fase 4 — Integração com os Fluxos de Negócio

Injetar o `WhatsappService` nos módulos existentes:

| Evento | Onde injetar | O que enviar |
|---|---|---|
| Nova doação criada | `DoacoesService.create()` | Confirmação + protocolo ao doador; alerta ao celular da administração |
| Voluntário atribuído | `DoacoesService.atribuir()` | Endereço, data, horário e itens ao voluntário |
| Palavra-passe bíblica | `DoacoesService.atribuir()` | Enviada separadamente ao voluntário e ao doador no mesmo evento |

> A palavra-passe bíblica já tem schema (`PalavraChave`) e o campo `palavra_chave_id` em `Doacao`. O sorteio e a associação acontecem na atribuição.

---

### Fase 5 — Frontend e UX

#### 5.1 — Checkbox de consentimento

No `StepContato.tsx` (passo 6 do formulário), adicionar:

> "Desejo receber atualizações sobre minha doação via WhatsApp"

O campo `whatsapp` já existe separado de `telefone` no modelo de dados (decisão da Sessão 2). O checkbox controla se o número de WhatsApp será usado.

#### 5.2 — Toast de feedback (opcional)

Após o `POST /api/doacoes` retornar sucesso, exibir um toast do Shadcn/ui:

> "✅ Um comprovante foi enviado para seu WhatsApp"

---

## 3. Deploy na Vercel

### Entendendo a Arquitetura de Deploy

A Vercel é **serverless** — não mantém processos contínuos. Por isso:

- **Next.js e NestJS** → vão para a Vercel (sem estado persistente, funcionam bem serverless)
- **Evolution API + Redis + PostgreSQL** → ficam no servidor externo (precisam de processo contínuo)

### Pré-requisitos

- Conta no [vercel.com](https://vercel.com) (gratuita)
- Repositório do projeto no GitHub
- Vercel CLI instalada: `npm i -g vercel`
- VPS ou servidor externo com Docker para o PostgreSQL (ou conta no [Supabase](https://supabase.com) como alternativa gerenciada)

---

### Etapa 1 — Banco de Dados

#### Opção A — PostgreSQL no VPS (recomendada se já tem servidor)

O banco já estará rodando junto com a Evolution API pelo `docker-compose.yaml`. O único ajuste necessário é garantir que o PostgreSQL esteja acessível externamente pela Vercel:

- Porta `5432` liberada no firewall do VPS
- `DATABASE_URL` na Vercel apontando para o IP do servidor:

```
postgresql://doame:suasenha@SEU_IP_DO_VPS:5432/doamedb
```

#### Opção B — Supabase (alternativa gerenciada e gratuita)

Caso não tenha VPS ainda, o Supabase oferece PostgreSQL gerenciado com 500 MB gratuitos.

1. Acesse [supabase.com](https://supabase.com), crie uma conta e clique em **New Project**
2. Vá em **Project Settings → Database → Connection string → URI** e copie a string
3. Rode as migrations apontando para o Supabase:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy \
  --schema=apps/api/prisma/schema.prisma
```

4. Rode o seed se necessário:

```bash
DATABASE_URL="postgresql://..." npx prisma db seed \
  --schema=apps/api/prisma/schema.prisma
```

> Use `migrate deploy` (não `migrate dev`) — aplica as migrations existentes sem gerar novas.

---

### Etapa 2 — Preparar o NestJS para a Vercel

#### 2.1 — Criar `apps/api/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

#### 2.2 — Ajustar o CORS no `main.ts`

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
});
```

---

### Etapa 3 — Configurar o `turbo.json`

No `turbo.json` da raiz, declarar as variáveis de ambiente na pipeline de build:

```json
{
  "pipeline": {
    "build": {
      "env": [
        "NEXT_PUBLIC_API_URL",
        "DATABASE_URL",
        "JWT_SECRET",
        "EVOLUTION_API_URL",
        "EVOLUTION_API_KEY"
      ],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

> Isso garante que o Turborepo use caches diferentes por ambiente, evitando que o build de staging vaze para produção.

---

### Etapa 4 — Deploy da API (NestJS)

Criar dois projetos separados na Vercel: um para a API e um para o front, com domínios e variáveis de ambiente independentes.

```bash
cd apps/api
vercel
```

Configurar quando o CLI perguntar:

| Pergunta | Resposta |
|---|---|
| Project name | `doame-api` |
| Build command | `cd ../.. && turbo build --filter=api` |
| Output directory | `dist` |
| Install command | `pnpm install` |

Após o link, adicionar as variáveis de ambiente no dashboard da Vercel (**Project → Settings → Environment Variables**):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | String do banco (VPS ou Supabase) |
| `JWT_SECRET` | Sua chave secreta |
| `EVOLUTION_API_URL` | URL do ngrok ou IP do VPS |
| `EVOLUTION_API_KEY` | Sua chave da Evolution API |
| `FRONTEND_URL` | URL do front (preencher após o próximo passo) |

Fazer o deploy de produção:

```bash
vercel --prod
```

Anotar a URL gerada (ex: `https://doame-api.vercel.app`).

---

### Etapa 5 — Deploy do Front-end (Next.js)

```bash
cd ../../apps/web
vercel
```

Configurar quando o CLI perguntar:

| Pergunta | Resposta |
|---|---|
| Project name | `doame-web` |
| Build command | `cd ../.. && turbo build --filter=web` |
| Output directory | `.next` |
| Install command | `pnpm install` |

Variável de ambiente no dashboard da Vercel:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL da API gerada no passo anterior |

Fazer o deploy de produção:

```bash
vercel --prod
```

Com a URL do front em mãos (ex: `https://doame.vercel.app`), voltar ao projeto da API no dashboard e atualizar a variável `FRONTEND_URL`. Fazer um novo deploy da API para pegar a variável:

```bash
cd ../api
vercel --prod
```

---

### Etapa 6 — Fluxo de Deploy Contínuo (CI/CD)

Após o setup inicial, qualquer push para `main` dispara deploy automático nos dois projetos:

```bash
git add .
git commit -m "feat: nova feature"
git push origin main
# Vercel detecta e faz deploy automático
```

O filtro `--filter` do Turborepo garante que apenas o projeto afetado seja rebuildo, economizando tempo de build.

---

### Etapa 7 — Evolution API em Desenvolvimento (ngrok)

Enquanto não houver um VPS, o celular da ASA fica pareado localmente e exposto via ngrok:

```bash
# Terminal 1 — sobe a Evolution API e o Redis
docker compose up evolution redis postgres

# Terminal 2 — expõe a porta da Evolution API
ngrok http 8080
```

O ngrok vai gerar uma URL tipo `https://abc123.ngrok-free.app`. Atualizar a variável `EVOLUTION_API_URL` na Vercel com essa URL e fazer redeploy da API.

> ⚠️ O ngrok gratuito gera uma URL nova a cada reinicialização. Quando isso acontecer, atualizar a variável na Vercel. O plano pago do ngrok (~$8/mês) oferece URL fixa — vale a pena quando o projeto entrar em uso real pela ASA.

---

## 4. Ordem de Execução Recomendada

### Módulo de Comunicação

```
Fase 1 (Docker) → testar com docker compose up
       ↓
Fase 2 (QR Code) → parear o celular da ASA
       ↓
Fase 3 (WhatsappModule) → testar sendText via endpoint do WhatsappController
       ↓
Fechar pendências de integração:
  - DELETE /api/voluntarios/:id
  - POST /api/doacoes/:id/atribuir
  - PATCH /api/doacoes/:id/status
       ↓
Fase 4 (fluxos de negócio) → integrar nos services existentes
       ↓
Fase 5 (frontend) → checkbox + toast
```

### Deploy na Vercel

```
1. Configurar banco (VPS ou Supabase) → obter DATABASE_URL
2. Rodar prisma migrate deploy apontando para o banco de produção
3. Criar vercel.json na API e ajustar CORS no main.ts
4. Atualizar turbo.json com as variáveis de ambiente
5. Deploy da API → anotar URL gerada
6. Deploy do front → anotar URL gerada
7. Cruzar as URLs nas variáveis de ambiente dos dois projetos
8. Subir Evolution API + ngrok localmente
9. Atualizar EVOLUTION_API_URL na Vercel com a URL do ngrok
```

---

## 5. Referência de Variáveis de Ambiente

### `.env` local (desenvolvimento com Docker)

```env
# Banco de dados
POSTGRES_USER=doame
POSTGRES_PASSWORD=suasenha
POSTGRES_DB=doamedb
DATABASE_URL=postgresql://doame:suasenha@postgres:5432/doamedb

# Autenticação
JWT_SECRET=sua_chave_jwt_secreta

# Evolution API
EVOLUTION_API_KEY=sua_chave_evolution
EVOLUTION_API_URL=http://evolution:8080

# Front-end
NEXT_PUBLIC_API_URL=http://api:3001
FRONTEND_URL=http://localhost:3000
```

### Vercel — Projeto `doame-api`

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL (VPS ou Supabase) |
| `JWT_SECRET` | Chave secreta para geração de tokens JWT |
| `EVOLUTION_API_URL` | URL pública da Evolution API (ngrok ou IP do VPS) |
| `EVOLUTION_API_KEY` | Chave de acesso à Evolution API |
| `FRONTEND_URL` | URL pública do front-end na Vercel (para CORS) |

### Vercel — Projeto `doame-web`

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL pública da API na Vercel |

---

*Documento gerado em 11/05/2026 — baseado nas Sessões 8 e 9 do Diário de Bordo*
