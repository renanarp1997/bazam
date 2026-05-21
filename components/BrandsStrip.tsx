import { ShieldCheck } from "lucide-react";
import { brands } from "@/lib/products";

export default function BrandsStrip() {
  const items = [...brands, ...brands];
  return (
    <section className="container-page section">
      <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-white via-ink-50/40 to-white p-7 shadow-soft sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent-100/50 blur-3xl" />

        <div className="relative flex flex-col items-center gap-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-600 shadow-soft ring-1 ring-inset ring-ink-100">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-600" />
            Lojas oficiais
          </span>
          <p className="text-center text-sm font-medium text-ink-500">
            Marcas que confiam na Bazam — produtos 100% originais com garantia
          </p>
        </div>

        <div className="relative mt-7 overflow-hidden mask-fade-x">
          <div className="flex w-max items-center gap-14 animate-marquee">
            {items.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="group relative whitespace-nowrap font-head text-lg font-extrabold tracking-tight text-ink-700/70 transition-colors hover:text-brand-700 sm:text-xl"
              >
                {b}
                <span className="ml-14 inline-block h-1 w-1 rounded-full bg-ink-300 align-middle" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
