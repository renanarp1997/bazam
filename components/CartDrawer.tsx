"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { formatBRL } from "@/lib/products";

export default function CartDrawer() {
  const {
    lines,
    open,
    closeCart,
    updateQty,
    removeLine,
    subtotal,
    itemsCount,
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
      closeCart();
      setCheckingOut(false);
    }, 1600);
  };

  const installmentValue = total / 12;
  const freeShipProgress = Math.min(100, (subtotal / 199) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink-950/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-md flex-col bg-white shadow-premium sm:max-w-md"
            role="dialog"
            aria-label="Sacola"
          >
            {/* Header */}
            <header className="relative shrink-0 border-b border-ink-100 bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 px-5 py-4 text-white">
              <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-400/30 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/20 backdrop-blur">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                    Minha sacola
                  </p>
                  <p className="font-head text-base font-extrabold">
                    {itemsCount} {itemsCount === 1 ? "item" : "itens"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free shipping progress */}
              {lines.length > 0 && (
                <div className="relative mt-3">
                  {subtotal < 199 ? (
                    <>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1.5 text-white/85">
                          <Truck className="h-3.5 w-3.5 text-accent-300" />
                          Faltam{" "}
                          <strong className="text-white">
                            {formatBRL(199 - subtotal)}
                          </strong>{" "}
                          para frete grátis
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent-400 to-amber-300 transition-all"
                          style={{ width: `${freeShipProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-400/20 px-2.5 py-1 text-[11px] font-bold text-accent-200 ring-1 ring-inset ring-accent-300/30">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Você ganhou frete grátis
                    </div>
                  )}
                </div>
              )}
            </header>

            {/* Body */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <p className="mt-4 font-head text-lg font-extrabold text-ink-900">
                  Sua sacola está vazia
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Que tal explorar nossas ofertas?
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] hover:scale-[1.02]"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <ul className="space-y-3">
                    {lines.map((l) => (
                      <li
                        key={l.product.id}
                        className="group flex gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft transition-colors hover:border-brand-200"
                      >
                        <Link
                          href={`/produto/${l.product.id}`}
                          onClick={closeCart}
                          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-50"
                        >
                          <Image
                            src={l.product.image}
                            alt={l.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                            {l.product.brand}
                          </p>
                          <Link
                            href={`/produto/${l.product.id}`}
                            onClick={closeCart}
                            className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink-900 hover:text-brand-700"
                          >
                            {l.product.name}
                          </Link>

                          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5 pt-2">
                            <div className="inline-flex h-8 items-center rounded-lg border border-ink-200 bg-white">
                              <button
                                type="button"
                                onClick={() => updateQty(l.product.id, -1)}
                                className="inline-flex h-8 w-7 items-center justify-center text-ink-700 hover:bg-ink-50"
                                aria-label="Diminuir"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-ink-900 tabular-nums">
                                {l.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(l.product.id, 1)}
                                className="inline-flex h-8 w-7 items-center justify-center text-ink-700 hover:bg-ink-50"
                                aria-label="Aumentar"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="ml-auto text-right">
                              {l.product.oldPrice && (
                                <p className="text-[10px] text-ink-400 line-through">
                                  {formatBRL(l.product.oldPrice * l.qty)}
                                </p>
                              )}
                              <p className="font-head text-sm font-extrabold leading-none text-ink-900">
                                {formatBRL(l.product.price * l.qty)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLine(l.product.id)}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Coupon */}
                  <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-900">
                      <Tag className="h-3.5 w-3.5 text-brand-600" />
                      Cupom de desconto
                    </p>
                    {coupon ? (
                      <div className="mt-2.5 flex items-center justify-between rounded-xl bg-accent-50 px-3 py-2 ring-1 ring-inset ring-accent-200">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-700">
                          <BadgeCheck className="h-4 w-4" />
                          {coupon} aplicado (-10%)
                        </span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-accent-700 hover:bg-accent-100"
                          aria-label="Remover cupom"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <form
                          onSubmit={handleApplyCoupon}
                          className="mt-2.5 flex gap-2"
                        >
                          <input
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              setCouponError(false);
                            }}
                            placeholder="Ex: BAZAM10"
                            className={`h-10 flex-1 rounded-lg border bg-white px-3 text-xs outline-none focus:border-brand-400 ${
                              couponError ? "border-rose-400" : "border-ink-200"
                            }`}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-ink-900 px-3.5 text-xs font-bold text-white hover:bg-brand-700"
                          >
                            Aplicar
                          </button>
                        </form>
                        {couponError ? (
                          <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                            Cupom inválido
                          </p>
                        ) : (
                          <p className="mt-1.5 text-[11px] text-ink-500">
                            Experimente{" "}
                            <code className="font-mono font-bold text-brand-700">
                              BAZAM10
                            </code>{" "}
                            para 10% off
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Footer / Summary */}
                <footer className="shrink-0 border-t border-ink-100 bg-white p-4">
                  <dl className="space-y-1.5 text-sm">
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
                    <hr className="my-1.5 border-ink-100" />
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
                    className="group relative mt-3 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
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

                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={closeCart}
                      className="text-xs font-semibold text-ink-600 underline-offset-2 hover:text-ink-900 hover:underline"
                    >
                      Continuar comprando
                    </button>
                    <div className="flex items-center gap-3 text-[10px] text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        SSL 256-bit
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-accent-600" />
                        Compra protegida
                      </span>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
