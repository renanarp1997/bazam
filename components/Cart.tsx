"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { formatBRL } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

export default function Cart() {
  const {
    lines,
    updateQty,
    removeLine,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    shipping,
    total,
    clearCart,
  } = useCart();
  const { loading: toastLoading, update, success } = useToast();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput("");
      setCouponError(false);
      success("Cupom aplicado", "10% off no seu pedido");
    } else {
      setCouponError(true);
    }
  };

  const handleCheckout = () => {
    if (checkingOut || lines.length === 0) return;
    setCheckingOut(true);
    const id = toastLoading("Processando pedido…", "Aguarde alguns instantes");
    setTimeout(() => {
      update(id, {
        variant: "success",
        title: "Pedido confirmado!",
        description: `Total ${formatBRL(total)} — você receberá um e-mail em breve.`,
        duration: 5000,
      });
      clearCart();
      setCheckingOut(false);
    }, 1600);
  };

  const installmentValue = total / 12;

  if (lines.length === 0) {
    return (
      <section className="container-page mt-8">
        <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-head text-2xl font-extrabold text-ink-900">
            Sua sacola está vazia
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Que tal explorar nossas ofertas e encontrar algo especial?
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

  return (
    <section className="container-page mt-6 sm:mt-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-head text-3xl font-extrabold text-ink-900 sm:text-[34px]">
            Minha sacola
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {lines.length} {lines.length === 1 ? "produto" : "produtos"} ·{" "}
            {lines.reduce((a, l) => a + l.qty, 0)}{" "}
            {lines.reduce((a, l) => a + l.qty, 0) === 1 ? "item" : "itens"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Pagamento 100% protegido
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
            <Lock className="h-3.5 w-3.5" />
            SSL 256-bit
          </span>
        </div>
      </div>

      {/* Progress to free shipping */}
      {subtotal < 199 ? (
        <div className="mb-5 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-accent-50 p-4 shadow-soft">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-brand-700" />
            <span className="text-ink-700">
              Faltam{" "}
              <strong className="text-ink-900">{formatBRL(199 - subtotal)}</strong> para
              ganhar frete grátis
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
              style={{ width: `${Math.min(100, (subtotal / 199) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm font-bold text-accent-700">
          <BadgeCheck className="h-4 w-4" />
          Parabéns! Você ganhou frete grátis nesta compra.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {lines.map((l) => (
            <article
              key={l.product.id}
              className="group flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft transition-all hover:border-brand-200 sm:flex-row sm:items-start"
            >
              <Link
                href={`/produto/${l.product.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-50 sm:h-28 sm:w-28"
              >
                <Image
                  src={l.product.image}
                  alt={l.product.name}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-brand-700">
                  {l.product.brand}
                </p>
                <Link href={`/produto/${l.product.id}`}>
                  <h3 className="mt-0.5 text-sm font-bold leading-snug text-ink-900 hover:text-brand-700">
                    {l.product.name}
                  </h3>
                </Link>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  {l.product.freeShipping && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-2 py-0.5 font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
                      <Truck className="h-3 w-3" />
                      Frete grátis
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
                    Chega em 48h
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex h-10 items-center rounded-xl border border-ink-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQty(l.product.id, -1)}
                      className="inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:bg-ink-50"
                      aria-label="Diminuir"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-ink-900 tabular-nums">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(l.product.id, 1)}
                      className="inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:bg-ink-50"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    {l.product.oldPrice && (
                      <p className="text-xs text-ink-400 line-through">
                        {formatBRL(l.product.oldPrice * l.qty)}
                      </p>
                    )}
                    <p className="font-head text-lg font-extrabold text-ink-900">
                      {formatBRL(l.product.price * l.qty)}
                    </p>
                    {l.product.installments && (
                      <p className="text-[10.5px] text-ink-500">
                        em {l.product.installments.count}x sem juros
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeLine(l.product.id)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-xl text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        {/* Summary */}
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          {/* Coupon */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-900">
              <Tag className="h-3.5 w-3.5 text-brand-600" />
              Cupom de desconto
            </p>
            {coupon ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-accent-50 px-3 py-2 ring-1 ring-inset ring-accent-200">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-accent-700" />
                  <span className="text-sm font-bold text-accent-700">
                    {coupon} aplicado (-10%)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-accent-700 hover:bg-accent-100"
                  aria-label="Remover cupom"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(false);
                    }}
                    placeholder="Ex: BAZAM10"
                    className={`h-11 flex-1 rounded-xl border bg-white px-3.5 text-sm outline-none focus:border-brand-400 ${
                      couponError ? "border-rose-400" : "border-ink-200"
                    }`}
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-ink-900 px-4 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    Aplicar
                  </button>
                </form>
                {couponError && (
                  <p className="mt-2 text-[11px] font-semibold text-rose-600">
                    Cupom inválido
                  </p>
                )}
                <p className="mt-2 text-[11px] text-ink-500">
                  Experimente{" "}
                  <code className="font-mono font-bold text-brand-700">BAZAM10</code>{" "}
                  para 10% off
                </p>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <h2 className="font-head text-lg font-extrabold text-ink-900">
              Resumo do pedido
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-ink-700">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatBRL(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <dt>Cupom ({coupon})</dt>
                  <dd className="font-semibold">-{formatBRL(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-700">
                <dt>Frete</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-accent-700">Grátis</span>
                  ) : (
                    formatBRL(shipping)
                  )}
                </dd>
              </div>
              <hr className="border-ink-100" />
              <div className="flex items-baseline justify-between">
                <dt className="text-sm font-bold text-ink-900">Total</dt>
                <dd className="font-head text-2xl font-extrabold text-ink-900">
                  {formatBRL(total)}
                </dd>
              </div>
              <p className="text-right text-[11px] text-ink-500">
                ou 12x de {formatBRL(installmentValue)} sem juros
              </p>
            </dl>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="group relative mt-5 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.65)] transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {checkingOut ? (
                <>
                  <span className="relative inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                  <span className="relative">Processando…</span>
                </>
              ) : (
                <>
                  <CreditCard className="relative h-4 w-4" />
                  <span className="relative">Finalizar compra</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
            >
              Continuar comprando
            </Link>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-900">
              Formas de pagamento
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Visa", "Master", "Elo", "Amex", "Pix", "Boleto"].map((p) => (
                <span
                  key={p}
                  className="inline-flex h-8 items-center rounded-md border border-ink-200 bg-white px-2.5 text-[11px] font-bold text-ink-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
