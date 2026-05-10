# Arquitetura do Sistema Doame

> **Versão:** 2.0 — Atualizado em 10/05/2026

---

## 1. Visão Geral da Arquitetura

A arquitetura do Doame foi concebida para atender a três princípios centrais:

1. **Simplicidade operacional no MVP**, evitando complexidade desnecessária
2. **Escalabilidade horizontal**, preparada para crescimento em número de cidades, igrejas e doações
3. **Separação clara de responsabilidades**, alinhada às boas práticas da Engenharia de Software

O Doame adota uma **arquitetura monolítica modular** organizada em monorepo, com forte orientação a serviços, podendo evoluir naturalmente para uma arquitetura mais distribuída conforme a maturidade do produto.

---

## 2. Estrutura do Monorepo

O projeto utiliza **Turborepo + pnpm workspaces** com a seguinte organização:

```
doame/
  apps/
    web/          ← Next.js 15 (React 19) — Frontend
    api/          ← NestJS 10 + Prisma — Backend
  packages/
    shared/       ← Tipos e enums TypeScript compartilhados
  package.json    ← Scripts raiz (pnpm dev, build, lint, db:*)
  turbo.json      ← Pipeline de build com cache
  pnpm-workspace.yaml
```

O pacote `@doame/shared` é a **fonte única de verdade** para tipos compartilhados entre frontend e backend (enums de status, categorias, papéis, wrappers de resposta).

---

## 3. Visão Macro (Diagrama de Blocos)

```
[ Navegador do Usuário ]
         |
         v
[ Frontend Web — Next.js :3000 ]
         |
         |── GET/POST /api/*
         v
[ API Doame — NestJS :3001 ]
         |
         |── Prisma ORM
         |       v
         |   [ PostgreSQL — doamedb ]
         |
         |── fetch (server-side)
         v
[ ViaCEP — viacep.com.br ]  ← consulta de CEP (passthrough)
```

Serviços futuros (pós-MVP):
- `[ WhatsApp / SMS ]` — notificações para voluntários
- `[ OpenStreetMap / Nominatim ]` — geocodificação de endereços
- `[ PostGIS ]` — cálculos de proximidade geográfica

---

## 4. Arquitetura do Frontend (`apps/web`)

### 4.1 Tecnologia

- **Next.js 15** com App Router (React 19)
- **TypeScript** com strict mode
- **Tailwind CSS 4** para estilização
- **shadcn/ui** para componentes de UI (primitivos acessíveis e consistentes)
- **Framer Motion** para animações de transição entre passos do formulário

### 4.2 Organização por Route Groups

A separação de áreas é feita via **Next.js Route Groups** (convenção de parênteses):

| Route Group | Caminho | Acesso | Descrição |
|-------------|---------|--------|-----------|
| `(main)` | `/donation` | Público | Formulário de doação multi-step |
| `(marketing)` | `/about` | Público | Página institucional da ASA |
| `(restricted)` | `/login`, `/admin` | Autenticado | Dashboard administrativo |

### 4.3 Estrutura de Componentes

- **Componentes globais:** `src/components/ui/` (shadcn/ui)
- **Componentes por rota:** `_components/` co-localizado em cada segmento (underscore = não vira rota)
- **Hooks reutilizáveis:** `src/hooks/` (ex: `useCep.ts`)

### 4.4 Camadas Internas

```
[ Apresentação (UI) ]
    ↕ props / callbacks
[ Estado (page.tsx orquestrador) ]
    ↕ fetch / hooks
[ Serviços (API calls + hooks) ]
    ↕ HTTP
[ API Doame ]
```

O `page.tsx` de cada rota complexa (formulário de doação, dashboard admin) centraliza **todo o estado** — componentes filhos são stateless e recebem apenas props + callbacks.

### 4.5 Autenticação no Frontend

- Login: `POST /api/auth/login` com `{ email, senha }` → armazena `access_token` em `localStorage` como `doame_admin_token`
- Flag de sessão: `doame_admin_logado` em `localStorage`
- Guarda de rotas: `useEffect` no `page.tsx` do admin que redireciona para `/login` se não houver flag

### 4.6 Hook `useCep`

Localizado em `doame/apps/web/src/hooks/useCep.ts`. Responsabilidades:
- Aplicar máscara `XXXXX-XXX` ao campo CEP
- Disparar `GET /api/cep/:cep` automaticamente ao completar 8 dígitos
- Gerenciar estados `carregando` e `erro`
- Chamar callback `onPreenchido(dados)` com `{ logradouro, bairro, municipio, estado, complemento }`

Utilizado em: `StepEndereco.tsx` (formulário de doação) e `NovoVoluntarioDialog.tsx` (cadastro de voluntário).

---

## 5. Arquitetura do Backend (`apps/api`)

### 5.1 Tecnologia

- **NestJS 10** com TypeScript
- **Prisma 5** como ORM
- **PostgreSQL** como banco de dados
- **JWT** via `@nestjs/jwt` + `@nestjs/passport` para autenticação
- **class-validator** + **class-transformer** para validação global de DTOs

### 5.2 Módulos de Domínio

Cada módulo segue o padrão `module / controller / service / dto`:

| Módulo | Endpoints principais | Proteção | Responsabilidade |
|--------|---------------------|----------|-----------------|
| `AuthModule` | `POST /api/auth/login` | Público | Valida credenciais, emite JWT |
| `DoacoesModule` | `GET/POST /api/doacoes`, `PATCH /:id/status`, `POST /:id/atribuir`, `GET /:id/voluntarios-sugeridos` | Misto¹ | CRUD de doações, lógica de atribuição, anonimização LGPD |
| `VoluntariosModule` | `GET/POST /api/voluntarios`, `PATCH/DELETE /:id` | Misto² | CRUD de voluntários (sem senha), confirmação por senhaAdmin |
| `AdministradoresModule` | `GET/POST /api/administradores` | JWT | CRUD de admins |
| `PalavrasChaveModule` | `GET /api/palavras-chave`, `GET /api/palavras-chave/disponivel` | JWT | Sorteio de termo bíblico disponível |
| `CepModule` | `GET /api/cep/:cep` | Público | Proxy para ViaCEP, centraliza CORS e permite cache futuro |
| `PrismaModule` | — | Global | Singleton do PrismaClient injetado em todos os módulos |

¹ `POST /api/doacoes` é público (doador não tem login); demais rotas exigem JWT.  
² `POST /api/voluntarios` exige JWT (admin); `PATCH/DELETE` exige JWT + `senhaAdmin` no body.

### 5.3 Validação Global

Configurada em `main.ts` via `ValidationPipe`:
- `whitelist: true` — campos não declarados no DTO são removidos
- `forbidNonWhitelisted: true` — retorna erro se campos desconhecidos forem enviados
- `transform: true` — converte tipos automaticamente (ex: string → number)

### 5.4 Segurança

- CORS: `origin: FRONTEND_URL || 'http://localhost:3000'` em `main.ts`
- Rotas protegidas: `@UseGuards(JwtAuthGuard)` por decorador individual
- Senhas: hash bcrypt com salt 10
- Editar/excluir voluntário: exige `senhaAdmin` no body, validado no backend via `AuthService.verificarSenha()`
- Soft delete: voluntários são desativados (`ativo: false`), nunca deletados — preserva histórico de atribuições

---

## 6. Banco de Dados

### 6.1 Estratégia

- PostgreSQL como fonte de verdade
- Schema gerenciado pelo Prisma com migrações versionadas
- Seed reproduzível via `pnpm db:seed` (idempotente com `upsert`)
- Nome do banco em desenvolvimento: `doamedb`

### 6.2 Características

- Integridade referencial com cascade delete em itens de doação
- Anonimização lógica (campos → null) ao invés de deleção física
- Campos geográficos opcionais preparados para PostGIS futuro
- Palavras-chave bíblicas com controle de disponibilidade (`emUso`) evitando duplicação

---

## 7. Serviços de Integração

### 7.1 ViaCEP (ativo no MVP)

- **Endpoint:** `https://viacep.com.br/ws/{cep}/json/`
- **Uso:** preenchimento automático de endereço nos formulários de doação e de cadastro de voluntário
- **Arquitetura:** o frontend chama `/api/cep/:cep` no backend, que repassa para a ViaCEP. Isso evita CORS no browser e centraliza tratamento de erros
- **Resposta normalizada:** `{ cep, logradouro, complemento, bairro, municipio, estado }`

### 7.2 WhatsApp / SMS (pós-MVP)

- Envio de notificação ao voluntário com a palavra-passe bíblica
- Envio de confirmação ao doador
- A lógica de disparo residirá exclusivamente no backend

### 7.3 OpenStreetMap + Nominatim (pós-MVP)

- Geocodificação de endereços (textual → lat/long) para cálculo de proximidade
- Visualização de mapa no painel split-view de atribuição

---

## 8. Máquina de Estados da Doação

O status da doação evolui conforme as ações do administrador:

```
PENDENTE ──────────────────────────────── NEGADO
    │                                       ↑
    │ (atribuir voluntário)                 │ (a qualquer momento)
    ▼                                       │
AGUARDANDO ────────────────────────────────┤
    │                                       │
    │ (voluntário confirma)                 │
    ▼                                       │
CONFIRMADO ────────────────────────────────┤
    │                                       │
    │ (voluntário a caminho)                │
    ▼                                       │
ATRIBUIDO ─────────────────────────────────┤
    │
    │ (coleta realizada)
    ▼
COLETADO
    │
    │ (entrega confirmada + anonimização LGPD)
    ▼
ENTREGUE
```

Transições controladas exclusivamente pelo endpoint `PATCH /api/doacoes/:id/status`.

---

## 9. Observabilidade e Confiabilidade

### 9.1 Erros de CEP

- CEP inválido (< 8 dígitos): retorna `400 Bad Request` com mensagem `"CEP deve ter 8 dígitos"`
- CEP não encontrado no ViaCEP: retorna `400 Bad Request` com `"CEP não encontrado"`
- Falha na ViaCEP: retorna `400 Bad Request` com `"Erro ao consultar o serviço de CEP"`

### 9.2 Tolerância a Falhas

- Falhas no serviço de CEP não bloqueiam o formulário — usuário pode preencher manualmente
- Falhas externas não interrompem o fluxo principal

---

## 10. Evolução da Arquitetura

A arquitetura atual permite as seguintes evoluções sem redesenho:

| Evolução | O que muda |
|----------|-----------|
| Mapa interativo no split-view | Substituir lista de voluntários por componente `react-leaflet` no painel direito |
| Geocodificação de endereços | Preencher `latitude/longitude` em Doacao e Voluntario via Nominatim |
| Cálculo de proximidade | Adicionar extensão PostGIS ao PostgreSQL; atualizar `voluntariosSugeridos` no service |
| Autenticação de voluntários | `senhaHash` já está no schema (nullable); criar `VoluntarioModule` de auth separado |
| Envio de mensagens | Adicionar `MessagingModule` com integração Twilio ou Evolution API |
| Múltiplas igrejas | Estrutura multi-tenant já suportada pelo `igrejaId` em todas as entidades |
| Separação em microserviços | CepModule, MessagingModule e DoacoesModule são naturalmente isoláveis |
