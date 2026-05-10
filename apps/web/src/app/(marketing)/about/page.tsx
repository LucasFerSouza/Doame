import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  MapPin,
  UserCheck,
  Heart,
  Wheat,
  Shirt,
  Banknote,
  Users,
  Building2,
  HandHeart,
} from "lucide-react";

// ─── Dados ───────────────────────────────────────────────────────────────────

const comoFunciona = [
  {
    numero: "01",
    icone: <ClipboardList size={20} className="text-yellow-600" />,
    titulo: "Você informa a doação",
    texto:
      "Preencha um formulário simples, sem criar conta, informando o que deseja doar, quando e onde podemos buscar.",
  },
  {
    numero: "02",
    icone: <MapPin size={20} className="text-yellow-600" />,
    titulo: "A ASA organiza a coleta",
    texto:
      "Nossa equipe visualiza sua doação no painel e localiza o voluntário mais próximo da sua região.",
  },
  {
    numero: "03",
    icone: <UserCheck size={20} className="text-yellow-600" />,
    titulo: "O voluntário vai até você",
    texto:
      "Um voluntário aprovado pela ASA busca sua doação no horário combinado. Simples, seguro e sem burocracia.",
  },
  {
    numero: "04",
    icone: <Heart size={20} className="text-yellow-600" />,
    titulo: "O impacto chega a quem precisa",
    texto:
      "Sua doação é recebida, triada e distribuída pela ASA às famílias em situação de vulnerabilidade.",
  },
];

const categorias = [
  { icone: <Wheat size={22} className="text-yellow-600" />, label: "Alimentos não perecíveis" },
  { icone: <Shirt size={22} className="text-blue-500" />, label: "Roupas e agasalhos" },
  { icone: <Banknote size={22} className="text-green-600" />, label: "Dinheiro ou Pix" },
];

const quemServe = [
  {
    icone: <HandHeart size={24} className="text-yellow-600" />,
    titulo: "Doadores",
    texto: "Qualquer pessoa que queira contribuir de forma rápida e sem complicações.",
  },
  {
    icone: <Users size={24} className="text-blue-500" />,
    titulo: "Voluntários",
    texto: "Pessoas dispostas a ajudar na logística de coleta, conectadas à ASA.",
  },
  {
    icone: <Heart size={24} className="text-red-400" />,
    titulo: "Famílias atendidas",
    texto: "Famílias em vulnerabilidade social beneficiadas pela atuação da ASA.",
  },
  {
    icone: <Building2 size={24} className="text-green-600" />,
    titulo: "Lideranças da ASA",
    texto: "Administradores que ganham visibilidade e eficiência para coordenar coletas.",
  },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <main className="min-h-screen bg-[#faf7f0]">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden">
        <Image
          src="/doame_bg.png"
          alt="Pessoas recebendo doação"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-[#faf7f0]" />

        <div className="relative z-10 max-w-2xl ml-12 md:ml-24 px-4">
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4 font-sans tracking-wider uppercase text-[11px]">
            Ação Solidária Adventista
          </Badge>
          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight font-serif">
            Doar ficou{" "}
            <span className="text-yellow-400 italic">simples.</span>
          </h1>
          <p className="text-white/75 mt-5 text-lg leading-relaxed max-w-lg font-sans font-light">
            O Doame conecta quem quer ajudar a quem coordena a ajuda — de forma
            digital, organizada e com respeito à dignidade de todos.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button
              asChild
              className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6"
            >
              <Link href="/donation">Fazer uma doação</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/40 text-white hover:bg-white/10 hover:text-white bg-transparent px-6"
            >
              <Link href="/donation">Ser voluntário</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── O QUE É ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 mb-4 uppercase tracking-wider text-[10px]">
              O que é
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold leading-snug mb-5 font-serif">
              Uma ponte entre quem doa e quem{" "}
              <span className="text-yellow-600 italic">organiza.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed font-sans text-base mb-4">
              O Doame é uma plataforma web institucional criada para facilitar,
              organizar e tornar mais eficiente o processo de doações solidárias
              realizadas pela{" "}
              <strong className="text-gray-800">
                Ação Solidária Adventista (ASA)
              </strong>
              , departamento oficial da Igreja Adventista do Sétimo Dia.
            </p>
            <p className="text-gray-600 leading-relaxed font-sans text-base">
              Não substituímos os processos da ASA — somos o meio digital que
              reduz ruídos, melhora a logística e oferece às lideranças
              visibilidade e controle reais sobre cada ação.
            </p>

            <Separator className="my-6" />

            {/* Categorias aceitas */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Aceitamos
            </p>
            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center gap-2 border rounded-full px-3 py-1.5 bg-white text-sm text-gray-600"
                >
                  {cat.icone}
                  <span className="font-sans text-sm">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card institucional */}
          <Card className="bg-green-800 border-0 shadow-2xl text-white">
            <CardContent className="p-10">
              <Image
                src="/Isologo.svg"
                alt="Logo Doame"
                width={72}
                height={72}
                className="mb-6 brightness-200"
              />
              <blockquote className="text-xl italic font-light leading-relaxed text-white/90 font-serif">
                "Faça uma doação,
                <br />
                ame uma vida."
              </blockquote>
              <Separator className="my-6 bg-white/20" />
              <p className="text-[11px] text-white/40 uppercase tracking-widest font-sans mb-1">
                Parceria oficial com
              </p>
              <p className="text-white font-semibold font-sans">
                Ação Solidária Adventista — ASA
              </p>
              <p className="text-white/50 text-sm font-sans">
                Igreja Adventista do Sétimo Dia
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── COMO FUNCIONA ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 mb-4 uppercase tracking-wider text-[10px]">
            Como funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold font-serif">
            Do clique à{" "}
            <span className="text-yellow-600 italic">entrega.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {comoFunciona.map((item) => (
            <Card
              key={item.numero}
              className="group hover:border-yellow-300 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 flex gap-5 items-start">
                <span className="text-5xl font-bold text-gray-100 group-hover:text-yellow-100 transition-colors leading-none select-none flex-shrink-0">
                  {item.numero}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {item.icone}
                    <h3 className="font-bold text-gray-800 text-base font-serif">
                      {item.titulo}
                    </h3>
                  </div>
                  <p className="text-gray-500 font-sans text-sm leading-relaxed">
                    {item.texto}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── A QUEM SERVE ── */}
      <section className="bg-green-800 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4 uppercase tracking-wider text-[10px]">
              A quem serve
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
              Cada pessoa importa{" "}
              <span className="text-yellow-400 italic">nessa corrente.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quemServe.map((item) => (
              <Card
                key={item.titulo}
                className="bg-white/10 border-white/10 hover:bg-white/15 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{item.icone}</div>
                  <h3 className="text-white font-bold text-lg mb-2 font-serif">
                    {item.titulo}
                  </h3>
                  <p className="text-white/60 text-sm font-sans leading-relaxed">
                    {item.texto}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCERIA INSTITUCIONAL ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Card className="shadow-sm">
            <CardContent className="p-10">
              <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 mb-4 uppercase tracking-wider text-[10px]">
                Parceria institucional
              </Badge>
              <h3 className="text-2xl font-bold mb-4 font-serif leading-snug">
                Ação Solidária Adventista
              </h3>
              <p className="text-gray-500 font-sans text-sm leading-relaxed mb-4">
                A ASA é o departamento oficial de assistência social da Igreja
                Adventista do Sétimo Dia. Presente em municípios de todo o
                Brasil, coordena voluntários, coletas, distribuição e apoio
                contínuo a famílias em vulnerabilidade.
              </p>
              <p className="text-gray-500 font-sans text-sm leading-relaxed">
                O Doame foi criado exclusivamente para fortalecer a atuação da
                ASA — respeitando seus protocolos, sua estrutura e seus valores.
              </p>
              <Separator className="my-6" />
              <p className="text-xs text-gray-400 font-sans uppercase tracking-widest">
                Vinculada à
              </p>
              <p className="font-semibold text-gray-700 mt-1 font-sans">
                Igreja Adventista do Sétimo Dia — IASD
              </p>
            </CardContent>
          </Card>

          <div>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 mb-4 uppercase tracking-wider text-[10px]">
              Nosso limite
            </Badge>
            <h2 className="text-3xl font-bold leading-snug mb-5 font-serif">
              O Doame faz a{" "}
              <span className="text-yellow-600 italic">ponte.</span>
              <br />A ASA faz o restante.
            </h2>
            <p className="text-gray-600 font-sans text-base leading-relaxed mb-4">
              Toda a execução física — coleta, transporte, armazenamento e
              distribuição — permanece sob responsabilidade exclusiva da ASA.
            </p>
            <p className="text-gray-600 font-sans text-base leading-relaxed">
              O Doame digitaliza o ponto de entrada: o contato entre doador e
              instituição. Menos mensagens perdidas, mais organização e mais
              dignidade para quem doa e para quem recebe.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#1a1a1a] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
          <Image src="/Isologo.svg" alt="" width={500} height={500} className="brightness-200" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4 uppercase tracking-wider text-[10px]">
            Faça parte
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-5 font-serif">
            Uma doação simples pode{" "}
            <span className="text-yellow-400 italic">mudar um dia.</span>
          </h2>
          <p className="text-white/50 font-sans text-base mb-10">
            Sem cadastro, sem complicação. Em poucos minutos sua doação está
            registrada e a caminho de quem precisa.
          </p>
          <Button
            asChild
            className="rounded-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold text-base px-10 py-6 shadow-lg shadow-yellow-500/20"
          >
            <Link href="/donation">Quero doar agora</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
