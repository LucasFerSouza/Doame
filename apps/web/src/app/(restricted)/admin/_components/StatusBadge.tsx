import { Badge } from "@/components/ui/badge";
import { StatusDoacao } from "./mockData";

interface StatusBadgeProps {
  status: StatusDoacao;
  className?: string;
}

// Mapeamento de status → classes de cor
// Usando classes inline para garantir que o Tailwind não purgue as cores
const STATUS_CONFIG: Record<
  StatusDoacao,
  { label: string; className: string }
> = {
  Pendente: {
    label: "Pendente",
    className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100",
  },
  Aguardando: {
    label: "Aguardando",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
  },
  Confirmado: {
    label: "Confirmado",
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  },
  Negado: {
    label: "Negado",
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
  Atribuido: {
    label: "Atribuído",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
  },
  Coletado: {
    label: "Coletado",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
  },
  Entregue: {
    label: "Entregue",
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold px-2 py-0.5 ${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}

// Exporta as opções para uso no Select de mudança de status
export const STATUS_OPTIONS: StatusDoacao[] = [
  "Pendente",
  "Aguardando",
  "Confirmado",
  "Negado",
  "Atribuido",
  "Coletado",
  "Entregue",
];
