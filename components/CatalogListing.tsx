"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Grid3x3, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";
import { brands as allBrands } from "@/lib/products";

type Sort = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "rating", label: "Mais avaliados" },
  { value: "newest", label: "Lançamentos" },
];

type Props = {
  products: Product[];
};

export default function CatalogListing({ products }: Props) {
  const [sort, setSort] = useState<Sort>("relevance");
  const [openFilters, setOpenFilters] = useState(false);
  const [gridDense, setGridDense] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [freeShipOnly, setFreeShipOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (freeShipOnly && !p.freeShipping) return false;
      if (discountOnly && !p.oldPrice) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        r = [...r].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r = [...r].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        r = [...r].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        r = [...r].sort((a) => (a.badge === "new" ? -1 : 1));
        break;
    }
    return r;
  }, [products, sort, selectedBrands, minRating, maxPrice, freeShipOnly, discountOnly]);

  const brandsAvailable = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return allBrands.filter((b) => set.has(b));
  }, [products]);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinRating(0);
    setMaxPrice(5000);
    setFreeShipOnly(false);
    setDiscountOnly(false);
  };

  const activeCount =
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 5000 ? 1 : 0) +
    (freeShipOnly ? 1 : 0) +
    (discountOnly ? 1 : 0);

  return (
    <section className="container-page section">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside
          className={`${openFilters ? "fixed inset-0 z-50 overflow-y-auto bg-white p-4" : "hidden"} lg:relative lg:block lg:p-0`}
        >
          {openFilters && (
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-base font-bold text-ink-900">Filtros</p>
              <button
                onClick={() => setOpenFilters(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="space-y-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-900">
                Filtros
              </p>
              {activeCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  Limpar ({activeCount})
                </button>
              )}
            </div>

            {/* Promo */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                Promoções
              </p>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={freeShipOnly}
                  onChange={(e) => setFreeShipOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                />
                <span className="text-ink-700">Frete grátis</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                />
                <span className="text-ink-700">Com desconto</span>
              </label>
            </div>

            <hr className="border-ink-100" />

            {/* Brand */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                Marca
              </p>
              <div className="space-y-2">
                {brandsAvailable.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
                    />
                    <span className="text-ink-700">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-ink-100" />

            {/* Price */}
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                Preço até
              </p>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <p className="text-sm font-bold text-ink-900">
                R$ {maxPrice.toLocaleString("pt-BR")}
              </p>
            </div>

            <hr className="border-ink-100" />

            {/* Rating */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                Avaliação mínima
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      minRating === r
                        ? "bg-ink-900 text-white"
                        : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                    }`}
                  >
                    {r === 0 ? "Todas" : `${r}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Listing */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenFilters(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-800 transition-colors hover:border-brand-300 lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtros
                {activeCount > 0 && (
                  <span className="rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <p className="text-sm text-ink-600">
                <strong className="text-ink-900">{filtered.length}</strong> produtos
                encontrados
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1 rounded-full border border-ink-200 p-0.5 sm:flex">
                <button
                  onClick={() => setGridDense(false)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    !gridDense ? "bg-ink-900 text-white" : "text-ink-500"
                  }`}
                  aria-label="Grid largo"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setGridDense(true)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    gridDense ? "bg-ink-900 text-white" : "text-ink-500"
                  }`}
                  aria-label="Grid denso"
                >
                  <Grid3x3 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none rounded-full border border-ink-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-ink-800 outline-none transition-colors hover:border-brand-300 focus:border-brand-400"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
              <p className="text-base font-bold text-ink-900">
                Nenhum produto encontrado
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Tente ajustar os filtros ou limpar a seleção.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div
              className={`mt-5 grid gap-3 sm:gap-4 ${
                gridDense
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
