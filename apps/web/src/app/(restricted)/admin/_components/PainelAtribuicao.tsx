"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PainelAtribuicao.tsx
//
// Painel split-view para atribuição de voluntários a doações.
// Painel esquerdo: lista filtrável de doações pendentes de atribuição.
// Painel direito: voluntários sugeridos para a doação selecionada.
//
// Integração futura:
//   - Lista esquerda: GET /api/doacoes?status=Pendente,Negado
//   - Sugeridos direita: GET /api/voluntarios/sugeridos?doacaoId=:id
//   - Atribuição: POST /api/doacoes/:id/atribuir { voluntarioId }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Search,
  Star,
  Package,
  Clock,
  Calendar,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Users,
  ArrowRight,
  Shirt,
  DollarSign,
} from "lucide-react";
import {
  Doacao,
  Voluntario,
  StatusDoacao,
  sugerirVoluntarios,
} from "./mockData";
import { StatusBadge, STATUS_OPTIONS } from "./StatusBadge";

// ─── Utilitários ────────────────────────────────────────────────────────────

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function iconeCategoria(itens: Doacao["itens"]) {
  const tipos = new Set(itens.map((i) => i.tipo));
  if (tipos.has("alimento") && tipos.has("agasalho"))
    return <Package size={14} className="text-yellow-600" />;
  if (tipos.has("agasalho"))
    return <Shirt size={14} className="text-blue-500" />;
  if (tipos.has("dinheiro"))
    return <DollarSign size={14} className="text-green-600" />;
  return <Package size={14} className="text-yellow-600" />;
}

function MatchBadge({
  voluntario,
  doacao,
}: {
  voluntario: Voluntario;
  doacao: Doacao;
}) {
  const mesmoBairro =
    voluntario.endereco.bairro.toLowerCase() ===
    doacao.endereco.bairro.toLowerCase();
  const mesmoMunicipio =
    voluntario.endereco.municipio.toLowerCase() ===
    doacao.endereco.municipio.toLowerCase();

  if (mesmoBairro)
    return (
      <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] gap-1 font-semibold px-1.5 py-0.5">
        <Star size={9} className="fill-green-600" /> Mesmo bairro
      </Badge>
    );
  if (mesmoMunicipio)
    return (
      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold px-1.5 py-0.5">
        Mesmo município
      </Badge>
    );
  return (
    <Badge className="bg-gray-50 text-gray-400 border border-gray-200 text-[10px] font-semibold px-1.5 py-0.5">
      Outro município
    </Badge>
  );
}

// ─── Painel esquerdo: card de doação ────────────────────────────────────────

interface DoacaoItemProps {
  doacao: Doacao;
  selecionada: boolean;
  atribuido: boolean;
  onClick: () => void;
}

function DoacaoItem({ doacao, selecionada, atribuido, onClick }: DoacaoItemProps) {
  const totalItens = doacao.itens.reduce((s, i) => s + i.quantidade, 0);
  const nomesCurtos = doacao.itens
    .slice(0, 2)
    .map((i) => i.nome)
    .join(", ");
  const resto = doacao.itens.length > 2 ? ` +${doacao.itens.length - 2}` : "";

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 border-b last:border-b-0 transition-all duration-150
        ${
          selecionada
            ? "bg-yellow-50 border-l-2 border-l-yellow-500"
            : "hover:bg-gray-50 border-l-2 border-l-transparent"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Nome + ícone de categoria */}
          <div className="flex items-center gap-1.5 mb-1">
            {iconeCategoria(doacao.itens)}
            <span className="text-sm font-semibold text-gray-800 truncate">
              {doacao.nomeDoador}
            </span>
          </div>

          {/* Itens */}
          <p className="text-xs text-gray-500 truncate mb-1.5">
            {totalItens} {totalItens === 1 ? "item" : "itens"} — {nomesCurtos}{resto}
          </p>

          {/* Endereço */}
          <div className="flex items-center gap-1 text-gray-400">
            <MapPin size={10} />
            <span className="text-[11px] truncate">
              {doacao.endereco.bairro}, {doacao.endereco.municipio}
            </span>
          </div>

          {/* Data e hora */}
          <div className="flex items-center gap-3 mt-1 text-gray-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar size={10} />
              {doacao.dataColeta}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Clock size={10} />
              {doacao.horaColeta}
            </span>
          </div>
        </div>

        {/* Status + indicador de atribuição */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <StatusBadge status={doacao.status} />
          {atribuido && (
            <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold">
              <CheckCircle2 size={10} />
              Atribuído
            </span>
          )}
        </div>
      </div>

      {/* Seta indicando seleção */}
      {selecionada && (
        <div className="flex justify-end mt-1">
          <ArrowRight size={12} className="text-yellow-500" />
        </div>
      )}
    </button>
  );
}

// ─── Painel direito: card de voluntário ─────────────────────────────────────

interface VoluntarioCardProps {
  voluntario: Voluntario;
  doacao: Doacao;
  jaAtribuido: boolean;
  onAtribuir: (voluntarioId: string) => void;
  index: number;
}

function VoluntarioCard({
  voluntario,
  doacao,
  jaAtribuido,
  onAtribuir,
  index,
}: VoluntarioCardProps) {
  return (
    <div
      className={`
        flex items-center gap-3 border rounded-xl p-3.5 bg-white transition-all duration-150
        ${
          jaAtribuido
            ? "border-green-300 bg-green-50"
            : "hover:border-yellow-300 hover:shadow-sm"
        }
      `}
    >
      {/* Posição no ranking */}
      <span className="text-xs font-bold text-gray-300 w-5 text-center flex-shrink-0">
        {index + 1}
      </span>

      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback
          className={`text-xs font-bold ${
            jaAtribuido
              ? "bg-green-200 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {iniciais(voluntario.nome)}
        </AvatarFallback>
      </Avatar>

      {/* Dados do voluntário */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {voluntario.nome}
          </p>
          <MatchBadge voluntario={voluntario} doacao={doacao} />
          {jaAtribuido && (
            <Badge className="bg-green-100 text-green-700 border-green-300 text-[10px] px-1.5 py-0.5">
              <CheckCircle2 size={9} className="mr-0.5" />
              Atual
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <MapPin size={10} />
          <span className="text-[11px] truncate">
            {voluntario.endereco.bairro}, {voluntario.endereco.municipio}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Phone size={10} />
            {voluntario.telefone}
            {voluntario.whatsapp && (
              <span className="text-green-600 font-medium ml-1">WhatsApp</span>
            )}
          </span>
        </div>

        <p className="text-[11px] text-gray-400 mt-0.5">
          {voluntario.totalColetas} coleta{voluntario.totalColetas !== 1 ? "s" : ""} realizadas
        </p>
      </div>

      {/* Botão de atribuição */}
      <Button
        size="sm"
        disabled={jaAtribuido}
        onClick={() => onAtribuir(voluntario.id)}
        className={`
          text-xs flex-shrink-0 transition-all
          ${
            jaAtribuido
              ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-100 cursor-default"
              : "bg-yellow-600 hover:bg-yellow-700 text-white"
          }
        `}
        variant={jaAtribuido ? "outline" : "default"}
      >
        {jaAtribuido ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} /> Atribuído
          </span>
        ) : (
          "Atribuir"
        )}
      </Button>
    </div>
  );
}

// ─── Estado vazio do painel direito ─────────────────────────────────────────

function PainelDireitoVazio() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16 px-8">
      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
        <Users size={28} className="text-yellow-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">
          Selecione uma doação
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          Clique em qualquer doação na lista à esquerda para ver os voluntários
          sugeridos por proximidade.
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

interface PainelAtribuicaoProps {
  doacoes: Doacao[];
  voluntarios: Voluntario[];
  onAtribuir: (doacaoId: string, voluntarioId: string) => void;
}

export function PainelAtribuicao({
  doacoes,
  voluntarios: _voluntarios,
  onAtribuir,
}: PainelAtribuicaoProps) {
  const [doacaoSelecionadaId, setDoacaoSelecionadaId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusDoacao | "Todos">("Todos");

  // ── Doações filtradas (painel esquerdo) ──────────────────────────────────
  const doacoesFiltradas = useMemo(() => {
    return doacoes.filter((d) => {
      const buscaOk =
        d.nomeDoador.toLowerCase().includes(busca.toLowerCase()) ||
        d.endereco.bairro.toLowerCase().includes(busca.toLowerCase()) ||
        d.endereco.municipio.toLowerCase().includes(busca.toLowerCase());
      const statusOk = filtroStatus === "Todos" || d.status === filtroStatus;
      return buscaOk && statusOk;
    });
  }, [doacoes, busca, filtroStatus]);

  // ── Doação selecionada ───────────────────────────────────────────────────
  const doacaoSelecionada = useMemo(
    () => doacoes.find((d) => d.id === doacaoSelecionadaId) ?? null,
    [doacoes, doacaoSelecionadaId]
  );

  // ── Voluntários sugeridos para a doação selecionada ─────────────────────
  // TODO: substituir por GET /api/voluntarios/sugeridos?doacaoId=:id
  const sugeridos = useMemo(() => {
    if (!doacaoSelecionada) return [];
    return sugerirVoluntarios(doacaoSelecionada);
  }, [doacaoSelecionada]);

  // ── Handler de atribuição ────────────────────────────────────────────────
  const handleAtribuir = (voluntarioId: string) => {
    if (!doacaoSelecionadaId) return;
    onAtribuir(doacaoSelecionadaId, voluntarioId);
  };

  // ── Contadores para header ───────────────────────────────────────────────
  const totalPendentes = doacoes.filter(
    (d) => d.status === "Pendente" || d.status === "Negado"
  ).length;
  const totalAtribuidos = doacoes.filter((d) => d.voluntarioId).length;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header com métricas ─────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Painel de Atribuição</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Clique em uma doação para ver os voluntários mais próximos em tempo real.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            <span className="text-gray-500">
              <span className="font-bold text-gray-700">{totalPendentes}</span> pendentes
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-gray-500">
              <span className="font-bold text-gray-700">{totalAtribuidos}</span> com voluntário
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
            <span className="text-gray-500">
              <span className="font-bold text-gray-700">{doacoes.length}</span> total
            </span>
          </div>
        </div>
      </div>

      {/* ── Split-view ──────────────────────────────────────────────────── */}
      <div className="flex gap-5 flex-1 min-h-0">

        {/* ── Painel esquerdo: lista de doações ─────────────────────────── */}
        <div className="w-[380px] flex-shrink-0 flex flex-col border rounded-xl bg-white overflow-hidden shadow-sm">
          {/* Filtros */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar doação ou bairro…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Select
              value={filtroStatus}
              onValueChange={(v) =>
                setFiltroStatus(v as StatusDoacao | "Todos")
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de doações */}
          <div className="flex-1 overflow-y-auto">
            {doacoesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-gray-400 px-4">
                <AlertCircle size={24} className="text-gray-300" />
                <p className="text-sm">Nenhuma doação encontrada.</p>
              </div>
            ) : (
              doacoesFiltradas.map((d) => (
                <DoacaoItem
                  key={d.id}
                  doacao={d}
                  selecionada={d.id === doacaoSelecionadaId}
                  atribuido={!!d.voluntarioId}
                  onClick={() =>
                    setDoacaoSelecionadaId(
                      d.id === doacaoSelecionadaId ? null : d.id
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Footer contador */}
          <div className="border-t px-4 py-2 bg-gray-50">
            <p className="text-[11px] text-gray-400">
              {doacoesFiltradas.length} de {doacoes.length} doações
            </p>
          </div>
        </div>

        {/* ── Painel direito: voluntários sugeridos ─────────────────────── */}
        <div className="flex-1 flex flex-col border rounded-xl bg-white overflow-hidden shadow-sm">
          {doacaoSelecionada ? (
            <>
              {/* Header do painel direito */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck size={15} className="text-yellow-600 flex-shrink-0" />
                      <p className="text-sm font-bold text-gray-800">
                        Voluntários para {doacaoSelecionada.nomeDoador}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                      <MapPin size={11} />
                      <span className="text-xs">
                        {doacaoSelecionada.endereco.bairro} —{" "}
                        {doacaoSelecionada.endereco.municipio}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Ordenados por proximidade ao endereço de coleta
                    </p>
                  </div>
                  <StatusBadge status={doacaoSelecionada.status} />
                </div>

                {/* Itens da doação */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {doacaoSelecionada.itens.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {iconeCategoria([item])}
                      {item.quantidade}× {item.nome}
                    </span>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Lista de voluntários sugeridos */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {sugeridos.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center text-gray-400">
                    <AlertCircle size={28} className="text-gray-300" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nenhum voluntário disponível
                      </p>
                      <p className="text-xs mt-1">
                        Verifique se há voluntários aprovados, ativos e disponíveis.
                      </p>
                    </div>
                  </div>
                ) : (
                  sugeridos.map((v, i) => (
                    <VoluntarioCard
                      key={v.id}
                      voluntario={v}
                      doacao={doacaoSelecionada}
                      jaAtribuido={doacaoSelecionada.voluntarioId === v.id}
                      onAtribuir={handleAtribuir}
                      index={i}
                    />
                  ))
                )}
              </div>

              {/* Footer com legenda */}
              <div className="border-t px-4 py-2.5 bg-gray-50">
                <div className="flex items-center gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star size={10} className="fill-green-600 text-green-600" />
                    Mesmo bairro — melhor match
                  </span>
                  <span>·</span>
                  <span className="text-blue-500 font-medium">Mesmo município</span>
                  <span>·</span>
                  <span>Outro município</span>
                </div>
              </div>
            </>
          ) : (
            <PainelDireitoVazio />
          )}
        </div>
      </div>
    </div>
  );
}
