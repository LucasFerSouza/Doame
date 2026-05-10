"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Users, LogOut, GitMerge } from "lucide-react";

type AbaAtiva = "doacoes" | "voluntarios" | "atribuicao";

interface AdminSidebarProps {
  abaAtiva: AbaAtiva;
  onAbaChange: (aba: AbaAtiva) => void;
  onLogout: () => void;
  totalDoacoes: number;
  totalVoluntarios: number;
  totalPendentes: number;
}

export function AdminSidebar({
  abaAtiva,
  onAbaChange,
  onLogout,
  totalDoacoes,
  totalVoluntarios,
  totalPendentes,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: "doacoes" as AbaAtiva,
      label: "Doações",
      icone: <Package size={18} />,
      contador: totalDoacoes,
    },
    {
      id: "voluntarios" as AbaAtiva,
      label: "Voluntários",
      icone: <Users size={18} />,
      contador: totalVoluntarios,
    },
    {
      id: "atribuicao" as AbaAtiva,
      label: "Atribuição",
      icone: <GitMerge size={18} />,
      contador: totalPendentes,
    },
  ];

  return (
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 border-r bg-white flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <Image src="/Isologo.svg" alt="Doame" width={36} height={36} />
        <div>
          <p className="font-bold text-gray-800 leading-none">Doame</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Painel Admin</p>
        </div>
      </div>

      <Separator />

      {/* Navegação */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const ativo = abaAtiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onAbaChange(item.id)}
              className={`
                w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all duration-150
                ${
                  ativo
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }
              `}
            >
              <span className="flex items-center gap-2.5">
                <span className={ativo ? "text-yellow-600" : "text-gray-400"}>
                  {item.icone}
                </span>
                {item.label}
              </span>
              <span
                className={`
                  text-[11px] font-bold px-1.5 py-0.5 rounded-full
                  ${ativo ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-500"}
                `}
              >
                {item.contador}
              </span>
            </button>
          );
        })}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 text-sm"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Sair
        </Button>
      </div>
    </aside>
  );
}
