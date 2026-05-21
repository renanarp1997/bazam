"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Zap } from "lucide-react";
import { formatBRL, products } from "@/lib/products";

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function FlashDeals() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 42);
  const { h, m, s } = useCountdown(target);

  const featured = products.slice(0, 4);

  return (
    <section className="container-page section">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 ring-1 ring-rose-100/80 sm:p-7">
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-amber-200/50 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow bg-gradient-to-r from-rose-500 to-rose-700 text-white shadow-[0_8px_20px_-8px_rgba(244,63,94,0.55)]">
              <Flame className="h-3 w-3" />
              Oferta relâmpago
            </span>
            <h2 className="section-title mt-3">Acabou rápido. Aproveite agora.</h2>
            <p className="mt-1.5 max-w-xl text-sm text-ink-600">
              Estoque limitado e preços imbatíveis — atualizado a cada hora.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-600">
              Termina em
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { v: pad(h), l: "h" },
                { v: pad(m), l: "min" },
                { v: pad(s), l: "s" },
              ].map((u, i, arr) => (
                <div key={u.l} className="flex items-center gap-1.5">
                  <div className="relative flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_10px_25px_-10px_rgba(15,23,42,0.6)]">
                    <span className="font-head text-lg font-extrabold leading-none tabular-nums">
                      {u.v}
                    </span>
                    <span className="mt-0.5 text-[8.5px] uppercase tracking-widest text-white/65">
                      {u.l}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="font-head text-xl font-extrabold text-ink-400">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p, i) => {
            const disc =
              p.oldPrice && p.oldPrice > p.price
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : 30;
            const stockPct = 30 + ((i * 17) % 50);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
              <Link
                href={`/produto/${p.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-rose-100/80 bg-white p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-lift"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-50">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-md bg-gradient-to-br from-rose-500 to-rose-700 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-[0_4px_10px_-2px_rgba(244,63,94,0.45)]">
                    <Zap className="h-2.5 w-2.5" />
                    -{disc}%
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-xs font-semibold leading-snug text-ink-900">
                    {p.name}
                  </h4>
                  <p className="mt-1 text-base font-extrabold text-ink-900">
                    {formatBRL(p.price)}
                  </p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                      style={{ width: `${stockPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10.5px] font-semibold text-rose-700">
                    Apenas {Math.max(3, 30 - Math.round(stockPct / 4))} restantes
                  </p>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="relative mt-5 flex justify-end">
          <Link
            href="/ofertas"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-rose-700"
          >
            Ver todas as ofertas
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
