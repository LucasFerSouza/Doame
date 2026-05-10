# Modelo de Dados do Sistema Doame

> **Versão 2.0** — Atualizado para incluir suporte a palavra-passe bíblica, sistema de geolocalização e varredura de voluntários por raio.

---

## 1. Visão Geral

O modelo de dados do Doame foi projetado com foco em:

- Clareza de domínio
- Integridade referencial
- Escalabilidade geográfica
- Conformidade com LGPD (anonimização pós-coleta)
- Apoio a relatórios e auditoria institucional
- Segurança operacional via palavra-passe bíblica

Trata-se de um **modelo relacional**, adequado ao contexto transacional do sistema, com extensões para dados geográficos via **PostGIS**.

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
- raio_metropolitano_km — raio máximo de busca de voluntários para o município (configurável por igreja)
- ativa (boolean)

> **Novidade v2.0:** o campo `raio_metropolitano_km` define o limite máximo da varredura geográfica por voluntários. Quando nenhum voluntário é encontrado dentro desse raio, a busca é encerrada e o administrador é notificado.

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
- poligono_geografico (geometry — PostGIS)
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
- whatsapp (nullable) — número WhatsApp, se disponível
- endereco
- latitude
- longitude
- aprovado (boolean)
- ativo (boolean)
- disponivel (boolean) — indica se o voluntário está disponível para novas atribuições no momento
- igreja_id (FK)

> **Novidade v2.0:** campo `whatsapp` separado de `telefone`, permitindo que o sistema envie SMS ao número de telefone e mensagem WhatsApp ao número específico quando forem diferentes. O campo `disponivel` permite ao voluntário sinalizar temporariamente que não pode receber coletas, sem precisar ser desativado.

---

### 2.6 Doação

Registro da intenção de doação feita por um doador.

**Atributos:**
- id (PK)
- nome_doador
- telefone_doador
- whatsapp_doador (nullable)
- endereco_doador
- latitude
- longitude
- categoria (ALIMENTO | AGASALHO | FINANCEIRA)
- descricao
- quantidade
- data_coleta
- horario_coleta
- status (EM_ESPERA | EM_ATRIBUICAO | EM_TRANSITO | CONCLUIDA | SEM_VOLUNTARIO)
- palavra_chave_id (FK, nullable) — palavra-passe atribuída no momento da confirmação da coleta
- igreja_id (FK)
- criada_em
- anonimizacao_em (nullable)

> **Novidade v2.0:** novos campos `whatsapp_doador` e `palavra_chave_id`. Dois novos status foram adicionados: `EM_ATRIBUICAO` (varredura em andamento, voluntário ainda não confirmou) e `SEM_VOLUNTARIO` (varredura encerrada sem resultado, administrador precisa intervir).

---

### 2.7 Associação Voluntário–Doação

Entidade que representa cada tentativa de atribuição de um voluntário a uma doação. Mantém histórico de todas as tentativas, inclusive recusas.

**Atributos:**
- id (PK)
- doacao_id (FK)
- voluntario_id (FK)
- status (PENDENTE | ACEITA | RECUSADA | EXPIRADA)
- raio_varredura_km — em qual raio de busca esse voluntário foi encontrado
- distancia_metros — distância exata calculada entre voluntário e doação
- atribuida_em
- respondida_em (nullable)

> **Novidade v2.0:** o campo `status` substituiu o booleano `aceita`, permitindo representar estados intermediários. O histórico de tentativas é preservado para auditoria — é possível saber quantos voluntários recusaram uma coleta e em qual ordem foram acionados.

---

### 2.8 Doação Financeira

Detalhamento específico para doações financeiras.

**Atributos:**
- id (PK)
- doacao_id (FK)
- tipo (PIX | DINHEIRO)
- valor

---

### 2.9 PalavraChave *(nova entidade)*

Dicionário de termos bíblicos utilizados como palavra-passe nas coletas. Populado manualmente ou via seed antes da operação do sistema.

**Atributos:**
- id (PK)
- termo — a palavra ou expressão bíblica (ex: "Bétel", "Siloé", "Maranata", "Ebenézer")
- referencia_biblica — referência de origem (ex: "Gênesis 28:19", "João 9:7")
- significado (nullable) — breve explicação do termo, para uso interno
- ativa (boolean) — permite desativar termos sem removê-los do banco
- em_uso (boolean) — marcada como verdadeira enquanto vinculada a uma doação ativa, evitando reuso simultâneo

> **Regra de negócio:** uma `PalavraChave` só pode ser sorteada se `ativa = true` e `em_uso = false`. Ao concluir ou cancelar uma coleta, o campo `em_uso` retorna a `false`, liberando o termo para futuras coletas.

---

## 3. Relacionamentos

- Igreja 1:N Administrador
- Igreja 1:N Voluntário
- Igreja 1:N Doação
- Igreja 1:N Região Geográfica
- Doação 1:1 Doação Financeira (quando aplicável)
- Doação 1:N Associação Voluntário–Doação (histórico de tentativas)
- Voluntário 1:N Associação Voluntário–Doação
- Doação N:1 PalavraChave (uma doação usa uma palavra; uma palavra pode ser reusada em coletas futuras após liberação)

---

## 4. Estados e Regras de Negócio no Modelo

- Um voluntário só pode ter **uma associação ativa** (status PENDENTE ou ACEITA) por vez
- Uma doação só pode ter **um voluntário em trânsito** simultaneamente
- Dados do doador são anonimizados após status = CONCLUIDA
- Voluntários inativos, não aprovados ou com `disponivel = false` não recebem associações
- A `PalavraChave` é atribuída à doação **somente** quando um voluntário confirma a coleta (status ACEITA)
- A `PalavraChave` é liberada (`em_uso = false`) quando a doação muda para CONCLUIDA ou é cancelada
- A palavra-passe é enviada **separadamente** ao voluntário e ao doador — nunca no mesmo canal ou mensagem
- O status `SEM_VOLUNTARIO` é atribuído quando a varredura ultrapassa o `raio_metropolitano_km` da Igreja sem encontrar voluntário disponível

---

## 5. Fluxo de Varredura Geográfica

A busca por voluntários segue raios progressivos a partir das coordenadas da doação:

1. Raio de 1 km
2. Raio de 5 km
3. Raio de 10 km
4. Raio metropolitano (`raio_metropolitano_km` da Igreja)

Em cada raio, o sistema consulta o banco via PostGIS e retorna voluntários aprovados, ativos e disponíveis, ordenados por distância. A distância exata é registrada na entidade `Associação Voluntário–Doação` para auditoria.

Se apenas um voluntário é encontrado num raio, a tela de atribuição é aberta automaticamente para o administrador confirmar. Se mais de um é encontrado, o sistema atribui automaticamente ao mais próximo. Se o raio metropolitano é atingido sem resultado, o status da doação muda para `SEM_VOLUNTARIO` e o administrador é notificado.

---

## 6. Estratégia de Anonimização

Após a conclusão da coleta:

- nome_doador → NULL
- telefone_doador → NULL
- whatsapp_doador → NULL
- endereco_doador → NULL
- palavra_chave_id → NULL (desvinculada e liberada)

As coordenadas geográficas (latitude/longitude) podem ser mantidas de forma agregada para estatísticas regionais.

---

## 7. Índices Recomendados

- Índice geoespacial em latitude/longitude — Doação e Voluntário (PostGIS)
- Índice por status da doação
- Índice por igreja_id
- Índice por `em_uso` e `ativa` na tabela PalavraChave (sorteio eficiente)
- Índice por `disponivel` e `aprovado` na tabela Voluntário (varredura eficiente)

---

## 8. Considerações de Escalabilidade

- Modelo preparado para múltiplas igrejas e distritos com raios metropolitanos distintos
- Separação clara entre dados operacionais e institucionais
- Histórico completo de tentativas de atribuição para auditoria
- Facilidade de extensão para novas categorias de doação
- Dicionário bíblico expansível sem impacto nas demais entidades

---

## 9. Conclusão

O modelo de dados do Doame reflete fielmente o domínio do problema, equilibra simplicidade e robustez, e garante sustentação técnica para a evolução da plataforma sem comprometer a integridade institucional ou a privacidade dos usuários. A inclusão da palavra-passe bíblica reforça a identidade institucional da ASA e adiciona uma camada de segurança operacional ao processo de coleta.
