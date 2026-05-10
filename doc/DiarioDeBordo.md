# 📓 Diário de Bordo — Projeto Doame

---

## 📌 Índice

1. [Introdução ao Diário de Bordo](#1-introdução-ao-diário-de-bordo)
2. [Contexto Geral do Projeto](#2-contexto-geral-do-projeto)
3. [Registro Cronológico por Sessão](#3-registro-cronológico-por-sessão)
   - [Sessão 1 — 21/03/2026](#sessão-1--21032026)
   - [Sessão 2 — 27/04/2026](#sessão-2--27042026)
   - [Sessão 3 — 28/04/2026](#sessão-3--28042026)
   - [Sessão 4 — 29/04/2026](#sessão-4--29042026)
   - [Sessão 5 — 30/04/2026](#sessão-5--30042026)
   - [Sessão 6 — 01/05/2026](#sessão-6--01052026)
   - [Sessão 7 — 02/05/2026](#sessão-7--02052026)
4. [Consolidação das Decisões](#4-consolidação-das-decisões)
5. [Estado Atual do Projeto](#5-estado-atual-do-projeto)
6. [Pendências e Próximos Passos](#6-pendências-e-próximos-passos)
7. [Instruções para o Próximo Agente](#7-instruções-para-o-próximo-agente)

---

## 1. Introdução ao Diário de Bordo

### O que é este documento

O `DiarioDeBordo.md` é a **memória persistente e oficial do projeto Doame**. Ele registra de forma cronológica, detalhada e estruturada tudo o que foi discutido, decidido, construído e pendente ao longo de cada sessão de trabalho entre o desenvolvedor e o agente de IA (Claude).

### Para que serve

- Permitir que um novo agente (Claude em um chat futuro) assuma o trabalho **sem perda de contexto**
- Registrar o **raciocínio por trás de cada decisão**, não apenas o resultado
- Funcionar como ponte entre sessões de trabalho que ocorrem em chats separados
- Servir como fonte única de verdade sobre o **estado atual do projeto**

### O que este documento NÃO é

- Não é substituto da documentação técnica. Todo conteúdo técnico de escopo, arquitetura, modelo de dados e stack já existe nos arquivos da pasta `doc/` do repositório. Este Diário apenas **aponta para eles**
- Não contém trechos de código. Para consultar código, o agente deve acessar diretamente o arquivo referenciado pelo caminho absoluto indicado

### Regras obrigatórias deste documento

1. **Nunca registrar trechos de código** — apenas listar quais arquivos foram criados/modificados, o que cada um faz, e seu caminho absoluto dentro do repositório
2. **Nunca repetir conteúdo já presente nos documentos de `doc/`** — apenas referenciar com caminho absoluto (ex: `doame/doc/Modelo_de_Dados.md`)
3. **Nunca registrar dados pessoais** — pessoas reais são referenciadas apenas pelo seu papel (ex: "a professora", "o desenvolvedor", "o cliente institucional")
4. **Caminhos sempre absolutos** a partir da raiz do repositório zipado, para evitar erros em varreduras do `doame.zip`
5. **Nunca resumir excessivamente** — riqueza de contexto e raciocínio são prioritários
6. **Datas baseadas nos inputs do desenvolvedor** — Claude não tem acesso ao timestamp de cada mensagem; as datas foram fornecidas explicitamente pelo desenvolvedor e validadas
7. **Ao atualizar**: sempre adicionar novas sessões ao final da seção 3 deste documento (Registro Cronológico por Sessão), nunca apagar sessões anteriores. Atualizar também as seções 5 e 6

### Como está estruturado

O documento segue uma estrutura de 7 seções: introdução → contexto → registro cronológico sessão a sessão → decisões consolidadas → estado atual → pendências → instruções para o próximo agente.

### Como utilizar em um novo chat

Veja a [Seção 7](#7-instruções-para-o-próximo-agente) para o passo a passo completo e o prompt modelo.

---

## 2. Contexto Geral do Projeto

### Nome oficial
**Doame**

### Problema que resolve
A ASA (Ação Solidária Adventista) recebia pedidos de doação por múltiplos canais não estruturados (WhatsApp, telefone, presencialmente), sem visibilidade geográfica, sem controle logístico e sem dados para prestação de contas. O Doame digitaliza o ponto de entrada desse processo.

> Para o problema completo, objetivo e escopo, consultar:
> `doame/doc/Dossiê – Documento Inicial De Escopo.md`

### Parceria institucional
O Doame é uma plataforma criada exclusivamente para a **ASA — Ação Solidária Adventista**, departamento oficial da Igreja Adventista do Sétimo Dia (IASD).

### Escopo do MVP
O MVP foi reduzido ao longo do projeto para viabilizar entrega rápida. O escopo final do MVP contempla:
- Página de marketing (About)
- Formulário público de doação (multi-step, sem login)
- Página de login do administrador
- Dashboard administrativo com lista de doações e voluntários
- Atribuição manual de voluntários a doações
- Mudança manual de status das doações
- Back-end com CRUD completo em NestJS + Prisma + PostgreSQL

> Para o backlog completo e histórico do escopo, consultar:
> `doame/doc/Backlog do MVP.md`

### Premissas importantes
- O projeto **não está limitado** a nenhum prazo acadêmico — o desenvolvimento continua independentemente
- Não há orçamento para hospedagem no período de testes — uso de **ngrok** para acesso externo local
- O front-end foi desenvolvido antes do back-end; a integração entre eles ainda está em andamento

---

## 3. Registro Cronológico por Sessão

---

### Sessão 1 — 21/03/2026

#### 🧠 Contexto
Primeira sessão do projeto. O desenvolvedor apresentou os documentos iniciais de escopo e pediu ajuda para construir o front-end do Doame, se apresentando como alguém com conhecimento teórico mas pouca prática em arquitetura de sistemas.

#### 👤 O que foi solicitado
1. Leitura e compreensão de todos os documentos de documentação do projeto
2. Retorno sobre o entendimento do projeto antes de qualquer geração de código
3. Início pelo front-end (área de maior domínio do desenvolvedor)
4. Abordagem com ensino aplicado — explicar os conceitos enquanto se constrói

#### 🤖 O que foi feito
- Claude leu os 5 documentos anexados (Dossiê, Backlog, Modelo de Dados, Stack Tecnológica, Arquitetura de Sistema)
- Retornou um resumo estruturado do entendimento do projeto
- Identificou os 3 perfis de usuário (Doador, Voluntário, Administrador) e o fluxo central
- Identificou a separação crítica entre área pública e área privada do front-end

#### 📌 Decisões tomadas
- Começar pelo front-end, especificamente pela **landing page**
- Usar a estrutura de Route Groups do Next.js já presente no projeto: `(main)`, `(marketing)`, `(restricted)`
- O `layout.tsx` de cada grupo seria responsável por Header/Footer do grupo

#### 🔍 Análise e raciocínio
Claude identificou que o projeto já tinha uma estrutura de pastas bem pensada e que o desenvolvedor havia feito boas escolhas iniciais de organização. A separação em Route Groups foi reconhecida como uma convenção inteligente do Next.js.

#### ⚙️ Arquivos analisados (não criados)
O desenvolvedor compartilhou screenshots da estrutura de pastas e o código da `page.tsx` da landing page e da página de doação.

#### ⚠️ Pontos de atenção registrados
- O desenvolvedor usou `<h1>` para o link "Acesso Restrito" na landing page — problema semântico e de posicionamento identificado e corrigido com `fixed top-6 right-10 z-20`

---

### Sessão 2 — 27/04/2026

#### 🧠 Contexto
Retomada após pausa de 37 dias. O desenvolvedor apresentou o componente de doação existente e solicitou uma aula sobre seu funcionamento antes de evoluí-lo.

#### 👤 O que foi solicitado
1. Explicação detalhada do funcionamento do componente de doação existente (`page.tsx` de donation)
2. Discussão sobre a API de geolocalização e o sistema de mapa
3. Atualização da documentação de Modelo de Dados para incluir palavra-passe bíblica e campos de geolocalização

#### 🤖 O que foi feito

**Aula sobre o componente de doação:**
Claude explicou em detalhes: `"use client"`, `useState` e seus três papéis no componente (step, formData, direction), a função `changeStep`, o padrão spread operator para atualização de objetos, o sistema de animação com Framer Motion (`AnimatePresence`, `motion.div`, `variants`, `key`), renderização condicional com `&&`, e o botão `disabled`.

**Discussão sobre geolocalização:**
Claude propôs a stack gratuita e open source:
- **OpenStreetMap + Leaflet.js** (via `react-leaflet`) para o mapa
- **Nominatim** para geocodificação (endereço → coordenadas)
- **PostGIS** (extensão do PostgreSQL já adotado) para cálculos de distância e varredura de raios

Claude também analisou o sistema de varredura progressiva por raios (1km → 5km → 10km → raio metropolitano) e o fluxo de atribuição de voluntários descrito pelo desenvolvedor.

**Sobre SMS/WhatsApp:**
Claude identificou que não existe solução 100% gratuita para produção e sugeriu: Twilio (tier gratuito) ou Evolution API/Z-API para WhatsApp sem custo de API.

**Palavra-passe bíblica:**
O desenvolvedor propôs o uso de termos bíblicos como palavra-passe de segurança entre voluntário e doador. Claude validou a ideia como excelente e coerente com a identidade institucional da ASA.

**Atualização do Modelo de Dados:**
Claude gerou uma versão 2.0 do Modelo de Dados com as seguintes adições:
- Nova entidade `PalavraChave` com campos: `termo`, `referenciaBiblica`, `significado`, `ativa`, `emUso`
- Campo `whatsapp` separado de `telefone` em `Voluntário`
- Campo `disponivel` em `Voluntário`
- Campo `palavra_chave_id` em `Doação`
- Novos status `EM_ATRIBUICAO` e `SEM_VOLUNTARIO` em `Doação`
- Campo `raioMetropolitanoKm` em `Igreja`
- Entidade `Associação` evoluída de booleano para status com histórico completo

> O documento atualizado foi salvo em: `doame/doc/Modelo_de_Dados.md`

#### 📌 Decisões tomadas
- Stack de geolocalização: OpenStreetMap + Leaflet + Nominatim + PostGIS (tudo gratuito/open source)
- Mapa **não faz parte do MVP** — foi decidido na Sessão 4 (ver abaixo)
- A palavra-passe bíblica é gerada no momento da confirmação da coleta, não no cadastro da doação
- A palavra é enviada separadamente ao voluntário e ao doador — nunca no mesmo canal

#### ⚠️ Pontos de atenção
- O MVP não implementará o sistema de mapa — decisão tomada por restrição de prazo
- Nominatim tem limite de uso moderado no plano gratuito — suficiente para o MVP

---

### Sessão 3 — 28/04/2026

#### 🧠 Contexto
Sessão focada na evolução do formulário de doação, transformando-o de 3 passos simples para um sistema multi-fluxo com carrinho.

#### 👤 O que foi solicitado
Refatoração completa do componente de doação com os seguintes requisitos:
- Múltiplos fluxos: Alimento, Agasalho, Dinheiro
- Sistema de "carrinho" persistente no estado
- 7 passos no total (incluindo Hub de seleção, Resumo, Endereço, Contato)
- Animações mantidas com Framer Motion
- Componentização interna com pasta `_components`
- Botão flutuante de carrinho nos passos 2 e 3

#### 🔍 Análise e raciocínio
Claude ensinou duas decisões de arquitetura antes de codificar:
1. **Strings no lugar de números para identificar passos** — `"nome" | "hub" | "alimento"` é muito mais legível e extensível que `1 | 2 | 3`
2. **Componentização** — cada passo vira um componente filho que recebe dados e callbacks via props; o estado vive exclusivamente no `page.tsx` orquestrador

#### ⚙️ Arquivos criados

Todos em `doame/apps/web/src/app/(main)/donation/`:

| Arquivo | Função |
|---------|--------|
| `page.tsx` | Orquestrador: gerencia estado global, navegação entre passos e animações |
| `_components/types.ts` | Tipos TypeScript: `StepId`, `ItemCarrinho`, `FormData`, `formDataInicial` |
| `_components/data.ts` | Dados estáticos: listas de alimentos, agasalhos e estados brasileiros |
| `_components/CarrinhoPopover.tsx` | Botão flutuante com popover mostrando itens adicionados |
| `_components/StepNome.tsx` | Passo 1: captura do nome do doador |
| `_components/StepHub.tsx` | Passo 2: hub de seleção de categoria com 3 opções + botão finalizar |
| `_components/StepItens.tsx` | Passo 3A/3B: componente reutilizável para seleção de alimentos e agasalhos |
| `_components/StepDinheiro.tsx` | Passo 3C: input de valor monetário |
| `_components/StepResumo.tsx` | Passo 4: resumo dos itens com totalizador |
| `_components/StepEndereco.tsx` | Passo 5: formulário de endereço com select de estado |
| `_components/StepContato.tsx` | Passo 6: celular com máscara e radio group para WhatsApp |

#### 📌 Decisões tomadas
- `StepItens` é um único componente reutilizado para Alimento e Agasalho (DRY — Don't Repeat Yourself)
- O merge do carrinho faz soma de quantidades quando o mesmo item é adicionado mais de uma vez
- O `page.tsx` é o único responsável pelo estado — filhos são stateless e recebem apenas props
- A função `irPara(destino, direção)` substituiu `changeStep` para maior legibilidade

---

### Sessão 4 — 29/04/2026

#### 🧠 Contexto
Sessão mais longa do projeto. Definição do escopo reduzido do MVP, construção do dashboard administrativo, da página de login, da página About refatorada, e geração do back-end inicial.

#### 👤 O que foi solicitado (em ordem)

1. **Redução de escopo do MVP** para entrega em 1 mês (prazo acadêmico, mas o projeto continua além dele)
2. **Novo passo no formulário**: data e horário da coleta
3. **Página de login** do administrador
4. **Dashboard administrativo** com sidebar, lista de doações, lista de voluntários, dialogs, mudança de status e atribuição de voluntários
5. **Página About** refatorada com componentes Shadcn/ui
6. **Back-end** em NestJS com Prisma

#### 🔍 Escopo final do MVP definido

**Incluído no MVP:**
- Formulário de doação (7 passos)
- Página About (marketing)
- Login do administrador (hardcoded no MVP)
- Dashboard: lista de doações + lista de voluntários
- Mudança de status manual (sem automação)
- Atribuição manual de voluntário com sugestão por match de bairro/município
- Back-end: CRUD completo + autenticação JWT + seed

**Excluído do MVP (pós-MVP):**
- Mapa interativo
- Varredura automática de raios
- Envio real de SMS/WhatsApp
- Painel do voluntário
- Superadmin
- Palavra-passe bíblica (schema pronto, mas sem fluxo front-end no MVP)

#### ⚙️ Arquivos criados — Formulário de Doação (atualização)

| Arquivo | Função |
|---------|--------|
| `doame/apps/web/src/app/(main)/donation/_components/StepDataHora.tsx` | Novo passo 5: seletor de data (bloqueio de passado) e horário |
| `doame/apps/web/src/app/(main)/donation/_components/types.ts` | Atualizado: `dataColeta` e `horaColeta` adicionados ao `FormData`; `"dataHora"` adicionado ao `StepId` |
| `doame/apps/web/src/app/(main)/donation/page.tsx` | Atualizado: contador ajustado para "X de 7", novo case `"dataHora"` no switch |

#### ⚙️ Arquivos criados — Login

| Arquivo | Função |
|---------|--------|
| `doame/apps/web/src/app/(restricted)/login/page.tsx` | Tela de login com credenciais hardcoded, toggle de senha, simulação de latência, flag no localStorage |

**Credenciais de teste (MVP):**
- E-mail: `admin@doame.com`
- Senha: `doame2025`

> Referência: `doame/doc/Acesso Admin.md`

#### ⚙️ Arquivos criados — Dashboard Administrativo

Todos em `doame/apps/web/src/app/(restricted)/admin/`:

| Arquivo | Função |
|---------|--------|
| `page.tsx` | Orquestrador do dashboard: estado global, handlers, dialogs |
| `_components/mockData.ts` | Dados mockados de doações e voluntários + função `sugerirVoluntarios` com score de match |
| `_components/StatusBadge.tsx` | Badge colorido por status com mapeamento de 7 status para 7 cores |
| `_components/AdminSidebar.tsx` | Sidebar fixa com logo, navegação (Doações/Voluntários/Atribuição) e logout |
| `_components/DoacoesList.tsx` | Lista de cards de doações com busca e filtro por status |
| `_components/DoacaoDialog.tsx` | Dialog de detalhes da doação: select de status, itens, endereço, voluntário atribuído |
| `_components/AtribuirDialog.tsx` | Dialog de atribuição: lista ordenada de voluntários com score de match e badge de proximidade |
| `_components/VoluntariosList.tsx` | Lista de cards de voluntários com busca |
| `_components/VoluntarioDialog.tsx` | Dialog de detalhes do voluntário: contato, endereço, histórico de coletas |

**Status da doação e cores:**
| Status | Cor |
|--------|-----|
| Pendente | Cinza |
| Aguardando | Amarelo |
| Confirmado | Azul |
| Negado | Vermelho |
| Atribuído | Roxo |
| Coletado | Laranja |
| Entregue | Verde |

#### ⚙️ Arquivos criados — About

| Arquivo | Função |
|---------|--------|
| `doame/apps/web/src/app/(marketing)/about/page.tsx` | Página refatorada com Card, Button, Badge, Separator do Shadcn/ui; 5 seções: Hero, O que é, Como funciona, A quem serve, CTA |

#### ⚙️ Arquivos criados — Back-end (NestJS)

Estrutura completa em `doame/apps/api/`:

**Configuração:**
| Arquivo | Função |
|---------|--------|
| `package.json` | Dependências do NestJS, Prisma, JWT, bcrypt |
| `tsconfig.json` | Configuração TypeScript com decorators habilitados |
| `nest-cli.json` | Configuração do CLI do NestJS |
| `.env` / `.env.example` | Variáveis: DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, PORT, FRONTEND_URL |
| `src/main.ts` | Entry point: CORS configurado para `localhost:3000`, ValidationPipe global, prefixo `/api` |
| `src/app.module.ts` | Módulo raiz importando todos os módulos do domínio |

**Prisma:**
| Arquivo | Função |
|---------|--------|
| `prisma/schema.prisma` | Schema completo com todas as entidades do Modelo de Dados v2.0 |
| `prisma/seed.ts` | Seed com: 1 igreja, 1 administrador, 4 voluntários, 20 palavras bíblicas, 3 doações |
| `prisma/migrations/` | Migration inicial gerada automaticamente |
| `src/prisma/prisma.service.ts` | Singleton do PrismaClient com lifecycle hooks |
| `src/prisma/prisma.module.ts` | Módulo global (disponível em toda a aplicação sem reimportação) |

**Módulos de domínio:**

| Módulo | Controller | Service | DTO | Função |
|--------|-----------|---------|-----|--------|
| `auth` | `POST /api/auth/login` | Valida credenciais, gera JWT | `LoginDto` | Autenticação JWT |
| `doacoes` | `GET/POST /api/doacoes`, `PATCH /:id/status`, `POST /:id/atribuir`, `GET /:id/voluntarios-sugeridos` | CRUD + lógica de atribuição + anonimização LGPD | `CreateDoacaoDto`, `UpdateStatusDto`, `AtribuirVoluntarioDto` | Gestão completa de doações |
| `voluntarios` | `GET/POST /api/voluntarios`, `PATCH/DELETE /:id` | CRUD com verificação de senha do admin para editar/excluir | `CreateVoluntarioDto`, `UpdateVoluntarioDto`, `ConfirmacaoAdminDto` | Gestão de voluntários |
| `administradores` | `GET/POST /api/administradores` | CRUD básico | `CreateAdminDto` | Gestão de admins |
| `palavras-chave` | `GET /api/palavras-chave`, `GET /api/palavras-chave/disponivel` | Listagem e sorteio de termo disponível | — | Palavra-passe bíblica |

**Segurança:**
| Arquivo | Função |
|---------|--------|
| `src/auth/jwt.strategy.ts` | Extrai e valida JWT do header Authorization |
| `src/auth/jwt-auth.guard.ts` | Guard aplicado em rotas protegidas |

#### 📌 Decisões tomadas nesta sessão

- **Autenticação**: JWT via `@nestjs/jwt` + `@nestjs/passport` — credenciais hardcoded no seed (não no código)
- **Proteção de rotas**: `JwtAuthGuard` aplicado individualmente por rota; `POST /doacoes` é pública (doador sem login)
- **Editar/excluir voluntário**: exige campo `senhaAdmin` no body da requisição, revalidado no backend — dupla confirmação de identidade
- **Soft delete**: voluntários são desativados (`ativo: false`) em vez de deletados — preserva histórico de atribuições
- **LGPD**: dados do doador são anonimizados automaticamente quando status muda para `ENTREGUE`
- **Palavra-chave**: sorteada no momento da atribuição e liberada na conclusão ou cancelamento
- **Sugestão de voluntários no MVP**: algoritmo de score por texto (mesmo bairro = 2pts, mesmo município = 1pt) — sem PostGIS ainda
- **Comentários `// TODO`**: todos os pontos de integração futura com a API foram marcados no front-end

#### 📎 Componentes Shadcn instalados nesta sessão
`dialog`, `badge`, `select`, `avatar`, `input`

---

### Sessão 5 — 30/04/2026

#### 🧠 Contexto
Sessão focada na reorganização estrutural do projeto e na tentativa de integração front-back.

#### 👤 O que foi solicitado
1. Que o projeto fosse organizado como **monorepo** para otimizar reuso de arquivos entre front e back
2. Integração do front-end com o back-end
3. Implementação das features de editar e excluir voluntário
4. Redirecionamento para a home após finalização da doação

#### 🤖 O que foi feito

O desenvolvedor enviou o projeto já organizado como monorepo com a seguinte estrutura:

```
doame/
  apps/
    web/          ← Next.js (frontend)
    api/          ← NestJS (backend)
  packages/
    shared/       ← Tipos e enums compartilhados
  package.json    ← Raiz do monorepo
  pnpm-workspace.yaml
  turbo.json
```

**Pacote compartilhado criado pelo desenvolvedor:**

`doame/packages/shared/src/index.ts` — exporta enums e interfaces comuns:
- `PapelAdmin`, `CategoriaDoacao`, `StatusDoacao`, `StatusAtribuicao`, `TipoPagamento`
- `ApiResponse<T>`, `PaginatedResponse<T>`

**Gerenciador de pacotes e build:** `pnpm` + `Turborepo`

#### ⚠️ Sessão interrompida

A conversa foi interrompida antes da conclusão da integração. O trabalho de integração front-back, as features de editar/excluir voluntário, e o redirecionamento pós-doação **não foram concluídos nesta sessão**.

#### 📌 Estado ao final da sessão
- Estrutura de monorepo: ✅ configurada pelo desenvolvedor
- Integração front-back: ❌ não concluída
- Feature editar voluntário: ❌ não implementada no front
- Feature excluir voluntário: ❌ não implementada no front
- Redirecionamento pós-doação: ❌ não implementado

---

### Sessão 6 — 01/05/2026

#### 🧠 Contexto
Sessão dedicada à criação do Diário de Bordo.

#### 👤 O que foi solicitado
Criação do `DiarioDeBordo.md` para servir como memória persistente do projeto em chats futuros.

#### 🤖 O que foi feito
- Claude coletou todas as informações necessárias via perguntas estruturadas em 4 blocos
- Validou a contagem de inputs (26 inputs = 26 datas fornecidas = 6 sessões)
- Corrigiu caminhos para absolutos conforme solicitado
- Gerou o presente documento

#### 📌 Decisões tomadas
- Caminhos sempre absolutos a partir da raiz do repositório zipado
- Nenhum trecho de código registrado no documento
- Conteúdo dos docs de `doc/` apenas referenciado, nunca repetido
- Sessões consolidadas por data (inputs do mesmo dia = 1 sessão)

---

### Sessão 7 — 02/05/2026

#### 🧠 Contexto
Retomada após um dia. O desenvolvedor iniciou a sessão fornecendo inputs de uma conversa paralela realizada no mesmo dia, na qual as pendências 2, 3 e 4 já haviam sido implementadas por outro agente Claude. A sessão foi, portanto, dividida em duas partes: absorção do contexto atualizado e implementação da nova funcionalidade solicitada.

#### 👤 O que foi solicitado
1. Leitura do `DiarioDeBordo.md` e confirmação de contexto completo do projeto
2. Absorção dos inputs da sessão paralela (pendências 2, 3 e 4 já concluídas)
3. Criação do **Painel Split-View de atribuição** como nova aba do dashboard administrativo
4. Uso exclusivo de componentes Shadcn/ui já instalados para manter consistência visual
5. Listagem de comandos de instalação de eventuais componentes novos no monorepo

#### 🤖 O que foi feito (parte 1 — absorção de contexto)

Claude incorporou os seguintes avanços registrados na sessão paralela:

**Pendência 2 — Editar voluntário (concluída antes desta sessão):**
O arquivo `doame/apps/web/src/app/(restricted)/admin/_components/VoluntarioDialog.tsx` foi refatorado com três modos internos (`visualizar | editar | excluir`). No modo editar, todos os campos viram inputs editáveis com campo de senha do administrador para confirmação. O handler `handleEditarVoluntario` em `page.tsx` valida a senha (hardcoded `doame2025` no MVP), aplica o merge no array com `.map()` e atualiza o `voluntarioSelecionado` em tempo real. Tela de confirmação `✓ Alterações salvas` exibida por 1,2 segundos antes de fechar.

**Pendência 3 — Excluir voluntário (concluída antes desta sessão):**
No mesmo `VoluntarioDialog.tsx`, o modo excluir exibe alerta visual em vermelho explicando o soft delete. O handler `handleExcluirVoluntario` em `page.tsx` valida a senha e remove o voluntário do array com `.filter()`. O back-end marcará `ativo: false` na integração real.

**Pendência 4 — Redirecionamento pós-doação (concluído antes desta sessão):**
O arquivo `doame/apps/web/src/app/(main)/donation/_components/StepContato.tsx` ganhou `"use client"` e dois estados: `enviando` (simula latência de rede com 800ms de delay) e `enviado`. Quando `enviado` é `true`, o JSX inteiro é substituído por tela de confirmação com ícone verde ✅, mensagem personalizada com o nome do doador e botão "Voltar à página inicial" executando `router.push("/")`. O `alert()` foi removido. O `onEnviar` no orquestrador é um callback vazio com `// TODO` para o `POST /api/doacoes` real.

#### 🤖 O que foi feito (parte 2 — nova implementação)

**Painel Split-View de atribuição:**

Claude verificou todos os componentes Shadcn/ui disponíveis no projeto antes de implementar. Todos os necessários (`Badge`, `Button`, `Input`, `Select`, `Avatar`, `Separator`) já estavam instalados — nenhuma instalação nova foi necessária.

A nova aba foi adicionada à sidebar com o ícone `GitMerge` do `lucide-react`, escolhido pela sua semântica visual de "juntar dois pontos" (doação ↔ voluntário). O badge contador da aba exibe apenas as doações com status `Pendente` ou `Negado` — as que efetivamente demandam atribuição — e não o total geral.

#### ⚙️ Arquivos criados

| Arquivo | Função |
|---------|--------|
| `doame/apps/web/src/app/(restricted)/admin/_components/PainelAtribuicao.tsx` | Painel split-view completo: lista filtrável de doações à esquerda (busca por nome/bairro + filtro por status), voluntários sugeridos por proximidade à direita com botão de atribuição inline, badge de match visual e estado de voluntário já atribuído |

#### ⚙️ Arquivos modificados

| Arquivo | O que mudou |
|---------|-------------|
| `doame/apps/web/src/app/(restricted)/admin/_components/AdminSidebar.tsx` | Tipo `AbaAtiva` ampliado para incluir `"atribuicao"`, novo item de navegação "Atribuição" com ícone `GitMerge`, nova prop `totalPendentes` para o badge contador |
| `doame/apps/web/src/app/(restricted)/admin/page.tsx` | Import de `PainelAtribuicao`, tipo `AbaAtiva` atualizado, cálculo de `totalPendentes` (Pendente + Negado) passado à sidebar, bloco de renderização `{abaAtiva === "atribuicao"}` |
| `doame/doc/DiarioDeBordo.md` | Sessão 7 adicionada, Seções 5 e 6 atualizadas |

#### 📌 Decisões tomadas

- **Nenhum componente Shadcn novo** instalado — todos já existiam no projeto
- **Badge da sidebar** exibe pendentes (Pendente + Negado), não total de doações — foco no que precisa de ação
- **Painel direito** reutilizou a função `sugerirVoluntarios` do `mockData.ts` — mesmo algoritmo já testado no `AtribuirDialog`
- **Voluntário já atribuído** aparece com badge verde "Atual" e botão desabilitado — impede atribuição dupla acidental
- **Seleção de doação** é toggle — clicar na mesma doação já selecionada desmarca e retorna ao estado vazio do painel direito
- **Estrutura do painel direito foi projetada para o pós-MVP**: basta substituir a lista de `VoluntarioCard` por um componente de mapa `react-leaflet` sem alterar o layout geral do split-view — decisão que motivou o desenvolvedor a preferir esta abordagem em vez da combinação sugerida (Abordagens 1+2)

#### 🔍 Raciocínio sobre a escolha da abordagem

O desenvolvedor optou pelo Painel Split-View (Abordagem 4) em detrimento da combinação Dialog + Select inline (Abordagens 1+2) sugerida por Claude. A justificativa foi estratégica: o split-view mantém valor no pós-MVP mesmo após a adição do mapa interativo, pois o painel direito pode evoluir para exibir um mapa com pins dos voluntários em vez da lista atual — sem necessidade de redesenho da navegação do dashboard.

#### 📎 Componentes Shadcn já presentes (nenhuma instalação necessária)
`badge`, `button`, `input`, `select`, `avatar`, `separator`

---

### Sessão 8 — 10/05/2026

#### 🧠 Contexto
Retomada com contexto compactado. O agente recebeu um resumo estruturado da sessão anterior e continuou a partir do ponto exato onde o trabalho havia parado. A sessão foi densa e cobriu três grandes blocos: (1) conclusão da integração backend, (2) mudança conceitual no modelo de voluntários, e (3) nova funcionalidade de preenchimento automático de endereço via CEP.

#### 👤 O que foi solicitado

**Bloco 1 — Conclusão da integração backend:**
Continuação do trabalho iniciado na sessão anterior. A pendência era conectar login, envio de doação e busca de doações à API real.

**Bloco 2 — Mudança de modelo do voluntário:**
O desenvolvedor esclareceu que voluntários **não se auto-cadastram** no sistema. O fluxo correto é: voluntário comunica interesse fora do Doame → administrador cadastra os dados → sistema notifica o voluntário por SMS/WhatsApp sobre cada coleta. Com isso, **senha de voluntário é desnecessária** e foi removida do formulário e do backend.

**Bloco 3 — Preenchimento automático de CEP:**
Solicitação de implementação completa com os seguintes requisitos:
- Backend como proxy para a ViaCEP (evitar CORS e centralizar cache futuro)
- Frontend com hook reutilizável para os dois formulários (doação e voluntário)
- Campos auto-preenchidos ficam desabilitados durante a busca e recebem fundo amarelo como indicador visual
- Spinner de carregamento no campo CEP
- Tratamento de erro inline abaixo do campo
- Endereço do voluntário com a mesma estrutura separada de campos do formulário de doação

#### 🤖 O que foi feito

**Parte 1 — Correções de erros e integração backend (bloco de trabalho anterior ao contexto atual):**

Antes da integração, foram corrigidos os seguintes erros identificados na API:
- Conflito de rotas no `doacoes.controller.ts`: `GET :id` interceptava `GET :id/voluntarios-sugeridos` — corrigido por reordenação
- Validadores ausentes em `CreateAdminDto` — adicionados decoradores `class-validator`
- `@IsNumber()` ausente em `latitude/longitude` do `voluntarios.dto.ts`
- Erro TypeScript `TS18047` em `VoluntarioDialog.tsx`: TypeScript não preserva narrowing em closures — corrigido com padrão `const voluntario = voluntarioOrNull` após guard

**Parte 2 — Cinco funcionalidades implementadas:**

| Funcionalidade | Descrição |
|----------------|-----------|
| Centralização mobile | Homepage centraliza logo e conteúdo em dispositivos móveis; alinha à direita em desktop |
| Botão Voltar no StepHub | `StepHub.tsx` recebeu prop `onVoltar` e botão com ícone `ChevronLeft` |
| Dark mode no admin | `AdminSidebar` recebeu props `darkMode` e `onToggleDark`; estado persistido em `localStorage` com chave `doame_dark_mode`; todos os componentes do dashboard receberam classes `dark:` do Tailwind |
| Cadastro de novo voluntário | Criado `NovoVoluntarioDialog.tsx` com formulário completo e botão "Novo Voluntário" na aba Voluntários |
| Integração backend — formulário | `StepContato.tsx` agora chama `POST /api/doacoes` via callback `onEnviar` assíncrono; mapeamento de `FormData` para `CreateDoacaoDto` feito no `page.tsx` da doação |
| Integração backend — login | `login/page.tsx` substituiu credenciais hardcoded por chamada real a `POST /api/auth/login`; JWT armazenado em `localStorage` como `doame_admin_token` |
| Integração backend — admin | `admin/page.tsx` busca doações reais via `GET /api/doacoes` com token JWT; função `mapApiDoacao()` converte resposta da API para o tipo `Doacao` do frontend |

**Variáveis de ambiente adicionadas:**

| Variável | Arquivo | Valor |
|----------|---------|-------|
| `NEXT_PUBLIC_IGREJA_ID` | `doame/apps/web/.env.local` e `.env.example` | `"igreja-itapetininga-01"` |

**Parte 3 — Remoção da senha do voluntário:**

Mudança de modelo confirmada pelo desenvolvedor. Voluntários não fazem login no Doame.

| Item | O que mudou |
|------|------------|
| `doame/apps/api/prisma/schema.prisma` | `Voluntario.senhaHash String` → `String?` (nullable); `Doacao.latitude/longitude Float` → `Float?` (nullable) |
| `doame/apps/api/src/voluntarios/voluntarios.dto.ts` | Campo `senha` removido do `CreateVoluntarioDto`; `MinLength` removido dos imports |
| `doame/apps/api/src/voluntarios/voluntarios.service.ts` | Remoção de bcrypt hash na criação; remoção do import `bcryptjs` |
| `doame/apps/api/src/doacoes/doacoes.dto.ts` | `latitude` e `longitude` marcados com `@IsOptional()` |
| `doame/apps/web/src/app/(restricted)/admin/_components/NovoVoluntarioDialog.tsx` | Campo senha removido do formulário e da interface `NovoVoluntarioDados` |
| `doame/apps/web/src/app/(restricted)/admin/page.tsx` | Campo `senha` removido do payload de criação |

**Banco de dados:**

- Database criado: `doamedb` em PostgreSQL local
- Schema aplicado via `prisma db push` (advisory lock impediu `migrate dev` por processo concorrente)
- Seed executado com sucesso: 1 igreja, 1 admin, 4 voluntários, 20 palavras bíblicas, 3 doações de exemplo

**Parte 4 — Módulo CEP (backend + frontend):**

#### ⚙️ Arquivos criados

| Arquivo | Função |
|---------|--------|
| `doame/apps/api/src/cep/cep.service.ts` | Busca CEP na ViaCEP, valida 8 dígitos, normaliza resposta para `{ cep, logradouro, complemento, bairro, municipio, estado }` |
| `doame/apps/api/src/cep/cep.controller.ts` | `GET /api/cep/:cep` — rota pública, sem JWT |
| `doame/apps/api/src/cep/cep.module.ts` | Módulo NestJS registrado no `AppModule` |
| `doame/apps/web/src/hooks/useCep.ts` | Hook reutilizável: aplica máscara `XXXXX-XXX`, dispara busca ao completar 8 dígitos, gerencia `carregando` e `erro`, chama `onPreenchido(dados)` |

#### ⚙️ Arquivos modificados

| Arquivo | O que mudou |
|---------|-------------|
| `doame/apps/api/src/app.module.ts` | `CepModule` adicionado aos imports |
| `doame/apps/web/src/app/(main)/donation/_components/StepEndereco.tsx` | Reescrito: usa `useCep`, campos auto-preenchidos com fundo amarelo, spinner no CEP, erro inline, nova prop `onPreencherEndereco` para bulk update sem stale closure |
| `doame/apps/web/src/app/(main)/donation/page.tsx` | Prop `onPreencherEndereco` adicionada com `setFormData(prev => ...)` para evitar stale closure no bulk update |
| `doame/apps/web/src/app/(restricted)/admin/_components/NovoVoluntarioDialog.tsx` | `endereco: string` → objeto estruturado `EnderecoVoluntario` com 7 campos; mesma estrutura e UX de CEP do `StepEndereco` |
| `doame/apps/web/src/app/(restricted)/admin/page.tsx` | `handleCadastrarVoluntario` serializa o objeto `endereco` para string `"Logradouro, N — Bairro, Cidade/UF"` antes de enviar à API; atualização local do estado usa campos individuais |

#### 📌 Decisões tomadas

- **Proxy no backend para ViaCEP**: evita CORS no browser, centraliza erros, permite cache e rate-limiting futuros sem alterar o frontend
- **`onPreencherEndereco` como prop separada do `onChange`**: bulk update de múltiplos campos de endereço com `setFormData(prev => ...)` usa updater function e evita o problema de stale closure que ocorreria ao chamar `onChange` múltiplas vezes em sequência
- **Campos auto-preenchidos editáveis após lookup**: desabilitados apenas durante a busca; editáveis depois para permitir correções manuais
- **Fundo amarelo nos campos auto-preenchidos**: indicador visual sutil de que o campo foi preenchido automaticamente, mantendo consistência com a paleta de cores do projeto
- **`senhaHash` mantido como nullable no schema** (não removido): permite migração futura para autenticação de voluntários sem migration destrutiva

#### 📌 Raciocínio sobre stale closure
Quando `onChange(campo, valor)` é chamado múltiplas vezes rapidamente (como em um bulk fill), cada chamada lê `formData.endereco` do momento do render — não do estado pós-atualização anterior. Resultado: apenas o último campo persiste. A solução foi criar `onPreencherEndereco(dados: Partial<Endereco>)` no orquestrador, implementado como `setFormData(prev => ({ ...prev, endereco: { ...prev.endereco, ...dados } }))`, que processa todas as mudanças em uma única transação de estado.

---

## 4. Consolidação das Decisões

### Tecnologia

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Framework front-end | Next.js (App Router) + TypeScript | SSR/SSG para páginas públicas, Route Groups para separação de áreas, ecossistema maduro |
| Estilização | TailwindCSS + Shadcn/ui | Consistência visual, componentes acessíveis, evita CSS customizado excessivo |
| Animações | Framer Motion | Única biblioteca que suporta animação de entrada/saída com `AnimatePresence` de forma simples |
| Back-end | NestJS + TypeScript | Arquitetura modular opinada, suporte nativo a SOLID e DDD, ideal para equipes pequenas |
| ORM | Prisma | Tipagem forte, migrações controladas, produtividade elevada |
| Banco de dados | PostgreSQL | Maduro, suporta PostGIS para geolocalização futura, forte integridade referencial |
| Autenticação | JWT via `@nestjs/jwt` + `@nestjs/passport` | Padrão da indústria, sem sessão server-side, compatível com arquitetura stateless |
| Monorepo | Turborepo + pnpm | Gerenciamento eficiente de múltiplos pacotes, cache de build, workspace nativo |
| Mapa (pós-MVP) | OpenStreetMap + react-leaflet | Gratuito, open source, sem limites de requisição |
| Geocodificação (pós-MVP) | Nominatim | API oficial do OSM, gratuita para uso moderado |
| Testes externos | ngrok | Sem custo, sem configuração de servidor, tunnel seguro para exposição local |

### Arquitetura

| Decisão | Detalhes |
|---------|---------|
| Separação de áreas no front | Route Groups: `(main)` público, `(marketing)` institucional, `(restricted)` autenticado |
| Estado no formulário | Centralizado no `page.tsx` orquestrador; componentes filhos são stateless |
| Identificação de passos | Strings (`"nome"`, `"hub"`) em vez de números — mais legível e extensível |
| Proteção de rotas (MVP) | Flag `doame_admin_logado` no localStorage — substituível por JWT storage no pós-MVP |
| Componentização | Pasta `_components` local por página (underscore = não vira rota no Next.js) |
| Dados mockados | Centralizados em `mockData.ts` com comentários `// TODO` marcando pontos de integração |
| Soft delete | Voluntários desativados, nunca deletados — preserva histórico |
| LGPD | Anonimização automática no back-end ao mudar status para `ENTREGUE` |

### Produto

| Decisão | Detalhes |
|---------|---------|
| Confirmação de editar/excluir voluntário | Exige senha do administrador — validada no back-end (não apenas no front) |
| Palavra-passe bíblica | Sorteada no momento da atribuição; enviada separadamente a voluntário e doador; liberada na conclusão |
| Carrinho de doações | Permite múltiplas categorias na mesma doação com merge inteligente (soma quantidades) |
| Status da doação | 7 estados com cores distintas — Pendente, Aguardando, Confirmado, Negado, Atribuído, Coletado, Entregue |
| MVP sem mapa | Decisão de escopo para viabilizar entrega; mapa está no pós-MVP |
| Painel split-view de atribuição | Escolhido sobre dialog+select inline por escalabilidade: painel direito poderá exibir mapa no pós-MVP sem redesenho |

---

## 5. Estado Atual do Projeto

### ✅ Concluído

**Front-end:**
- Landing page centralizada em mobile (`doame/apps/web/src/app/page.tsx`)
- Formulário de doação multi-step com 7 passos + botão Voltar no StepHub (`doame/apps/web/src/app/(main)/donation/`)
- Formulário de endereço com preenchimento automático via CEP (`StepEndereco.tsx`)
- Envio real de doação: `StepContato.tsx` chama `POST /api/doacoes` com mapeamento completo do `FormData`
- Redirecionamento para home após envio bem-sucedido
- Página About (`doame/apps/web/src/app/(marketing)/about/page.tsx`)
- Login real com JWT: `login/page.tsx` chama `POST /api/auth/login`, armazena token em `localStorage`
- Dashboard administrativo com **dark mode** persistido (`doame/apps/web/src/app/(restricted)/admin/`):
  - Aba **Doações**: busca real via `GET /api/doacoes` com JWT; dialog de detalhes, mudança de status, atribuição
  - Aba **Voluntários**: lista com busca, dialog visualizar/editar/excluir; botão **Novo Voluntário** com dialog de cadastro
  - Aba **Atribuição**: painel split-view com lista filtrável e voluntários sugeridos por proximidade
- Cadastro de voluntário com endereço estruturado e preenchimento via CEP (`NovoVoluntarioDialog.tsx`)
- Hook `useCep` reutilizável (`doame/apps/web/src/hooks/useCep.ts`)

**Back-end:**
- Estrutura NestJS completa (`doame/apps/api/src/`)
- Todos os módulos funcionais: auth, doacoes, voluntarios, administradores, palavras-chave, **cep**
- Schema Prisma atualizado: `senhaHash` opcional em Voluntario; `latitude/longitude` opcionais em Doacao
- Banco `doamedb` criado e populado com seed
- Módulo `CepModule`: proxy público para ViaCEP (`GET /api/cep/:cep`)

**Infraestrutura:**
- Monorepo com Turborepo + pnpm
- Pacote `@doame/shared`
- Banco `doamedb` em PostgreSQL local

### 🔄 Parcialmente concluído

- **Integração front-back no dashboard**: doações são buscadas da API real. Voluntários, edição, exclusão e atribuição ainda usam `mockData.ts` e lógica local no frontend.

### ❌ Não iniciado (MVP)

- Busca real de voluntários via `GET /api/voluntarios` no dashboard
- Edição/exclusão de voluntário via `PATCH/DELETE /api/voluntarios/:id` com `senhaAdmin`
- Atribuição via `POST /api/doacoes/:id/atribuir`
- Mudança de status via `PATCH /api/doacoes/:id/status`

---

## 6. Pendências e Próximos Passos

### Pendências abertas (MVP — integração restante)

1. **Aba Voluntários — busca real**
   - `GET /api/voluntarios?igrejaId=...` com JWT para substituir `voluntariosMock`

2. **Aba Voluntários — edição e exclusão**
   - `PATCH /api/voluntarios/:id` com `{ ...form, senhaAdmin }` no body
   - `DELETE /api/voluntarios/:id` com `{ senhaAdmin }` no body

3. **Painel de Atribuição**
   - `GET /api/doacoes/:id/voluntarios-sugeridos` para substituir `sugerirVoluntarios()` do mockData
   - `POST /api/doacoes/:id/atribuir` com `{ voluntarioId }` para atribuição real

4. **Mudança de status no DoacaoDialog**
   - `PATCH /api/doacoes/:id/status` com `{ status }` para refletir mudanças no banco

### Pendências futuras (pós-MVP)

- Substituir lista de voluntários no split-view por mapa interativo (`react-leaflet` + PostGIS)
- Geocodificação de endereços via Nominatim (preencher `latitude/longitude` em Doacao e Voluntario)
- Varredura automática de raios para sugestão de voluntários
- Envio real de SMS/WhatsApp com palavra-passe bíblica na confirmação de coleta
- Painel do voluntário (área autenticada separada, usando `senhaHash` já presente no schema)
- Superadmin com gestão de múltiplas igrejas

---

## 7. Instruções para o Próximo Agente

### Prompt modelo para iniciar um novo chat

```
Leia o arquivo "DiarioDeBordo.md" na pasta "doc" do repositório (caminho: doame/doc/DiarioDeBordo.md) e retorne para mim uma comprovação de que você está por dentro de tudo relativo ao projeto. Depois me pergunte o que devemos fazer em seguida.
```

### Passo a passo do que o agente deve fazer ao ler este documento

1. **Ler este Diário de Bordo integralmente**, do início ao fim, sem pular seções
2. **Acessar os documentos técnicos referenciados** na pasta `doame/doc/` para ter contexto completo de escopo, arquitetura, modelo de dados e stack
3. **Verificar o estado atual** na Seção 5 para saber o que está pronto e o que está pendente
4. **Verificar as pendências** na Seção 6 para ter clareza sobre o que falta
5. **Retornar ao desenvolvedor** uma confirmação estruturada do entendimento, cobrindo:
   - O que é o projeto e para quem serve
   - Em que estado está o front-end (incluindo as 3 abas do dashboard)
   - Em que estado está o back-end
   - Qual é a pendência principal aberta
   - Qual a estrutura do monorepo
6. **Perguntar ao desenvolvedor** o que deve ser feito na sessão atual

### O que o agente deve saber antes de qualquer ação

- O projeto é um **monorepo** gerenciado com **pnpm + Turborepo**
- O front-end está em `doame/apps/web/` (Next.js + TypeScript + Tailwind + Shadcn/ui)
- O back-end está em `doame/apps/api/` (NestJS + Prisma + PostgreSQL)
- Tipos compartilhados estão em `doame/packages/shared/`
- Os dados do front ainda são **mockados** — a integração com a API não foi concluída
- O desenvolvedor tem mais domínio de **front-end** e está aprendendo arquitetura na prática
- Claude deve **ensinar enquanto constrói** — explicar o raciocínio das decisões

### O que não deve ser alterado sem análise prévia

- O schema do Prisma (`doame/apps/api/prisma/schema.prisma`) — qualquer mudança gera migration e pode quebrar o banco
- A estrutura de Route Groups do Next.js — `(main)`, `(marketing)`, `(restricted)` têm propósito deliberado
- O pacote `@doame/shared` — qualquer tipo alterado aqui afeta front e back simultaneamente
- As credenciais do seed (`admin@doame.com` / `doame2025`) — documentadas em `doame/doc/Acesso Admin.md`

### Como atualizar este Diário de Bordo

Ao final de cada sessão (ou quando solicitado), o agente deve:
1. Adicionar uma nova entrada na Seção 3 com a data fornecida pelo desenvolvedor
2. Atualizar a Seção 5 (Estado Atual) para refletir o que foi concluído
3. Atualizar a Seção 6 (Pendências) removendo o que foi feito e adicionando o que surgiu
4. **Nunca apagar sessões anteriores** da Seção 3
5. Salvar o arquivo em `doame/doc/DiarioDeBordo.md`

---

*Diário de Bordo gerado em 01/05/2026 — Sessão 6*
*Última atualização: 02/05/2026 — Sessão 7*
