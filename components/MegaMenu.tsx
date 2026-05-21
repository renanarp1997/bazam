"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  categories,
  formatBRL,
  getProductsByCategory,
  type Category,
} from "@/lib/products";

const subcatMap: Record<string, string[]> = {
  eletronicos: [
    "Smartphones",
    "Notebooks",
    "Tablets",
    "Smartwatches",
    "Fones",
    "Câmeras",
    "Caixas de som",
    "Drones",
    "Monitores",
    "Teclados",
    "Mouses",
    "Consoles",
  ],
  moda: [
    "Camisetas",
    "Jaquetas",
    "Calças",
    "Vestidos",
    "Camisas",
    "Moletons",
    "Shorts",
    "Polo",
    "Cardigãs",
    "Saias",
    "Blazers",
    "Casacos",
  ],
  calcados: [
    "Tênis",
    "Botas",
    "Sandálias",
    "Chuteiras",
    "Mocassins",
    "Sapatênis",
    "Sapatilhas",
    "Sneakers",
    "Loafers",
  ],
  acessorios: [
    "Mochilas",
    "Bolsas",
    "Óculos",
    "Relógios",
    "Carteiras",
    "Cintos",
    "Bonés",
    "Cachecóis",
    "Pochetes",
  ],
  "casa-decor": [
    "Cafeteiras",
    "Air fryer",
    "Liquidificadores",
    "Panelas",
    "Sofás",
    "Mesas",
    "Luminárias",
    "Edredom",
    "Tapetes",
    "Velas",
    "Quadros",
  ],
  beleza: [
    "Skincare",
    "Sérum",
    "Perfumes",
    "Maquiagem",
    "Batom",
    "Base",
    "Paleta",
    "Pincéis",
    "Shampoo",
    "Protetor solar",
    "Máscara",
    "Hidratante",
  ],
};

const quickLinks = [
  { name: "Ofertas do dia", href: "/ofertas", icon: Flame, color: "text-rose-600 bg-rose-50 ring-rose-100" },
  { name: "Lançamentos", href: "/lancamentos", icon: Sparkles, color: "text-accent-700 bg-accent-50 ring-accent-100" },
  { name: "Mais vendidos", href: "/mais-vendidos", icon: TrendingUp, color: "text-amber-700 bg-amber-50 ring-amber-100" },
  { name: "Bazam Plus", href: "/plus", icon: Star, color: "text-brand-700 bg-brand-50 ring-brand-100" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MegaMenu({ open, onClose }: Props) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>(categories[0].slug);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeCategory: Category | undefined = categories.find((c) => c.slug === active);
  const subcats = subcatMap[active] ?? [];
  const products = getProductsByCategory(active);
  const featured =
    products.find((p) => p.badge === "new") ??
    products.find((p) => p.badge === "bestseller") ??
    products.find((p) => p.oldPrice) ??
    products[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-x-0 bottom-0 top-[180px] z-[40] hidden bg-ink-950/40 backdrop-blur-sm lg:block"
          />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-0 right-0 top-full z-[45] hidden lg:block"
          >
            <div className="container-page">
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-premium">
                <div className="grid grid-cols-[260px_1fr]">
                  {/* Category nav */}
                  <ul className="border-r border-ink-100 bg-gradient-to-b from-ink-50/70 to-white p-3">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/categoria/${c.slug}`}
                          onClick={onClose}
                          onMouseEnter={() => setActive(c.slug)}
                          onFocus={() => setActive(c.slug)}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                            active === c.slug
                              ? "bg-white text-brand-700 shadow-soft ring-1 ring-brand-100"
                              : "text-ink-700 hover:bg-white hover:text-brand-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                active === c.slug ? "bg-brand-500" : "bg-ink-300"
                              }`}
                            />
                            {c.name}
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 transition-all ${
                              active === c.slug ? "translate-x-0.5 text-brand-500" : "text-ink-300"
                            }`}
                          />
                        </Link>
                      </li>
                    ))}

                    <hr className="my-3 border-ink-100" />

                    <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-500">
                      Atalhos
                    </p>
                    <div className="mt-2 space-y-1">
                      {quickLinks.map((q) => (
                        <Link
                          key={q.name}
                          href={q.href}
                          onClick={onClose}
                          className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-white"
                        >
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset ${q.color}`}
                          >
                            <q.icon className="h-3.5 w-3.5" />
                          </span>
                          {q.name}
                        </Link>
                      ))}
                    </div>
                  </ul>

                  {/* Subcategories + featured */}
                  <div className="grid grid-cols-[1fr_320px] gap-8 p-7">
                    <div className="min-w-0">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">
                            Departamento
                          </p>
                          <h3 className="mt-1 font-head text-2xl font-extrabold leading-none text-ink-900">
                            {activeCategory?.name}
                          </h3>
                          <p className="mt-1.5 text-xs text-ink-500">
                            {activeCategory?.count.toLocaleString("pt-BR")} produtos disponíveis
                          </p>
                        </div>
                        <Link
                          href={`/categoria/${active}`}
                          onClick={onClose}
                          className="group inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700"
                        >
                          Ver tudo
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>

                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="mt-5 grid grid-cols-3 gap-x-4 gap-y-2"
                      >
                        {subcats.map((s) => (
                          <Link
                            key={s}
                            href={`/buscar?q=${encodeURIComponent(s)}`}
                            onClick={onClose}
                            className="group flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-sm text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                          >
                            <span className="h-1 w-1 rounded-full bg-ink-300 transition-colors group-hover:bg-brand-500" />
                            {s}
                          </Link>
                        ))}
                      </motion.div>

                      <div className="mt-7 flex flex-wrap gap-2">
                        <Link
                          href="/ofertas"
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-100 transition-colors hover:bg-rose-100"
                        >
                          <Flame className="h-3.5 w-3.5" />
                          Até 60% OFF
                        </Link>
                        <Link
                          href="/plus"
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700 ring-1 ring-inset ring-accent-100 transition-colors hover:bg-accent-100"
                        >
                          <Zap className="h-3.5 w-3.5" />
                          Frete grátis Plus
                        </Link>
                      </div>
                    </div>

                    {/* Featured */}
                    {featured && (
                      <motion.div
                        key={`f-${featured.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={`/produto/${featured.id}`}
                          onClick={onClose}
                          className="group relative block overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-br from-ink-50 to-white shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
                        >
                          <p className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            <Sparkles className="h-3 w-3 text-amber-300" />
                            Destaque
                          </p>
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={featured.image}
                              alt={featured.name}
                              fill
                              sizes="320px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                              {featured.brand}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-sm font-bold text-ink-900">
                              {featured.name}
                            </p>
                            <div className="mt-1.5 flex items-baseline gap-2">
                              {featured.oldPrice && (
                                <span className="text-[11px] text-ink-400 line-through">
                                  {formatBRL(featured.oldPrice)}
                                </span>
                              )}
                              <span className="font-head text-lg font-extrabold leading-none text-ink-900">
                                {formatBRL(featured.price)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
