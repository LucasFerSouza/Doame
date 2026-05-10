"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Credenciais hardcoded para o MVP.
// Substituição futura: remover estas constantes e chamar
//   POST /auth/login → { access_token }
// armazenando o JWT retornado no lugar da flag.
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@doame.com";
const ADMIN_SENHA = "doame2025";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = () => {
    setErro("");
    setCarregando(true);

    // Simula latência de rede para UX realista
    setTimeout(() => {
      if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
        localStorage.setItem("doame_admin_logado", "true");
        router.replace("/admin");
      } else {
        setErro("E-mail ou senha incorretos.");
        setCarregando(false);
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Detalhe de fundo decorativo */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-yellow-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-green-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm px-4">
        <Card className="shadow-xl border-gray-100">
          <CardHeader className="items-center pb-2 pt-8">
            {/* Logo */}
            <Image
              src="/Isologo.svg"
              alt="Doame"
              width={64}
              height={64}
              className="mb-4 mx-auto"
            />
            <h1 className="text-xl font-bold text-gray-800">Acesso restrito</h1>
            <p className="text-sm text-gray-400 text-center mt-1">
              Área exclusiva para administradores da ASA
            </p>
          </CardHeader>

          <CardContent className="pt-4 pb-8 px-6 space-y-4">
            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@doame.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="senha" className="text-sm text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setMostrarSenha((v) => !v)}
                  tabIndex={-1}
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                <AlertCircle size={14} className="flex-shrink-0" />
                {erro}
              </div>
            )}

            {/* Botão */}
            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold mt-2"
              onClick={handleLogin}
              disabled={!email || !senha || carregando}
            >
              {carregando ? "Verificando..." : "Entrar"}
            </Button>
          </CardContent>
        </Card>

        {/* Rodapé discreto */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Doame · Ação Solidária Adventista
        </p>
      </div>
    </main>
  );
}
