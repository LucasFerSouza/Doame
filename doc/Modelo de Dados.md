# Modelo de Dados do Sistema Doame

> **Versão:** 3.0 — Atualizado em 10/05/2026  
> **Fonte de verdade:** `doame/apps/api/prisma/schema.prisma`

---

## 1. Visão Geral

O modelo de dados do Doame foi projetado com foco em:

- Clareza de domínio
- Integridade referencial
- Escalabilidade geográfica (prepared for PostGIS)
- Conformidade com LGPD (anonimização pós-coleta)
- Apoio a relatórios e auditoria institucional

Trata-se de um **modelo relacional** implementado em PostgreSQL via Prisma ORM.

---

## 2. Entidades Principais

### 2.1 Igreja

Representa a unidade local da IASD responsável pelas ações da ASA.

**Atributos:**
- `id` (PK, uuid)
- `nome`
- `endereco`
- `cidade`
- `estado`
- `latitude` (Float)
- `longitude` (Float)
- `raioMetropolitanoKm` (Float, default 20)
- `ativa` (boolean, default true)
- `criadaEm` (DateTime)

---

### 2.2 Administrador

Líder local da ASA com acesso ao painel administrativo.

**Atributos:**
- `id` (PK, uuid)
- `nome`
- `email` (unique)
- `senhaHash` (String — obrigatório, administradores fazem login)
- `papel` (ADMIN | SUPERADMIN, default ADMIN)
- `ativo` (boolean, default true)
- `criadoEm` (DateTime)
- `igrejaId` (FK → Igreja)

---

### 2.3 Voluntário

Pessoa cadastrada pelo administrador para realizar coletas. **Não possui login próprio** — é notificado via SMS/WhatsApp pelo administrador fora do sistema.

**Atributos:**
- `id` (PK, uuid)
- `nome`
- `email` (unique)
- `senhaHash` (String? — **nullable**, voluntários não fazem login)
- `telefone`
- `whatsapp` (String? — nullable, número pode ser o mesmo ou diferente)
- `endereco` (String — formato: `"Logradouro, N — Bairro, Cidade/UF"`)
- `latitude` (Float? — nullable, para matching geográfico futuro)
- `longitude` (Float? — nullable)
- `aprovado` (boolean, default false)
- `ativo` (boolean, default true)
- `disponivel` (boolean, default true)
- `criadoEm` (DateTime)
- `igrejaId` (FK → Igreja)

> **Decisão de design:** `senhaHash` foi tornado opcional em 10/05/2026. O fluxo do voluntário é: administrador cadastra os dados → sistema envia notificação externa (WhatsApp/SMS) → voluntário responde fora do Doame. Autenticação de voluntário é escopo pós-MVP.

---

### 2.4 Doação

Registro da intenção de doação feita por um doador via formulário público.

**Atributos:**
- `id` (PK, uuid)
- `nomeDoador` (String? — anulado no status ENTREGUE)
- `telefoneDoador` (String? — anulado no status ENTREGUE)
- `whatsappDoador` (String? — nullable)
- `enderecoDoador` (String? — formato `"Logradouro, N — Bairro, Cidade/UF"`, anulado no status ENTREGUE)
- `latitude` (Float? — **nullable**, formulário não captura geolocalização no MVP)
- `longitude` (Float? — **nullable**)
- `dataColeta` (DateTime)
- `horarioColeta` (String — ex: `"09:00"`)
- `status` (enum StatusDoacao, default PENDENTE)
- `anonimizacaoEm` (DateTime? — preenchido quando status → ENTREGUE)
- `criadaEm` (DateTime)
- `igrejaId` (FK → Igreja)
- `palavraChaveId` (FK? → PalavraChave — atribuída no momento da atribuição do voluntário)

> **Decisão de design:** `latitude` e `longitude` foram tornados opcionais em 10/05/2026. O formulário público usa apenas endereço textual; coordenadas serão capturadas via geocodificação (Nominatim) no pós-MVP.

---

### 2.5 ItemDoação

Detalhe dos itens físicos de uma doação (alimentos, agasalhos ou valor financeiro simbólico).

**Atributos:**
- `id` (PK, uuid)
- `categoria` (enum: ALIMENTO | AGASALHO | FINANCEIRA)
- `nome` (String — ex: "Arroz", "Cobertor", "Doação em dinheiro")
- `quantidade` (Int)
- `doacaoId` (FK → Doacao, onDelete: Cascade)

> Uma Doação pode ter múltiplos ItemDoação. O valor monetário é registrado aqui como `categoria: FINANCEIRA` com `quantidade` representando o valor em reais.

---

### 2.6 DoacaoFinanceira

Detalhamento do meio de pagamento para doações financeiras (pós-MVP).

**Atributos:**
- `id` (PK, uuid)
- `tipo` (enum: PIX | DINHEIRO)
- `valor` (Float)
- `doacaoId` (FK único → Doacao, onDelete: Cascade)

---

### 2.7 AtribuicaoVoluntarioDoacao

Registro da atribuição de um voluntário a uma doação, com histórico de resposta.

**Atributos:**
- `id` (PK, uuid)
- `status` (enum StatusAtribuicao: PENDENTE | ACEITA | RECUSADA | EXPIRADA, default PENDENTE)
- `raioVarreduraKm` (Float — raio usado no momento da sugestão)
- `distanciaMetros` (Float? — calculada com PostGIS no pós-MVP)
- `atribuidaEm` (DateTime)
- `respondidaEm` (DateTime? — quando voluntário aceita ou recusa)
- `doacaoId` (FK → Doacao)
- `voluntarioId` (FK → Voluntario)

---

### 2.8 PalavraChave

Termos bíblicos usados como palavra-passe de segurança na confirmação de coleta.

**Atributos:**
- `id` (PK, uuid)
- `termo` (String, unique — ex: "Bétel", "Siloé")
- `referenciaBiblica` (String — ex: "Gênesis 28:19")
- `significado` (String? — nullable)
- `ativa` (boolean, default true)
- `emUso` (boolean, default false — evita duplicação)

> Sorteada no momento da atribuição. Liberada para reuso quando a doação é concluída ou cancelada. O seed contém 20 termos bíblicos.

---

### 2.9 RegiaoGeografica

Delimitação territorial atendida por uma igreja (pós-MVP).

**Atributos:**
- `id` (PK, uuid)
- `nome`
- `igrejaId` (FK → Igreja)

---

## 3. Enums

| Enum | Valores |
|------|---------|
| `PapelAdmin` | `ADMIN`, `SUPERADMIN` |
| `CategoriaDoacao` | `ALIMENTO`, `AGASALHO`, `FINANCEIRA` |
| `StatusDoacao` | `PENDENTE`, `AGUARDANDO`, `CONFIRMADO`, `NEGADO`, `ATRIBUIDO`, `COLETADO`, `ENTREGUE` |
| `StatusAtribuicao` | `PENDENTE`, `ACEITA`, `RECUSADA`, `EXPIRADA` |
| `TipoPagamento` | `PIX`, `DINHEIRO` |

---

## 4. Relacionamentos

- `Igreja` 1:N `Administrador`
- `Igreja` 1:N `Voluntario`
- `Igreja` 1:N `Doacao`
- `Igreja` 1:N `RegiaoGeografica`
- `Doacao` 1:N `ItemDoacao` (cascade delete)
- `Doacao` 1:1 `DoacaoFinanceira` (cascade delete, quando aplicável)
- `Doacao` N:N `Voluntario` via `AtribuicaoVoluntarioDoacao`
- `Doacao` N:1 `PalavraChave` (nullable)

---

## 5. Máquina de Estados da Doação

```
PENDENTE → AGUARDANDO (voluntário atribuído)
         → NEGADO (admin recusa)

AGUARDANDO → CONFIRMADO (voluntário confirma)
           → NEGADO (voluntário recusa / admin cancela)

CONFIRMADO → ATRIBUIDO (voluntário a caminho)
           → NEGADO

ATRIBUIDO → COLETADO (voluntário coletou)
          → NEGADO

COLETADO → ENTREGUE (entrega confirmada — aciona anonimização LGPD)
```

As transições são controladas exclusivamente pelo endpoint `PATCH /api/doacoes/:id/status`.

---

## 6. Estratégia de Anonimização (LGPD)

Ao atingir status `ENTREGUE`, os seguintes campos são anulados automaticamente pelo backend:

- `nomeDoador` → `null`
- `telefoneDoador` → `null`
- `whatsappDoador` → `null`
- `enderecoDoador` → `null`
- `anonimizacaoEm` → timestamp da operação
- `palavraChaveId` → `null` (libera a palavra para reuso)

Dados geográficos (`latitude`, `longitude`) e data/horário são mantidos para fins estatísticos agregados.

---

## 7. Formato de Endereço

Endereços são armazenados como strings no formato padronizado:

```
"Logradouro, Número — Bairro, Município/UF"
```

Exemplo: `"Rua das Palmeiras, 101 — Vila Nova, Itapetininga/SP"`

O frontend usa o hook `useCep` para preencher automaticamente os campos via API ViaCEP (`GET /api/cep/:cep`). O backend serializa os campos estruturados do formulário para esse formato antes de persistir.

---

## 8. Índices Recomendados

- Índice geográfico em `latitude/longitude` (Doacao, Voluntario) — preparado para PostGIS
- Índice por `status` em Doacao
- Índice por `igrejaId` em todas as entidades
- Índice por `emUso` em PalavraChave

---

## 9. Considerações de Escalabilidade

- Modelo preparado para múltiplas igrejas e distritos
- `Voluntario.senhaHash` nullable permite migração futura para autenticação sem migração destrutiva
- `Doacao.latitude/longitude` nullable permite geocodificação progressiva no pós-MVP
- `AtribuicaoVoluntarioDoacao` com status próprio permite histórico completo de tentativas de atribuição
