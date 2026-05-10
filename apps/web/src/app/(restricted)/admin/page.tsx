"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./_components/AdminSidebar";
import { DoacoesList } from "./_components/DoacoesList";
import { DoacaoDialog } from "./_components/DoacaoDialog";
import { VoluntariosList } from "./_components/VoluntariosList";
import { VoluntarioDialog } from "./_components/VoluntarioDialog";
import { PainelAtribuicao } from "./_components/PainelAtribuicao";
import {
  NovoVoluntarioDialog,
  NovoVoluntarioDados,
} from "./_components/NovoVoluntarioDialog";
import {
  doacoesMock,
  voluntariosMock,
  Doacao,
  Voluntario,
  StatusDoacao,
  TipoItem,
} from "./_components/mockData";

type AbaAtiva = "doacoes" | "voluntarios" | "atribuicao";

const SENHA_ADMIN_MVP = "doame2025";
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const IGREJA_ID = process.env.NEXT_PUBLIC_IGREJA_ID ?? "igreja-itapetininga-01";

// ── Mapeamento de resposta da API para tipo frontend ──────────────────────────

function parseEndereco(str: string) {
  const partes = str.split("—");
  const end = partes[0]?.trim() ?? str;
  const local = partes[1]?.trim() ?? "";
  const [bairroMuni = "", uf = ""] = local.split("/");
  const [bairro = "", municipio = ""] = bairroMuni.split(",");
  const [logradouro = end, numero = ""] = end.split(",");
  return {
    logradouro: logradouro.trim(),
    numero: numero.trim(),
    bairro: bairro.trim(),
    municipio: municipio.trim(),
    estado: uf.trim(),
    cep: "",
  };
}

function mapApiVoluntario(v: Record<string, unknown>): Voluntario {
  return {
    id: v.id as string,
    nome: v.nome as string,
    email: (v.email as string) ?? "",
    telefone: (v.telefone as string) ?? "",
    whatsapp: !!(v.whatsapp),
    endereco: parseEndereco((v.endereco as string) ?? ""),
    aprovado: !!(v.aprovado),
    ativo: !!(v.ativo),
    disponivel: !!(v.disponivel),
    totalColetas: (v.totalColetas as number) ?? 0,
  };
}

function mapApiDoacao(d: Record<string, unknown>): Doacao {

  const mapStatus = (s: string): StatusDoacao => {
    const m: Record<string, StatusDoacao> = {
      PENDENTE: "Pendente",
      AGUARDANDO: "Aguardando",
      CONFIRMADO: "Confirmado",
      NEGADO: "Negado",
      ATRIBUIDO: "Atribuido",
      COLETADO: "Coletado",
      ENTREGUE: "Entregue",
    };
    return m[s] ?? "Pendente";
  };

  const fmtDate = (v: string | Date) => {
    const dt = new Date(v as string);
    return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  };

  const mapTipo = (cat: string): TipoItem =>
    cat === "FINANCEIRA" ? "dinheiro" : (cat.toLowerCase() as TipoItem);

  const itens = d.itens as Array<Record<string, unknown>> | undefined;
  const atribuicoes = d.atribuicoes as
    | Array<Record<string, unknown>>
    | undefined;

  return {
    id: d.id as string,
    nomeDoador: d.nomeDoador as string,
    telefone: d.telefoneDoador as string,
    whatsapp: !!d.whatsappDoador,
    itens: (itens ?? []).map((i) => ({
      tipo: mapTipo(i.categoria as string),
      nome: i.nome as string,
      quantidade: i.quantidade as number,
    })),
    endereco: parseEndereco((d.enderecoDoador as string) ?? ""),
    dataColeta: fmtDate(d.dataColeta as string),
    horaColeta: (d.horarioColeta as string) ?? "",
    status: mapStatus(d.status as string),
    voluntarioId: atribuicoes?.[0]?.voluntarioId as string | undefined,
    criadaEm: fmtDate((d.criadaEm ?? d.createdAt ?? new Date()) as string),
  };
}

export default function AdminPage() {
  const router = useRouter();

  // ── Dark mode ──
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("doame_dark_mode");
    if (saved === "true") setDarkMode(true);
  }, []);
  const toggleDark = () => {
    setDarkMode((v) => {
      localStorage.setItem("doame_dark_mode", String(!v));
      return !v;
    });
  };

  // ── Guarda de autenticação ──
  useEffect(() => {
    const logado = localStorage.getItem("doame_admin_logado");
    if (!logado) router.replace("/login");
  }, [router]);

  // ── Estado principal ──
  const [doacoes, setDoacoes] = useState<Doacao[]>(doacoesMock);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>(voluntariosMock);

  // ── Busca de doações da API ──
  useEffect(() => {
    const token = localStorage.getItem("doame_admin_token");
    if (!token) return;
    fetch(`${API}/doacoes?igrejaId=${IGREJA_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setDoacoes((data as Array<Record<string, unknown>>).map(mapApiDoacao));
        }
      })
      .catch(() => {});
  }, []);

  // ── Busca de voluntários da API ──
  useEffect(() => {
    const token = localStorage.getItem("doame_admin_token");
    if (!token) return;
    fetch(`${API}/voluntarios?igrejaId=${IGREJA_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setVoluntarios((data as Array<Record<string, unknown>>).map(mapApiVoluntario));
        }
      })
      .catch(() => {});
  }, []);

  // ── Navegação ──
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("doacoes");

  // ── Dialogs ──
  const [doacaoSelecionada, setDoacaoSelecionada] = useState<Doacao | null>(
    null,
  );
  const [doacaoDialogOpen, setDoacaoDialogOpen] = useState(false);
  const [voluntarioSelecionado, setVoluntarioSelecionado] =
    useState<Voluntario | null>(null);
  const [voluntarioDialogOpen, setVoluntarioDialogOpen] = useState(false);
  const [novoVoluntarioOpen, setNovoVoluntarioOpen] = useState(false);

  // ── Handlers de doação ──
  const handleSelecionarDoacao = (doacao: Doacao) => {
    setDoacaoSelecionada(doacao);
    setDoacaoDialogOpen(true);
  };
  const handleSelecionarVoluntario = (v: Voluntario) => {
    setVoluntarioSelecionado(v);
    setVoluntarioDialogOpen(true);
  };

  const handleStatusChange = (id: string, novoStatus: StatusDoacao) => {
    setDoacoes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: novoStatus } : d)),
    );
    setDoacaoSelecionada((prev) =>
      prev?.id === id ? { ...prev, status: novoStatus } : prev,
    );
  };

  const handleAtribuir = (doacaoId: string, voluntarioId: string) => {
    setDoacoes((prev) =>
      prev.map((d) =>
        d.id === doacaoId
          ? { ...d, voluntarioId, status: "Aguardando" as StatusDoacao }
          : d,
      ),
    );
    setDoacaoSelecionada((prev) =>
      prev?.id === doacaoId
        ? { ...prev, voluntarioId, status: "Aguardando" }
        : prev,
    );
  };

  // ── Handlers de voluntário ──
  const handleEditarVoluntario = async (
    id: string,
    dados: Partial<Voluntario>,
    senhaAdmin: string,
  ): Promise<{ ok: boolean; erro?: string }> => {
    const token = localStorage.getItem("doame_admin_token");
    try {
      const original = voluntarios.find((v) => v.id === id);
      const body: Record<string, unknown> = { senhaAdmin };
      if (dados.nome !== undefined) body.nome = dados.nome;
      if (dados.telefone !== undefined) body.telefone = dados.telefone;
      if (dados.whatsapp !== undefined)
        body.whatsapp = dados.whatsapp
          ? (dados.telefone ?? original?.telefone ?? "")
          : undefined;
      if (dados.disponivel !== undefined) body.disponivel = dados.disponivel;
      if (dados.aprovado !== undefined) body.aprovado = dados.aprovado;
      if (dados.ativo !== undefined) body.ativo = dados.ativo;
      if (dados.endereco !== undefined) {
        const e = dados.endereco;
        body.endereco = [
          [e.logradouro, e.numero].filter(Boolean).join(", "),
          [[e.bairro, e.municipio].filter(Boolean).join(", "), e.estado]
            .filter(Boolean)
            .join("/"),
        ]
          .filter(Boolean)
          .join(" — ");
      }
      const res = await fetch(`${API}/voluntarios/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err?.message)
          ? err.message[0]
          : (err?.message ?? "Erro ao atualizar.");
        return { ok: false, erro: msg };
      }
      setVoluntarios((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...dados } : v)),
      );
      setVoluntarioSelecionado((prev) =>
        prev?.id === id ? { ...prev, ...dados } : prev,
      );
      return { ok: true };
    } catch {
      return { ok: false, erro: "Não foi possível conectar ao servidor." };
    }
  };

  const handleExcluirVoluntario = async (
    id: string,
    senhaAdmin: string,
  ): Promise<{ ok: boolean; erro?: string }> => {
    if (senhaAdmin !== SENHA_ADMIN_MVP)
      return { ok: false, erro: "Senha incorreta. Tente novamente." };
    setVoluntarios((prev) => prev.filter((v) => v.id !== id));
    return { ok: true };
  };

  const handleCadastrarVoluntario = async (
    dados: NovoVoluntarioDados,
  ): Promise<{ ok: boolean; erro?: string }> => {
    const token = localStorage.getItem("doame_admin_token");
    try {
      const res = await fetch(`${API}/voluntarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          whatsapp: dados.whatsapp ? dados.telefone : undefined,
          endereco: [
            [dados.endereco.logradouro, dados.endereco.numero].filter(Boolean).join(", "),
            [[dados.endereco.bairro, dados.endereco.municipio].filter(Boolean).join(", "), dados.endereco.estado].filter(Boolean).join("/"),
          ].filter(Boolean).join(" — "),
          igrejaId: IGREJA_ID,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = Array.isArray(body?.message)
          ? body.message[0]
          : (body?.message ?? "Erro ao cadastrar.");
        return { ok: false, erro: msg };
      }
      const novoVol = await res.json();
      setVoluntarios((prev) => [
        ...prev,
        {
          id: novoVol.id,
          nome: dados.nome,
          telefone: dados.telefone,
          whatsapp: dados.whatsapp,
          email: dados.email,
          endereco: {
            logradouro: dados.endereco.logradouro,
            numero: dados.endereco.numero,
            bairro: dados.endereco.bairro,
            municipio: dados.endereco.municipio,
            estado: dados.endereco.estado,
            cep: dados.endereco.cep,
          },
          aprovado: false,
          ativo: true,
          disponivel: false,
          totalColetas: 0,
        },
      ]);
      return { ok: true };
    } catch {
      return { ok: false, erro: "Não foi possível conectar ao servidor." };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doame_admin_logado");
    localStorage.removeItem("doame_admin_token");
    router.replace("/login");
  };

  // ── Render ──
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar
          abaAtiva={abaAtiva}
          onAbaChange={setAbaAtiva}
          onLogout={handleLogout}
          totalDoacoes={doacoes.length}
          totalVoluntarios={voluntarios.length}
          totalPendentes={
            doacoes.filter(
              (d) => d.status === "Pendente" || d.status === "Negado",
            ).length
          }
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {abaAtiva === "doacoes" && (
            <div>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Doações
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                  Gerencie e acompanhe todas as doações registradas.
                </p>
              </div>
              <DoacoesList
                doacoes={doacoes}
                onSelect={handleSelecionarDoacao}
              />
            </div>
          )}

          {abaAtiva === "voluntarios" && (
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Voluntários
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    Visualize e gerencie os voluntários cadastrados.
                  </p>
                </div>
                <Button
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white shrink-0"
                  onClick={() => setNovoVoluntarioOpen(true)}
                >
                  <UserPlus size={16} />
                  Novo Voluntário
                </Button>
              </div>
              <VoluntariosList
                voluntarios={voluntarios}
                onSelect={handleSelecionarVoluntario}
              />
            </div>
          )}

          {abaAtiva === "atribuicao" && (
            <PainelAtribuicao
              doacoes={doacoes}
              voluntarios={voluntarios}
              onAtribuir={handleAtribuir}
            />
          )}
        </main>

        <DoacaoDialog
          doacao={doacaoSelecionada}
          open={doacaoDialogOpen}
          onOpenChange={setDoacaoDialogOpen}
          onStatusChange={handleStatusChange}
          onAtribuir={handleAtribuir}
        />
        <VoluntarioDialog
          voluntario={voluntarioSelecionado}
          open={voluntarioDialogOpen}
          onOpenChange={setVoluntarioDialogOpen}
          onEditar={handleEditarVoluntario}
          onExcluir={handleExcluirVoluntario}
        />
        <NovoVoluntarioDialog
          open={novoVoluntarioOpen}
          onOpenChange={setNovoVoluntarioOpen}
          onCadastrar={handleCadastrarVoluntario}
        />
      </div>
    </div>
  );
}
