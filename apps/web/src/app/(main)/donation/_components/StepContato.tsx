"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { FormData } from "./types";

interface StepContatoProps {
  contato: FormData["contato"];
  nomeDoador: string;
  onChange: (campo: keyof FormData["contato"], valor: string | boolean) => void;
  onEnviar: () => Promise<{ ok: boolean; erro?: string }>;
  onVoltar: () => void;
}

// Máscara simples de celular: (11) 99999-9999
function aplicarMascara(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export function StepContato({
  contato,
  nomeDoador,
  onChange,
  onEnviar,
  onVoltar,
}: StepContatoProps) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  const celularValido = contato.celular.replace(/\D/g, "").length === 11;

  async function handleEnviar() {
    setEnviando(true);
    setErroEnvio("");
    const resultado = await onEnviar();
    setEnviando(false);
    if (!resultado.ok) {
      setErroEnvio(resultado.erro ?? "Erro ao registrar doação. Tente novamente.");
      return;
    }
    setEnviado(true);
  }

  // ── Tela de confirmação ──
  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <CheckCircle2 size={52} className="text-green-600" />
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-800">
            Obrigado, {nomeDoador}!
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sua doação foi registrada com sucesso. <br />
            Em breve um voluntário entrará em contato.
          </p>
        </div>
        <Button
          className="mt-2 bg-green-700 hover:bg-green-800 px-8"
          onClick={() => router.push("/")}
        >
          Voltar à página inicial
        </Button>
      </div>
    );
  }

  // ── Formulário de contato ──
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-gray-600">
        Como podemos entrar em contato?
      </p>

      {/* Input de celular com máscara */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Celular *</label>
        <input
          type="tel"
          className="border rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="(11) 99999-9999"
          value={contato.celular}
          onChange={(e) => onChange("celular", aplicarMascara(e.target.value))}
        />
      </div>

      {/* Radio group para WhatsApp */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Este número tem WhatsApp?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="whatsapp"
              checked={contato.temWhatsapp === true}
              onChange={() => onChange("temWhatsapp", true)}
              className="accent-yellow-600"
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="whatsapp"
              checked={contato.temWhatsapp === false}
              onChange={() => onChange("temWhatsapp", false)}
              className="accent-yellow-600"
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
      </div>

      {erroEnvio && (
        <p className="text-xs text-red-600 bg-red-50 rounded-md px-3 py-2 border border-red-100">
          {erroEnvio}
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={onVoltar} disabled={enviando}>
          Voltar
        </Button>
        <Button
          className="flex-1 bg-green-700 hover:bg-green-800"
          disabled={!celularValido || enviando}
          onClick={handleEnviar}
        >
          {enviando ? "Enviando..." : "Enviar doação"}
        </Button>
      </div>
    </div>
  );
}
