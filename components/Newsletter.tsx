"use client";

import { useState } from "react";
import { ArrowRight, BadgeCheck, Gift, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function Newsletter() {
  const { loading, update } = useToast();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    const id = loading("Enviando…", "Cadastrando seu email");
    setTimeout(() => {
      update(id, {
        variant: "success",
        title: "Cupom enviado!",
        description: `R$ 50 de desconto disponível em ${email}`,
        duration: 5000,
      });
      setEmail("");
      setSending(false);
    }, 1200);
  };

  return (
    <section className="container-page section">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-8 text-white shadow-premium sm:p-12 lg:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-glow-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="pointer-events-none absolute right-1/3 top-1/3 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-30" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/25 backdrop-blur">
              <Gift className="h-3.5 w-3.5 text-amber-300" />
              Cupom exclusivo
            </span>
            <h2 className="mt-4 font-head text-[28px] font-extrabold leading-[1.1] text-balance sm:text-4xl lg:text-[44px]">
              Ganhe{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-amber-200 via-accent-300 to-accent-200 bg-clip-text text-transparent">
                  R$ 50
                </span>
                <span className="absolute -inset-1 -z-0 rounded-full bg-accent-400/20 blur-xl" />
              </span>{" "}
              na primeira compra
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
              Cadastre-se e receba ofertas, lançamentos e cupons em primeira mão.
              Cancelamento a qualquer momento.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-accent-300" />
                Sem spam
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Ofertas em primeira mão
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-[52px] w-full rounded-full border border-white/20 bg-white/10 pl-12 pr-5 text-sm text-white placeholder-white/55 outline-none backdrop-blur transition-all focus:border-white/50 focus:bg-white/15 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 px-7 text-sm font-extrabold text-ink-950 shadow-[0_18px_36px_-12px_rgba(16,185,129,0.65)] transition-all hover:scale-[1.02] hover:from-accent-300 hover:to-accent-500 disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
              >
                {sending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink-900/40 border-t-ink-900" />
                    Enviando…
                  </>
                ) : (
                  <>
                    Quero meu cupom
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-white/60">
              Ao se cadastrar, você concorda com a nossa{" "}
              <a href="#" className="underline underline-offset-2 hover:text-white">
                Política de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
