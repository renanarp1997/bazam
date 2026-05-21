import Link from "next/link";
import {
  Apple,
  BadgeCheck,
  Facebook,
  Globe,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Truck,
  Twitter,
  Youtube,
} from "lucide-react";
import Logo from "./Logo";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Comprar",
    links: [
      { label: "Ofertas do dia", href: "/ofertas" },
      { label: "Lançamentos", href: "/lancamentos" },
      { label: "Mais vendidos", href: "/mais-vendidos" },
      { label: "Frete grátis", href: "/ofertas" },
      { label: "Outlet", href: "/ofertas" },
      { label: "Cupons ativos", href: "/plus" },
    ],
  },
  {
    title: "Categorias",
    links: [
      { label: "Eletrônicos", href: "/categoria/eletronicos" },
      { label: "Moda", href: "/categoria/moda" },
      { label: "Calçados", href: "/categoria/calcados" },
      { label: "Acessórios", href: "/categoria/acessorios" },
      { label: "Casa & Decor", href: "/categoria/casa-decor" },
      { label: "Beleza", href: "/categoria/beleza" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Central de atendimento", href: "/ajuda" },
      { label: "Como comprar", href: "/ajuda" },
      { label: "Trocas e devoluções", href: "/ajuda" },
      { label: "Prazos de entrega", href: "/ajuda" },
      { label: "Rastrear pedido", href: "/ajuda" },
      { label: "Garantia estendida", href: "/ajuda" },
    ],
  },
  {
    title: "Bazam",
    links: [
      { label: "Sobre nós", href: "/ajuda" },
      { label: "Trabalhe conosco", href: "/ajuda" },
      { label: "Vender na Bazam", href: "/ajuda" },
      { label: "Programa Bazam Plus", href: "/plus" },
      { label: "Imprensa", href: "/ajuda" },
      { label: "Sustentabilidade", href: "/ajuda" },
    ],
  },
];

const payments = ["Visa", "Master", "Elo", "Hiper", "Amex", "Pix", "Boleto"];
const seals = ["SSL 256-bit", "Site Blindado", "LGPD", "Reclame Aqui RA1000"];

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-ink-100 bg-gradient-to-b from-white via-ink-50/60 to-white pt-16">
      <div className="pointer-events-none absolute -left-32 -top-20 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-accent-100/40 blur-3xl" />

      <div className="container-page relative">
        <div className="mb-12 grid gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:grid-cols-2 sm:p-7 lg:grid-cols-3 lg:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">Baixe o app Bazam</p>
              <p className="text-xs text-ink-500">Ofertas exclusivas no celular</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end lg:justify-center">
            <Link
              href="#"
              className="group inline-flex items-center gap-2.5 rounded-2xl border border-ink-200 bg-ink-900 px-4 py-2.5 text-white transition-all hover:scale-[1.02]"
            >
              <Apple className="h-5 w-5" />
              <span className="text-left leading-tight">
                <span className="block text-[9.5px] uppercase tracking-wider text-white/70">
                  Baixe na
                </span>
                <span className="block text-sm font-bold">App Store</span>
              </span>
            </Link>
            <Link
              href="#"
              className="group inline-flex items-center gap-2.5 rounded-2xl border border-ink-200 bg-ink-900 px-4 py-2.5 text-white transition-all hover:scale-[1.02]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M3.6 2.3a1.6 1.6 0 0 0-.6 1.3v16.8c0 .5.2 1 .6 1.3l9.5-9.7L3.6 2.3Zm10.6 10.4 2.6 2.6-9.7 5.6 7.1-8.2Zm0-1.4L7.1 3.1l9.7 5.6-2.6 2.6Zm6.2-1.8-2.5-1.5-2.8 2.8 2.8 2.8 2.5-1.5c.9-.6.9-2 0-2.6Z"/>
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[9.5px] uppercase tracking-wider text-white/70">
                  Disponível no
                </span>
                <span className="block text-sm font-bold">Google Play</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-1 lg:justify-end">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              <Truck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">Entrega para todo Brasil</p>
              <p className="text-xs text-ink-500">5.570 cidades atendidas</p>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-600">
              Bazam é a loja oficial de tecnologia, moda e lifestyle. Mais de
              50 mil produtos, entrega para todo o Brasil e atendimento humano.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-600">
              <li className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Phone className="h-4 w-4" />
                </div>
                <span>0800 940 8800 — seg. a sáb., 8h às 22h</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:atendimento@bazam.com.br" className="hover:text-ink-900">
                  atendimento@bazam.com.br
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Av. Paulista, 1.000 — São Paulo, SP</span>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                Siga a Bazam
              </p>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { Icon: Instagram, label: "Instagram", color: "hover:from-fuchsia-500 hover:to-amber-400" },
                  { Icon: Facebook, label: "Facebook", color: "hover:from-blue-500 hover:to-blue-700" },
                  { Icon: Youtube, label: "YouTube", color: "hover:from-rose-500 hover:to-rose-700" },
                  { Icon: Twitter, label: "Twitter", color: "hover:from-sky-400 hover:to-sky-600" },
                ].map(({ Icon, label, color }) => (
                  <Link
                    key={label}
                    href="#"
                    aria-label={label}
                    className={`group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-all hover:scale-110 hover:border-transparent hover:bg-gradient-to-br hover:text-white hover:shadow-soft ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1 text-sm text-ink-600 transition-colors hover:text-brand-700"
                      >
                        <span className="transition-transform group-hover:translate-x-0.5">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-ink-200/70 py-8 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
              <Lock className="h-3.5 w-3.5 text-brand-600" />
              Formas de pagamento
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {payments.map((p) => (
                <span
                  key={p}
                  className="inline-flex h-9 items-center rounded-lg border border-ink-200 bg-white px-3 text-[11px] font-bold text-ink-700 shadow-[0_1px_0_0_rgba(15,23,42,0.03)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-900">
              <BadgeCheck className="h-3.5 w-3.5 text-accent-600" />
              Segurança & Selos
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {seals.map((s) => (
                <span
                  key={s}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 text-[11px] font-bold text-ink-700 shadow-[0_1px_0_0_rgba(15,23,42,0.03)]"
                >
                  <BadgeCheck className="h-3 w-3 text-accent-600" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-ink-200/70 py-7 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Bazam Comércio Eletrônico Ltda. — CNPJ
            00.000.000/0001-00. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500">
            <Link href="#" className="transition-colors hover:text-ink-800">
              Política de privacidade
            </Link>
            <Link href="#" className="transition-colors hover:text-ink-800">
              Termos de uso
            </Link>
            <Link href="#" className="transition-colors hover:text-ink-800">
              Cookies
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              <Globe className="h-3 w-3" />
              Brasil — Português
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
