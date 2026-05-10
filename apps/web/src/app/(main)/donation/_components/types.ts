export type StepId =
  | "nome"
  | "hub"
  | "alimento"
  | "agasalho"
  | "dinheiro"
  | "resumo"
  | "dataHora" // ← novo passo
  | "endereco"
  | "contato";

export type ItemTipo = "alimento" | "agasalho";

export interface ItemCarrinho {
  tipo: ItemTipo;
  nome: string;
  quantidade: number;
}

export interface FormData {
  nome: string;
  itens: ItemCarrinho[];
  dinheiro: string;
  dataColeta: string;
  horaColeta: string;
  endereco: {
    cep: string;
    estado: string;
    municipio: string;
    bairro: string;
    logradouro: string;
    numero: string;
    complemento: string;
  };
  contato: {
    celular: string;
    temWhatsapp: boolean;
  };
}

export const formDataInicial: FormData = {
  nome: "",
  itens: [],
  dinheiro: "",
  dataColeta: "",
  horaColeta: "",
  endereco: {
    cep: "",
    estado: "",
    municipio: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  },
  contato: {
    celular: "",
    temWhatsapp: false,
  },
};
