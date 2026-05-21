"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CreditCard,
  Headphones,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

const topics = [
  {
    icon: Package,
    title: "Pedidos",
    desc: "Acompanhe, altere ou cancele um pedido.",
    color: "from-brand-500 to-brand-700",
  },
  {
    icon: Truck,
    title: "Entrega",
    desc: "Prazos, frete e rastreamento.",
    color: "from-accent-500 to-accent-700",
  },
  {
    icon: RotateCcw,
    title: "Trocas e devoluções",
    desc: "Como devolver ou trocar um produto.",
    color: "from-rose-500 to-rose-700",
  },
  {
    icon: CreditCard,
    title: "Pagamentos",
    desc: "Formas de pagamento e parcelamento.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: User,
    title: "Minha conta",
    desc: "Login, dados e privacidade.",
    color: "from-fuchsia-500 to-rose-500",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    desc: "Compra protegida e LGPD.",
    color: "from-ink-700 to-ink-900",
  },
];

const faq = [
  {
    cat: "Pedidos",
    q: "Como acompanho meu pedido?",
    a: "Acesse Minha conta > Meus pedidos. Você também recebe atualizações por e-mail e SMS a cada mudança de status.",
  },
  {
    cat: "Pedidos",
    q: "Posso alterar o endereço após o pedido feito?",
    a: "Sim, enquanto o pedido estiver em preparação. Vá em Meus pedidos e selecione 'Alterar endereço'. Após o envio, não é possível.",
  },
  {
    cat: "Entrega",
    q: "Em quanto tempo recebo meu pedido?",
    a: "Capitais e regiões metropolitanas: 24-48h em entregas expressas. Demais cidades: 3-7 dias úteis. Consulte o prazo exato no checkout.",
  },
  {
    cat: "Entrega",
    q: "Como funciona o frete grátis?",
    a: "Frete grátis em pedidos acima de R$ 199 para todo o Brasil. Assinantes Bazam Plus têm frete grátis ilimitado, sem valor mínimo.",
  },
  {
    cat: "Trocas e devoluções",
    q: "Qual o prazo para trocar ou devolver?",
    a: "Você tem até 30 dias após o recebimento para solicitar troca ou devolução gratuita, com o produto sem uso e na embalagem original.",
  },
  {
    cat: "Pagamentos",
    q: "Posso parcelar sem juros?",
    a: "Sim, em até 12x sem juros no cartão de crédito. Para Pix, oferecemos 10% de desconto adicional no valor à vista.",
  },
  {
    cat: "Pagamentos",
    q: "Quais formas de pagamento são aceitas?",
    a: "Visa, Master, Elo, Hiper, Amex, Pix e Boleto. Todas as transações são processadas em ambiente 100% seguro com SSL 256-bit.",
  },
  {
    cat: "Segurança",
    q: "Meus dados estão seguros?",
    a: "Sim. Seguimos a LGPD e usamos criptografia SSL 256-bit. Nunca compartilhamos seus dados sem consentimento. Veja nossa Política de privacidade.",
  },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(faq[0].q);

  const filtered = useMemo(() => {
    if (!query.trim()) return faq;
    const q = query.toLowerCase();
    return faq.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof faq>();
    filtered.forEach((f) => {
      const arr = map.get(f.cat) ?? [];
      arr.push(f);
      map.set(f.cat, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      {/* Hero with search */}
      <section className="container-page mt-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-8 text-white shadow-premium sm:p-12 lg:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/25 backdrop-blur">
              <HelpCircle className="h-3.5 w-3.5" />
              Central de ajuda
            </span>
            <h1 className="mt-4 font-head text-3xl font-extrabold leading-tight text-balance sm:text-4xl lg:text-[44px]">
              Como podemos te ajudar?
            </h1>
            <p className="mt-3 text-sm text-white/85 sm:text-base">
              Busque por um tema ou escolha uma categoria abaixo.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="relative mt-6">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: como rastrear meu pedido?"
                className="h-14 w-full rounded-full border border-white/10 bg-white pl-12 pr-32 text-sm text-ink-900 placeholder:text-ink-400 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] outline-none focus:border-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-5 text-xs font-bold text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.55)]"
              >
                Buscar
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Topics */}
      <section className="container-page section">
        <h2 className="section-title text-center">Categorias de ajuda</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-500">
          Escolha o assunto e encontre as respostas mais comuns.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t, i) => (
            <motion.button
              key={t.title}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <div className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${t.color} text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`}>
                <t.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-head text-base font-extrabold text-ink-900 transition-colors group-hover:text-brand-700">
                  {t.title}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-ink-600">{t.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-400 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page section">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
              <BadgeCheck className="h-3 w-3" />
              Perguntas frequentes
            </span>
            <h2 className="section-title mt-3">Respostas que ajudam</h2>
          </div>
          {query && (
            <p className="text-sm text-ink-500">
              {filtered.length}{" "}
              {filtered.length === 1 ? "resultado" : "resultados"} para{" "}
              <strong className="text-ink-900">&quot;{query}&quot;</strong>
            </p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {grouped.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
              <p className="text-sm font-bold text-ink-900">
                Nenhum resultado encontrado
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Tente outra busca ou fale com nosso atendimento abaixo.
              </p>
            </div>
          )}
          {grouped.map(([cat, items]) => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                {cat}
              </p>
              <div className="mt-3 space-y-2">
                {items.map((f) => {
                  const isOpen = open === f.q;
                  return (
                    <div
                      key={f.q}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition-all ${
                        isOpen ? "border-brand-200" : "border-ink-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : f.q)}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                      >
                        <span className="font-head text-sm font-bold text-ink-900 sm:text-base">
                          {f.q}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-ink-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-ink-100 px-5 py-4 text-sm leading-relaxed text-ink-700">
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container-page section">
        <div className="relative overflow-hidden rounded-[28px] border border-ink-100 bg-gradient-to-br from-white via-ink-50/60 to-white p-8 shadow-soft sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent-100/50 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_2fr]">
            <div>
              <span className="eyebrow bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-100">
                <Headphones className="h-3 w-3" />
                Atendimento
              </span>
              <h2 className="section-title mt-3">Ainda com dúvida?</h2>
              <p className="mt-2 text-sm text-ink-600">
                Nossa equipe responde em até 1 hora em dias úteis. Escolha o canal que
                preferir.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href="#"
                className="group flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-head text-sm font-bold text-ink-900">
                    Chat ao vivo
                  </p>
                  <p className="text-[11.5px] text-ink-500">
                    Resposta em 2 min · 7 dias por semana
                  </p>
                </div>
              </a>
              <a
                href="tel:08009408800"
                className="group flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-head text-sm font-bold text-ink-900">Telefone</p>
                  <p className="text-[11.5px] text-ink-500">
                    0800 940 8800 · 8h-22h
                  </p>
                </div>
              </a>
              <a
                href="mailto:atendimento@bazam.com.br"
                className="group flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-head text-sm font-bold text-ink-900">E-mail</p>
                  <p className="break-all text-[11.5px] text-ink-500">
                    atendimento@bazam.com.br
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <p className="container-page mt-8 text-center text-xs text-ink-400">
        Quer ver outras seções? Visite a{" "}
        <Link href="/" className="font-semibold text-brand-700 hover:underline">
          home da Bazam
        </Link>
        .
      </p>
    </>
  );
}
