"use client";

import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export interface CepResultado {
  logradouro: string;
  complemento: string;
  bairro: string;
  municipio: string;
  estado: string;
}

export function useCep(onPreenchido: (dados: CepResultado) => void) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  // Ref garante que o callback mais recente seja sempre chamado,
  // mesmo que o componente tenha re-renderizado durante o fetch.
  const callbackRef = useRef(onPreenchido);
  callbackRef.current = onPreenchido;

  function aplicarMascara(valor: string): string {
    const digits = valor.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  async function handleCepChange(valorBruto: string): Promise<string> {
    const mascarado = aplicarMascara(valorBruto);
    const digits = mascarado.replace(/\D/g, "");

    if (digits.length < 8) {
      setErro("");
      return mascarado;
    }

    setCarregando(true);
    setErro("");
    try {
      const res = await fetch(`${API}/cep/${digits}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErro(body?.message ?? "CEP não encontrado.");
        return mascarado;
      }
      const data: CepResultado = await res.json();
      callbackRef.current(data);
    } catch {
      setErro("Não foi possível consultar o CEP.");
    } finally {
      setCarregando(false);
    }

    return mascarado;
  }

  return { handleCepChange, carregando, erro };
}
