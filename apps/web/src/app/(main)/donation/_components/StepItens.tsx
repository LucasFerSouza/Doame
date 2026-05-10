import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemCarrinho, ItemTipo } from "./types";
import { Package } from "lucide-react";

interface ItemDisponivel {
  nome: string;
  descricao: string;
  foto: string;
}

interface StepItensProps {
  tipo: ItemTipo;
  titulo: string;
  itensDisponiveis: ItemDisponivel[];
  onConfirmar: (novosItens: ItemCarrinho[]) => void;
  onVoltar: () => void;
}

export function StepItens({
  tipo,
  titulo,
  itensDisponiveis,
  onConfirmar,
  onVoltar,
}: StepItensProps) {
  // Estado local: controla as quantidades de cada item NESSA sessão
  const [quantidades, setQuantidades] = useState<Record<string, number>>(
    Object.fromEntries(itensDisponiveis.map((i) => [i.nome, 0]))
  );

  const atualizar = (nome: string, valor: number) => {
    setQuantidades((prev) => ({ ...prev, [nome]: Math.max(0, valor) }));
  };

  const confirmar = () => {
    const selecionados: ItemCarrinho[] = itensDisponiveis
      .filter((item) => quantidades[item.nome] > 0)
      .map((item) => ({
        tipo,
        nome: item.nome,
        quantidade: quantidades[item.nome],
      }));

    onConfirmar(selecionados);
  };

  const temSelecionado = Object.values(quantidades).some((q) => q > 0);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-600">{titulo}</p>

      {/* Lista com scroll */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {itensDisponiveis.map((item) => (
          <div
            key={item.nome}
            className="flex items-center gap-3 border rounded-lg p-2 bg-white/70"
          >
            {/* Foto placeholder */}
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-gray-400" />
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {item.nome}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {item.descricao}
              </p>
            </div>

            {/* Input numérico */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                className="w-6 h-6 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs"
                onClick={() => atualizar(item.nome, quantidades[item.nome] - 1)}
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold">
                {quantidades[item.nome]}
              </span>
              <button
                className="w-6 h-6 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center text-xs"
                onClick={() => atualizar(item.nome, quantidades[item.nome] + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={onVoltar} className="flex-shrink-0">
          Voltar
        </Button>
        <Button
          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          disabled={!temSelecionado}
          onClick={confirmar}
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}
