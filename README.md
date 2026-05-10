# Doame — Monorepo

Sistema de gestão de doações para igrejas adventistas. Estruturado como monorepo com **Turborepo** + **pnpm workspaces**.

---

## Estrutura

```
doame/
├── apps/
│   ├── web/          → Next.js 16 (frontend)
│   └── api/          → NestJS 10 + Prisma (backend)
├── packages/
│   └── shared/       → Enums e tipos compartilhados
├── turbo.json        → Configuração do Turborepo
├── pnpm-workspace.yaml
└── package.json      → Scripts raiz
```

---

## Pré-requisitos

- **Node.js** >= 20
- **pnpm** >= 9 → `npm install -g pnpm`
- **PostgreSQL** em execução local

---

## Configuração inicial

```bash
# 1. Instalar todas as dependências (hoisted na raiz)
pnpm install

# 2. Configurar variáveis de ambiente da API
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env com sua DATABASE_URL e JWT_SECRET

# 3. Configurar variáveis de ambiente do frontend
cp apps/web/.env.example apps/web/.env.local

# 4. Rodar migrations do banco
pnpm db:migrate

# 5. Popular banco com dados de desenvolvimento
pnpm db:seed
```

---

## Desenvolvimento

```bash
# Iniciar web e api em paralelo
pnpm dev
```

- Frontend: http://localhost:3000
- API:      http://localhost:3001/api

---

## Build

```bash
pnpm build
```

Turborepo compila os pacotes na ordem correta com cache inteligente.

---

## Scripts disponíveis

| Comando           | Descrição                                  |
|-------------------|--------------------------------------------|
| `pnpm dev`        | Inicia web + api em modo desenvolvimento   |
| `pnpm build`      | Build de produção de todos os apps         |
| `pnpm lint`       | Lint de todos os apps                      |
| `pnpm db:migrate` | Roda migrations Prisma                     |
| `pnpm db:generate`| Regenera Prisma Client                     |
| `pnpm db:seed`    | Popula banco com dados de desenvolvimento  |
| `pnpm db:studio`  | Abre Prisma Studio                         |

---

## Packages

### `@doame/shared`

Enums e tipos TypeScript compartilhados entre `web` e `api`, eliminando duplicação:

- `StatusDoacao`, `CategoriaDoacao`, `TipoPagamento`, etc.
- Importação: `import { StatusDoacao } from '@doame/shared'`

---

## Credenciais de desenvolvimento (seed)

| Papel        | Email              | Senha       |
|--------------|--------------------|-------------|
| Admin        | admin@doame.com    | doame2025   |
| Voluntário   | carlos.mendonca@.. | voluntario123 |
