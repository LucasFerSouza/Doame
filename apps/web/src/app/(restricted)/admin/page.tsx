"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "./_components/AdminSidebar";
import { DoacoesList } from "./_components/DoacoesList";
import { DoacaoDialog } from "./_components/DoacaoDialog";
import { VoluntariosList } from "./_components/VoluntariosList";
import { VoluntarioDialog } from "./_components/VoluntarioDialog";
import { PainelAtribuicao } from "./_components/PainelAtribuicao";
import {
  doacoesMock,
  voluntariosMock,
  Doacao,
  Voluntario,
  StatusDoacao,
} from "./_components/mockData";

type AbaAtiva = "doacoes" | "voluntarios" | "atribuicao";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Page — orquestrador do dashboard
//
// Todo o estado vive aqui. Os componentes filhos recebem dados e callbacks.
// Quando o backend NestJS estiver pronto, os estados serão inicializados
// com chamadas à API em vez dos arrays mockados.
// ─────────────────────────────────────────────────────────────────────────────

// Senha hardcoded do MVP — TODO: remover quando login usar JWT real
const SENHA_ADMIN_MVP = "doame2025";

export default function AdminPage() {
  const router = useRouter();

  // ── Guarda de autenticação ──
  useEffect(() => {
    const logado = localStorage.getItem("doame_admin_logado");
    if (!logado) router.replace("/login");
  }, [router]);

  // ── Estado principal ──
  // Substituição futura: useState(await api.get("/doacoes"))
  const [doacoes, setDoacoes] = useState<Doacao[]>(doacoesMock);
  // voluntarios agora é mutável para refletir edições e exclusões localmente
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>(voluntariosMock);

  // ── Navegação ──
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("doacoes");

  // ── Dialogs ──
  const [doacaoSelecionada, setDoacaoSelecionada] = useState<Doacao | null>(null);
  const [doacaoDialogOpen, setDoacaoDialogOpen] = useState(false);

  const [voluntarioSelecionado, setVoluntarioSelecionado] = useState<Voluntario | null>(null);
  const [voluntarioDialogOpen, setVoluntarioDialogOpen] = useState(false);

  // ── Handlers de doação ──

  const handleSelecionarDoacao = (doacao: Doacao) => {
    setDoacaoSelecionada(doacao);
    setDoacaoDialogOpen(true);
  };

  const handleSelecionarVoluntario = (voluntario: Voluntario) => {
    setVoluntarioSelecionado(voluntario);
    setVoluntarioDialogOpen(true);
  };

  // Mudança de status — atualiza o item na lista e reflete no dialog aberto
  // Substituição futura: await api.patch(`/doacoes/${id}/status`, { status })
  const handleStatusChange = (id: string, novoStatus: StatusDoacao) => {
    setDoacoes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: novoStatus } : d)),
    );
    setDoacaoSelecionada((prev) =>
      prev?.id === id ? { ...prev, status: novoStatus } : prev,
    );
  };

  // Atribuição de voluntário
  // Substituição futura: await api.post(`/doacoes/${doacaoId}/atribuir`, { voluntarioId })
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

  // Editar voluntário
  // Substituição futura: await api.patch(`/voluntarios/${id}`, { ...dados, senhaAdmin })
  const handleEditarVoluntario = async (
    id: string,
    dados: Partial<Voluntario>,
    senhaAdmin: string,
  ): Promise<{ ok: boolean; erro?: string }> => {
    // MVP: valida senha localmente — quando integrar ao back, remover esta verificação
    if (senhaAdmin !== SENHA_ADMIN_MVP) {
      return { ok: false, erro: "Senha incorreta. Tente novamente." };
    }

    setVoluntarios((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...dados } : v)),
    );

    // Atualiza também o voluntário selecionado para o dialog refletir os dados novos
    setVoluntarioSelecionado((prev) =>
      prev?.id === id ? { ...prev, ...dados } : prev,
    );

    return { ok: true };
  };

  // Excluir voluntário (soft delete — marca como inativo)
  // Substituição futura: await api.delete(`/voluntarios/${id}`, { body: { senhaAdmin } })
  const handleExcluirVoluntario = async (
    id: string,
    senhaAdmin: string,
  ): Promise<{ ok: boolean; erro?: string }> => {
    // MVP: valida senha localmente — quando integrar ao back, remover esta verificação
    if (senhaAdmin !== SENHA_ADMIN_MVP) {
      return { ok: false, erro: "Senha incorreta. Tente novamente." };
    }

    // Soft delete: remove da lista exibida (o backend marcará como ativo: false)
    setVoluntarios((prev) => prev.filter((v) => v.id !== id));

    return { ok: true };
  };

  const handleLogout = () => {
    localStorage.removeItem("doame_admin_logado");
    router.replace("/login");
  };

  // ── Render ──
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        abaAtiva={abaAtiva}
        onAbaChange={setAbaAtiva}
        onLogout={handleLogout}
        totalDoacoes={doacoes.length}
        totalVoluntarios={voluntarios.length}
        totalPendentes={doacoes.filter((d) => d.status === "Pendente" || d.status === "Negado").length}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {abaAtiva === "doacoes" && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-800">Doações</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Gerencie e acompanhe todas as doações registradas.
              </p>
            </div>
            <DoacoesList doacoes={doacoes} onSelect={handleSelecionarDoacao} />
          </div>
        )}

        {abaAtiva === "voluntarios" && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-800">Voluntários</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Visualize e gerencie os voluntários cadastrados.
              </p>
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

      {/* Dialogs */}
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
    </div>
  );
}
