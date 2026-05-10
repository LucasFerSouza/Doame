"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCep } from "@/hooks/useCep";

interface NovoVoluntarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCadastrar: (dados: NovoVoluntarioDados) => Promise<{ ok: boolean; erro?: string }>;
}

export interface EnderecoVoluntario {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  estado: string;
}

export interface NovoVoluntarioDados {
  nome: string;
  email: string;
  telefone: string;
  whatsapp: boolean;
  endereco: EnderecoVoluntario;
}

const enderecoInicial: EnderecoVoluntario = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  municipio: "",
  estado: "",
};

const inicial: NovoVoluntarioDados = {
  nome: "",
  email: "",
  telefone: "",
  whatsapp: false,
  endereco: enderecoInicial,
};

export function NovoVoluntarioDialog({
  open,
  onOpenChange,
  onCadastrar,
}: NovoVoluntarioDialogProps) {
  const [form, setForm] = useState<NovoVoluntarioDados>(inicial);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const { handleCepChange, carregando: buscandoCep, erro: erroCep } = useCep(
    (dados) => {
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          municipio: dados.municipio,
          estado: dados.estado,
          complemento: dados.complemento || prev.endereco.complemento,
        },
      }));
    }
  );

  function handleClose(v: boolean) {
    if (!v) {
      setForm(inicial);
      setErro("");
      setSucesso(false);
      setCarregando(false);
    }
    onOpenChange(v);
  }

  function set(campo: keyof Omit<NovoVoluntarioDados, "endereco">, valor: string | boolean) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErro("");
  }

  function setEndereco(campo: keyof EnderecoVoluntario, valor: string) {
    setForm((prev) => ({ ...prev, endereco: { ...prev.endereco, [campo]: valor } }));
    setErro("");
  }

  async function handleSalvar() {
    const { nome, email, telefone, endereco } = form;
    if (!nome || !email || !telefone || !endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.municipio || !endereco.estado) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setCarregando(true);
    setErro("");
    try {
      const resultado = await onCadastrar(form);
      if (!resultado.ok) {
        setErro(resultado.erro ?? "Erro ao cadastrar voluntário.");
        return;
      }
      setSucesso(true);
      setTimeout(() => handleClose(false), 1500);
    } catch {
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const autoPreenchido = !buscandoCep && !!form.endereco.logradouro;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto dark:bg-gray-900">
        {sucesso ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Voluntário cadastrado!</p>
          </div>
        ) : (
        <>
        <DialogHeader>
          <DialogTitle className="text-base dark:text-gray-100">Novo voluntário</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Nome completo *</label>
            <Input value={form.nome} onChange={(e) => set("nome", e.target.value)} className="text-sm dark:bg-gray-800 dark:border-gray-700" />
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">E-mail *</label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="text-sm dark:bg-gray-800 dark:border-gray-700" />
          </div>

          {/* Telefone + WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Telefone *</label>
              <Input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} className="text-sm dark:bg-gray-800 dark:border-gray-700" placeholder="(11) 99999-9999" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">WhatsApp?</label>
              <select
                value={String(form.whatsapp)}
                onChange={(e) => set("whatsapp", e.target.value === "true")}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          {/* ── Endereço ── */}
          <div className="flex flex-col gap-2 pt-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Endereço</p>

            {/* CEP */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">CEP *</label>
              <div className="relative">
                <Input
                  placeholder="00000-000"
                  maxLength={9}
                  value={form.endereco.cep}
                  onChange={async (e) => {
                    const mascarado = await handleCepChange(e.target.value);
                    setEndereco("cep", mascarado);
                  }}
                  className="text-sm dark:bg-gray-800 dark:border-gray-700 pr-8"
                />
                {buscandoCep && (
                  <Loader2
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-yellow-600"
                  />
                )}
              </div>
              {erroCep && <p className="text-[11px] text-red-500">{erroCep}</p>}
            </div>

            {/* Logradouro */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Logradouro *</label>
              <Input
                placeholder="Rua, Avenida..."
                value={form.endereco.logradouro}
                onChange={(e) => setEndereco("logradouro", e.target.value)}
                className={`text-sm dark:bg-gray-800 dark:border-gray-700 ${autoPreenchido ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
              />
            </div>

            {/* Número + Complemento */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Número *</label>
                <Input
                  placeholder="123"
                  value={form.endereco.numero}
                  onChange={(e) => setEndereco("numero", e.target.value)}
                  className="text-sm dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Complemento</label>
                <Input
                  placeholder="Apto, Casa..."
                  value={form.endereco.complemento}
                  onChange={(e) => setEndereco("complemento", e.target.value)}
                  className="text-sm dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Bairro */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Bairro *</label>
              <Input
                placeholder="Bairro"
                value={form.endereco.bairro}
                onChange={(e) => setEndereco("bairro", e.target.value)}
                className={`text-sm dark:bg-gray-800 dark:border-gray-700 ${autoPreenchido ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
              />
            </div>

            {/* Município + Estado */}
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">Município *</label>
                <Input
                  placeholder="Cidade"
                  value={form.endereco.municipio}
                  onChange={(e) => setEndereco("municipio", e.target.value)}
                  className={`text-sm dark:bg-gray-800 dark:border-gray-700 ${autoPreenchido ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">UF *</label>
                <Input
                  placeholder="SP"
                  maxLength={2}
                  value={form.endereco.estado}
                  onChange={(e) => setEndereco("estado", e.target.value.toUpperCase())}
                  className={`text-sm dark:bg-gray-800 dark:border-gray-700 w-16 ${autoPreenchido ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
                />
              </div>
            </div>
          </div>

          {erro && <p className="text-xs text-red-500">{erro}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 dark:border-gray-700 dark:text-gray-300" onClick={() => handleClose(false)} disabled={carregando || buscandoCep}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleSalvar} disabled={carregando || buscandoCep}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
