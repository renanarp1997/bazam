import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Frete grátis",
    desc: "em pedidos acima de R$ 199",
    color: "from-brand-500 to-brand-700",
  },
  {
    icon: CreditCard,
    title: "Parcele em 12x",
    desc: "sem juros no cartão",
    color: "from-accent-500 to-accent-700",
  },
  {
    icon: ShieldCheck,
    title: "Compra protegida",
    desc: "site blindado SSL 256-bit",
    color: "from-rose-500 to-rose-700",
  },
  {
    icon: RotateCcw,
    title: "Troca grátis",
    desc: "em até 30 dias",
    color: "from-amber-500 to-amber-700",
  },
];

export default function TrustStrip() {
  return (
    <section className="container-page mt-10">
      <div className="grid gap-2 rounded-2xl border border-ink-100 bg-white/80 p-3 shadow-soft backdrop-blur sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
        {items.map((i) => (
          <div
            key={i.title}
            className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ink-50/70"
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${i.color} opacity-0 blur-md transition-opacity group-hover:opacity-30`} />
              <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${i.color} text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]`}>
                <i.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">{i.title}</p>
              <p className="text-[11.5px] leading-tight text-ink-500">{i.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
