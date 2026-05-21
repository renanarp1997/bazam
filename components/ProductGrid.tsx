"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  accent?: "brand" | "rose" | "accent" | "amber";
  filters?: string[];
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  accent: "bg-accent-50 text-accent-700 ring-accent-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

const accentDot: Record<NonNullable<Props["accent"]>, string> = {
  brand: "bg-brand-500",
  rose: "bg-rose-500",
  accent: "bg-accent-500",
  amber: "bg-amber-500",
};

export default function ProductGrid({
  id,
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref = "#",
  accent = "brand",
  filters,
}: Props) {
  return (
    <section id={id} className="container-page section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <span className={`eyebrow ring-1 ring-inset ${accentMap[accent]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accentDot[accent]} animate-pulse-soft`} />
              {eyebrow}
            </span>
          )}
          <h2 className="section-title mt-3 text-balance">{title}</h2>
          {subtitle && (
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {filters && (
            <div className="hidden flex-wrap gap-2 sm:flex">
              {filters.map((f, i) => (
                <button
                  key={f}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    i === 0
                      ? "bg-ink-900 text-white shadow-soft"
                      : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800 transition-all hover:border-brand-300 hover:text-brand-700 hover:shadow-soft"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5 xl:gap-5">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
