"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/products";

export default function CategoriesGrid() {
  return (
    <section id="categorias" className="container-page section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
            Navegue por categoria
          </span>
          <h2 className="section-title mt-3">Explore por categoria</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-500">
            Encontre o que precisa em segundos — mais de 50.000 produtos selecionados.
          </p>
        </div>
        <Link
          href="#"
          className="group inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-700 hover:shadow-soft"
        >
          Ver todas
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/categoria/${c.slug}`}
              className="group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-4"
            >
              <span className="pointer-events-none absolute inset-x-6 -top-12 h-20 rounded-full bg-gradient-to-b from-brand-200/60 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative h-24 w-full overflow-hidden rounded-xl bg-gradient-to-br from-ink-50 to-white sm:h-28">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width:768px) 200px, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                  {c.name}
                </p>
                <p className="text-[11px] font-medium text-ink-500">
                  {c.count.toLocaleString("pt-BR")} produtos
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
