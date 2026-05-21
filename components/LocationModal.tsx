"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Loader2,
  MapPin,
  Navigation,
  Search,
  Truck,
  X,
} from "lucide-react";
import { useLocation } from "@/lib/location-context";
import { useToast } from "@/lib/toast-context";

type Status =
  | { type: "idle" }
  | { type: "loading"; mode: "gps" | "cep" }
  | { type: "error"; message: string };

function maskCep(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export default function LocationModal() {
  const { open, closeModal, setLocation, location, clearLocation } = useLocation();
  const { success, error: toastError } = useToast();

  const [cep, setCep] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStatus({ type: "idle" });
    } else if (location?.cep) {
      setCep(location.cep);
    }
  }, [open, location?.cep]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  // Lock body scroll
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus({
        type: "error",
        message: "Seu navegador não suporta geolocalização. Tente pelo CEP.",
      });
      return;
    }
    setStatus({ type: "loading", mode: "gps" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&addressdetails=1&accept-language=pt-BR`,
            { headers: { "Accept-Language": "pt-BR" } },
          );
          if (!res.ok) throw new Error("nominatim_fail");
          const data = await res.json();
          const a = data.address ?? {};
          const city =
            a.city ?? a.town ?? a.village ?? a.municipality ?? "Sua região";
          const uf = (a.state_code ?? a.state ?? "").toString().slice(0, 2).toUpperCase();
          const district = a.suburb ?? a.neighbourhood;
          const street = a.road;
          const postcode = (a.postcode ?? "").replace(/\D/g, "");
          const formattedCep =
            postcode.length === 8 ? `${postcode.slice(0, 5)}-${postcode.slice(5)}` : undefined;

          setLocation({
            cep: formattedCep,
            city,
            uf: uf || "—",
            district,
            street,
          });
          success(
            "Localização detectada",
            `${city}${uf ? " · " + uf : ""}${formattedCep ? " · " + formattedCep : ""}`,
          );
          closeModal();
        } catch {
          setStatus({
            type: "error",
            message:
              "Encontramos sua posição, mas não conseguimos detalhar o endereço. Tente pelo CEP.",
          });
        }
      },
      (err) => {
        let msg = "Não foi possível obter sua localização.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Você bloqueou o acesso. Permita o GPS ou digite seu CEP.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "Localização indisponível agora. Tente pelo CEP.";
        } else if (err.code === err.TIMEOUT) {
          msg = "Tempo esgotado ao buscar sua localização. Tente pelo CEP.";
        }
        setStatus({ type: "error", message: msg });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  const handleCepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) {
      setStatus({ type: "error", message: "Digite um CEP com 8 dígitos." });
      return;
    }
    setStatus({ type: "loading", mode: "cep" });

    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      if (!res.ok) throw new Error("viacep_fail");
      const data = await res.json();
      if (data?.erro) {
        setStatus({
          type: "error",
          message: "CEP não encontrado. Verifique e tente novamente.",
        });
        return;
      }
      const loc = {
        cep: `${clean.slice(0, 5)}-${clean.slice(5)}`,
        city: data.localidade,
        uf: data.uf,
        district: data.bairro || undefined,
        street: data.logradouro || undefined,
      };
      setLocation(loc);
      success(
        "Endereço atualizado",
        `${loc.city}${loc.uf ? " · " + loc.uf : ""} · ${loc.cep}`,
      );
      closeModal();
    } catch {
      setStatus({
        type: "error",
        message:
          "Não conseguimos consultar o CEP agora. Verifique sua conexão e tente novamente.",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeModal}
            className="fixed inset-0 z-[75] bg-ink-950/55 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-label="Localização de entrega"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-premium sm:rounded-3xl">
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 p-6 text-white">
                <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-25" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-400/30 blur-3xl" />
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                      Endereço de entrega
                    </p>
                    <p className="font-head text-lg font-extrabold">
                      Onde você quer receber?
                    </p>
                  </div>
                </div>
                <p className="relative mt-3 text-xs leading-relaxed text-white/85">
                  Calcule frete, prazos e veja ofertas disponíveis na sua região.
                </p>
              </div>

              <div className="p-5">
                {/* GPS button */}
                <button
                  type="button"
                  onClick={handleGps}
                  disabled={status.type === "loading"}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-50 to-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift disabled:cursor-wait disabled:opacity-70"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                    {status.type === "loading" && status.mode === "gps" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Navigation className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink-900">
                      {status.type === "loading" && status.mode === "gps"
                        ? "Localizando…"
                        : "Usar minha localização"}
                    </p>
                    <p className="text-[11.5px] leading-snug text-ink-500">
                      Detectamos automaticamente via GPS do seu dispositivo
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </button>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-ink-400">
                  <span className="h-px flex-1 bg-ink-100" />
                  ou digite seu CEP
                  <span className="h-px flex-1 bg-ink-100" />
                </div>

                {/* CEP form */}
                <form onSubmit={handleCepSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cep}
                      onChange={(e) => {
                        setCep(maskCep(e.target.value));
                        if (status.type === "error") setStatus({ type: "idle" });
                      }}
                      placeholder="00000-000"
                      className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm tracking-wider outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status.type === "loading"}
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 text-sm font-extrabold text-white shadow-[0_10px_25px_-10px_rgba(79,70,229,0.55)] transition-all hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {status.type === "loading" && status.mode === "cep" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                </form>

                {status.type === "error" && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-100"
                  >
                    {status.message}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <a
                    href="https://buscacepinter.correios.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    Não sei meu CEP →
                  </a>
                  {location && (
                    <button
                      type="button"
                      onClick={() => {
                        clearLocation();
                        setCep("");
                        toastError(
                          "Endereço removido",
                          "Clique no chip do header para definir um novo.",
                        );
                        closeModal();
                      }}
                      className="font-semibold text-ink-500 hover:text-rose-600 hover:underline"
                    >
                      Limpar endereço
                    </button>
                  )}
                </div>

                {/* Footer perks */}
                <ul className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-[11.5px] text-ink-600">
                  <li className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-brand-600" />
                    Frete grátis acima de R$ 199 para todo o Brasil
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-3.5 w-3.5 text-accent-600" />
                    Prazos e ofertas personalizados pela sua região
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
