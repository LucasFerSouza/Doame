🚀 Checklist de Desenvolvimento - Projeto Doação
🎨 Front-End (Interface & UX)
Fluxo de Doação
[ ] Novo Passo: Agendamento

[ ] Criar input de data (type="date") com bloqueio de datas passadas.

[ ] Criar seletor de período (Manhã, Tarde, Noite).

[ ] Novo Passo: Resumo Final

[ ] Exibir cards com: Nome, Itens no Carrinho, Endereço, Contato e Data da Coleta.

[ ] Edição de Dados

[ ] Implementar botões "Editar" em cada seção do resumo que retornam o usuário para o passo específico.

[ ] Responsividade & UI

[ ] Refatorar a Landing Page com Media Queries (Mobile-First).

[ ] Ajustar a Tela de Login para telas pequenas (uso de flex-col e larguras dinâmicas).

[ ] Melhorar o layout da página "Sobre" (inserir missão/visão da ASA e imagens).

Painéis (Dashboards)
[ ] Interface do Voluntário

[ ] Lista de coletas pendentes.

[ ] Relatório histórico: [Doador | Data | Status].

[ ] Dashboard do Administrador

[ ] Integração com API de Mapas (Google Maps ou Leaflet) para exibir pins de doações.

[ ] Tabela de doações com filtros dinâmicos (Ativas, Realizadas, Canceladas).

⚙️ Back-End (A "Mágica" por trás)
Infraestrutura & Segurança
[ ] Setup Inicial: Configurar Node.js/Next.js API Routes ou um servidor dedicado.

[ ] Autenticação (Auth): Implementar login via NextAuth.js ou JWT (Diferenciando Voluntário de Admin).

[ ] Banco de Dados: Estruturar tabelas no PostgreSQL (Doadores, Doações, Itens, Endereços, Usuários).

Regras de Negócio (API)
[ ] CRUD de Doações: Endpoint para salvar o formulário completo do front-end.

[ ] Lógica de Status: Criar o fluxo de alteração de status (Pendente -> Em Rota -> Finalizada).

[ ] Integração de Endereço: Criar rota que consome a API do ViaCEP para autocompletar o endereço no Passo 4.

[ ] Relatórios: Queries para o dashboard do admin (contagem de itens e doações por período).

🧪 Testes & Deploy
[ ] Testar persistência do "Carrinho" (Context API ou LocalStorage).

[ ] Validar se as Media Queries não quebram o Card de doação.

[ ] Testar o envio real dos dados para o banco de dados.