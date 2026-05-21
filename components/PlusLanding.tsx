"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/lib/toast-context";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Gift,
  Headphones,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: PiggyBank,
    title: "Cashback de 5%",
    desc: "Em todas as compras, sem letras miúdas. Use o saldo na próxima compra.",
    color: "from-accent-500 to-accent-700",
  },
  {
    icon: Truck,
    title: "Frete grátis ilimitado",
    desc: "Para qualquer valor de compra, em todo o Brasil. Sem mínimo.",
    color: "from-brand-500 to-brand-700",
  },
  {
    icon: Sparkles,
    title: "Acesso antecipado",
    desc: "Veja lançamentos e participe de drops exclusivos 48h antes de todo mundo.",
    color: "from-fuchsia-500 to-rose-600",
  },
  {
    icon: Zap,
    title: "Cupons exclusivos",
    desc: "Descontos mensais que só assinantes Plus recebem por email.",
    color: "from-amber-500 to-rose-500",
  },
  {
    icon: Headphones,
    title: "Atendimento VIP",
    desc: "Linha dedicada com atendimento prioritário 7 dias por semana.",
    color: "from-cyan-500 to-brand-600",
  },
  {
    icon: ShieldCheck,
    title: "Garantia estendida",
    desc: "Garantia adicional gratuita em produtos selecionados.",
    color: "from-ink-700 to-ink-900",
  },
];

const plans = [
  {
    name: "Mensal",
    price: 19.9,
    cadence: "/mês",
    perks: ["Cashback 5%", "Frete grátis ilimitado", "Cupons exclusivos"],
    accent: false,
  },
  {
    name: "Anual",
    price: 159.0,
    cadence: "/ano",
    perks: [
      "Tudo do mensal",
      "Economia de R$ 80 por ano",
      "Acesso antecipado a drops",
      "Atendimento VIP",
      "Garantia estendida",
    ],
    accent: true,
    badge: "Mais popular",
  },
];

const faq = [
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, o cancelamento é instantâneo e sem multa. Você continua usando os benefícios até o fim do ciclo já pago.",
  },
  {
    q: "Como funciona o cashback?",
    a: "A cada compra finalizada, 5% volta como crédito para sua carteira Bazam. Use em compras futuras como desconto.",
  },
  {
    q: "Tem fidelidade ou multa?",
    a: "Não. Bazam Plus é livre — entre, use e saia quando quiser.",
  },
  {
    q: "Frete grátis inclui produtos pesados?",
    a: "Sim, sem exceções. Eletros, móveis e produtos volumosos também entram no frete grátis ilimitado.",
  },
];

export default function PlusLanding() {
  const { loading, update } = useToast();
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  const handleSubscribe = (planName: string) => {
    if (subscribingPlan) return;
    setSubscribingPlan(planName);
    const id = loading("Ativando assinatura…", `Plano ${planName}`);
    setTimeout(() => {
      update(id, {
        variant: "success",
        title: "Bem-vindo ao Bazam Plus!",
        description: `Plano ${planName} ativo. Seus benefícios já estão liberados.`,
        duration: 5000,
      });
      setSubscribingPlan(null);
    }, 1500);
  };

  return (
    <>
      {/* Hero */}
      <section className="container-page mt-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-8 text-white shadow-premium sm:p-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent-500/30 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-30" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-950 shadow-[0_8px_20px_-8px_rgba(245,158,11,0.55)]">
                <Crown className="h-3.5 w-3.5" />
                Programa de fidelidade
              </span>
              <h1 className="mt-4 font-head text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[60px]">
                Bazam <span className="gradient-text">Plus</span>.<br />
                A melhor versão da Bazam.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Cashback de 5%, frete grátis ilimitado, acesso antecipado a lançamentos e
                atendimento VIP. Tudo por menos do que um almoço por mês.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#planos"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 shadow-[0_14px_30px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-[1.02]"
                >
                  Assinar agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#beneficios"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  Ver benefícios
                </a>
              </div>
              <div className="mt-7 flex items-center gap-3 text-xs text-white/85">
                <BadgeCheck className="h-4 w-4 text-accent-300" />
                <span>
                  <strong className="text-white">38.412 assinantes</strong> economizam em
                  média R$ 540/ano
                </span>
              </div>
            </div>

            {/* Visual card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-0 pattern-dots-white opacity-30" />
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-400/40 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-300/30">
                      <Crown className="h-3 w-3" />
                      Plus
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/50">
                      Membro
                    </span>
                  </div>
                  <p className="mt-12 font-head text-lg font-bold text-white">
                    Maria Cliente
                  </p>
                  <p className="text-[11px] text-white/60">Bazam ID: •••• 4928</p>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/50">
                        Cashback
                      </p>
                      <p className="font-head text-2xl font-extrabold text-amber-300">
                        R$ 84,20
                      </p>
                    </div>
                    <p className="text-[10px] text-white/40">Válido até 12/2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="container-page section">
        <div className="text-center">
          <span className="eyebrow bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
            <Sparkles className="h-3 w-3" />
            O que você ganha
          </span>
          <h2 className="section-title mt-3">Tudo o que entra na sua assinatura</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-500">
            Benefícios pensados para te fazer comprar com mais inteligência e economia.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.article
              key={b.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${b.color} text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`}>
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-head text-lg font-extrabold text-ink-900">
                {b.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{b.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="container-page section">
        <div className="text-center">
          <span className="eyebrow bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100">
            <Gift className="h-3 w-3" />
            Escolha seu plano
          </span>
          <h2 className="section-title mt-3">Planos para todos os bolsos</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-500">
            Sem fidelidade. Cancele quando quiser, sem multa.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative overflow-hidden rounded-2xl border p-6 shadow-soft ${
                p.accent
                  ? "border-brand-300 bg-gradient-to-br from-brand-50 to-white shadow-[0_20px_40px_-20px_rgba(79,70,229,0.35)] ring-2 ring-brand-200"
                  : "border-ink-100 bg-white"
              }`}
            >
              {p.accent && (
                <>
                  <span className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-300/40 blur-3xl" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-[0_8px_18px_-6px_rgba(245,158,11,0.55)]">
                    <Crown className="h-3 w-3" />
                    {p.badge}
                  </span>
                </>
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                {p.name}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-head text-4xl font-extrabold text-ink-900">
                  R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-ink-500">{p.cadence}</span>
              </div>

              <ul className="mt-5 space-y-2">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4 text-accent-600" />
                    <span className="text-ink-700">{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSubscribe(p.name)}
                disabled={subscribingPlan === p.name}
                className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-all disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100 ${
                  p.accent
                    ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.65)] hover:scale-[1.01]"
                    : "border border-ink-200 bg-white text-ink-900 hover:border-brand-300"
                }`}
              >
                {subscribingPlan === p.name ? (
                  <>
                    <span
                      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${
                        p.accent
                          ? "border-white/60 border-t-white"
                          : "border-ink-300 border-t-ink-900"
                      }`}
                    />
                    Ativando…
                  </>
                ) : (
                  <>
                    Assinar agora
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="eyebrow bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100">
              FAQ
            </span>
            <h2 className="section-title mt-3">Perguntas frequentes</h2>
            <p className="mt-2 text-sm text-ink-500">
              Não encontrou sua dúvida?{" "}
              <Link href="/ajuda" className="font-semibold text-brand-700 hover:underline">
                Fale com a gente
              </Link>
              .
            </p>
          </div>
          <dl className="space-y-3">
            {faq.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
              >
                <dt className="font-head text-base font-bold text-ink-900">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
