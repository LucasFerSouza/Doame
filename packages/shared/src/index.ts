// ─────────────────────────────────────────────────────────────────────────────
// @doame/shared — Tipos e enums compartilhados entre web e api
// ─────────────────────────────────────────────────────────────────────────────

// Enums (espelham os enums do Prisma schema para uso no frontend sem importar Prisma)
export enum PapelAdmin {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum CategoriaDoacao {
  ALIMENTO = 'ALIMENTO',
  AGASALHO = 'AGASALHO',
  FINANCEIRA = 'FINANCEIRA',
}

export enum StatusDoacao {
  PENDENTE = 'PENDENTE',
  AGUARDANDO = 'AGUARDANDO',
  CONFIRMADO = 'CONFIRMADO',
  NEGADO = 'NEGADO',
  ATRIBUIDO = 'ATRIBUIDO',
  COLETADO = 'COLETADO',
  ENTREGUE = 'ENTREGUE',
}

export enum StatusAtribuicao {
  PENDENTE = 'PENDENTE',
  ACEITA = 'ACEITA',
  RECUSADA = 'RECUSADA',
  EXPIRADA = 'EXPIRADA',
}

export enum TipoPagamento {
  PIX = 'PIX',
  DINHEIRO = 'DINHEIRO',
}

// Tipos comuns
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
