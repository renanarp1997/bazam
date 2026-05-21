"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Flame,
  Headphones,
  Heart,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import { allProducts, categories, formatBRL } from "@/lib/products";
import { matchesQuery, normalize } from "@/lib/search";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { useLocation } from "@/lib/location-context";

const navCategories = [
  { name: "Ofertas do dia", href: "/ofertas", hot: true, icon: Flame },
  { name: "Lançamentos", href: "/lancamentos", icon: Sparkles },
  { name: "Mais vendidos", href: "/mais-vendidos", icon: TrendingUp },
  { name: "Eletrônicos", href: "/categoria/eletronicos" },
  { name: "Moda", href: "/categoria/moda" },
  { name: "Calçados", href: "/categoria/calcados" },
  { name: "Acessórios", href: "/categoria/acessorios" },
  { name: "Casa & Decor", href: "/categoria/casa-decor" },
  { name: "Beleza", href: "/categoria/beleza" },
];

const quickSearches = [
  "iPhone",
  "Tênis",
  "Notebook",
  "Smartwatch",
  "Fone bluetooth",
  "Perfume",
];

export default function Header() {
  const router = useRouter();
  const { openCart, itemsCount } = useCart();
  const { count: favCount } = useFavorites();
  const { location, openModal: openLocation } = useLocation();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return { products: [], cats: [] };
    const nq = normalize(q);
    const products = allProducts
      .filter((p) => matchesQuery(p, q))
      .slice(0, 5);
    const cats = categories
      .filter((c) => normalize(c.name).includes(nq))
      .slice(0, 3);
    return { products, cats };
  }, [query]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    inputRef.current?.blur();
    mobileInputRef.current?.blur();
    setFocused(false);
    setOpen(false);
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  const goTo = (href: string) => {
    inputRef.current?.blur();
    mobileInputRef.current?.blur();
    setFocused(false);
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const showSuggestions =
    focused &&
    (query.trim().length > 0
      ? suggestions.products.length > 0 || suggestions.cats.length > 0
      : true);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/70 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-16 items-center gap-3 lg:h-[72px] lg:gap-7">
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Logo />

        <button
          type="button"
          onClick={() => setMegaOpen((v) => !v)}
          aria-expanded={megaOpen}
          aria-haspopup="true"
          className={`hidden h-11 items-center gap-2 rounded-2xl border px-3.5 text-sm font-semibold transition-all lg:inline-flex ${
            megaOpen
              ? "border-brand-300 bg-brand-50 text-brand-700 shadow-soft"
              : "border-ink-200 bg-white text-ink-800 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft"
          }`}
        >
          <Menu className={`h-4 w-4 ${megaOpen ? "text-brand-600" : "text-ink-500"}`} />
          Departamentos
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              megaOpen ? "rotate-180 text-brand-600" : "text-ink-400"
            }`}
          />
        </button>

        <div className="hidden flex-1 md:flex">
          <form
            onSubmit={submit}
            className={`group relative flex w-full items-center transition-all ${
              focused ? "scale-[1.005]" : ""
            }`}
          >
            <span
              className={`pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-500/20 via-brand-400/15 to-accent-400/20 opacity-0 blur-xl transition-opacity duration-300 ${
                focused ? "opacity-100" : ""
              }`}
            />
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-ink-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar entre +50.000 produtos…"
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              className="h-12 w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-32 text-sm text-ink-800 placeholder:text-ink-400 shadow-soft outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12),0_18px_36px_-18px_rgba(79,70,229,0.45)]"
            />
            {query && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-[88px] inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100"
                aria-label="Limpar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 text-xs font-bold text-white shadow-[0_8px_18px_-8px_rgba(79,70,229,0.55)] transition-all hover:from-brand-500 hover:to-brand-700"
            >
              <Search className="h-3.5 w-3.5" />
              Buscar
            </button>

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[70vh] overflow-y-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-premium">
                {query.trim().length === 0 ? (
                  <div className="p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                      Buscas populares
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickSearches.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQuery("");
                            goTo(`/buscar?q=${encodeURIComponent(q)}`);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          <TrendingUp className="h-3 w-3 text-brand-500" />
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {suggestions.cats.length > 0 && (
                      <div className="mb-1">
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">
                          Categorias
                        </p>
                        {suggestions.cats.map((c) => (
                          <button
                            key={c.slug}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => goTo(`/categoria/${c.slug}`)}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-brand-50"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                              <Tag className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold text-ink-800">
                              {c.name}
                            </span>
                            <span className="ml-auto text-[11px] text-ink-500">
                              {c.count.toLocaleString("pt-BR")} itens
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {suggestions.products.length > 0 && (
                      <div>
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">
                          Produtos
                        </p>
                        {suggestions.products.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => goTo(`/produto/${p.id}`)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-ink-50"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                                {p.brand}
                              </p>
                              <p className="line-clamp-1 text-sm font-semibold text-ink-900">
                                {p.name}
                              </p>
                            </div>
                            <p className="text-sm font-extrabold text-ink-900">
                              {formatBRL(p.price)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => submit()}
                      className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-brand-700"
                    >
                      Ver todos os resultados para “{query.trim()}”
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:gap-1.5">
          <button
            type="button"
            onClick={openLocation}
            className="hidden items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-ink-700 transition-colors hover:bg-ink-100 xl:inline-flex"
          >
            <MapPin className="h-4 w-4 text-brand-600" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] text-ink-500">
                {location ? "Entregar em" : "Definir endereço"}
              </span>
              <span className="block max-w-[160px] truncate font-semibold text-ink-800">
                {location
                  ? `${location.city}${location.uf ? ", " + location.uf : ""}${location.cep ? " · " + location.cep : ""}`
                  : "Onde você está?"}
              </span>
            </span>
          </button>

          <Link
            href="/entrar"
            className="hidden h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 sm:inline-flex"
          >
            <User className="h-5 w-5" />
            <span className="hidden text-left leading-tight lg:block">
              <span className="block text-[10px] text-ink-500">Olá, visitante</span>
              <span className="block text-xs font-semibold text-ink-800">Entrar / Cadastrar</span>
            </span>
          </Link>

          <Link
            href="/favoritos"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-700 transition-colors hover:bg-ink-100"
            aria-label="Favoritos"
          >
            <Heart className={`h-5 w-5 ${favCount > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
            {favCount > 0 && (
              <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 px-1 text-[10px] font-bold text-white shadow-[0_4px_10px_-2px_rgba(244,63,94,0.55)]">
                {favCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(79,70,229,0.65)] transition-all hover:from-brand-500 hover:to-brand-800"
            aria-label="Abrir sacola"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <ShoppingBag className="relative h-5 w-5" />
            <span className="relative hidden sm:inline">Sacola</span>
            <span className="relative inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-brand-700">
              {itemsCount}
            </span>
          </button>
        </div>
      </div>

      <div className="container-page pb-3 md:hidden">
        <form onSubmit={submit} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            ref={mobileInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar na Bazam"
            className="h-12 w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-20 text-sm shadow-soft outline-none focus:border-brand-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-3 text-xs font-bold text-white"
          >
            Buscar
          </button>
        </form>
      </div>

      <nav className="hidden border-t border-ink-100/80 bg-gradient-to-r from-white via-brand-50/30 to-white lg:block">
        <div className="container-page flex h-12 items-center gap-1 overflow-x-auto no-scrollbar">
          {navCategories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.name}
                href={c.href}
                className={`group relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  c.hot
                    ? "bg-gradient-to-r from-rose-500/15 to-rose-600/10 text-rose-700 ring-1 ring-rose-200/70"
                    : "text-ink-700 hover:bg-white hover:text-brand-700 hover:shadow-soft"
                }`}
              >
                {Icon && <Icon className={`h-3.5 w-3.5 ${c.hot ? "text-rose-600" : "text-ink-500 group-hover:text-brand-600"}`} />}
                {c.name}
                {c.hot && (
                  <span className="relative ml-0.5 flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-rose-500 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </span>
                )}
              </Link>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/plus"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-700 ring-1 ring-accent-100"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Bazam Plus
            </Link>
            <Link
              href="/ajuda"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-white hover:text-brand-700"
            >
              <Headphones className="h-3.5 w-3.5" />
              Ajuda
            </Link>
          </div>
        </div>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-page flex flex-col py-3">
            {navCategories.map((c) => (
              <Link
                key={c.name}
                href={c.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-100"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
    </header>
  );
}
