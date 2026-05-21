"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import CatalogListing from "./CatalogListing";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";

const quickSearches = [
  "iPhone",
  "Tênis",
  "Notebook",
  "Smartwatch",
  "Fone bluetooth",
  "Perfume",
  "Câmera",
  "Mochila",
];

type Props = {
  query: string;
  products: Product[];
};

export default function SearchResults({ query, products }: Props) {
  return (
    <>
      <section className="container-page mt-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 p-7 text-white shadow-premium sm:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/25 backdrop-blur">
              <Search className="h-3.5 w-3.5" />
              Resultado da busca
            </span>
            {query ? (
              <>
                <h1 className="mt-3 font-head text-2xl font-extrabold leading-tight text-balance sm:text-3xl lg:text-[40px]">
                  {products.length > 0 ? (
                    <>
                      <span className="text-white/70">Você buscou por</span>{" "}
                      “{query}”
                    </>
                  ) : (
                    <>
                      Nenhum resultado para{" "}
                      <span className="gradient-text">“{query}”</span>
                    </>
                  )}
                </h1>
                {products.length > 0 ? (
                  <p className="mt-3 text-sm text-white/80">
                    <strong className="text-white">{products.length}</strong>{" "}
                    {products.length === 1 ? "produto encontrado" : "produtos encontrados"}{" "}
                    — use os filtros para refinar.
                  </p>
                ) : (
                  <p className="mt-3 max-w-xl text-sm text-white/80">
                    Tente buscar por outro termo, navegue pelas categorias ou
                    confira nossas sugestões abaixo.
                  </p>
                )}
              </>
            ) : (
              <>
                <h1 className="mt-3 font-head text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[40px]">
                  O que você está procurando?
                </h1>
                <p className="mt-3 max-w-xl text-sm text-white/80">
                  Digite na barra de busca acima ou explore por uma das sugestões.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {!query || products.length === 0 ? (
        <section className="container-page section space-y-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
              Buscas populares
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickSearches.map((s) => (
                <Link
                  key={s}
                  href={`/buscar?q=${encodeURIComponent(s)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
              Ou navegue por categoria
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categoria/${c.slug}`}
                  className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <p className="font-head text-lg font-extrabold text-ink-900 transition-colors group-hover:text-brand-700">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {c.count.toLocaleString("pt-BR")} produtos
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <CatalogListing products={products} />
      )}
    </>
  );
}
