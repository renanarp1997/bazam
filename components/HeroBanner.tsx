"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="container-page mt-6 sm:mt-8">
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-6 text-white shadow-premium sm:p-10 lg:col-span-2 lg:p-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-accent-400/40 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute right-1/3 top-1/4 h-40 w-40 rounded-full bg-fuchsia-400/25 blur-3xl" />

          <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-40" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 ring-1 ring-inset ring-white/25 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-amber-300 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              <Flame className="h-3.5 w-3.5 text-amber-300" />
              Mega Black Week
            </span>
            <span className="hidden text-white/60 sm:inline">termina em 47h 23m 12s</span>
          </div>

          <div className="relative z-10 grid items-center gap-8 sm:grid-cols-2">
            <div>
              <h1 className="mt-4 font-head text-[34px] font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[58px]">
                Até{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-amber-200 via-accent-300 to-accent-200 bg-clip-text text-transparent">
                    60% OFF
                  </span>
                  <span className="absolute -inset-1 -z-0 rounded-full bg-accent-400/20 blur-xl" />
                </span>{" "}
                em mais de 5.000 produtos
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Tecnologia, moda e casa com frete grátis para todo o Brasil.
                Cupons exclusivos para novos clientes.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/ofertas"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 shadow-[0_12px_30px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_18px_40px_-10px_rgba(255,255,255,0.65)]"
                >
                  Aproveitar agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#categorias"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  Ver categorias
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3 text-xs text-white/85">
                <div className="flex -space-x-1.5">
                  {[
                    "from-amber-300 to-rose-400",
                    "from-brand-300 to-fuchsia-400",
                    "from-accent-300 to-cyan-400",
                    "from-pink-300 to-amber-400",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`h-7 w-7 rounded-full border-2 border-brand-700 bg-gradient-to-br ${g}`}
                    />
                  ))}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="flex items-center text-amber-300">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-300" />
                      ))}
                    </span>
                    4.9/5 — 58.000+ avaliações
                  </span>
                  <span className="text-white/65">Clientes compraram esta semana</span>
                </div>
              </div>
            </div>

            <div className="relative hidden h-72 sm:block lg:h-[360px]">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/5 to-transparent blur-2xl" />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
                  alt="Tênis em destaque"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_35px_45px_rgba(0,0,0,0.45)]"
                  sizes="(min-width: 1024px) 480px, 50vw"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -left-2 top-6 hidden rounded-2xl bg-white/95 px-3.5 py-2.5 text-ink-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur lg:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                      Oferta relâmpago
                    </p>
                    <p className="text-sm font-bold">R$ 499,90</p>
                    <p className="text-[10px] text-ink-500 line-through">R$ 749,90</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute -right-3 bottom-10 hidden rounded-2xl bg-white/95 px-3.5 py-2.5 text-ink-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur lg:block"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-700">
                      AO VIVO
                    </p>
                    <p className="text-sm font-bold">312 pessoas vendo</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute right-4 top-2 hidden lg:block"
              >
                <div className="rounded-full bg-gradient-to-br from-amber-400 to-amber-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-[0_10px_25px_-8px_rgba(245,158,11,0.6)]">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    #1 em vendas
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-white/85">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-300" />
              Compra protegida
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/85">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              +50.000 produtos
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/85">
              <TrendingUp className="h-3.5 w-3.5 text-accent-300" />
              Entrega expressa
            </span>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[28px] bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 p-6 text-white shadow-premium"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-30" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ring-white/25 backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Lançamento
              </span>
              <h3 className="mt-4 font-head text-2xl font-extrabold leading-tight">
                Coleção Verão 24
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                Looks frescos para a estação mais quente do ano.
              </p>
              <Link
                href="/lancamentos"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-white/25 backdrop-blur transition-all group-hover:bg-white group-hover:text-rose-700"
              >
                Conferir
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="group relative overflow-hidden rounded-[28px] border border-ink-200 bg-white p-6 shadow-soft"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-accent-200/40 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_6px_16px_-6px_rgba(79,70,229,0.5)]">
                <Sparkles className="h-3 w-3" />
                Cashback 5%
              </span>
              <h3 className="mt-4 font-head text-2xl font-extrabold leading-tight text-ink-900">
                Bazam <span className="gradient-text">Plus</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                Cashback em todas as compras, frete grátis e descontos exclusivos.
              </p>
              <Link
                href="/plus"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-bold text-white transition-all group-hover:bg-brand-700"
              >
                Assinar grátis
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
