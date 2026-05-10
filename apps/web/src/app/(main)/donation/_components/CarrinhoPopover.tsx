import { ShoppingBasket } from "lucide-react";
import { ItemCarrinho } from "./types";

interface CarrinhoPopoverProps {
  itens: ItemCarrinho[];
  dinheiro: string;
}

export function CarrinhoPopover({ itens, dinheiro }: CarrinhoPopoverProps) {
  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const temAlgo = itens.length > 0 || !!dinheiro;

  return (
    <div className="relative group">
      {/* Botão flutuante */}
      <button
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-yellow-600 hover:bg-yellow-700
          text-white shadow-2xl
          flex items-center justify-center
          transition-all duration-200
          active:scale-95
        "
        aria-label="Ver carrinho"
      >
        <ShoppingBasket size={24} />
        {temAlgo && (
          <span
            className="
              absolute -top-1 -right-1
              w-5 h-5 rounded-full
              bg-green-700 text-white
              text-[10px] font-bold
              flex items-center justify-center
            "
          >
            {totalItens || "R$"}
          </span>
        )}
      </button>

      {/* Popover — aparece ao hover/focus no botão */}
      <div
        className="
          fixed bottom-24 right-6 z-50
          w-72 rounded-xl
          bg-white/95 backdrop-blur
          shadow-2xl border border-gray-100
          p-4
          opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          transition-all duration-200 translate-y-2 group-hover:translate-y-0
        "
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Itens no carrinho
        </p>

        {!temAlgo && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum item adicionado ainda.
          </p>
        )}

        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {itens.map((item, i) => (
            <li key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">{item.nome}</span>
              <span className="text-gray-400 font-medium">
                x{item.quantidade}
              </span>
            </li>
          ))}

          {dinheiro && (
            <li className="flex justify-between items-center text-sm border-t pt-2 mt-2">
              <span className="text-gray-700">Dinheiro / Pix</span>
              <span className="text-green-700 font-semibold">
                R$ {dinheiro}
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
