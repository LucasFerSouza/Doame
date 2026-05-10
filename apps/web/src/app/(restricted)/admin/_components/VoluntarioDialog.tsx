"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Voluntario } from "./mockData";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────

type Modo = "visualizar" | "editar" | "excluir";

interface VoluntarioDialogProps {
  voluntario: Voluntario | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Callbacks para o orquestrador — TODO: substituir por chamadas à API
  onEditar: (id: string, dados: Partial<Voluntario>, senhaAdmin: string) => Promise<{ ok: boolean; erro?: string }>;
  onExcluir: (id: string, senhaAdmin: string) => Promise<{ ok: boolean; erro?: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────────

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export function VoluntarioDialog({
  voluntario,
  open,
  onOpenChange,
  onEditar,
  onExcluir,
}: VoluntarioDialogProps) {
  // ── Estado de modo ──
  const [modo, setModo] = useState<Modo>("visualizar");

  // ── Estado do formulário de edição ──
  const [form, setForm] = useState<Partial<Voluntario>>({});

  // ── Estado de confirmação de senha ──
  const [senhaAdmin, setSenhaAdmin] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // ── Estado de carregamento e feedback ──
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Reseta tudo ao abrir/fechar ou trocar voluntário
  useEffect(() => {
    if (open && voluntario) {
      setModo("visualizar");
      setForm({ ...voluntario });
      setSenhaAdmin("");
      setMostrarSenha(false);
      setErroSenha("");
      setSucesso(false);
      setCarregando(false);
    }
  }, [open, voluntario]);

  if (!voluntario) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  function handleCampoForm(campo: string, valor: string | boolean) {
    // Campos aninhados (endereco.*)
    if (campo.startsWith("endereco.")) {
      const subCampo = campo.replace("endereco.", "");
      setForm((prev) => ({
        ...prev,
        endereco: { ...(prev.endereco ?? voluntario.endereco), [subCampo]: valor },
      }));
    } else {
      setForm((prev) => ({ ...prev, [campo]: valor }));
    }
  }

  async function handleSalvarEdicao() {
    if (!senhaAdmin) {
      setErroSenha("Informe a senha do administrador para confirmar.");
      return;
    }
    setCarregando(true);
    setErroSenha("");
    // TODO: substituir por PATCH /api/voluntarios/:id com { ...form, senhaAdmin }
    const resultado = await onEditar(voluntario.id, form, senhaAdmin);
    setCarregando(false);
    if (!resultado.ok) {
      setErroSenha(resultado.erro ?? "Senha incorreta. Tente novamente.");
      return;
    }
    setSucesso(true);
    setTimeout(() => onOpenChange(false), 1200);
  }

  async function handleConfirmarExclusao() {
    if (!senhaAdmin) {
      setErroSenha("Informe a senha do administrador para confirmar.");
      return;
    }
    setCarregando(true);
    setErroSenha("");
    // TODO: substituir por DELETE /api/voluntarios/:id com { senhaAdmin } no body
    const resultado = await onExcluir(voluntario.id, senhaAdmin);
    setCarregando(false);
    if (!resultado.ok) {
      setErroSenha(resultado.erro ?? "Senha incorreta. Tente novamente.");
      return;
    }
    setSucesso(true);
    setTimeout(() => onOpenChange(false), 1200);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sub-renderizações
  // ─────────────────────────────────────────────────────────────────────────

  function renderCampoSenha(labelAcao: string) {
    return (
      <div className="flex flex-col gap-2 pt-2">
        <p className="text-xs text-gray-500">
          Confirme com a <strong>senha do administrador</strong> para {labelAcao}.
        </p>
        <div className="relative">
          <Input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha do administrador"
            value={senhaAdmin}
            onChange={(e) => {
              setSenhaAdmin(e.target.value);
              setErroSenha("");
            }}
            className={`pr-10 text-sm ${erroSenha ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setMostrarSenha((v) => !v)}
          >
            {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {erroSenha && (
          <p className="text-xs text-red-500">{erroSenha}</p>
        )}
      </div>
    );
  }

  // ── Modo: VISUALIZAR ──
  function renderVisualizar() {
    return (
      <>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={13} className="text-gray-400" />
              {voluntario.telefone}
              {voluntario.whatsapp && (
                <span className="text-[11px] text-green-600 font-semibold">WhatsApp</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail size={13} className="text-gray-400" />
              {voluntario.email}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Endereço</p>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>
              {voluntario.endereco.logradouro}, {voluntario.endereco.numero}
              <br />
              {voluntario.endereco.bairro} · {voluntario.endereco.municipio}/{voluntario.endereco.estado}
              <br />
              <span className="text-gray-400 text-xs">CEP {voluntario.endereco.cep}</span>
            </span>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Histórico</p>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Award size={13} className="text-yellow-500" />
            <span>
              <strong>{voluntario.totalColetas}</strong> coleta{voluntario.totalColetas !== 1 ? "s" : ""}{" "}
              realizada{voluntario.totalColetas !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </>
    );
  }

  // ── Modo: EDITAR ──
  function renderEditar() {
    const end = form.endereco ?? voluntario.endereco;
    return (
      <>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dados pessoais</p>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Nome completo</label>
            <Input value={form.nome ?? voluntario.nome} onChange={(e) => handleCampoForm("nome", e.target.value)} className="text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Telefone</label>
              <Input value={form.telefone ?? voluntario.telefone} onChange={(e) => handleCampoForm("telefone", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">WhatsApp?</label>
              <select
                value={String(form.whatsapp ?? voluntario.whatsapp)}
                onChange={(e) => handleCampoForm("whatsapp", e.target.value === "true")}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">E-mail</label>
            <Input type="email" value={form.email ?? voluntario.email} onChange={(e) => handleCampoForm("email", e.target.value)} className="text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Disponível?</label>
              <select
                value={String(form.disponivel ?? voluntario.disponivel)}
                onChange={(e) => handleCampoForm("disponivel", e.target.value === "true")}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Aprovado?</label>
              <select
                value={String(form.aprovado ?? voluntario.aprovado)}
                onChange={(e) => handleCampoForm("aprovado", e.target.value === "true")}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Endereço</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-gray-500">Logradouro</label>
              <Input value={end.logradouro} onChange={(e) => handleCampoForm("endereco.logradouro", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Número</label>
              <Input value={end.numero} onChange={(e) => handleCampoForm("endereco.numero", e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Bairro</label>
              <Input value={end.bairro} onChange={(e) => handleCampoForm("endereco.bairro", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Município</label>
              <Input value={end.municipio} onChange={(e) => handleCampoForm("endereco.municipio", e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Estado (UF)</label>
              <Input value={end.estado} maxLength={2} onChange={(e) => handleCampoForm("endereco.estado", e.target.value.toUpperCase())} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">CEP</label>
              <Input value={end.cep} onChange={(e) => handleCampoForm("endereco.cep", e.target.value)} className="text-sm" />
            </div>
          </div>
        </div>
        <Separator />
        {renderCampoSenha("salvar as alterações")}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={() => setModo("visualizar")} disabled={carregando}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleSalvarEdicao} disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </>
    );
  }

  // ── Modo: EXCLUIR ──
  function renderExcluir() {
    return (
      <>
        <Separator />
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">
            <p className="font-semibold mb-1">Atenção: ação irreversível</p>
            <p className="text-xs leading-relaxed">
              O voluntário <strong>{voluntario.nome}</strong> será{" "}
              <strong>desativado</strong> do sistema (soft delete). Seu histórico de coletas
              será preservado, mas ele não aparecerá mais nas sugestões de atribuição.
            </p>
          </div>
        </div>
        {renderCampoSenha("confirmar a exclusão")}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={() => setModo("visualizar")} disabled={carregando}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmarExclusao} disabled={carregando}>
            {carregando ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render principal
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">

        {/* Feedback de sucesso — sobrepõe o conteúdo */}
        {sucesso && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 rounded-lg gap-3">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="text-sm font-semibold text-gray-700">
              {modo === "excluir" ? "Voluntário excluído." : "Alterações salvas."}
            </p>
          </div>
        )}

        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-green-100 text-green-800 text-lg font-bold">
                  {iniciais(voluntario.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base">{voluntario.nome}</DialogTitle>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className={
                      voluntario.aprovado
                        ? "text-green-700 border-green-200 bg-green-50 text-xs"
                        : "text-gray-500 border-gray-200 bg-gray-50 text-xs"
                    }
                  >
                    {voluntario.aprovado ? "Aprovado" : "Pendente de aprovação"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      voluntario.disponivel
                        ? "text-blue-700 border-blue-200 bg-blue-50 text-xs"
                        : "text-orange-600 border-orange-200 bg-orange-50 text-xs"
                    }
                  >
                    {voluntario.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Botões de ação — só no modo visualizar */}
            {modo === "visualizar" && (
              <div className="flex gap-1 mt-1 flex-shrink-0">
                <button
                  title="Editar voluntário"
                  onClick={() => setModo("editar")}
                  className="p-1.5 rounded-md text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  title="Excluir voluntário"
                  onClick={() => setModo("excluir")}
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Indicador de modo */}
          {modo !== "visualizar" && (
            <p className="text-xs font-semibold mt-3">
              {modo === "editar" ? (
                <span className="text-yellow-700">✏️ Modo edição</span>
              ) : (
                <span className="text-red-600">🗑️ Confirmar exclusão</span>
              )}
            </p>
          )}
        </DialogHeader>

        {modo === "visualizar" && renderVisualizar()}
        {modo === "editar" && renderEditar()}
        {modo === "excluir" && renderExcluir()}
      </DialogContent>
    </Dialog>
  );
}
