"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { formatBRL, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useToast } from "@/lib/toast-context";
import { useRouter } from "next/navigation";

const reviewsBreakdown = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addProduct, openCart } = useCart();
  const { has: isFavorite, toggle: toggleFavorite } = useFavorites();
  const { success, info, loading, update, dismiss, error: toastError } = useToast();
  const favored = isFavorite(product.id);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[Math.floor((product.sizes?.length ?? 0) / 2)]);
  const [openSpecs, setOpenSpecs] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);
  const [cep, setCep] = useState("");
  const [cepResult, setCepResult] = useState<{ days: string; price: string } | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  const handleAddToCart = () => {
    addProduct(product.id, qty);
    success("Adicionado à sacola", `${qty}× ${product.name}`);
  };

  const handleBuyNow = () => {
    addProduct(product.id, qty);
    success("Pronto para finalizar", "Itens disponíveis na sua sacola");
    openCart();
  };

  const handleCepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length !== 8) {
      toastError("CEP inválido", "Digite um CEP com 8 dígitos");
      return;
    }
    setCepLoading(true);
    setCepResult(null);
    const loadingId = loading("Calculando frete…", `CEP ${cleaned.slice(0,5)}-${cleaned.slice(5)}`);
    setTimeout(() => {
      const days = product.freeShipping ? "24-48h" : "3-5 dias úteis";
      const price = product.freeShipping ? "Grátis" : "R$ 19,90";
      setCepResult({ days, price });
      setCepLoading(false);
      update(loadingId, {
        variant: "success",
        title: "Entrega disponível",
        description: `Chega em ${days} • ${price}`,
        duration: 4000,
      });
    }, 1100);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.brand, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      success("Link copiado!", "Cole onde quiser para compartilhar");
    } catch {
      info("Link disponível na barra do navegador");
    }
  };

  const handleReview = () => {
    const id = loading("Abrindo formulário…");
    setTimeout(() => {
      update(id, {
        variant: "info",
        title: "Em breve",
        description: "Avaliações pelo app estarão disponíveis em breve.",
        duration: 4000,
      });
    }, 700);
  };

  // router/dismiss reserved for future flows
  void router;
  void dismiss;

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <section className="container-page mt-6 sm:mt-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 to-white shadow-soft">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={gallery[active]}
                alt={product.name}
                fill
                priority
                sizes="(min-width:1024px) 600px, 90vw"
                className="object-cover"
              />
            </motion.div>

            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="badge-discount inline-flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  -{discount}%
                </span>
              )}
              {product.badge === "new" && <span className="badge-new">Novo</span>}
              {product.badge === "bestseller" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  <Star className="h-3 w-3 fill-current" />
                  Top vendas
                </span>
              )}
            </div>

            <div className="absolute right-4 top-4 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-pressed={favored}
                aria-label={favored ? "Remover dos favoritos" : "Favoritar"}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full shadow-soft transition-all hover:scale-110 ${
                  favored
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-white/95 text-ink-600 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                <Heart className={`h-4 w-4 ${favored ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink-600 shadow-soft transition-all hover:scale-110 hover:bg-brand-50 hover:text-brand-700"
                aria-label="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-ink-50 transition-all ${
                    active === i
                      ? "border-brand-500 shadow-[0_8px_18px_-8px_rgba(79,70,229,0.45)]"
                      : "border-ink-100 hover:border-ink-300"
                  }`}
                  aria-label={`Imagem ${i + 1}`}
                >
                  <Image src={g} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            {product.brand}
          </p>
          <h1 className="mt-2 font-head text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl lg:text-[34px]">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 ring-1 ring-inset ring-amber-100">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-ink-900">{product.rating.toFixed(1)}</span>
              <span className="text-ink-500">
                ({product.reviews.toLocaleString("pt-BR")} avaliações)
              </span>
            </div>
            <span className="text-ink-300">·</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              {product.inStock ?? 20} em estoque
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            {product.oldPrice && (
              <div className="flex items-baseline gap-2">
                <p className="text-sm text-ink-400 line-through">
                  {formatBRL(product.oldPrice)}
                </p>
                {discount > 0 && (
                  <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[11px] font-bold text-rose-700">
                    -{discount}%
                  </span>
                )}
              </div>
            )}
            <p className="mt-0.5 font-head text-[34px] font-extrabold leading-none tracking-tight text-ink-900 sm:text-[40px]">
              {formatBRL(product.price)}
            </p>
            {product.installments && (
              <p className="mt-1.5 text-sm text-ink-600">
                ou <strong className="text-ink-900">{product.installments.count}x</strong> de{" "}
                <strong className="text-ink-900">
                  {formatBRL(product.installments.value)}
                </strong>
                <span className="text-accent-700"> sem juros</span>
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-md bg-accent-50 px-2 py-1 font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
                <Zap className="h-3 w-3" />
                Pague no Pix com 10% off
              </span>
              {product.freeShipping && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
                  <Truck className="h-3 w-3" />
                  Frete grátis
                </span>
              )}
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-900">
                Cor: <span className="text-ink-600">{color}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`group relative h-10 w-10 rounded-full ring-2 transition-all ${
                      color === c.name
                        ? "ring-brand-500 ring-offset-2"
                        : "ring-ink-200 hover:ring-ink-400"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-900">
                  Tamanho: <span className="text-ink-600">{size}</span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    info(
                      "Guia de tamanhos",
                      "Tabela completa de medidas estará disponível em breve.",
                    )
                  }
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Guia de tamanhos
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`inline-flex h-11 min-w-[44px] items-center justify-center rounded-xl border px-3 text-sm font-bold transition-all ${
                      size === s
                        ? "border-brand-500 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                        : "border-ink-200 bg-white text-ink-800 hover:border-ink-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CEP */}
          <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-900">
              <Truck className="h-3.5 w-3.5 text-brand-600" />
              Calcular frete e prazo
            </p>
            <form
              onSubmit={handleCepSubmit}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="text"
                inputMode="numeric"
                value={cep}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
                  const formatted =
                    digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
                  setCep(formatted);
                }}
                placeholder="00000-000"
                className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-4 text-sm outline-none transition-colors focus:border-brand-400"
              />
              <button
                type="submit"
                disabled={cepLoading}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-ink-900 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {cepLoading ? "Calculando…" : "Calcular"}
              </button>
            </form>
            {cepResult ? (
              <div className="mt-3 rounded-xl bg-accent-50 p-3 ring-1 ring-inset ring-accent-200">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-accent-700">
                    <Truck className="h-3.5 w-3.5" />
                    Entrega expressa
                  </span>
                  <span className="text-ink-700">
                    Chega em <strong className="text-ink-900">{cepResult.days}</strong>
                  </span>
                  <span className="font-bold text-accent-700">{cepResult.price}</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[11px] text-ink-500">
                Não sei meu CEP{" "}
                <a
                  href="https://buscacepinter.correios.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 hover:underline"
                >
                  consultar
                </a>
              </p>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex items-center gap-2.5">
            <div className="inline-flex h-12 items-center rounded-xl border border-ink-200 bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="inline-flex h-12 w-11 items-center justify-center text-ink-700 transition-colors hover:bg-ink-50"
                aria-label="Diminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-ink-900 tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="inline-flex h-12 w-11 items-center justify-center text-ink-700 transition-colors hover:bg-ink-50"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="group relative inline-flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.65)] transition-all hover:scale-[1.01] hover:from-brand-500 hover:to-brand-700"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <ShoppingBag className="relative h-4 w-4" />
              <span className="relative">Adicionar à sacola</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 text-sm font-extrabold text-white transition-all hover:bg-ink-800"
          >
            Comprar agora
          </button>

          {/* Trust */}
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                <Truck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-ink-900">Entrega rápida</p>
                <p className="text-ink-500">Chega em 24-48h em capitais</p>
              </div>
            </li>
            <li className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-ink-900">Compra protegida</p>
                <p className="text-ink-500">Site blindado SSL</p>
              </div>
            </li>
            <li className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-ink-900">Troca grátis</p>
                <p className="text-ink-500">Em até 30 dias</p>
              </div>
            </li>
            <li className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-ink-900">Garantia oficial</p>
                <p className="text-ink-500">12 meses do fabricante</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Description & specs */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <h2 className="font-head text-xl font-extrabold text-ink-900">
              Sobre o produto
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {product.description ??
                "Produto de alta qualidade selecionado por nossa curadoria. Confira as especificações técnicas para garantir a melhor escolha para você."}
            </p>
          </div>

          {product.specs && product.specs.length > 0 && (
            <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
              <button
                type="button"
                onClick={() => setOpenSpecs((v) => !v)}
                className="flex w-full items-center justify-between p-6"
              >
                <h2 className="font-head text-xl font-extrabold text-ink-900">
                  Especificações técnicas
                </h2>
                <ChevronDown
                  className={`h-5 w-5 text-ink-500 transition-transform ${openSpecs ? "rotate-180" : ""}`}
                />
              </button>
              {openSpecs && (
                <div className="px-6 pb-6">
                  <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {product.specs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-3 border-b border-dashed border-ink-100 py-2">
                        <dt className="text-sm text-ink-500">{s.label}</dt>
                        <dd className="text-sm font-semibold text-ink-900">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
            <button
              type="button"
              onClick={() => setOpenShipping((v) => !v)}
              className="flex w-full items-center justify-between p-6"
            >
              <h2 className="font-head text-xl font-extrabold text-ink-900">
                Entrega e devolução
              </h2>
              <ChevronDown
                className={`h-5 w-5 text-ink-500 transition-transform ${openShipping ? "rotate-180" : ""}`}
              />
            </button>
            {openShipping && (
              <div className="space-y-2 px-6 pb-6 text-sm text-ink-700">
                <p>· Frete grátis em todo o Brasil em pedidos acima de R$ 199.</p>
                <p>· Entrega expressa em 24-48h em capitais e regiões metropolitanas.</p>
                <p>· Devolução gratuita em até 30 dias após o recebimento.</p>
                <p>· Garantia de 12 meses contra defeitos de fabricação.</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews summary */}
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
            <h3 className="font-head text-lg font-extrabold text-ink-900">
              Avaliações
            </h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-center">
                <p className="font-head text-4xl font-extrabold text-ink-900">
                  {product.rating.toFixed(1)}
                </p>
                <div className="mt-1 flex items-center justify-center text-amber-400">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-amber-400" : "text-ink-200"}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-ink-500">
                  {product.reviews.toLocaleString("pt-BR")} avaliações
                </p>
              </div>
              <div className="flex-1 space-y-1.5">
                {reviewsBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-6 text-ink-600">{r.stars}★</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-ink-500">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleReview}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-ink-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
            >
              Escrever avaliação
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
