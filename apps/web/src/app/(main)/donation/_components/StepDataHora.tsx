import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Calendar, Clock } from "lucide-react";

interface StepDataHoraProps {
  dataColeta: string;
  horaColeta: string;
  onDataChange: (valor: string) => void;
  onHoraChange: (valor: string) => void;
  onNext: () => void;
  onVoltar: () => void;
}

export function StepDataHora({
  dataColeta,
  horaColeta,
  onDataChange,
  onHoraChange,
  onNext,
  onVoltar,
}: StepDataHoraProps) {
  const valido = !!dataColeta && !!horaColeta;

  // Data mínima = hoje (não permite agendar no passado)
  const hoje = new Date().toISOString().split("T")[0];

  return (
    <Field className="flex flex-col gap-4">
      <FieldLabel className="text-base">
        Quando podemos buscar sua doação?
      </FieldLabel>

      <FieldDescription>
        Escolha um dia e horário conveniente para o voluntário buscar os itens.
      </FieldDescription>

      {/* Data */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 flex items-center gap-1.5">
          <Calendar size={12} />
          Data da coleta
        </label>
        <input
          type="date"
          min={hoje}
          className="border rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          value={dataColeta}
          onChange={(e) => onDataChange(e.target.value)}
        />
      </div>

      {/* Horário */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 flex items-center gap-1.5">
          <Clock size={12} />
          Horário preferido
        </label>
        <input
          type="time"
          className="border rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          value={horaColeta}
          onChange={(e) => onHoraChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          disabled={!valido}
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </Field>
  );
}
