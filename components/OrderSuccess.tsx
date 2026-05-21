"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { formatBRL } from "@/lib/products";

type StoredOrder = {
  number: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    brand: string;
    image: string;
    qty: number;
    price: number;
    oldPrice?: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  pixDiscount: number;
  total: number;
  payment: "pix" | "card" | "boleto";
  installments: number;
  delivery?: { name: string; desc: string; days: string };
  customer: { name: string; email: string; phone: string; cpf: string };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    uf: string;
  };
};

const paymentInfo: Record<
  StoredOrder["payment"],
  { label: string; icon: typeof Zap; color: string }
> = {
  pix: { label: "Pago via Pix", icon: Zap, color: "text-accent-700 bg-accent-50" },
  card: {
    label: "Pago no cartão",
    icon: CreditCard,
    color: "text-brand-700 bg-brand-50",
  },
  boleto: {
    label: "Aguardando boleto",
    icon: FileText,
    color: "text-ink-800 bg-ink-100",
  },
};

function estimatedDelivery(daysText?: string): string {
  const now = new Date();
  const max = daysText?.includes("24")
    ? 2
    : daysText?.includes("3-5")
      ? 5
      : daysText?.includes("Pronto")
        ? 0
        : 5;
  const d = new Date(now.getTime() + max * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}

export default function OrderSuccess() {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bazam:last-order");
      if (raw) setOrder(JSON.parse(raw) as StoredOrder);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const eta = useMemo(
    () => estimatedDelivery(order?.delivery?.days),
    [order?.delivery?.days],
  );

  const copyNumber = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  };

  if (!loaded) return null;

  if (!order) {
    return (
      <section className="container-page mt-12">
        <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
            <Package className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-head text-2xl font-extrabold text-ink-900">
            Nenhum pedido recente encontrado
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Volte à loja para fazer um pedido.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] hover:scale-[1.02]"
          >
            Continuar comprando
          </Link>
        </div>
      </section>
    );
  }

  const pay = paymentInfo[order.payment];

  return (
    <>
      {/* Hero */}
      <section className="container-page mt-6 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-accent-600 via-accent-700 to-brand-900 p-8 text-white shadow-premium sm:p-12 lg:p-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.55,
                  type: "spring",
                  stiffness: 220,
                  damping: 14,
                }}
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/30 backdrop-blur"
              >
                <CheckCircle2 className="h-7 w-7" />
              </motion.div>
              <h1 className="mt-4 font-head text-3xl font-extrabold leading-[1.1] text-balance sm:text-4xl lg:text-[44px]">
                Pedido confirmado!
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Obrigado pela compra, {order.customer.name.split(" ")[0] || "cliente"}.
                Enviamos a confirmação para{" "}
                <strong className="text-white">{order.customer.email}</strong>.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-inset ring-white/25 backdrop-blur">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Pedido
                </span>
                <code className="font-head text-base font-extrabold tracking-wider">
                  {order.number}
                </code>
                <button
                  type="button"
                  onClick={copyNumber}
                  className="inline-flex h-7 items-center gap-1 rounded-lg bg-white/10 px-2 text-[11px] font-bold text-white hover:bg-white/20"
                  aria-label="Copiar número"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copiar
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent-700 shadow-[0_14px_30px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-[1.02]"
                >
                  Continuar comprando
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/ajuda"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  Acompanhar pedido
                </Link>
              </div>
            </div>

            {/* Delivery summary card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="hidden w-72 rounded-2xl bg-white/10 p-5 backdrop-blur ring-1 ring-inset ring-white/15 lg:block"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Previsão de entrega
              </p>
              <p className="mt-1 font-head text-3xl font-extrabold leading-none">
                {eta}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {order.delivery?.name ?? "Entrega padrão"} · {order.delivery?.days}
              </p>
              <hr className="my-4 border-white/15" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Endereço
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                {order.address.street}, {order.address.number}
                {order.address.complement ? ` · ${order.address.complement}` : ""}
                <br />
                {order.address.district} · {order.address.city}/{order.address.uf}
                <br />
                CEP {order.address.cep}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="container-page mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Tracking timeline */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-head text-base font-extrabold text-ink-900">
              <Truck className="h-4 w-4 text-brand-600" />
              Acompanhe seu pedido
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                {
                  title: "Pedido recebido",
                  desc: "Confirmamos seu pedido e enviamos o resumo por e-mail.",
                  done: true,
                  current: false,
                },
                {
                  title:
                    order.payment === "boleto"
                      ? "Aguardando pagamento do boleto"
                      : order.payment === "pix"
                        ? "Pagamento Pix confirmado"
                        : "Pagamento autorizado",
                  desc:
                    order.payment === "boleto"
                      ? "Você tem 3 dias úteis para pagar o boleto."
                      : "Tudo certo com seu pagamento.",
                  done: order.payment !== "boleto",
                  current: order.payment === "boleto",
                },
                {
                  title: "Preparando seu pedido",
                  desc: "Em até 24h enviamos para a transportadora.",
                  done: false,
                  current: order.payment !== "boleto",
                },
                {
                  title: "A caminho",
                  desc: `Previsão de chegada em ${eta}.`,
                  done: false,
                  current: false,
                },
                {
                  title: "Pedido entregue",
                  desc: "Avaliação será solicitada após a entrega.",
                  done: false,
                  current: false,
                },
              ].map((step, i, arr) => (
                <li key={i} className="relative flex gap-3">
                  {i < arr.length - 1 && (
                    <span
                      className={`absolute left-[15px] top-7 h-full w-px ${
                        step.done ? "bg-accent-400" : "bg-ink-200"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-gradient-to-br from-accent-500 to-accent-700 text-white"
                        : step.current
                          ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white"
                          : "bg-ink-100 text-ink-400"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : step.current ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    ) : (
                      <span className="text-[11px] font-bold">{i + 1}</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1 pb-1">
                    <p
                      className={`text-sm font-bold ${
                        step.done || step.current ? "text-ink-900" : "text-ink-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11.5px] leading-relaxed text-ink-500">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-head text-base font-extrabold text-ink-900">
              <Package className="h-4 w-4 text-brand-600" />
              Itens do pedido ({order.items.length})
            </h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 rounded-xl bg-ink-50/60 p-3"
                >
                  <Link
                    href={`/produto/${i.id}`}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white"
                  >
                    <Image
                      src={i.image}
                      alt={i.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] font-bold text-white">
                      {i.qty}
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                      {i.brand}
                    </p>
                    <Link
                      href={`/produto/${i.id}`}
                      className="line-clamp-2 text-sm font-bold leading-snug text-ink-900 hover:text-brand-700"
                    >
                      {i.name}
                    </Link>
                  </div>
                  <p className="font-head text-sm font-extrabold text-ink-900">
                    {formatBRL(i.price * i.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: summary */}
        <aside className="space-y-4">
          {/* Payment */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-900">
              Pagamento
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${pay.color}`}
              >
                <pay.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900">{pay.label}</p>
                {order.payment === "card" && order.installments > 1 && (
                  <p className="text-[11px] text-ink-500">
                    Parcelado em {order.installments}x sem juros
                  </p>
                )}
                {order.payment === "pix" && (
                  <p className="text-[11px] text-accent-700">
                    Você economizou {formatBRL(order.pixDiscount)} no Pix
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-900">
              Resumo
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-700">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatBRL(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <dt>Cupom</dt>
                  <dd className="font-semibold">-{formatBRL(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-700">
                <dt>Frete</dt>
                <dd className="font-semibold">
                  {order.shipping === 0 ? (
                    <span className="text-accent-700">Grátis</span>
                  ) : (
                    formatBRL(order.shipping)
                  )}
                </dd>
              </div>
              {order.pixDiscount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <dt>Desconto Pix</dt>
                  <dd className="font-semibold">-{formatBRL(order.pixDiscount)}</dd>
                </div>
              )}
              <hr className="my-2 border-ink-100" />
              <div className="flex items-baseline justify-between">
                <dt className="text-sm font-bold text-ink-900">Total</dt>
                <dd className="font-head text-2xl font-extrabold text-ink-900">
                  {formatBRL(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Delivery mobile */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft lg:hidden">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-900">
              <MapPin className="mr-1 inline h-3 w-3 text-brand-600" />
              Entrega
            </p>
            <p className="mt-2 font-head text-xl font-extrabold text-ink-900">
              {eta}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {order.delivery?.name} · {order.delivery?.days}
            </p>
            <p className="mt-3 text-[11.5px] leading-relaxed text-ink-700">
              {order.address.street}, {order.address.number}
              {order.address.complement ? ` · ${order.address.complement}` : ""}
              <br />
              {order.address.district} · {order.address.city}/{order.address.uf}
              <br />
              CEP {order.address.cep}
            </p>
          </div>

          {/* Plus invite */}
          <Link
            href="/plus"
            className="group block overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-5 text-white shadow-premium"
          >
            <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />
            <div className="relative">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-300/30">
                <Sparkles className="h-3 w-3" /> Bazam Plus
              </span>
              <p className="mt-2 font-head text-base font-extrabold">
                Ganhe cashback nesta compra
              </p>
              <p className="mt-1 text-xs text-white/80">
                Assinantes Plus recebem 5% de volta para a próxima compra.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:underline">
                Conhecer Plus
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-900">
              <Mail className="h-3.5 w-3.5 text-brand-600" />
              E-mail enviado
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              Enviamos os detalhes do pedido <strong className="text-ink-900">{order.number}</strong> para{" "}
              <strong className="text-ink-900">{order.customer.email}</strong>.
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-ink-500">
              <BadgeCheck className="h-3.5 w-3.5 text-accent-600" />
              Atendimento prioritário 24h após o pedido
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
