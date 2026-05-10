"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Award, Search, Users } from "lucide-react";
import { Voluntario } from "./mockData";

interface VoluntariosListProps {
  voluntarios: Voluntario[];
  onSelect: (voluntario: Voluntario) => void;
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function VoluntariosList({
  voluntarios,
  onSelect,
}: VoluntariosListProps) {
  const [busca, setBusca] = useState("");

  const filtrados = voluntarios.filter(
    (v) =>
      v.nome.toLowerCase().includes(busca.toLowerCase()) ||
      v.endereco.bairro.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Busca */}
      <div className="relative">
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

      {/* Contador */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {filtrados.length} voluntário{filtrados.length !== 1 ? "s" : ""}{" "}
        encontrado{filtrados.length !== 1 ? "s" : ""}
      </p>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Users
            size={32}
            className="mx-auto mb-3 text-gray-200 dark:text-gray-700"
          />
          <p className="text-sm">Nenhum voluntário encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtrados.map((v) => (
            <Card
              key={v.id}
              className="cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:border-gray-700"
              onClick={() => onSelect(v)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-bold">
                      {iniciais(v.nome)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        {v.nome}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          v.aprovado
                            ? "text-green-700 border-green-200 bg-green-50 text-[10px]"
                            : "text-gray-500 border-gray-200 bg-gray-50 text-[10px]"
                        }
                      >
                        {v.aprovado ? "Aprovado" : "Pendente"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          v.disponivel
                            ? "text-blue-700 border-blue-200 bg-blue-50 text-[10px]"
                            : "text-orange-600 border-orange-200 bg-orange-50 text-[10px]"
                        }
                      >
                        {v.disponivel ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {v.endereco.bairro} · {v.endereco.municipio}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {v.telefone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={11} />
                        {v.totalColetas} coletas
                      </span>
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
