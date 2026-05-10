"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Calendar,
  Clock,
  Package,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { Doacao, StatusDoacao, voluntariosMock } from "./mockData";
import { StatusBadge, STATUS_OPTIONS } from "./StatusBadge";
import { AtribuirDialog } from "./AtribuirDialog";

interface DoacaoDialogProps {
  doacao: Doacao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, novoStatus: StatusDoacao) => void;
  onAtribuir: (doacaoId: string, voluntarioId: string) => void;
}

const TIPO_LABEL = {
  alimento: "🌾 Alimento",
  agasalho: "🧥 Agasalho",
  dinheiro: "💵 Dinheiro",
};

export function DoacaoDialog({
  doacao,
  open,
  onOpenChange,
  onStatusChange,
  onAtribuir,
}: DoacaoDialogProps) {
  const [atribuirOpen, setAtribuirOpen] = useState(false);

  if (!doacao) return null;

  const voluntario = doacao.voluntarioId
    ? voluntariosMock.find((v) => v.id === doacao.voluntarioId)
    : null;

  // Agrupa itens por tipo para exibição organizada
  const itensPorTipo = doacao.itens.reduce(
    (acc, item) => {
      if (!acc[item.tipo]) acc[item.tipo] = [];
      acc[item.tipo].push(item);
      return acc;
    },
    {} as Record<string, typeof doacao.itens>
  );

  const podeAtribuir = ["Pendente", "Negado"].includes(doacao.status);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-lg">
                  Doação de {doacao.nomeDoador}
                </DialogTitle>
                <p className="text-xs text-gray-400 mt-0.5">
                  Registrada em {doacao.criadaEm} · ID {doacao.id}
                </p>
              </div>
              <StatusBadge status={doacao.status} />
            </div>
          </DialogHeader>

          <Separator />

          {/* ── Alterar status ── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Alterar status
            </p>
            <Select
              value={doacao.status}
              onValueChange={(val) =>
                onStatusChange(doacao.id, val as StatusDoacao)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={s} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* ── Itens doados ── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Itens doados
            </p>
            <div className="space-y-2">
              {Object.entries(itensPorTipo).map(([tipo, itens]) => (
                <div key={tipo} className="rounded-lg border p-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    {TIPO_LABEL[tipo as keyof typeof TIPO_LABEL]}
                  </p>
                  <div className="space-y-1">
                    {itens.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700 flex items-center gap-1.5">
                          <Package size={12} className="text-gray-400" />
                          {item.nome}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs text-gray-500"
                        >
                          x{item.quantidade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Contato do doador ── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Contato
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone size={13} className="text-gray-400" />
                {doacao.telefone}
                {doacao.whatsapp && (
                  <span className="text-[11px] text-green-600 font-semibold">
                    WhatsApp
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Endereço ── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Endereço de coleta
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>
                {doacao.endereco.logradouro}, {doacao.endereco.numero}
                {doacao.endereco.complemento
                  ? ` — ${doacao.endereco.complemento}`
                  : ""}
                <br />
                {doacao.endereco.bairro} · {doacao.endereco.municipio}/
                {doacao.endereco.estado}
                <br />
                <span className="text-gray-400 text-xs">
                  CEP {doacao.endereco.cep}
                </span>
              </span>
            </div>
          </div>

          <Separator />

          {/* ── Data e hora ── */}
          <div className="flex gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Data
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar size={13} className="text-gray-400" />
                {doacao.dataColeta}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Horário
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Clock size={13} className="text-gray-400" />
                {doacao.horaColeta}
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Voluntário atribuído ── */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Voluntário
            </p>

            {voluntario ? (
              <div className="rounded-lg border p-3 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {voluntario.nome}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <Phone size={10} />
                    {voluntario.telefone}
                    {voluntario.whatsapp && (
                      <span className="text-green-600 font-medium">
                        · WhatsApp
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {voluntario.endereco.bairro} ·{" "}
                    {voluntario.totalColetas} coletas
                  </p>
                </div>
                <UserCheck size={18} className="text-green-600" />
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum voluntário atribuído.
              </p>
            )}
          </div>

          {/* ── Ações ── */}
          <div className="flex gap-2 pt-1">
            {podeAtribuir && (
              <Button
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 gap-2"
                onClick={() => setAtribuirOpen(true)}
              >
                <UserCheck size={15} />
                {voluntario ? "Reatribuir voluntário" : "Atribuir voluntário"}
              </Button>
            )}
            {voluntario && (
              <Button variant="outline" className="gap-2 flex-1" disabled>
                <MessageSquare size={15} />
                Enviar mensagem
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de atribuição aninhado */}
      <AtribuirDialog
        open={atribuirOpen}
        onOpenChange={setAtribuirOpen}
        doacao={doacao}
        onAtribuir={(volId) => onAtribuir(doacao.id, volId)}
      />
    </>
  );
}
