"use client";

import Link from "next/link";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "./PageHero";
import CatalogListing from "./CatalogListing";
import { useFavorites } from "@/lib/favorites-context";
import { categories } from "@/lib/products";

export default function FavoritesList() {
  const { items, count, clear } = useFavorites();

  return (
    <>
      <PageHero
        eyebrow="Minha lista"
        title="Seus favoritos"
        subtitle="Tudo o que você marcou para comprar depois. Salvamos para você não esquecer."
        icon="heart"
        count={count}
        accent="rose"
      />

      {count === 0 ? (
        <section className="container-page section">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center shadow-soft sm:p-14"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-head text-2xl font-extrabold text-ink-900">
              Sua lista de favoritos está vazia
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Toque no coração de qualquer produto para salvá-lo aqui e encontrar
              depois sem precisar buscar de novo.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                Explorar produtos
              </Link>
              <Link
                href="/ofertas"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-bold text-ink-800 hover:border-brand-300 hover:text-brand-700"
              >
                Ver ofertas do dia
              </Link>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                Ou navegue por categoria
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categoria/${c.slug}`}
                    className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-left text-sm font-semibold text-ink-800 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      ) : (
        <>
          <section className="container-page mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Limpar lista
            </button>
          </section>
          <CatalogListing products={items} />
        </>
      )}
    </>
  );
}
