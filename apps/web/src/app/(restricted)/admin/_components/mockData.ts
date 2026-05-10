// ─────────────────────────────────────────────────────────────────────────────
// mockData.ts
//
// Todos os dados estão centralizados aqui.
// Quando o backend NestJS estiver pronto, basta substituir cada array
// por uma chamada fetch/axios ao endpoint correspondente.
//
// Exemplo de substituição futura:
//   ANTES → import { doacoesMock } from "./_components/mockData"
//   DEPOIS → const doacoes = await api.get("/doacoes")
// ─────────────────────────────────────────────────────────────────────────────

export type StatusDoacao =
  | "Pendente"
  | "Aguardando"
  | "Confirmado"
  | "Negado"
  | "Atribuido"
  | "Coletado"
  | "Entregue";

export type TipoItem = "alimento" | "agasalho" | "dinheiro";

export interface ItemDoacao {
  tipo: TipoItem;
  nome: string;
  quantidade: number;
}

export interface Doacao {
  id: string;
  nomeDoador: string;
  telefone: string;
  whatsapp: boolean;
  itens: ItemDoacao[];
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    estado: string;
    cep: string;
  };
  dataColeta: string;   // formato: "DD/MM/AAAA"
  horaColeta: string;   // formato: "HH:MM"
  status: StatusDoacao;
  voluntarioId?: string;
  criadaEm: string;
}

export interface Voluntario {
  id: string;
  nome: string;
  telefone: string;
  whatsapp: boolean;
  email: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    municipio: string;
    estado: string;
    cep: string;
  };
  aprovado: boolean;
  ativo: boolean;
  disponivel: boolean;
  totalColetas: number;
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

export const voluntariosMock: Voluntario[] = [
  {
    id: "v1",
    nome: "Carlos Mendonça",
    telefone: "(15) 99812-3344",
    whatsapp: true,
    email: "carlos.mendonca@email.com",
    endereco: {
      logradouro: "Rua das Acácias",
      numero: "42",
      bairro: "Vila Nova",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-000",
    },
    aprovado: true,
    ativo: true,
    disponivel: true,
    totalColetas: 14,
  },
  {
    id: "v2",
    nome: "Fernanda Rocha",
    telefone: "(15) 98877-5566",
    whatsapp: true,
    email: "fernanda.rocha@email.com",
    endereco: {
      logradouro: "Av. Brasil",
      numero: "310",
      bairro: "Centro",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-100",
    },
    aprovado: true,
    ativo: true,
    disponivel: true,
    totalColetas: 8,
  },
  {
    id: "v3",
    nome: "João Batista Lima",
    telefone: "(15) 97766-4455",
    whatsapp: false,
    email: "joao.lima@email.com",
    endereco: {
      logradouro: "Rua Sete de Setembro",
      numero: "88",
      bairro: "Jardim Paulista",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18201-000",
    },
    aprovado: true,
    ativo: true,
    disponivel: false,
    totalColetas: 22,
  },
  {
    id: "v4",
    nome: "Maria Aparecida Santos",
    telefone: "(15) 99100-2233",
    whatsapp: true,
    email: "maria.santos@email.com",
    endereco: {
      logradouro: "Rua das Flores",
      numero: "15",
      bairro: "Vila Nova",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-050",
    },
    aprovado: true,
    ativo: true,
    disponivel: true,
    totalColetas: 5,
  },
  {
    id: "v5",
    nome: "Rafael Oliveira",
    telefone: "(15) 98855-7788",
    whatsapp: true,
    email: "rafael.oliveira@email.com",
    endereco: {
      logradouro: "Rua Três",
      numero: "200",
      bairro: "Bairro Novo",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18203-000",
    },
    aprovado: false,
    ativo: false,
    disponivel: false,
    totalColetas: 0,
  },
];

export const doacoesMock: Doacao[] = [
  {
    id: "d1",
    nomeDoador: "Ana Paula",
    telefone: "(15) 99811-2233",
    whatsapp: true,
    itens: [
      { tipo: "alimento", nome: "Arroz", quantidade: 2 },
      { tipo: "alimento", nome: "Feijão", quantidade: 3 },
    ],
    endereco: {
      logradouro: "Rua das Palmeiras",
      numero: "101",
      bairro: "Vila Nova",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-000",
    },
    dataColeta: "30/07/2025",
    horaColeta: "09:00",
    status: "Pendente",
    criadaEm: "25/07/2025",
  },
  {
    id: "d2",
    nomeDoador: "Roberto Farias",
    telefone: "(15) 98833-4455",
    whatsapp: false,
    itens: [
      { tipo: "agasalho", nome: "Cobertor", quantidade: 2 },
      { tipo: "agasalho", nome: "Blusa de Frio", quantidade: 4 },
    ],
    endereco: {
      logradouro: "Av. Central",
      numero: "55",
      complemento: "Apto 3",
      bairro: "Centro",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-100",
    },
    dataColeta: "29/07/2025",
    horaColeta: "14:00",
    status: "Aguardando",
    voluntarioId: "v1",
    criadaEm: "24/07/2025",
  },
  {
    id: "d3",
    nomeDoador: "Carla Nunes",
    telefone: "(15) 97744-6677",
    whatsapp: true,
    itens: [{ tipo: "dinheiro", nome: "Dinheiro / Pix", quantidade: 1 }],
    endereco: {
      logradouro: "Rua Progresso",
      numero: "310",
      bairro: "Jardim Paulista",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18201-000",
    },
    dataColeta: "28/07/2025",
    horaColeta: "10:30",
    status: "Confirmado",
    voluntarioId: "v2",
    criadaEm: "23/07/2025",
  },
  {
    id: "d4",
    nomeDoador: "Marcos Vieira",
    telefone: "(15) 99955-8899",
    whatsapp: true,
    itens: [
      { tipo: "alimento", nome: "Macarrão", quantidade: 5 },
      { tipo: "alimento", nome: "Óleo de Soja", quantidade: 2 },
      { tipo: "agasalho", nome: "Camiseta", quantidade: 3 },
    ],
    endereco: {
      logradouro: "Rua Santa Luzia",
      numero: "77",
      bairro: "Vila Nova",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-200",
    },
    dataColeta: "31/07/2025",
    horaColeta: "15:00",
    status: "Atribuido",
    voluntarioId: "v4",
    criadaEm: "26/07/2025",
  },
  {
    id: "d5",
    nomeDoador: "Silvia Moura",
    telefone: "(15) 98811-0011",
    whatsapp: true,
    itens: [{ tipo: "agasalho", nome: "Calça", quantidade: 2 }],
    endereco: {
      logradouro: "Rua das Acácias",
      numero: "90",
      bairro: "Vila Nova",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-000",
    },
    dataColeta: "27/07/2025",
    horaColeta: "08:00",
    status: "Negado",
    voluntarioId: "v3",
    criadaEm: "22/07/2025",
  },
  {
    id: "d6",
    nomeDoador: "Paulo Henrique",
    telefone: "(15) 97700-5544",
    whatsapp: false,
    itens: [
      { tipo: "alimento", nome: "Arroz", quantidade: 4 },
      { tipo: "alimento", nome: "Açúcar", quantidade: 2 },
    ],
    endereco: {
      logradouro: "Rua Liberdade",
      numero: "200",
      bairro: "Centro",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18200-150",
    },
    dataColeta: "26/07/2025",
    horaColeta: "11:00",
    status: "Coletado",
    voluntarioId: "v1",
    criadaEm: "21/07/2025",
  },
  {
    id: "d7",
    nomeDoador: "Beatriz Alves",
    telefone: "(15) 99922-3344",
    whatsapp: true,
    itens: [
      { tipo: "alimento", nome: "Leite em Pó", quantidade: 3 },
      { tipo: "agasalho", nome: "Meias", quantidade: 6 },
    ],
    endereco: {
      logradouro: "Av. São Paulo",
      numero: "512",
      bairro: "Jardim Paulista",
      municipio: "Itapetininga",
      estado: "SP",
      cep: "18201-100",
    },
    dataColeta: "25/07/2025",
    horaColeta: "13:00",
    status: "Entregue",
    voluntarioId: "v2",
    criadaEm: "20/07/2025",
  },
];

// ─── Utilitário de match de voluntários ──────────────────────────────────────
// Futuramente substituído por endpoint: GET /voluntarios/sugeridos?doacaoId=X
// O backend fará isso via PostGIS. No MVP, simulamos a lógica no frontend.

export function sugerirVoluntarios(doacao: Doacao): Voluntario[] {
  const disponiveis = voluntariosMock.filter(
    (v) => v.aprovado && v.ativo && v.disponivel
  );

  // Score: 2 pts mesmo bairro | 1 pt mesmo município | 0 pts fora
  const comScore = disponiveis.map((v) => {
    let score = 0;
    if (
      v.endereco.bairro.toLowerCase() ===
      doacao.endereco.bairro.toLowerCase()
    )
      score = 2;
    else if (
      v.endereco.municipio.toLowerCase() ===
      doacao.endereco.municipio.toLowerCase()
    )
      score = 1;
    return { voluntario: v, score };
  });

  return comScore
    .sort((a, b) => b.score - a.score)
    .map((item) => item.voluntario);
}
