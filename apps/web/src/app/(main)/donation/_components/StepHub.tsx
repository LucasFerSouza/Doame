import { Button } from "@/components/ui/button";
import { StepId, ItemCarrinho } from "./types";
import { Wheat, Shirt, Banknote, CheckCircle, ChevronLeft } from "lucide-react";

interface StepHubProps {
  nome: string;
  itens: ItemCarrinho[];
  dinheiro: string;
  onEscolher: (destino: StepId) => void;
  onFinalizar: () => void;
  onVoltar: () => void;
}

export function StepHub({
  nome,
  itens,
  dinheiro,
  onEscolher,
  onFinalizar,
  onVoltar,
}: StepHubProps) {
  const temAlgo = itens.length > 0 || !!dinheiro;

  const opcoes = [
    {
      label: "Alimento",
      descricao: "Itens não perecíveis",
      icone: <Wheat size={28} />,
      destino: "alimento" as StepId,
      cor: "hover:border-yellow-500 hover:bg-yellow-50",
      corIcone: "text-yellow-600",
    },
    {
      label: "Agasalho",
      descricao: "Roupas e cobertores",
      icone: <Shirt size={28} />,
      destino: "agasalho" as StepId,
      cor: "hover:border-blue-400 hover:bg-blue-50",
      corIcone: "text-blue-500",
    },
    {
      label: "Dinheiro",
      descricao: "Pix ou dinheiro",
      icone: <Banknote size={28} />,
      destino: "dinheiro" as StepId,
      cor: "hover:border-green-500 hover:bg-green-50",
      corIcone: "text-green-600",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onVoltar}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors w-fit -mt-1"
      >
        <ChevronLeft size={14} />
        Voltar
      </button>
      <p className="text-sm text-gray-500">
        O que você deseja doar, <span className="font-semibold text-gray-700">{nome}</span>?
      </p>

      <div className="grid grid-cols-3 gap-3">
        {opcoes.map((opcao) => (
          <button
            key={opcao.destino}
            onClick={() => onEscolher(opcao.destino)}
            className={`
              flex flex-col items-center justify-center gap-2
              border-2 border-gray-200 rounded-xl p-4
              transition-all duration-150 cursor-pointer
              ${opcao.cor}
            `}
          >
            <span className={opcao.corIcone}>{opcao.icone}</span>
            <span className="text-xs font-semibold text-gray-700">{opcao.label}</span>
            <span className="text-[10px] text-gray-400 text-center">{opcao.descricao}</span>
          </button>
        ))}
      </div>

      {temAlgo && (
        <Button
          className="w-full bg-green-700 hover:bg-green-800 mt-2 gap-2"
          onClick={onFinalizar}
        >
          <CheckCircle size={16} />
          Finalizar doação
        </Button>
      )}

      {!temAlgo && (
        <p className="text-xs text-center text-gray-400">
          Selecione pelo menos um item para continuar
        </p>
      )}
    </div>
  );
}
