"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

type Mode = "login" | "signup";

const perks = [
  { icon: Gift, text: "R$ 50 de cupom na primeira compra" },
  { icon: Sparkles, text: "Cashback 5% no programa Bazam Plus" },
  { icon: Truck, text: "Frete grátis em compras a partir de R$ 199" },
  { icon: ShieldCheck, text: "Histórico e segurança das suas compras" },
];

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { loading, update, info } = useToast();
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const id = loading(
      isLogin ? "Entrando…" : "Criando sua conta…",
      "Validando seus dados",
    );
    setTimeout(() => {
      update(id, {
        variant: "success",
        title: isLogin ? "Bem-vindo de volta!" : "Conta criada!",
        description: isLogin
          ? "Você está logado na Bazam"
          : "Seu cupom de R$ 50 já está disponível",
        duration: 4500,
      });
      setSubmitting(false);
      setTimeout(() => router.push("/"), 600);
    }, 1400);
  };

  const handleSocial = (provider: "Google" | "Apple") => {
    const id = loading(`Conectando com ${provider}…`);
    setTimeout(() => {
      update(id, {
        variant: "info",
        title: "Em breve",
        description: `Login com ${provider} estará disponível em breve.`,
        duration: 4000,
      });
    }, 700);
  };

  const handleForgot = () => {
    info("Recuperar senha", "Enviamos um link de reset por e-mail (simulado).");
  };

  return (
    <section className="container-page mt-6 sm:mt-10">
      <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-premium">
        <div className="grid lg:grid-cols-2">
          {/* Left — brand panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-8 text-white sm:p-12 lg:p-14">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-glow-pulse" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
            <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-30" />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/25 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Conta Bazam
              </span>
              <h1 className="mt-4 font-head text-3xl font-extrabold leading-tight text-balance sm:text-4xl lg:text-[44px]">
                {isLogin ? (
                  <>
                    Bem-vindo de volta. <br />
                    <span className="gradient-text">Bom te ver de novo.</span>
                  </>
                ) : (
                  <>
                    Crie sua conta <br />
                    em <span className="gradient-text">30 segundos</span>.
                  </>
                )}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                {isLogin
                  ? "Entre para acompanhar seus pedidos, favoritos e ofertas personalizadas."
                  : "Faça parte da Bazam e aproveite ofertas exclusivas, cashback e frete grátis."}
              </p>

              <ul className="mt-8 space-y-3">
                {perks.map((p) => (
                  <li key={p.text} className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent-300 ring-1 ring-inset ring-white/15">
                      <p.icon className="h-4 w-4" />
                    </div>
                    <span className="text-white/90">{p.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-inset ring-white/15 backdrop-blur">
                <BadgeCheck className="h-4 w-4 text-accent-300" />
                <p className="text-xs text-white/85">
                  <strong className="font-bold text-white">58.000+ clientes</strong> já
                  confiam na Bazam
                </p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="p-8 sm:p-12 lg:p-14"
          >
            <h2 className="font-head text-2xl font-extrabold text-ink-900">
              {isLogin ? "Entrar na Bazam" : "Criar conta"}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {isLogin ? (
                <>
                  Ainda não tem conta?{" "}
                  <Link
                    href="/cadastrar"
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <Link
                    href="/entrar"
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    Entrar
                  </Link>
                </>
              )}
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleSocial("Google")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:shadow-soft"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path fill="#EA4335" d="M12 11v3.2h4.5c-.2 1.2-1.4 3.6-4.5 3.6-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.6 3.2 1.2L17.5 7C16.1 5.7 14.3 5 12 5 7.6 5 4 8.6 4 13s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5-.1-.9-.1-1.2H12Z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocial("Apple")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:shadow-soft"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-ink-900" aria-hidden>
                  <path d="M16.3 1.3c0 1-.4 2-1.1 2.7-.7.8-1.8 1.3-2.8 1.2-.1-1 .4-2.1 1.1-2.8.8-.8 1.9-1.3 2.8-1.1Zm3.3 18c-.6 1.4-1.4 2.8-2.5 3.7-.9.8-1.5 1-2.5 1-1 0-1.4-.3-2.6-.3s-1.7.3-2.7.3c-1 0-1.7-.4-2.4-1.1-2.4-2.7-4.1-7.6-1.7-10.9 1.2-1.7 3.2-2.7 5.1-2.7 1 0 2 .4 2.6.4s1.9-.5 3.2-.4c.5 0 2.1.2 3.1 1.7-2.7 1.6-2.3 5.5.4 6.3-.4 1.1-.7 1.4-1 2Z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-ink-400">
              <span className="h-px flex-1 bg-ink-100" />
              ou com e-mail
              <span className="h-px flex-1 bg-ink-100" />
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="text-xs font-semibold text-ink-700">Nome completo</span>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="text-xs font-semibold text-ink-700">E-mail</span>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold text-ink-700">
                  Senha
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleForgot}
                      className="font-semibold text-brand-700 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </span>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type={show ? "text" : "password"}
                    required
                    placeholder={isLogin ? "Sua senha" : "Crie uma senha forte"}
                    className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-10 text-sm outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 hover:bg-ink-100"
                    aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {!isLogin && (
                <label className="flex items-start gap-2.5 pt-1 text-[11.5px] leading-relaxed text-ink-600">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                  />
                  <span>
                    Aceito os{" "}
                    <a href="#" className="font-semibold text-brand-700 hover:underline">
                      Termos de uso
                    </a>{" "}
                    e a{" "}
                    <a href="#" className="font-semibold text-brand-700 hover:underline">
                      Política de privacidade
                    </a>
                    .
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.65)] transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                    {isLogin ? "Entrando…" : "Criando conta…"}
                  </>
                ) : (
                  <>
                    {isLogin ? "Entrar" : "Criar minha conta"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
