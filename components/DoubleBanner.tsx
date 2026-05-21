"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const banners = [
  {
    title: "Tech que muda seu dia",
    subtitle: "Headphones, smartwatches e câmeras com até 40% off.",
    cta: "Explorar tecnologia",
    href: "/categoria/eletronicos",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    bg: "from-ink-950 via-ink-900 to-ink-800",
    text: "text-white",
    badge: "Eletrônicos",
    badgeIcon: Zap,
    accent: "text-accent-300",
  },
  {
    title: "Looks que combinam com você",
    subtitle: "Novidades da estação com peças versáteis e atemporais.",
    cta: "Ver coleção",
    href: "/categoria/moda",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    bg: "from-amber-50 via-rose-50 to-pink-50",
    text: "text-ink-900",
    badge: "Moda",
    badgeIcon: Sparkles,
    accent: "text-rose-600",
  },
];

export default function DoubleBanner() {
  return (
    <section className="container-page section">
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {banners.map((b, i) => {
          const isDark = b.text === "text-white";
          const Icon = b.badgeIcon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-[28px] bg-gradient-to-br ${b.bg} p-6 shadow-premium sm:p-9`}
            >
              {isDark && (
                <>
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-500/30 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-400/25 blur-3xl" />
                  <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />
                </>
              )}
              {!isDark && (
                <>
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-rose-300/40 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
                </>
              )}

              <div className="relative z-10 max-w-[62%]">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    isDark
                      ? "bg-white/12 text-white ring-1 ring-inset ring-white/20 backdrop-blur"
                      : "bg-white/80 text-ink-900 ring-1 ring-inset ring-ink-200 backdrop-blur"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${b.accent}`} />
                  {b.badge}
                </span>
                <h3
                  className={`mt-4 font-head text-2xl font-extrabold leading-[1.1] text-balance ${b.text} sm:text-3xl lg:text-[34px]`}
                >
                  {b.title}
                </h3>
                <p
                  className={`mt-2.5 max-w-sm text-sm leading-relaxed ${
                    isDark ? "text-white/80" : "text-ink-600"
                  }`}
                >
                  {b.subtitle}
                </p>
                <Link
                  href={b.href}
                  className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                    isDark
                      ? "bg-white text-ink-900 shadow-[0_12px_30px_-10px_rgba(255,255,255,0.5)] hover:scale-[1.02]"
                      : "bg-ink-900 text-white shadow-[0_12px_30px_-10px_rgba(15,23,42,0.45)] hover:scale-[1.02] hover:bg-brand-700"
                  }`}
                >
                  {b.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                className="pointer-events-none absolute -right-4 -bottom-4 h-48 w-48 sm:-right-6 sm:-bottom-6 sm:h-60 sm:w-60"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/20 to-transparent blur-2xl" />
                <Image
                  src={b.image}
                  alt=""
                  fill
                  sizes="280px"
                  className="rounded-2xl object-cover shadow-card ring-1 ring-black/10"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
