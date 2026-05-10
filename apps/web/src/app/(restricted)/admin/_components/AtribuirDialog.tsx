"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Star, AlertCircle } from "lucide-react";
import { Doacao, Voluntario, sugerirVoluntarios } from "./mockData";

interface AtribuirDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doacao: Doacao;
  onAtribuir: (voluntarioId: string) => void;
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function MatchLabel({
  voluntario,
  doacao,
}: {
  voluntario: Voluntario;
  doacao: Doacao;
}) {
  const mesmoBairro =
    voluntario.endereco.bairro.toLowerCase() ===
    doacao.endereco.bairro.toLowerCase();
  const mesmaMunicipio =
    voluntario.endereco.municipio.toLowerCase() ===
    doacao.endereco.municipio.toLowerCase();

  if (mesmoBairro)
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] gap-1">
        <Star size={10} /> Mesmo bairro
      </Badge>
    );
  if (mesmaMunicipio)
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
        Mesmo município
      </Badge>
    );
  return (
    <Badge className="bg-gray-50 text-gray-500 border-gray-200 text-[10px]">
      Outro município
    </Badge>
  );
}

export function AtribuirDialog({
  open,
  onOpenChange,
  doacao,
  onAtribuir,
}: AtribuirDialogProps) {
  const sugeridos = sugerirVoluntarios(doacao);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir voluntário</DialogTitle>
          <DialogDescription>
            Voluntários ordenados por proximidade ao endereço de coleta. O
            primeiro da lista é o melhor match.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {sugeridos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center text-gray-400">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-sm">
              Nenhum voluntário disponível no momento.
              <br />
              Verifique se há voluntários aprovados e ativos.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 max-h-96 overflow-y-auto py-1 pr-1">
            {sugeridos.map((v, index) => (
              <li
                key={v.id}
                className="flex items-center gap-3 border rounded-xl p-3 bg-white hover:border-yellow-300 hover:shadow-sm transition-all"
              >
                {/* Posição no ranking */}
                <span className="text-xs font-bold text-gray-300 w-4 text-center flex-shrink-0">
                  {index + 1}
                </span>

                {/* Avatar */}
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="bg-green-100 text-green-700 text-xs font-bold">
                    {iniciais(v.nome)}
                  </AvatarFallback>
                </Avatar>

                {/* Dados */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {v.nome}
                    </p>
                    <MatchLabel voluntario={v} doacao={doacao} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                    <MapPin size={10} />
                    <span className="text-[11px] truncate">
                      {v.endereco.bairro}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Phone size={10} />
                    <span className="text-[11px]">{v.telefone}</span>
                    {v.whatsapp && (
                      <span className="text-[10px] text-green-600 font-medium ml-1">
                        WhatsApp
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {v.totalColetas} coleta{v.totalColetas !== 1 ? "s" : ""}{" "}
                    realizadas
                  </p>
                </div>

                {/* Botão */}
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs flex-shrink-0"
                  onClick={() => {
                    onAtribuir(v.id);
                    onOpenChange(false);
                  }}
                >
                  Atribuir
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
