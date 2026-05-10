# Arquitetura do Sistema Doame

## 1. Visão Geral da Arquitetura

A arquitetura do Doame foi concebida para atender a três princípios centrais:

1. **Simplicidade operacional no MVP**, evitando complexidade desnecessária
2. **Escalabilidade horizontal**, preparada para crescimento rápido em número de cidades, igrejas e doações
3. **Separação clara de responsabilidades**, alinhada às boas práticas da Engenharia de Software

O Doame adota uma **arquitetura em camadas**, com forte orientação a serviços, podendo evoluir naturalmente para uma arquitetura mais distribuída conforme a maturidade do produto.

---

## 2. Visão Macro (Logical View)

O sistema é composto pelos seguintes grandes blocos:

- **Frontend Web**
- **Backend de Aplicação (API)**
- **Serviços de Integração Externa**
- **Banco de Dados**
- **Serviços de Observabilidade e Suporte**

```
[ Navegador ]
      |
      v
[ Frontend Web ]
      |
      v
[ API Doame ]
      |
      +--> [ Banco de Dados ]
      +--> [ Serviço WhatsApp ]
      +--> [ Serviço de Autenticação ]
      +--> [ Serviço de Logs e Erros ]
```

---

## 3. Arquitetura de Frontend

### 3.1 Responsabilidades

O Frontend é responsável por:

- Exibição da landing page institucional
- Execução do formulário "One Question at a Time"
- Experiência de uso fluida para doadores
- Interfaces autenticadas para voluntários e administradores
- Consumo da API do Doame

### 3.2 Características Técnicas

- Aplicação **Web Responsiva**
- Sem dependência de instalação
- Separação clara entre áreas públicas e áreas autenticadas
- Tratamento mínimo de lógica de negócio (regra sempre no backend)

### 3.3 Camadas Internas do Frontend

- Camada de Apresentação (UI)
- Camada de Estado (fluxo do formulário, autenticação)
- Camada de Serviços (integração com API)

---

## 4. Arquitetura de Backend

### 4.1 API Central

O backend é o núcleo do Doame e expõe uma **API RESTful** responsável por toda a lógica de negócio.

#### Principais responsabilidades:

- Gerenciamento de doações
- Gerenciamento de voluntários
- Gerenciamento de administradores e superadmin
- Regras de estados da doação
- Sugestão automática de voluntários
- Controle de permissões
- Anonimização de dados

### 4.2 Organização Interna (Camadas)

- **Controller**: Recebe requisições HTTP
- **Service**: Contém regras de negócio
- **Domain / Entity**: Modelos do sistema
- **Repository**: Acesso a dados
- **Integration**: Comunicação com serviços externos

Essa separação garante **manutenibilidade e testabilidade**.

---

## 5. Modelo de Domínio (Visão Conceitual)

Entidades principais:

- Doador (temporário)
- Doação
- Voluntário
- Administrador
- Igreja
- Distrito
- Região Geográfica
- Associação Voluntário–Doação

As relações são explicitamente controladas para permitir rastreabilidade operacional sem violar LGPD.

---

## 6. Banco de Dados

### 6.1 Estratégia

- Banco de dados relacional como fonte de verdade
- Uso de geolocalização para cálculos de proximidade
- Anonimização lógica após conclusão da coleta

### 6.2 Características

- Integridade referencial
- Histórico operacional sem dados pessoais
- Preparado para consultas analíticas

---

## 7. Serviços de Integração

### 7.1 WhatsApp

- Envio de mensagens automáticas:
  - Confirmação de coleta
  - Aviso de deslocamento do voluntário
  - Confirmação final

A lógica de disparo reside exclusivamente no backend.

### 7.2 Autenticação

- Login por e-mail e senha (voluntários e admins)
- Controle de papéis (roles)

---

## 8. Estados da Doação (State Machine)

Estados possíveis:

- Em Espera
- Em Trânsito
- Concluída

As transições são controladas exclusivamente pela API, garantindo consistência.

---

## 9. Observabilidade e Confiabilidade

### 9.1 Logs

- Registro de erros e eventos críticos
- Consolidação periódica para superadmin

### 9.2 Tolerância a Falhas

- Falhas externas não interrompem o fluxo principal
- Erros são registrados e tratados posteriormente

---

## 10. Segurança

- HTTPS obrigatório
- Validação de dados no backend
- Controle de acesso por perfil
- Princípio do menor privilégio

---

## 11. Evolução da Arquitetura

A arquitetura atual permite evoluções como:

- Separação em microserviços
- Inclusão de filas (mensageria)
- Cache distribuído
- Dashboards analíticos avançados

---

## 12. Conclusão

A arquitetura do Doame foi desenhada para ser **robusta, ética, escalável e alinhada à missão institucional da ASA**, equilibrando responsabilidade social, eficiência operacional e boas práticas de Engenharia de Software.

