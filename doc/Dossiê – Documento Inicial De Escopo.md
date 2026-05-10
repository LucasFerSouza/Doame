# Dossiê do Projeto Doame

## 1. Visão Geral

O **Doame** é uma plataforma web institucional criada para **facilitar, organizar e tornar mais eficiente o processo de doações solidárias** realizadas pela **Ação Solidária Adventista (ASA)**, departamento oficial da Igreja Adventista do Sétimo Dia (IASD). Trata-se de uma solução digital de apoio operacional, concebida para conectar **doadores**, **voluntários** e **lideranças locais da ASA**, respeitando integralmente os procedimentos, protocolos e diretrizes já consolidados pela instituição.

O Doame não substitui os processos institucionais da ASA, mas atua como um **meio tecnológico de intermediação**, reduzindo fricções de comunicação, melhorando a logística de coletas e oferecendo maior visibilidade e controle às lideranças locais.

---

## 2. O que é o Doame

O Doame é uma **plataforma web responsiva**, acessível diretamente pelo navegador, sem necessidade de instalação de aplicativos, projetada para permitir que qualquer pessoa possa:

- Informar uma intenção de doação (bens ou recursos financeiros)
- Disponibilizar dados básicos para viabilizar a coleta
- Conectar-se, de forma segura e controlada, à estrutura operacional da ASA

Simultaneamente, o Doame fornece à ASA um **painel administrativo** que centraliza informações sobre doações pendentes, voluntários disponíveis e regiões atendidas.

---

## 3. Por que o Doame foi criado

O Doame foi concebido para responder a desafios reais enfrentados pela ASA, tais como:

- Dificuldade de centralizar pedidos de doação recebidos por múltiplos canais (WhatsApp, telefone, presencialmente)
- Falta de visibilidade geográfica das doações
- Sobrecarga manual na designação de voluntários
- Ausência de dados consolidados para relatórios e prestação de contas

Ao digitalizar o ponto inicial do processo (o contato entre doador e ASA), o Doame reduz ruídos, aumenta a eficiência logística e fortalece a atuação social da instituição.

---

## 4. Para que o Doame serve

O Doame serve para:

- Facilitar o contato entre doadores e a ASA
- Registrar intenções de doação de forma estruturada
- Apoiar a logística de coleta por meio de voluntários
- Oferecer controle operacional às lideranças locais
- Gerar dados estatísticos anonimizados para relatórios institucionais

---

## 5. O que o Doame faz

De forma objetiva, o Doame:

- Apresenta uma **landing page institucional** explicando a missão, funcionamento e impacto da ASA
- Coleta dados de doação por meio de um formulário progressivo (One Question at a Time)
- Direciona doações para a região e distrito eclesiástico corretos
- Permite que administradores visualizem doações em mapa e lista
- Sugere voluntários com base em proximidade geográfica
- Facilita a comunicação entre ASA, voluntários e doadores via WhatsApp
- Registra estados da doação (Em Espera, Em Trânsito, Concluída)
- Anonimiza dados pessoais após a conclusão da coleta

---

## 6. O que o Doame não faz

É igualmente importante delimitar o escopo. O Doame **não**:

- Realiza pagamentos online no MVP
- Gerencia conflitos operacionais ou disciplinares
- Substitui protocolos internos da ASA
- Valida juridicamente doações
- Controla o uso final dos recursos arrecadados
- Atua como plataforma genérica para outras instituições

Toda a execução física da coleta, transporte, armazenamento e distribuição permanece sob responsabilidade da ASA.

---

## 7. Como o Doame funciona

### 7.1 Fluxo do Doador

1. O doador acessa a landing page do Doame
2. Escolhe entre "Fazer uma Doação" ou "Ser Voluntário"
3. Preenche um formulário progressivo com:
   - Nome
   - Categoria da doação
   - Descrição e quantidade
   - Data e horário para coleta
   - Endereço
   - Telefone
4. Confirma a doação
5. Recebe mensagens de confirmação via WhatsApp

Após a coleta, seus dados são anonimizados.

### 7.2 Fluxo do Voluntário

- Realiza cadastro com login e senha
- Aguarda aprovação do administrador local
- Recebe solicitações de coleta
- Aceita ou recusa conforme disponibilidade
- Entrega a doação na sede local da ASA

### 7.3 Fluxo do Administrador

- Visualiza doações pendentes no mapa
- Gerencia voluntários
- Aprova voluntários
- Atribui voluntários às coletas
- Marca coletas como concluídas
- Gera relatórios

---

## 8. Quem o Doame vai ajudar

O Doame beneficia diretamente:

- Famílias e pessoas em situação de vulnerabilidade
- A ASA, ao otimizar seus processos
- Voluntários, ao organizar melhor sua atuação
- Doadores, ao facilitar o ato de doar

---

## 9. Quem utilizará o Doame

- Doadores (sem cadastro)
- Voluntários (com cadastro e aprovação)
- Administradores locais da ASA
- Superadministradores institucionais

---

## 10. Cenários de uso do Doame

- Doações pontuais de alimentos
- Coletas de agasalhos
- Doações financeiras presenciais ou via Pix
- Apoio contínuo a ações assistenciais

---

## 11. Boas Práticas de Engenharia de Software

O Doame seguirá princípios como:

- Separação clara de responsabilidades
- Arquitetura escalável desde o MVP
- Segurança e privacidade por padrão (Privacy by Design)
- Observabilidade e rastreabilidade de erros
- Código limpo, documentado e testável

---

## 12. Requisitos do Sistema

### 12.1 Requisitos Funcionais

- RF01: Registrar intenções de doação
- RF02: Registrar voluntários
- RF03: Aprovar voluntários
- RF04: Atribuir voluntários a coletas
- RF05: Alterar estado das doações
- RF06: Enviar notificações via WhatsApp
- RF07: Gerar relatórios administrativos

### 12.2 Requisitos Não Funcionais

- RNF01: Alta disponibilidade
- RNF02: Usabilidade elevada
- RNF03: Conformidade com LGPD
- RNF04: Segurança de autenticação

### 12.3 Requisitos Relacionais

- RR01: Associação entre doações e regiões
- RR02: Associação entre voluntários e coletas

### 12.4 Requisitos Não Relacionais Sistêmicos

- RNS01: Escalabilidade horizontal
- RNS02: Modularidade
- RNS03: Observabilidade
- RNS04: Manutenibilidade

---

## 13. Considerações Finais

O Doame é uma plataforma de apoio institucional, construída para fortalecer o impacto social da ASA por meio da tecnologia, respeitando seus valores, protocolos e estrutura organizacional. Trata-se de um projeto com escopo bem definido, arquitetura preparada para crescimento e foco absoluto na eficiência operacional e na dignidade do ato de doar.
