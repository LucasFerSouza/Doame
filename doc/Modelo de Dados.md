# Modelo de Dados do Sistema Doame

## 1. Visão Geral

O modelo de dados do Doame foi projetado com foco em:

- Clareza de domínio
- Integridade referencial
- Escalabilidade geográfica
- Conformidade com LGPD (anonimização pós-coleta)
- Apoio a relatórios e auditoria institucional

Trata-se de um **modelo relacional**, adequado ao contexto transacional do sistema, com extensões para dados geográficos.

---

## 2. Entidades Principais

### 2.1 Igreja

Representa a unidade local da IASD responsável pelas ações da ASA.

**Atributos:**
- id (PK)
- nome
- endereco
- cidade
- estado
- latitude
- longitude
- ativa (boolean)

---

### 2.2 Distrito

Agrupamento geográfico e administrativo de igrejas.

**Atributos:**
- id (PK)
- nome
- descricao
- igreja_id (FK)

---

### 2.3 Região Geográfica

Delimitação territorial atendida por uma igreja/distrito.

**Atributos:**
- id (PK)
- nome
- poligono_geografico (geometry)
- igreja_id (FK)

---

### 2.4 Administrador

Líder local da ASA com permissão administrativa.

**Atributos:**
- id (PK)
- nome
- email
- senha_hash
- papel (ADMIN | SUPERADMIN)
- igreja_id (FK)
- ativo (boolean)

---

### 2.5 Voluntário

Pessoa cadastrada e aprovada para realizar coletas.

**Atributos:**
- id (PK)
- nome
- email
- senha_hash
- telefone
- endereco
- latitude
- longitude
- aprovado (boolean)
- ativo (boolean)
- igreja_id (FK)

---

### 2.6 Doação

Registro da intenção de doação feita por um doador.

**Atributos:**
- id (PK)
- nome_doador
- telefone_doador
- endereco_doador
- latitude
- longitude
- categoria (ALIMENTO | AGASALHO | FINANCEIRA)
- descricao
- quantidade
- data_coleta
- horario_coleta
- status (EM_ESPERA | EM_TRANSITO | CONCLUIDA)
- igreja_id (FK)
- criada_em
- anonimizacao_em (nullable)

---

### 2.7 Associação Voluntário–Doação

Entidade que representa a atribuição de um voluntário a uma doação.

**Atributos:**
- id (PK)
- doacao_id (FK)
- voluntario_id (FK)
- aceita (boolean)
- atribuida_em

---

### 2.8 Doação Financeira

Detalhamento específico para doações financeiras.

**Atributos:**
- id (PK)
- doacao_id (FK)
- tipo (PIX | DINHEIRO)
- valor

---

## 3. Relacionamentos

- Igreja 1:N Administrador
- Igreja 1:N Voluntário
- Igreja 1:N Doação
- Igreja 1:N Região Geográfica
- Doação 1:1 Doação Financeira (quando aplicável)
- Doação N:1 Associação Voluntário–Doação
- Voluntário 1:N Associação Voluntário–Doação

---

## 4. Estados e Regras de Negócio no Modelo

- Um voluntário só pode ter **uma associação ativa** por vez
- Uma doação só pode ter **um voluntário em trânsito**
- Dados do doador são anonimizados após status = CONCLUIDA
- Voluntários inativos ou não aprovados não recebem associações

---

## 5. Estratégia de Anonimização

Após a conclusão da coleta:

- nome_doador → NULL ou valor mascarado
- telefone_doador → NULL
- endereco_doador → NULL

Os dados geográficos podem ser mantidos de forma agregada para estatísticas.

---

## 6. Índices Recomendados

- Índice geográfico em latitude/longitude (Doação, Voluntário)
- Índice por status da doação
- Índice por igreja_id

---

## 7. Considerações de Escalabilidade

- Modelo preparado para múltiplas igrejas e distritos
- Separação clara entre dados operacionais e institucionais
- Facilidade de extensão para novas categorias de doação

---

## 8. Conclusão

O modelo de dados do Doame reflete fielmente o domínio do problema, equilibra simplicidade e robustez, e garante sustentação técnica para a evolução da plataforma sem comprometer a integridade institucional ou a privacidade dos usuários.

