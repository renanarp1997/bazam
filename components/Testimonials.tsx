"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Mariana Souza",
    role: "Cliente Plus desde 2022",
    text: "Já comprei mais de 12 vezes na Bazam. Entrega rápida, embalagem caprichada e os preços são os melhores que encontro. Virei cliente fiel.",
    rating: 5,
    avatar: "from-rose-300 to-amber-400",
    product: "Tênis Runner Pro 3.0",
  },
  {
    name: "Pedro Lima",
    role: "Comprou há 2 dias",
    text: "Recebi meu fone em 24h. A qualidade do produto é absurda pelo preço — e o atendimento por chat respondeu em 2 minutos. Recomendo demais.",
    rating: 5,
    avatar: "from-brand-300 to-fuchsia-400",
    product: "Fone Sonik ANC",
  },
  {
    name: "Carolina Ribeiro",
    role: "Cliente Plus desde 2023",
    text: "O programa Bazam Plus se pagou em 2 compras. Cashback real, frete grátis sempre e cupons exclusivos. Único marketplace que uso hoje.",
    rating: 5,
    avatar: "from-accent-300 to-cyan-400",
    product: "Câmera Lensa 24MP",
  },
];

export default function Testimonials() {
  return (
    <section className="container-page section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse-soft" />
            Avaliações reais
          </span>
          <h2 className="section-title mt-3">O que dizem nossos clientes</h2>
          <p className="mt-1.5 max-w-xl text-sm text-ink-500">
            Mais de 58.000 avaliações com média 4.9/5 — verificadas e aprovadas.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-4 py-2.5 shadow-soft">
          <div className="flex items-center text-amber-400">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400" />
            ))}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-ink-900">4.9 / 5</p>
            <p className="text-[11px] text-ink-500">58.412 avaliações</p>
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.article
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-100/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <Quote className="absolute right-5 top-5 h-10 w-10 -rotate-180 text-ink-100" />

            <div className="relative flex items-center gap-1 text-amber-400">
              {[0, 1, 2, 3, 4].map((j) => (
                <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-amber-400" : "text-ink-200"}`} />
              ))}
            </div>

            <p className="relative mt-3 text-sm leading-relaxed text-ink-700">
              {r.text}
            </p>

            <div className="relative mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${r.avatar} ring-2 ring-white`} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="flex items-center gap-1 text-sm font-bold text-ink-900">
                  {r.name}
                  <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />
                </p>
                <p className="text-[11px] text-ink-500">{r.role}</p>
              </div>
              <span className="hidden rounded-full bg-ink-50 px-2.5 py-1 text-[10.5px] font-semibold text-ink-700 sm:inline-flex">
                {r.product}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
