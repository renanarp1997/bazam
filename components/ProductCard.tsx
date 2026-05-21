"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { formatBRL, type Product } from "@/lib/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/produto/${product.id}`;
  const [imgSrc, setImgSrc] = useState(product.image);
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 will-change-transform hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift">
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-brand-200 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-ink-50 via-white to-ink-50">
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-0">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.12),transparent_55%)]" />
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 300px, (min-width:640px) 33vw, 50vw"
            className="object-cover transition-all duration-[700ms] ease-out group-hover:scale-110 group-hover:rotate-[0.5deg]"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge-discount inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              -{discount}%
            </span>
          )}
          {product.badge === "new" && <span className="badge-new">Novo</span>}
          {product.badge === "bestseller" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_4px_10px_-2px_rgba(245,158,11,0.45)]">
              <Star className="h-3 w-3 fill-current" />
              Top vendas
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink-600 shadow-soft backdrop-blur transition-all hover:scale-110 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Favoritar"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/95 text-ink-600 opacity-0 shadow-soft backdrop-blur transition-all hover:bg-brand-50 hover:text-brand-700 group-hover:translate-x-0 group-hover:opacity-100"
            aria-label="Visualização rápida"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-semibold uppercase tracking-widest text-brand-700">
            {product.brand}
          </p>
          <span className="inline-flex items-center gap-0.5 text-[11px]">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-ink-800">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-ink-400">
              ({product.reviews.toLocaleString("pt-BR")})
            </span>
          </span>
        </div>

        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink-900 transition-colors hover:text-brand-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            {product.oldPrice && (
              <p className="text-xs text-ink-400 line-through">
                {formatBRL(product.oldPrice)}
              </p>
            )}
            {discount > 0 && (
              <span className="text-[10.5px] font-bold text-rose-600">
                -{discount}%
              </span>
            )}
          </div>
          <p className="text-[22px] font-extrabold leading-tight tracking-tight text-ink-900">
            {formatBRL(product.price)}
          </p>
          {product.installments && (
            <p className="text-[11px] leading-tight text-ink-600">
              ou <strong className="text-ink-900">{product.installments.count}x</strong> de{" "}
              <strong className="text-ink-900">{formatBRL(product.installments.value)}</strong>
              <span className="text-accent-700"> sem juros</span>
            </p>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {product.freeShipping && (
            <span className="inline-flex w-fit items-center gap-1 rounded-md bg-accent-50 px-2 py-0.5 text-[10.5px] font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
              <Truck className="h-3 w-3" />
              Frete grátis
            </span>
          )}
          <span className="inline-flex w-fit items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[10.5px] font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
            Chega em 48h
          </span>
        </div>

        <button
          type="button"
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-ink-900 to-ink-800 px-4 py-2.5 text-xs font-bold text-white transition-all hover:from-brand-700 hover:to-brand-600 hover:shadow-[0_12px_24px_-12px_rgba(79,70,229,0.55)]"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Adicionar à sacola
        </button>
      </div>
    </article>
  );
}
