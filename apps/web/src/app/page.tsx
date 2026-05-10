import Image from "next/image";
import Link from "next/link"; // Importação essencial
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center md:items-end md:pr-36 overflow-hidden">
      <Link href="/login" className="fixed top-6 right-10 z-20 ">
        <Button className="w-40 bg-white text-lg font-semibold text-yellow-600 hover:bg-yellow-600 hover:text-white border-2 border-yellow-600 rounded-4xl">
          Acesso Restrito
        </Button>
      </Link>
      <div className="mt-16">
        <Image
          src="/doame_bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Logo e Texto */}

        <div className="relative z-10 w-full max-w-xs md:max-w-100 flex flex-col items-center px-6 md:px-0">
          <Image
            src="/Isologo.svg"
            alt="Isologo MeuPet"
            width={480}
            height={240}
            className="pt-16"
          />

          <h1 className="text-yellow-600 font-bold text-2xl text-center pt-8">
            Faça uma doação, ame uma vida.
          </h1>

          {/* Ajustes aqui: removido w-full e adicionado flex justify-center */}
          <Link href="/donation" className="flex justify-center w-full mt-4 ">
            <Button className="w-60 text-lg font-semibold bg-yellow-600 hover:bg-yellow-700 text-white">
              Faça sua doação
            </Button>
          </Link>
          <Link href="/about" className="flex justify-center w-full mt-4">
            <Button className="w-60 text-lg font-semibold bg-green-700 hover:bg-green-900 text-white">
              Saiba como funciona
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
