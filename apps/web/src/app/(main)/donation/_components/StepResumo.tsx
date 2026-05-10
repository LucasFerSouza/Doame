import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormData } from "./types";
import { Wheat, Shirt, Banknote } from "lucide-react";

interface StepResumoProps {
  formData: FormData;
  onConfirmar: () => void;
  onVoltar: () => void;
}

export function StepResumo({ formData, onConfirmar, onVoltar }: StepResumoProps) {
  const alimentos = formData.itens.filter((i) => i.tipo === "alimento");
  const agasalhos = formData.itens.filter((i) => i.tipo === "agasalho");
  const totalItens = formData.itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Tudo certo,{" "}
          <span className="font-semibold text-gray-800">{formData.nome}</span>!
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Revise os itens antes de continuar. Você ainda poderá informar data,
          endereço e contato nos próximos passos.
        </p>
      </div>

      <Separator />

      {/* Itens */}
      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
        {alimentos.length > 0 && (
          <div className="rounded-lg border p-3 bg-yellow-50/60">
            <div className="flex items-center gap-2 mb-2">
              <Wheat size={13} className="text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                Alimentos
              </span>
            </div>
            {alimentos.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-gray-700 py-0.5"
              >
                <span>{item.nome}</span>
                <span className="text-gray-400 font-medium">
                  x{item.quantidade}
                </span>
              </div>
            ))}
          </div>
        )}

        {agasalhos.length > 0 && (
          <div className="rounded-lg border p-3 bg-blue-50/60">
            <div className="flex items-center gap-2 mb-2">
              <Shirt size={13} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Agasalhos
              </span>
            </div>
            {agasalhos.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-gray-700 py-0.5"
              >
                <span>{item.nome}</span>
                <span className="text-gray-400 font-medium">
                  x{item.quantidade}
                </span>
              </div>
            ))}
          </div>
        )}

        {formData.dinheiro && (
          <div className="rounded-lg border p-3 bg-green-50/60">
            <div className="flex items-center gap-2 mb-1">
              <Banknote size={13} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Dinheiro / Pix
              </span>
            </div>
            <span className="text-sm font-semibold text-green-700">
              R$ {formData.dinheiro}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Totalizador */}
      <div className="flex justify-between items-center text-xs text-gray-400 px-1">
        <span>Total de itens</span>
        <span className="font-semibold text-gray-600">{totalItens} unidade{totalItens !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-green-700 hover:bg-green-800"
          onClick={onConfirmar}
        >
          Confirmar e continuar
        </Button>
      </div>
    </div>
  );
}
