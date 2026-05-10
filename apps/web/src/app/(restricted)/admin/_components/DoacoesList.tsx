"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Clock, Package, Search } from "lucide-react";
import { Doacao, StatusDoacao } from "./mockData";
import { StatusBadge, STATUS_OPTIONS } from "./StatusBadge";

interface DoacoesListProps {
  doacoes: Doacao[];
  onSelect: (doacao: Doacao) => void;
}

export function DoacoesList({ doacoes, onSelect }: DoacoesListProps) {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusDoacao | "Todos">(
    "Todos"
  );

  const filtradas = doacoes.filter((d) => {
    const buscaOk =
      d.nomeDoador.toLowerCase().includes(busca.toLowerCase()) ||
      d.endereco.bairro.toLowerCase().includes(busca.toLowerCase());
    const statusOk = filtroStatus === "Todos" || d.status === filtroStatus;
    return buscaOk && statusOk;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Buscar por nome ou bairro..."
            className="pl-8 text-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select
          value={filtroStatus}
          onValueChange={(v) =>
            setFiltroStatus(v as StatusDoacao | "Todos")
          }
        >
          <SelectTrigger className="w-44 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                <StatusBadge status={s} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contador */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {filtradas.length} doaç{filtradas.length !== 1 ? "ões" : "ão"}{" "}
        encontrada{filtradas.length !== 1 ? "s" : ""}
      </p>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Package size={32} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
          <p className="text-sm">Nenhuma doação encontrada.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtradas.map((doacao) => (
            <Card
              key={doacao.id}
              className="cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-md transition-all duration-200 group dark:bg-gray-800 dark:border-gray-700"
              onClick={() => onSelect(doacao)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        {doacao.nomeDoador}
                      </p>
                      <StatusBadge status={doacao.status} />
                    </div>

                    {/* Endereço */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-2">
                      <MapPin size={11} />
                      <span className="truncate">
                        {doacao.endereco.bairro} ·{" "}
                        {doacao.endereco.municipio}/{doacao.endereco.estado}
                      </span>
                    </div>

                    {/* Itens resumidos */}
                    <div className="flex flex-wrap gap-1.5">
                      {doacao.itens.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5"
                        >
                          {item.nome} x{item.quantidade}
                        </span>
                      ))}
                      {doacao.itens.length > 3 && (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                          +{doacao.itens.length - 3} itens
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Data e hora */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar size={11} />
                      {doacao.dataColeta}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock size={11} />
                      {doacao.horaColeta}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
