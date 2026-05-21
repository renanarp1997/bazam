"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const trends = [
  { tag: "iPhone 15 Pro", growth: "+148%" },
  { tag: "Tênis Nike Air", growth: "+92%" },
  { tag: "Smartwatch", growth: "+76%" },
  { tag: "Air fryer", growth: "+65%" },
  { tag: "Notebook gamer", growth: "+58%" },
  { tag: "Fone bluetooth", growth: "+44%" },
  { tag: "Câmera mirrorless", growth: "+39%" },
  { tag: "Cadeira gamer", growth: "+32%" },
  { tag: "Perfume importado", growth: "+28%" },
  { tag: "Mochila premium", growth: "+22%" },
];

export default function Trending() {
  return (
    <section className="container-page section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100">
            <TrendingUp className="h-3 w-3" />
            Em alta agora
          </span>
          <h2 className="section-title mt-3">Tendências da semana</h2>
          <p className="mt-1.5 max-w-xl text-sm text-ink-500">
            O que está bombando entre os clientes Bazam nos últimos 7 dias.
          </p>
        </div>
      </div>

      {/* Mobile: horizontal scroll snap */}
      <div className="mt-6 -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 no-scrollbar sm:-mx-6 sm:px-6 lg:hidden">
        {trends.map((t, i) => (
          <motion.div
            key={t.tag}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="shrink-0"
          >
            <Link
              href={`/buscar?q=${encodeURIComponent(t.tag)}`}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 shadow-soft transition-all hover:border-brand-300"
            >
              <span className="text-ink-400 group-hover:text-brand-500">
                #{(i + 1).toString().padStart(2, "0")}
              </span>
              {t.tag}
              <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10.5px] font-bold text-accent-700">
                {t.growth}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-12 text-ink-400 transition-all group-hover:rotate-0 group-hover:text-brand-600" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Desktop: wrap */}
      <div className="mt-6 hidden flex-wrap gap-2.5 lg:flex">
        {trends.map((t, i) => (
          <motion.div
            key={t.tag}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
          >
            <Link
              href={`/buscar?q=${encodeURIComponent(t.tag)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-lift"
            >
              <span className="text-ink-400 group-hover:text-brand-500">
                #{(i + 1).toString().padStart(2, "0")}
              </span>
              {t.tag}
              <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10.5px] font-bold text-accent-700">
                {t.growth}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 -rotate-12 text-ink-400 transition-all group-hover:rotate-0 group-hover:text-brand-600" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
