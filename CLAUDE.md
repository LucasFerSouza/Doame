# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Doame** is a donation management system (sistema de gestão de doações) for Seventh-day Adventist churches, built as a TypeScript monorepo with Turborepo + pnpm workspaces. All user-facing text and code identifiers are in **Brazilian Portuguese**.

## Commands

Run from the repo root unless noted.

```bash
# Development
pnpm install          # Install all dependencies (requires pnpm >= 9, Node >= 20)
pnpm dev              # Start frontend (port 3000) + API (port 3001) concurrently

# Build & lint
pnpm build            # Build all apps via Turborepo
pnpm lint             # Lint entire monorepo

# Database (runs against apps/api)
pnpm db:migrate       # Run Prisma migrations
pnpm db:generate      # Regenerate Prisma Client after schema changes
pnpm db:seed          # Seed DB with test data (admin + volunteer accounts)
pnpm db:studio        # Open Prisma Studio UI
```

Seed credentials: `admin@doame.com` / `doame2025`. Volunteer accounts are created by admins only — volunteers have no login.

## Architecture

### Monorepo Structure

```
apps/
  web/     → Next.js 15 (React 19) frontend
  api/     → NestJS 10 backend with Prisma
packages/
  shared/  → TypeScript enums and interfaces shared by both apps
```

### Shared Package (`packages/shared`)

Single source of truth for types used across the stack. Key exports:
- Status enums: `StatusDoacao`, `StatusAtribuicao`, `CategoriaDoacao`, `TipoPagamento`, `PapelAdmin`
- Response wrappers: `ApiResponse<T>`, `PaginatedResponse<T>`

**Always update the shared package when adding new statuses or categories** — both apps import from `@doame/shared`.

### Frontend (`apps/web`)

Next.js App Router with route groups:
- `(main)/donation/` — Multi-step donation wizard (StepNome → StepContato → StepEndereço → StepDataHora → StepItens → StepDinheiro → StepResumo)
- `(restricted)/admin/` — Admin dashboard (donation list, volunteer assignment, status management)
- `(restricted)/volunteer/` — Volunteer dashboard (view assignments, accept/refuse)
- `(restricted)/login/` — Authentication page
- `(marketing)/about/` — Public information page

UI components live in `src/components/ui/` (shadcn/ui primitives). Feature-specific components are co-located in `_components/` subfolders within each route segment. Reusable hooks live in `src/hooks/` (e.g., `useCep.ts`).

Path aliases (configured in `tsconfig.json`): `@/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/config/*`, `@/data/*`.

Environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_IGREJA_ID` (copy from `.env.example`). `NEXT_PUBLIC_IGREJA_ID` must match the church ID seeded in the database (`igreja-itapetininga-01`).

### Backend (`apps/api`)

NestJS with feature modules — each domain has its own `module/controller/service/dto` set:
- `AuthModule` — JWT login (`POST /api/auth/login`), Passport strategy, `JwtAuthGuard`
- `DoacoesModule` — Donation CRUD, volunteer suggestion by geolocation, assignment logic
- `VoluntariosModule` — Volunteer CRUD + approval workflow (no password — admin registers volunteers)
- `AdministradoresModule` — Admin CRUD (ADMIN / SUPERADMIN roles)
- `PalavrasChaveModule` — Biblical keywords linked to donations
- `CepModule` — Public proxy to ViaCEP (`GET /api/cep/:cep`), returns structured address; centralizes CORS handling
- `PrismaModule` — Singleton DB connection injected across modules

Global setup in `main.ts`: CORS (from `FRONTEND_URL` env), `ValidationPipe`, API prefix `/api`.

Environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `FRONTEND_URL` (copy from `.env.example`).

### Data Model (Prisma)

Core entities: `Igreja` (church with geographic radius) → `Doacao` (donation) + `ItemDoacao` / `DoacaoFinanceira` → `AtribuicaoVoluntarioDoacao` (volunteer assignment join table with distance and response status) → `Voluntario`.

Key schema decisions:
- `Voluntario.senhaHash` is **nullable** — volunteers are registered by admins and do not log in to the system
- `Doacao.latitude` and `Doacao.longitude` are **nullable** — the donation form does not capture geolocation; reserved for future map integration
- Address data is stored as a formatted string: `"Logradouro, N — Bairro, Cidade/UF"` in both `enderecoDoador` and `Voluntario.endereco`

**CEP lookup**: `GET /api/cep/:cep` proxies ViaCEP and returns `{ logradouro, bairro, municipio, estado, complemento }`. The hook `useCep` (in `apps/web/src/hooks/useCep.ts`) triggers the lookup automatically when the CEP field reaches 8 digits and fills the address fields.

**Geographic matching**: Volunteer suggestions (`GET /api/doacoes/:id/voluntarios-sugeridos`) currently use text-based scoring (same bairro = 2pts, same município = 1pt). PostGIS-based matching is planned for post-MVP.

**LGPD compliance**: Donor personal info is anonymized when a donation reaches status `ENTREGUE`.

After any schema change run `pnpm db:generate` to regenerate the Prisma Client, then `pnpm db:migrate` (or `pnpm db:push` for dev-only changes without a migration file) to apply changes.
