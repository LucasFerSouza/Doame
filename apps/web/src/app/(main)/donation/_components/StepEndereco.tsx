"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FormData } from "./types";
import { useCep } from "@/hooks/useCep";

interface StepEnderecoProps {
  endereco: FormData["endereco"];
  onChange: (campo: keyof FormData["endereco"], valor: string) => void;
  onPreencherEndereco: (dados: Partial<FormData["endereco"]>) => void;
  onNext: () => void;
  onVoltar: () => void;
}

export function StepEndereco({
  endereco,
  onChange,
  onPreencherEndereco,
  onNext,
  onVoltar,
}: StepEnderecoProps) {
  const { handleCepChange, carregando, erro } = useCep((dados) => {
    onPreencherEndereco({
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      municipio: dados.municipio,
      estado: dados.estado,
      ...(dados.complemento ? { complemento: dados.complemento } : {}),
    });
  });

  const campoObrigatorioPreenchido =
    !!endereco.cep &&
    !!endereco.estado &&
    !!endereco.municipio &&
    !!endereco.bairro &&
    !!endereco.logradouro &&
    !!endereco.numero;

  const autoPreenchido = !carregando && !!endereco.logradouro;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-600">Endereço para coleta</p>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {/* CEP */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              placeholder="CEP *"
              maxLength={9}
              value={endereco.cep}
              onChange={async (e) => {
                const mascarado = await handleCepChange(e.target.value);
                onChange("cep", mascarado);
              }}
              className="text-sm pr-8"
            />
            {carregando && (
              <Loader2
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-yellow-600"
              />
            )}
          </div>
          {erro && <p className="text-[11px] text-red-500">{erro}</p>}
        </div>

        {/* Logradouro */}
        <Input
          placeholder="Logradouro (rua, avenida...) *"
          value={endereco.logradouro}
          onChange={(e) => onChange("logradouro", e.target.value)}
          className={`text-sm ${autoPreenchido ? "bg-yellow-50" : ""}`}
        />

        {/* Número e Complemento */}
        <div className="flex gap-2">
          <Input
            placeholder="Número *"
            value={endereco.numero}
            onChange={(e) => onChange("numero", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Complemento"
            value={endereco.complemento}
            onChange={(e) => onChange("complemento", e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Bairro */}
        <Input
          placeholder="Bairro *"
          value={endereco.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
          className={`text-sm ${autoPreenchido ? "bg-yellow-50" : ""}`}
        />

        {/* Município e Estado */}
        <div className="flex gap-2">
          <Input
            placeholder="Município *"
            value={endereco.municipio}
            onChange={(e) => onChange("municipio", e.target.value)}
            className={`text-sm flex-1 ${autoPreenchido ? "bg-yellow-50" : ""}`}
          />
          <Input
            placeholder="UF *"
            maxLength={2}
            value={endereco.estado}
            onChange={(e) => onChange("estado", e.target.value.toUpperCase())}
            className={`text-sm w-16 ${autoPreenchido ? "bg-yellow-50" : ""}`}
          />
        </div>
      </div>

      <p className="text-[10px] text-gray-400">
        * Campos obrigatórios · Fundo amarelo = preenchido via CEP
      </p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onVoltar} disabled={carregando}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
          disabled={!campoObrigatorioPreenchido || carregando}
          onClick={onNext}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
