"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useQuickView } from "@/lib/quickview-context";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useToast } from "@/lib/toast-context";
import { formatBRL } from "@/lib/products";

export default function QuickView() {
  const { product, close } = useQuickView();
  const { addProduct } = useCart();
  const { has, toggle } = useFavorites();
  const { success } = useToast();

  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (product) {
      setQty(1);
      setActive(0);
    }
  }, [product]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (product) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, close]);

  if (!product) return null;

  const gallery =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;
  const favored = has(product.id);

  const handleAdd = () => {
    addProduct(product.id, qty);
    success("Adicionado à sacola", `${qty}× ${product.name}`);
    close();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[75] bg-ink-950/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-label="Visualização rápida"
          >
            <div className="relative w-full max-w-3xl overflow-hidden rounded-t-3xl bg-white shadow-premium sm:rounded-3xl">
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink-700 shadow-soft backdrop-blur transition-all hover:scale-110 hover:bg-ink-100"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid max-h-[88dvh] overflow-y-auto sm:max-h-[80dvh] md:grid-cols-2">
                {/* Gallery */}
                <div className="relative bg-gradient-to-br from-ink-50 to-white">
                  <div className="relative aspect-square">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={gallery[active]}
                        alt={product.name}
                        fill
                        priority
                        sizes="(min-width:768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                      {discount > 0 && (
                        <span className="badge-discount inline-flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          -{discount}%
                        </span>
                      )}
                      {product.badge === "new" && (
                        <span className="badge-new">Novo</span>
                      )}
                      {product.badge === "bestseller" && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          <Star className="h-3 w-3 fill-current" />
                          Top vendas
                        </span>
                      )}
                    </div>
                  </div>

                  {gallery.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-3">
                      {gallery.slice(0, 4).map((g, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActive(i)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-ink-50 ${
                            active === i ? "border-brand-500" : "border-ink-100"
                          }`}
                          aria-label={`Imagem ${i + 1}`}
                        >
                          <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col p-5 sm:p-7">
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-brand-700">
                    {product.brand}
                  </p>
                  <h2 className="mt-1 font-head text-xl font-extrabold leading-tight text-ink-900 sm:text-2xl">
                    {product.name}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 ring-1 ring-inset ring-amber-100">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-ink-900">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-ink-500">
                        ({product.reviews.toLocaleString("pt-BR")})
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-700">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                      </span>
                      {product.inStock ?? 20} em estoque
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-ink-50/70 p-4">
                    {product.oldPrice && (
                      <p className="text-xs text-ink-400 line-through">
                        {formatBRL(product.oldPrice)}
                      </p>
                    )}
                    <p className="font-head text-3xl font-extrabold leading-none tracking-tight text-ink-900 sm:text-[34px]">
                      {formatBRL(product.price)}
                    </p>
                    {product.installments && (
                      <p className="mt-1 text-xs text-ink-600">
                        ou{" "}
                        <strong className="text-ink-900">
                          {product.installments.count}x
                        </strong>{" "}
                        de{" "}
                        <strong className="text-ink-900">
                          {formatBRL(product.installments.value)}
                        </strong>
                        <span className="text-accent-700"> sem juros</span>
                      </p>
                    )}
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10.5px]">
                      <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-2 py-0.5 font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
                        <Zap className="h-3 w-3" />
                        Pix 10% off
                      </span>
                      {product.freeShipping && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
                          <Truck className="h-3 w-3" />
                          Frete grátis
                        </span>
                      )}
                    </div>
                  </div>

                  {product.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-600">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row sm:items-center">
                    <div className="inline-flex h-11 items-center self-stretch rounded-xl border border-ink-200 bg-white">
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="inline-flex h-11 w-11 items-center justify-center text-ink-700 hover:bg-ink-50"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-ink-900 tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + 1)}
                        className="inline-flex h-11 w-11 items-center justify-center text-ink-700 hover:bg-ink-50"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAdd}
                      className="group relative inline-flex h-11 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.65)] transition-all hover:scale-[1.01]"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <ShoppingBag className="relative h-4 w-4" />
                      <span className="relative">Adicionar à sacola</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggle(product.id)}
                      aria-pressed={favored}
                      aria-label={favored ? "Remover dos favoritos" : "Favoritar"}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                        favored
                          ? "border-rose-300 bg-rose-50 text-rose-600"
                          : "border-ink-200 bg-white text-ink-600 hover:border-rose-300 hover:text-rose-600"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favored ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-ink-500">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-brand-600" />
                      Compra protegida
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <RotateCcw className="h-3 w-3 text-accent-600" />
                      Troca em 30 dias
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3 text-amber-600" />
                      Garantia oficial
                    </span>
                  </div>

                  <Link
                    href={`/produto/${product.id}`}
                    onClick={close}
                    className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full text-xs font-bold text-brand-700 hover:underline"
                  >
                    Ver detalhes completos
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
