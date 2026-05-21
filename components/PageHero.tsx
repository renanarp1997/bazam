"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  HelpCircle,
  Heart,
  Sparkles,
  Tag,
  TrendingUp,
  Crown,
} from "lucide-react";

const iconMap = {
  flame: Flame,
  help: HelpCircle,
  heart: Heart,
  sparkles: Sparkles,
  tag: Tag,
  trending: TrendingUp,
  crown: Crown,
} as const;

type IconKey = keyof typeof iconMap;

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  icon?: IconKey;
  count?: number;
  accent?: "brand" | "rose" | "accent" | "amber" | "ink";
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  brand: "from-brand-700 via-brand-600 to-brand-900",
  rose: "from-rose-600 via-rose-500 to-rose-800",
  accent: "from-accent-600 via-accent-500 to-accent-800",
  amber: "from-amber-500 via-orange-500 to-rose-600",
  ink: "from-ink-950 via-ink-900 to-ink-800",
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  icon,
  count,
  accent = "brand",
}: Props) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <section className="container-page mt-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${accentMap[accent]} p-7 text-white shadow-premium sm:p-10 lg:p-12`}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-glow-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />

        <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            {eyebrow && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/25 backdrop-blur">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 font-head text-3xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-[44px]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {subtitle}
              </p>
            )}
            {typeof count === "number" && (
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-white/20 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-300 animate-pulse-soft" />
                {count.toLocaleString("pt-BR")} produtos disponíveis
              </p>
            )}
          </div>

          {image && (
            <div className="relative hidden h-40 w-56 shrink-0 sm:block">
              <Image
                src={image}
                alt=""
                fill
                sizes="240px"
                className="rounded-2xl object-cover shadow-card ring-1 ring-white/15"
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
