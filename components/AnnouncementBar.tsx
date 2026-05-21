"use client";

import { Truck, ShieldCheck, CreditCard, Sparkles, Zap, Gift } from "lucide-react";

const messages = [
  { icon: Zap, text: "MEGA BLACK WEEK • Até 60% OFF — termina em 48h" },
  { icon: Truck, text: "Frete grátis em todo o Brasil acima de R$ 199" },
  { icon: CreditCard, text: "Até 12x sem juros no cartão" },
  { icon: Gift, text: "Ganhe R$ 50 de cupom na primeira compra" },
  { icon: ShieldCheck, text: "Compra 100% protegida — Site Blindado" },
  { icon: Sparkles, text: "Bazam Plus: cashback de 5% em todas as compras" },
];

export default function AnnouncementBar() {
  const loop = [...messages, ...messages];
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-r from-ink-950 via-ink-900 to-ink-950 text-white sm:block">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[length:200%_200%] animate-gradient-pan"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.55), rgba(16,185,129,0.45), transparent)",
        }}
      />
      <div className="relative flex h-9 items-center text-[11.5px] font-medium">
        <div className="flex w-max items-center gap-10 whitespace-nowrap animate-marquee-slow mask-fade-x">
          {loop.map((m, i) => (
            <span key={i} className="flex items-center gap-2 text-white/90">
              <m.icon className="h-3.5 w-3.5 text-accent-300" />
              {m.text}
              <span className="ml-10 h-1 w-1 rounded-full bg-white/30" />
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 hidden items-center gap-4 bg-gradient-to-l from-ink-950 via-ink-950 to-transparent pl-12 pr-6 text-[11px] text-white/85 lg:flex">
        <a href="#" className="transition-colors hover:text-white">
          Encontre uma loja
        </a>
        <span className="text-white/25">·</span>
        <a href="#" className="transition-colors hover:text-white">
          Atendimento
        </a>
        <span className="text-white/25">·</span>
        <a
          href="#"
          className="rounded-full bg-white/10 px-2.5 py-0.5 font-semibold text-white transition-colors hover:bg-white/15"
        >
          Vender na Bazam
        </a>
      </div>
    </div>
  );
}
