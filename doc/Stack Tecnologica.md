# Stack Tecnológica do Doame

## 1. Visão Geral

A stack tecnológica do **Doame** foi definida com foco em:

- Robustez institucional
- Baixo custo operacional
- Facilidade de manutenção a longo prazo
- Escalabilidade geográfica
- Aderência às boas práticas de Engenharia de Software
- Compatibilidade com equipes pequenas ou médias

O Doame é uma **plataforma web institucional**, orientada a processos, com forte preocupação com integridade de dados, rastreabilidade administrativa e conformidade com LGPD.

---

## 2. Arquitetura Geral

O sistema segue uma arquitetura **Web em Camadas**, com separação clara de responsabilidades:

- Frontend Web
- Backend API REST
- Banco de Dados Relacional
- Serviços de Mensageria Externa (WhatsApp)
- Camada de Observabilidade e Logs

Essa arquitetura permite evolução futura para microsserviços, caso necessário, sem reescrita completa do sistema.

---

## 3. Frontend

### 3.1 Tecnologia Principal

- **Framework:** Next.js (React)
- **Linguagem:** TypeScript

### 3.2 Justificativa

- Excelente SEO para páginas públicas (doadores)
- Suporte nativo a SSR e SSG
- Ótima performance percebida
- Forte ecossistema
- Alta maturidade para aplicações institucionais

### 3.3 UI e Estilo

- **CSS:** TailwindCSS
- **Componentização:** React Components Shadcn/ui
- **Design System:** Simples, institucional e acessível

### 3.4 Autenticação no Frontend

- JWT armazenado de forma segura
- Proteção de rotas por perfil:
  - Voluntário
  - Administrador Local
  - Superadministrador

---

## 4. Backend

### 4.1 Tecnologia Principal

- **Plataforma:** Node.js
- **Framework:** NestJS
- **Linguagem:** TypeScript

### 4.2 Justificativa

- Arquitetura modular e opinada
- Suporte nativo a boas práticas (DDD, SOLID)
- Facilidade para validação, autenticação e logs
- Ideal para equipes pequenas

### 4.3 Padrões Utilizados

- API RESTful
- Controllers, Services, Repositories
- DTOs para validação
- Guards para controle de acesso

---

## 5. Banco de Dados

### 5.1 Banco Principal

- **PostgreSQL**

### 5.2 Justificativa

- Banco relacional maduro
- Excelente suporte a dados geográficos
- Forte integridade referencial
- Ideal para relatórios administrativos

### 5.3 ORM

- **Prisma ORM**

Benefícios:

- Tipagem forte
- Migrações controladas
- Produtividade elevada

---

## 6. Geolocalização

- Uso de coordenadas (latitude/longitude)
- Índices geoespaciais no PostgreSQL
- Cálculo de proximidade para sugestão de voluntários

Preparado para escalar para bairros, distritos e regiões.

---

## 7. Comunicação Externa

### 7.1 WhatsApp

- Integração via **WhatsApp Business API** ou provedor homologado

Usos:

- Confirmação de coleta
- Aviso de deslocamento do voluntário
- Comunicação com doador

Nenhuma conversa é armazenada integralmente no sistema.

---

## 8. Autenticação e Segurança

- JWT (JSON Web Token)
- Senhas com hash (bcrypt ou argon2)
- RBAC (Role Based Access Control)
- HTTPS obrigatório

Conformidade com LGPD por anonimização de dados sensíveis.

---

## 9. Observabilidade e Logs

### 9.1 Logs

- Logs estruturados no backend
- Classificação por tipo de erro

### 9.2 Relatórios de Erro

- Consolidação trimestral
- Envio de relatórios ao Superadministrador

---

## 10. Infraestrutura e Deploy

### 10.1 Hospedagem

- VPS ou Cloud (AWS, Azure, GCP ou similar)

### 10.2 Containers

- Docker
- Docker Compose para ambientes iniciais

### 10.3 CI/CD (Futuro)

- GitHub Actions
- Deploy automatizado

---

## 11. Escopo Intencionalmente Fora da Stack

O Doame **não** inclui:

- Aplicativo mobile nativo
- Gateway financeiro próprio
- Armazenamento de dados bancários
- Gestão de tesouraria
- Processos internos da ASA

---

## 12. Considerações Finais

A stack definida é:

- Moderna
- Sustentável
- Acessível financeiramente
- Aderente ao contexto institucional da ASA

Ela permite que o Doame cumpra seu papel central: **facilitar a conexão entre doadores e a ASA, sem interferir nos processos internos da instituição**.
