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

Seed credentials: `admin@doame.com` / `doame2025`, `carlos.mendonca@...` / `voluntario123`.

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

UI components live in `src/components/ui/` (shadcn/ui primitives). Feature-specific components are co-located in `_components/` subfolders within each route segment.

Path aliases (configured in `tsconfig.json`, `baseUrl: src`): `@/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/config/*`, `@/data/*`.

Environment variable: `NEXT_PUBLIC_API_URL` (copy from `.env.example`).

### Backend (`apps/api`)

NestJS with feature modules — each domain has its own `module/controller/service/dto` set:
- `AuthModule` — JWT login (`POST /api/auth/login`), Passport strategy, `JwtAuthGuard`
- `DoacoesModule` — Donation CRUD, volunteer suggestion by geolocation, assignment logic
- `VoluntariosModule` — Volunteer CRUD + approval workflow
- `AdministradoresModule` — Admin CRUD (ADMIN / SUPERADMIN roles)
- `PalavrasChaveModule` — Biblical keywords linked to donations
- `PrismaModule` — Singleton DB connection injected across modules

Global setup in `main.ts`: CORS (from `FRONTEND_URL` env), `ValidationPipe`, API prefix `/api`.

Environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `FRONTEND_URL` (copy from `.env.example`).

### Data Model (Prisma)

Core entities: `Igreja` (church with geographic radius) → `Doacao` (donation with lat/long) + `ItemDoacao` / `DoacaoFinanceira` → `AtribuicaoVoluntarioDoacao` (volunteer assignment join table with distance and response status) → `Voluntario`.

**Geographic matching**: Volunteer suggestions (`GET /api/doacoes/:id/voluntarios-sugeridos`) use lat/long distance calculations based on the church's configured sweep radius.

**LGPD compliance**: Donor personal info is anonymized when a donation reaches status `ENTREGUE`.

After any schema change run `pnpm db:generate` to regenerate the Prisma Client, then `pnpm db:migrate` to apply migrations.
