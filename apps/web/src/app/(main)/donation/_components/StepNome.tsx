import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

interface StepNomeProps {
  nome: string;
  onChange: (valor: string) => void;
  onNext: () => void;
}

export function StepNome({ nome, onChange, onNext }: StepNomeProps) {
  return (
    <Field className="flex flex-col gap-4">
      <FieldLabel className="text-base">Como devemos te chamar?</FieldLabel>

      <input
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Digite seu nome ou apelido"
        value={nome}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && nome && onNext()}
        autoFocus
      />

      <Button
        className="w-full bg-yellow-600 hover:bg-yellow-700 mt-2"
        onClick={onNext}
        disabled={!nome.trim()}
      >
        Próximo
      </Button>
    </Field>
  );
}
