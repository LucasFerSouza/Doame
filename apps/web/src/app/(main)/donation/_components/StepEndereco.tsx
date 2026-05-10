import { Button } from "@/components/ui/button";
import { FormData } from "./types";
import { estadosBrasileiros } from "./data";

interface StepEnderecoProps {
  endereco: FormData["endereco"];
  onChange: (campo: keyof FormData["endereco"], valor: string) => void;
  onNext: () => void;
  onVoltar: () => void;
}

export function StepEndereco({
  endereco,
  onChange,
  onNext,
  onVoltar,
}: StepEnderecoProps) {
  const campoObrigatorioPreenchido =
    !!endereco.cep &&
    !!endereco.estado &&
    !!endereco.municipio &&
    !!endereco.bairro &&
    !!endereco.logradouro &&
    !!endereco.numero;

  const inputClass =
    "border rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500";

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-600">
        Endereço para coleta
      </p>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {/* CEP */}
        <input
          className={inputClass}
          placeholder="CEP *"
          maxLength={9}
          value={endereco.cep}
          onChange={(e) => onChange("cep", e.target.value)}
        />

        {/* Estado */}
        <select
          className={inputClass}
          value={endereco.estado}
          onChange={(e) => onChange("estado", e.target.value)}
        >
          <option value="">Estado *</option>
          {estadosBrasileiros.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>

        {/* Município */}
        <input
          className={inputClass}
          placeholder="Município *"
          value={endereco.municipio}
          onChange={(e) => onChange("municipio", e.target.value)}
        />

        {/* Bairro */}
        <input
          className={inputClass}
          placeholder="Bairro *"
          value={endereco.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
        />

        {/* Logradouro */}
        <input
          className={inputClass}
          placeholder="Logradouro (rua, avenida...) *"
          value={endereco.logradouro}
          onChange={(e) => onChange("logradouro", e.target.value)}
        />

        {/* Número e Complemento lado a lado */}
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Número *"
            value={endereco.numero}
            onChange={(e) => onChange("numero", e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Complemento"
            value={endereco.complemento}
            onChange={(e) => onChange("complemento", e.target.value)}
          />
        </div>
      </div>

      <p className="text-[10px] text-gray-400">* Campos obrigatórios</p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          disabled={!campoObrigatorioPreenchido}
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
