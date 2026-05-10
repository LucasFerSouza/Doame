# Backlog do MVP – Plataforma Doame

## 1. Visão Geral do Backlog

Este backlog descreve o **MVP (Minimum Viable Product)** do Doame, organizado de forma incremental e orientada a valor, permitindo:

- Entrega rápida de uma versão utilizável pela ASA
- Validação operacional em municípios pequenos
- Evolução segura para cenários mais complexos

O backlog está estruturado por **épicos**, **histórias de usuário** e **critérios de aceitação**, seguindo boas práticas de Engenharia de Software e Product Management.

---

## 2. Épico 1 – Landing Page Institucional

### US-01 – Visualizar a landing page do Doame

**Como** visitante
**Quero** acessar uma landing page clara e institucional
**Para** entender o que é o Doame e como posso ajudar

**Critérios de aceitação:**
- Página responsiva
- Explicação clara do propósito do Doame
- Destaque da parceria com a ASA
- Botões "Faça sua Doação" e "Seja um Voluntário"

---

## 3. Épico 2 – Fluxo de Doação (Doador Anônimo)

### US-02 – Iniciar uma doação

**Como** doador
**Quero** iniciar uma doação sem criar conta
**Para** doar de forma rápida e simples

**Critérios de aceitação:**
- Acesso sem autenticação
- Formulário progressivo (One Question at a Time)

---

### US-03 – Informar dados da doação

**Como** doador
**Quero** informar o que desejo doar
**Para** que a ASA organize a coleta

**Critérios de aceitação:**
- Seleção de categoria
- Descrição e quantidade
- Opção de múltiplas doações

---

### US-04 – Informar data, horário e endereço

**Como** doador
**Quero** informar quando e onde a coleta ocorrerá
**Para** facilitar o trabalho do voluntário

**Critérios de aceitação:**
- Campos flexíveis de endereço
- Data e horário obrigatórios

---

### US-05 – Confirmar doação

**Como** doador
**Quero** confirmar minha doação
**Para** que ela seja registrada no sistema

**Critérios de aceitação:**
- Tela de revisão
- Confirmação explícita
- Tela final de agradecimento

---

## 4. Épico 3 – Cadastro e Gestão de Voluntários

### US-06 – Cadastro de voluntário

**Como** interessado
**Quero** me cadastrar como voluntário
**Para** ajudar nas coletas da ASA

**Critérios de aceitação:**
- Cadastro com e-mail e senha
- Coleta de endereço e telefone

---

### US-07 – Aprovação de voluntário

**Como** administrador
**Quero** aprovar ou reprovar voluntários
**Para** garantir a segurança institucional

**Critérios de aceitação:**
- Lista de voluntários pendentes
- Ação de aprovar/reprovar

---

## 5. Épico 4 – Painel Administrativo da ASA

### US-08 – Visualizar doações pendentes

**Como** administrador
**Quero** visualizar doações pendentes
**Para** organizar a logística de coleta

**Critérios de aceitação:**
- Listagem de doações
- Filtro por status

---

### US-09 – Visualizar mapa de doações

**Como** administrador
**Quero** ver doações no mapa
**Para** facilitar a distribuição de voluntários

**Critérios de aceitação:**
- Mapa interativo
- Marcação das doações

---\ n
### US-10 – Visualizar voluntários no mapa

**Como** administrador
**Quero** visualizar voluntários disponíveis
**Para** associá-los às coletas

**Critérios de aceitação:**
- Exibição por proximidade

---

### US-11 – Atribuir voluntário a doação

**Como** administrador
**Quero** atribuir um voluntário a uma doação
**Para** iniciar a coleta

**Critérios de aceitação:**
- Sugestão automática por proximidade
- Opção de atribuição manual

---

### US-12 – Atualizar status da doação

**Como** administrador
**Quero** atualizar o status da doação
**Para** refletir o andamento real

**Critérios de aceitação:**
- Transições controladas
- Liberação do voluntário após conclusão

---

## 6. Épico 5 – Comunicação e Notificações

### US-13 – Notificar voluntário sobre coleta

**Como** sistema
**Quero** notificar o voluntário
**Para** informá-lo sobre a coleta

**Critérios de aceitação:**
- Mensagem automática
- Conteúdo padronizado

---

### US-14 – Notificar doador

**Como** sistema
**Quero** notificar o doador
**Para** confirmar a coleta

**Critérios de aceitação:**
- Mensagem via WhatsApp
- Confirmação explícita

---

## 7. Épico 6 – Relatórios e Governança

### US-15 – Visualizar relatórios básicos

**Como** administrador
**Quero** visualizar relatórios
**Para** prestação de contas

**Critérios de aceitação:**
- Quantidade de doações
- Tipos de doação

---

## 8. Épico 7 – Segurança, LGPD e Observabilidade

### US-16 – Anonimizar dados do doador

**Como** sistema
**Quero** anonimizar dados após a coleta
**Para** cumprir LGPD

**Critérios de aceitação:**
- Dados pessoais removidos

---

### US-17 – Registrar erros do sistema

**Como** sistema
**Quero** registrar erros
**Para** gerar relatórios ao superadmin

**Critérios de aceitação:**
- Logs estruturados
- Consolidação periódica

---

## 9. Ordem de Implementação Sugerida

1. Landing Page
2. Fluxo de Doação
3. Cadastro de Voluntários
4. Painel Administrativo
5. Comunicação
6. Relatórios
7. LGPD e Observabilidade

---

## 10. Conclusão

Este backlog define o **escopo mínimo completo** para que o Doame opere de forma real, segura e alinhada à missão da ASA, permitindo validação rápida em campo e evolução contínua do produto.

