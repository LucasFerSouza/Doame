"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const IGREJA_ID = process.env.NEXT_PUBLIC_IGREJA_ID ?? "igreja-itapetininga-01";

import {
  StepId,
  FormData,
  ItemCarrinho,
  formDataInicial,
} from "./_components/types";
import { alimentosDisponiveis, agasalhosDisponiveis } from "./_components/data";

import { StepNome } from "./_components/StepNome";
import { StepHub } from "./_components/StepHub";
import { StepItens } from "./_components/StepItens";
import { StepDinheiro } from "./_components/StepDinheiro";
import { StepResumo } from "./_components/StepResumo";
import { StepDataHora } from "./_components/StepDataHora";
import { StepEndereco } from "./_components/StepEndereco";
import { StepContato } from "./_components/StepContato";
import { CarrinhoPopover } from "./_components/CarrinhoPopover";

const STEP_LABELS: Record<StepId, string> = {
  nome: "1 de 7",
  hub: "2 de 7",
  alimento: "3 de 7",
  agasalho: "3 de 7",
  dinheiro: "3 de 7",
  resumo: "4 de 7",
  dataHora: "5 de 7",
  endereco: "6 de 7",
  contato: "7 de 7",
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -120 : 120, opacity: 0 }),
};

export default function Donation() {
  const [step, setStep] = useState<StepId>("nome");
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(formDataInicial);

  const irPara = (destino: StepId, dir: number = 1) => {
    setDirection(dir);
    setStep(destino);
  };

  const atualizar = <K extends keyof FormData>(campo: K, valor: FormData[K]) =>
    setFormData((prev) => ({ ...prev, [campo]: valor }));

  const adicionarItens = (novosItens: ItemCarrinho[]) => {
    setFormData((prev) => {
      const carrinho = [...prev.itens];
      novosItens.forEach((novo) => {
        const idx = carrinho.findIndex(
          (i) => i.nome === novo.nome && i.tipo === novo.tipo,
        );
        if (idx >= 0) {
          carrinho[idx] = {
            ...carrinho[idx],
            quantidade: carrinho[idx].quantidade + novo.quantidade,
          };
        } else {
          carrinho.push(novo);
        }
      });
      return { ...prev, itens: carrinho };
    });
  };

  const mostrarCarrinho: StepId[] = ["hub", "alimento", "agasalho", "dinheiro"];

  const handleEnviar = async (): Promise<{ ok: boolean; erro?: string }> => {
    const { nome, itens, dinheiro, dataColeta, horaColeta, endereco, contato } = formData;

    const endPart1 = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");
    const endPart2 = [
      [endereco.bairro, endereco.municipio].filter(Boolean).join(", "),
      endereco.estado,
    ].filter(Boolean).join("/");
    const enderecoDoador = [endPart1, endPart2].filter(Boolean).join(" — ");

    const itensMapeados: Array<{ categoria: string; nome: string; quantidade: number }> =
      itens.map((i) => ({
        categoria: i.tipo === "alimento" ? "ALIMENTO" : "AGASALHO",
        nome: i.nome,
        quantidade: i.quantidade,
      }));

    if (dinheiro && Number(dinheiro) > 0) {
      itensMapeados.push({ categoria: "FINANCEIRA", nome: "Doação em dinheiro", quantidade: Number(dinheiro) });
    }

    try {
      const res = await fetch(`${API}/doacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeDoador: nome,
          telefoneDoador: contato.celular,
          whatsappDoador: contato.temWhatsapp ? contato.celular : undefined,
          enderecoDoador,
          dataColeta,
          horarioColeta: horaColeta,
          igrejaId: IGREJA_ID,
          itens: itensMapeados,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = Array.isArray(body?.message) ? body.message[0] : (body?.message ?? "Erro ao registrar doação.");
        return { ok: false, erro: msg };
      }
      return { ok: true };
    } catch {
      return { ok: false, erro: "Não foi possível conectar ao servidor." };
    }
  };

  const renderStep = () => {
    switch (step) {
      case "nome":
        return (
          <StepNome
            nome={formData.nome}
            onChange={(v) => atualizar("nome", v)}
            onNext={() => irPara("hub")}
          />
        );

      case "hub":
        return (
          <StepHub
            nome={formData.nome}
            itens={formData.itens}
            dinheiro={formData.dinheiro}
            onEscolher={(d) => irPara(d)}
            onFinalizar={() => irPara("resumo")}
            onVoltar={() => irPara("nome", -1)}
          />
        );

      case "alimento":
        return (
          <StepItens
            tipo="alimento"
            titulo="Selecione os alimentos que deseja doar"
            itensDisponiveis={alimentosDisponiveis}
            onConfirmar={(novos) => {
              adicionarItens(novos);
              irPara("hub", -1);
            }}
            onVoltar={() => irPara("hub", -1)}
          />
        );

      case "agasalho":
        return (
          <StepItens
            tipo="agasalho"
            titulo="Selecione as peças de roupa que deseja doar"
            itensDisponiveis={agasalhosDisponiveis}
            onConfirmar={(novos) => {
              adicionarItens(novos);
              irPara("hub", -1);
            }}
            onVoltar={() => irPara("hub", -1)}
          />
        );

      case "dinheiro":
        return (
          <StepDinheiro
            valor={formData.dinheiro}
            onChange={(v) => atualizar("dinheiro", v)}
            onConfirmar={() => irPara("hub", -1)}
            onVoltar={() => irPara("hub", -1)}
          />
        );

      case "resumo":
        return (
          <StepResumo
            formData={formData}
            onConfirmar={() => irPara("dataHora")}
            onVoltar={() => irPara("hub", -1)}
          />
        );

      case "dataHora":
        return (
          <StepDataHora
            dataColeta={formData.dataColeta}
            horaColeta={formData.horaColeta}
            onDataChange={(v) => atualizar("dataColeta", v)}
            onHoraChange={(v) => atualizar("horaColeta", v)}
            onNext={() => irPara("endereco")}
            onVoltar={() => irPara("resumo", -1)}
          />
        );

      case "endereco":
        return (
          <StepEndereco
            endereco={formData.endereco}
            onChange={(campo, valor) =>
              setFormData((prev) => ({
                ...prev,
                endereco: { ...prev.endereco, [campo]: valor },
              }))
            }
            onPreencherEndereco={(cepData) =>
              setFormData((prev) => ({
                ...prev,
                endereco: { ...prev.endereco, ...cepData },
              }))
            }
            onNext={() => irPara("contato")}
            onVoltar={() => irPara("dataHora", -1)}
          />
        );

      case "contato":
        return (
          <StepContato
            contato={formData.contato}
            nomeDoador={formData.nome}
            onChange={(campo, valor) =>
              atualizar("contato", { ...formData.contato, [campo]: valor })
            }
            onEnviar={handleEnviar}
            onVoltar={() => irPara("endereco", -1)}
          />
        );
    }
  };

  return (
    <section className="relative w-full p-4 min-h-screen flex flex-col items-center overflow-hidden">
      <Image
        src="/donations_bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 max-w-25">
        <Image
          src="/Isologo.svg"
          alt="Isologo Doame"
          width={90}
          height={120}
          className="pt-16"
        />
      </div>

      <div className="relative z-10 mt-4">
        <Card className="p-6 w-100 h-125 shadow-2xl bg-white/90 backdrop-blur overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Passo {STEP_LABELS[step]}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex-1 overflow-y-auto flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {mostrarCarrinho.includes(step) && (
        <CarrinhoPopover itens={formData.itens} dinheiro={formData.dinheiro} />
      )}
    </section>
  );
}
