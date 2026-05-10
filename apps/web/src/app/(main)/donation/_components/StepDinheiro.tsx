import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";

interface StepDinheiroProps {
  valor: string;
  onChange: (valor: string) => void;
  onConfirmar: () => void;
  onVoltar: () => void;
}

export function StepDinheiro({
  valor,
  onChange,
  onConfirmar,
  onVoltar,
}: StepDinheiroProps) {
  return (
    <Field className="flex flex-col gap-4">
      <FieldLabel className="text-base">Qual valor deseja doar?</FieldLabel>

      <input
        type="number"
        min="1"
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="R$ 0,00"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />

      <FieldDescription>Qualquer valor ajuda a transformar uma vida.</FieldDescription>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          disabled={!valor || Number(valor) <= 0}
          onClick={onConfirmar}
        >
          Confirmar valor
        </Button>
      </div>
    </Field>
  );
}
