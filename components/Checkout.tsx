"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useLocation } from "@/lib/location-context";
import { formatBRL } from "@/lib/products";

type Shipping = {
  id: string;
  name: string;
  desc: string;
  price: number;
  days: string;
  icon: typeof Truck;
};

type Payment = "pix" | "card" | "boleto";

const shippingOptions: Shipping[] = [
  {
    id: "expressa",
    name: "Entrega expressa",
    desc: "Chega em 24-48h em capitais",
    price: 29.9,
    days: "1-2 dias úteis",
    icon: Zap,
  },
  {
    id: "padrao",
    name: "Entrega padrão",
    desc: "Frete econômico para todo Brasil",
    price: 0,
    days: "3-5 dias úteis",
    icon: Truck,
  },
  {
    id: "retirar",
    name: "Retirar na loja",
    desc: "Av. Paulista, 1.000 — São Paulo, SP",
    price: 0,
    days: "Pronto em 2h",
    icon: Store,
  },
];

const fakeBoletoLine =
  "23793.39038 02904.700017 89308.190010 4 89970000123450";

// Realistic QR-like grid (visual only — not a real QR encoder).
// Includes finder patterns (3 corners), alignment pattern, timing patterns
// and pseudo-random data modules.
function placeFinder(grid: boolean[][], r: number, c: number) {
  const size = grid.length;
  // White separator (clear 8x8 area around finder)
  for (let dr = -1; dr <= 7; dr++) {
    for (let dc = -1; dc <= 7; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < size && nc < size) grid[nr][nc] = false;
    }
  }
  // 7x7 finder: outer ring + 3x3 center
  for (let dr = 0; dr < 7; dr++) {
    for (let dc = 0; dc < 7; dc++) {
      const outer = dr === 0 || dr === 6 || dc === 0 || dc === 6;
      const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
      if (outer || inner) grid[r + dr][c + dc] = true;
    }
  }
}

function placeAlignment(grid: boolean[][], r: number, c: number) {
  for (let dr = 0; dr < 5; dr++) {
    for (let dc = 0; dc < 5; dc++) {
      const edge = dr === 0 || dr === 4 || dc === 0 || dc === 4;
      const center = dr === 2 && dc === 2;
      grid[r + dr][c + dc] = edge || center;
    }
  }
}

function generateQRPattern(size = 29, seed = 31): boolean[][] {
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false),
  );

  // Pseudo-random data
  let s = seed;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      s = (s * 9301 + 49297) % 233280;
      grid[r][c] = s / 233280 > 0.5;
    }
  }

  // Finder patterns: top-left, top-right, bottom-left
  placeFinder(grid, 0, 0);
  placeFinder(grid, 0, size - 7);
  placeFinder(grid, size - 7, 0);

  // Alignment pattern near bottom-right
  if (size >= 25) {
    placeAlignment(grid, size - 9, size - 9);
  }

  // Timing patterns on row 6 and col 6 between finders
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Dark module (mandatory in real QR codes)
  if (size > 9) grid[size - 8][8] = true;

  // Reserve center for logo (7x7 cleared)
  const cs = Math.floor(size / 2) - 3;
  for (let dr = 0; dr < 7; dr++) {
    for (let dc = 0; dc < 7; dc++) {
      const nr = cs + dr;
      const nc = cs + dc;
      if (nr >= 0 && nc >= 0 && nr < size && nc < size) grid[nr][nc] = false;
    }
  }

  return grid;
}

function detectCardBrand(num: string): "visa" | "master" | "amex" | "elo" | null {
  const digits = num.replace(/\D/g, "");
  if (!digits) return null;
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "master";
  if (/^(34|37)/.test(digits)) return "amex";
  if (/^(636368|636297|504175|438935|451416|509\d{3})/.test(digits)) return "elo";
  return null;
}

function maskCard(v: string): string {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function maskExpiry(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function maskCep(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function maskPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCpf(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export default function Checkout() {
  const router = useRouter();
  const {
    lines,
    subtotal,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    clearCart,
  } = useCart();
  const { loading: toastLoading, update, success, error: toastError } = useToast();
  const { location, openModal: openLocationModal } = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const [shipping, setShipping] = useState<string>("padrao");
  const [payment, setPayment] = useState<Payment>("pix");
  const [installments, setInstallments] = useState(1);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [boletoCopied, setBoletoCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shippingPrice =
    shippingOptions.find((s) => s.id === shipping)?.price ?? 0;
  // Free standard shipping above R$ 199 (matches cart-context rule)
  const effectiveShipping =
    shipping === "padrao" && subtotal > 199 ? 0 : shippingPrice;

  const total = Math.max(0, subtotal - discount + effectiveShipping);

  // PIX discount 5% if selected
  const pixDiscount = payment === "pix" ? total * 0.05 : 0;
  const finalTotal = total - pixDiscount;

  const installmentValue = finalTotal / installments;
  const qrSize = 29;
  const qrGrid = useMemo(() => generateQRPattern(qrSize, 31), [qrSize]);
  const fakePixCode = useMemo(
    () =>
      `00020126360014BR.GOV.BCB.PIX0114bazam@pix.com5204000053039865802BR5910BAZAM LOJA6009SAO PAULO62070503***6304ABCD`,
    [],
  );

  // Empty cart guard
  useEffect(() => {
    if (lines.length === 0 && !submitting) {
      // do not redirect immediately to allow showing empty state
    }
  }, [lines.length, submitting]);

  // Prefill from saved location on mount
  useEffect(() => {
    if (!location) return;
    setCep((prev) => prev || location.cep || "");
    setStreet((prev) => prev || location.street || "");
    setDistrict((prev) => prev || location.district || "");
    setCity((prev) => prev || location.city || "");
    setUf((prev) => prev || location.uf || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulated CEP autofill
  const handleCep = (v: string) => {
    const formatted = maskCep(v);
    setCep(formatted);
    if (formatted.replace(/\D/g, "").length === 8) {
      // Simulate ViaCEP-like response after a brief delay
      const id = toastLoading("Buscando endereço…", `CEP ${formatted}`);
      setTimeout(() => {
        setStreet(street || "Av. Paulista");
        setDistrict(district || "Bela Vista");
        setCity(city || "São Paulo");
        setUf(uf || "SP");
        update(id, {
          variant: "success",
          title: "Endereço encontrado",
          description: "Confira e ajuste se necessário.",
          duration: 3000,
        });
      }, 700);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput("");
      setCouponError(false);
      success("Cupom aplicado", "10% off no seu pedido");
    } else {
      setCouponError(true);
    }
  };

  const copy = async (text: string, setFlag: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlag(true);
      success("Copiado!", "Cole no app do seu banco.");
      setTimeout(() => setFlag(false), 2500);
    } catch {
      toastError("Falha ao copiar", "Tente selecionar manualmente.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || lines.length === 0) return;

    // Minimal validation
    if (
      !name.trim() ||
      !email.trim() ||
      !cep.trim() ||
      !street.trim() ||
      !number.trim()
    ) {
      toastError(
        "Faltam dados",
        "Preencha pelo menos nome, e-mail, CEP, rua e número.",
      );
      return;
    }
    if (payment === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toastError("Cartão incompleto", "Preencha todos os campos do cartão.");
        return;
      }
    }

    setSubmitting(true);
    const id = toastLoading(
      "Processando pedido…",
      payment === "pix"
        ? "Aguardando confirmação do PIX"
        : payment === "boleto"
          ? "Gerando boleto"
          : "Autorizando pagamento",
    );

    setTimeout(() => {
      const orderNumber = `BZ-${Date.now().toString().slice(-8)}`;
      const order = {
        number: orderNumber,
        date: new Date().toISOString(),
        items: lines.map((l) => ({
          id: l.product.id,
          name: l.product.name,
          brand: l.product.brand,
          image: l.product.image,
          qty: l.qty,
          price: l.product.price,
          oldPrice: l.product.oldPrice,
        })),
        subtotal,
        discount,
        shipping: effectiveShipping,
        pixDiscount,
        total: finalTotal,
        payment,
        installments: payment === "card" ? installments : 1,
        delivery: shippingOptions.find((s) => s.id === shipping),
        customer: { name, email, phone, cpf },
        address: { cep, street, number, complement, district, city, uf },
      };
      try {
        sessionStorage.setItem("bazam:last-order", JSON.stringify(order));
      } catch {
        /* ignore */
      }
      update(id, {
        variant: "success",
        title: "Pedido confirmado!",
        description: `Pedido ${orderNumber} — você receberá um e-mail em breve.`,
        duration: 4500,
      });
      clearCart();
      router.push("/checkout/sucesso");
    }, 1800);
  };

  // Empty cart
  if (lines.length === 0 && !submitting) {
    return (
      <section className="container-page mt-8">
        <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-head text-2xl font-extrabold text-ink-900">
            Sua sacola está vazia
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Adicione produtos para continuar com o checkout.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] hover:scale-[1.02]"
          >
            Continuar comprando
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page mt-6 sm:mt-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-head text-3xl font-extrabold text-ink-900 sm:text-[34px]">
            Finalizar compra
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Confirme seus dados, escolha entrega e forma de pagamento.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 font-bold text-accent-700 ring-1 ring-inset ring-accent-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Compra protegida
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 font-bold text-brand-700 ring-1 ring-inset ring-brand-200">
            <Lock className="h-3.5 w-3.5" />
            SSL 256-bit
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_420px]"
      >
        {/* LEFT — sections */}
        <div className="space-y-5">
          {/* Section 1: Address */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-head text-sm font-extrabold text-white">
                1
              </span>
              <div className="flex-1">
                <h2 className="font-head text-base font-extrabold text-ink-900">
                  Endereço de entrega
                </h2>
                <p className="text-[11.5px] text-ink-500">
                  Para onde devemos enviar?
                </p>
              </div>
              <button
                type="button"
                onClick={openLocationModal}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-[11px] font-bold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                Usar GPS / CEP
              </button>
            </header>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <Field
                label="Nome completo"
                icon={User}
                value={name}
                onChange={setName}
                placeholder="Maria Silva"
                full
              />
              <Field
                label="E-mail"
                icon={Mail}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="seu@email.com"
              />
              <Field
                label="CPF"
                value={cpf}
                onChange={(v) => setCpf(maskCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
              />
              <Field
                label="Celular"
                value={phone}
                onChange={(v) => setPhone(maskPhone(v))}
                placeholder="(11) 90000-0000"
                inputMode="tel"
              />
              <Field
                label="CEP"
                value={cep}
                onChange={handleCep}
                placeholder="00000-000"
                inputMode="numeric"
              />
              <Field
                label="Rua / Avenida"
                icon={MapPin}
                value={street}
                onChange={setStreet}
                placeholder="Av. Paulista"
                full
              />
              <Field
                label="Número"
                value={number}
                onChange={setNumber}
                placeholder="1.000"
              />
              <Field
                label="Complemento"
                value={complement}
                onChange={setComplement}
                placeholder="Apto 42"
                optional
              />
              <Field
                label="Bairro"
                value={district}
                onChange={setDistrict}
                placeholder="Bela Vista"
              />
              <div className="grid grid-cols-[1fr_88px] gap-3">
                <Field
                  label="Cidade"
                  value={city}
                  onChange={setCity}
                  placeholder="São Paulo"
                />
                <Field
                  label="UF"
                  value={uf}
                  onChange={(v) => setUf(v.toUpperCase().slice(0, 2))}
                  placeholder="SP"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Shipping */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-head text-sm font-extrabold text-white">
                2
              </span>
              <div>
                <h2 className="font-head text-base font-extrabold text-ink-900">
                  Forma de entrega
                </h2>
                <p className="text-[11.5px] text-ink-500">
                  Escolha quando quer receber
                </p>
              </div>
            </header>
            <div className="grid gap-2 p-5 sm:grid-cols-3">
              {shippingOptions.map((opt) => {
                const Icon = opt.icon;
                const selected = shipping === opt.id;
                const price =
                  opt.id === "padrao" && subtotal > 199 ? 0 : opt.price;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setShipping(opt.id)}
                    className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-brand-400 bg-brand-50/50 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                        : "border-ink-200 bg-white hover:border-brand-200"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                    <div
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                        selected
                          ? "bg-brand-600 text-white"
                          : "bg-ink-100 text-ink-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink-900">{opt.name}</p>
                    <p className="text-[11px] leading-snug text-ink-500">
                      {opt.desc}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold text-ink-700">
                      {opt.days}
                    </p>
                    <p
                      className={`mt-1 font-head text-base font-extrabold ${
                        price === 0 ? "text-accent-700" : "text-ink-900"
                      }`}
                    >
                      {price === 0 ? "Grátis" : formatBRL(price)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Payment */}
          <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
            <header className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 font-head text-sm font-extrabold text-white">
                3
              </span>
              <div>
                <h2 className="font-head text-base font-extrabold text-ink-900">
                  Forma de pagamento
                </h2>
                <p className="text-[11.5px] text-ink-500">
                  Pague no Pix com 5% de desconto extra
                </p>
              </div>
            </header>

            <div className="grid gap-2 px-5 pt-5 sm:grid-cols-3">
              <PaymentTab
                active={payment === "pix"}
                onClick={() => setPayment("pix")}
                title="Pix"
                desc="Aprovação imediata"
                badge="5% OFF"
                icon={Zap}
                color="from-accent-500 to-accent-700"
              />
              <PaymentTab
                active={payment === "card"}
                onClick={() => setPayment("card")}
                title="Cartão de crédito"
                desc="Até 12x sem juros"
                icon={CreditCard}
                color="from-brand-500 to-brand-700"
              />
              <PaymentTab
                active={payment === "boleto"}
                onClick={() => setPayment("boleto")}
                title="Boleto bancário"
                desc="Vence em 3 dias úteis"
                icon={FileText}
                color="from-ink-600 to-ink-900"
              />
            </div>

            <div className="px-5 pb-5 pt-4">
              {payment === "pix" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4 rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50/60 to-white p-5 sm:grid-cols-[180px_1fr]"
                >
                  {/* QR code */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-100">
                    {/* Subtle corner crosshair guides */}
                    <span className="pointer-events-none absolute left-1 top-1 h-3 w-3 rounded-tl-md border-l-2 border-t-2 border-accent-500/70" />
                    <span className="pointer-events-none absolute right-1 top-1 h-3 w-3 rounded-tr-md border-r-2 border-t-2 border-accent-500/70" />
                    <span className="pointer-events-none absolute bottom-1 left-1 h-3 w-3 rounded-bl-md border-b-2 border-l-2 border-accent-500/70" />
                    <span className="pointer-events-none absolute bottom-1 right-1 h-3 w-3 rounded-br-md border-b-2 border-r-2 border-accent-500/70" />

                    <svg
                      viewBox={`-1 -1 ${qrSize + 2} ${qrSize + 2}`}
                      shapeRendering="crispEdges"
                      className="h-full w-full"
                      role="img"
                      aria-label="QR Code Pix"
                    >
                      <rect
                        x={-1}
                        y={-1}
                        width={qrSize + 2}
                        height={qrSize + 2}
                        fill="white"
                      />
                      {qrGrid.flatMap((row, r) =>
                        row.map((on, c) =>
                          on ? (
                            <rect
                              key={`${r}-${c}`}
                              x={c}
                              y={r}
                              width={1.04}
                              height={1.04}
                              fill="#0f172a"
                            />
                          ) : null,
                        ),
                      )}

                      {/* Pix logo (centered) */}
                      <g
                        transform={`translate(${qrSize / 2 - 3.5} ${qrSize / 2 - 3.5})`}
                      >
                        <rect
                          width={7}
                          height={7}
                          rx={1.4}
                          fill="white"
                          stroke="#e2e8f0"
                          strokeWidth={0.18}
                        />
                        {/* Pix diamond mark (rotated square with four "claws") */}
                        <g transform="translate(3.5 3.5) rotate(45)">
                          <rect
                            x={-1.45}
                            y={-1.45}
                            width={2.9}
                            height={2.9}
                            rx={0.32}
                            fill="#32BCAD"
                          />
                        </g>
                        <rect
                          x={3.1}
                          y={1.0}
                          width={0.8}
                          height={1.0}
                          fill="white"
                        />
                        <rect
                          x={3.1}
                          y={5.0}
                          width={0.8}
                          height={1.0}
                          fill="white"
                        />
                        <rect
                          x={1.0}
                          y={3.1}
                          width={1.0}
                          height={0.8}
                          fill="white"
                        />
                        <rect
                          x={5.0}
                          y={3.1}
                          width={1.0}
                          height={0.8}
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent-700">
                      Pague em segundos
                    </p>
                    <h3 className="mt-1 font-head text-lg font-extrabold text-ink-900">
                      Escaneie o QR Code
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">
                      Abra o app do seu banco, escolha pagar via Pix por QR Code
                      ou copia-e-cola. Aprovação imediata.
                    </p>
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-2">
                      <code className="line-clamp-1 flex-1 break-all px-1 text-[11px] text-ink-600">
                        {fakePixCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(fakePixCode, setPixCopied)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                          pixCopied
                            ? "bg-accent-100 text-accent-700"
                            : "bg-ink-900 text-white hover:bg-brand-700"
                        }`}
                      >
                        {pixCopied ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-accent-700">
                      <Sparkles className="h-3 w-3" />
                      Você economiza {formatBRL(pixDiscount)} no Pix
                    </p>
                  </div>
                </motion.div>
              )}

              {payment === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-5 sm:grid-cols-[1fr_280px]"
                >
                  {/* Form */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Número do cartão"
                      icon={CreditCard}
                      value={cardNumber}
                      onChange={(v) => setCardNumber(maskCard(v))}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      full
                    />
                    <Field
                      label="Nome impresso no cartão"
                      value={cardName}
                      onChange={(v) => setCardName(v.toUpperCase())}
                      placeholder="MARIA SILVA"
                      full
                    />
                    <Field
                      label="Validade"
                      value={cardExpiry}
                      onChange={(v) => setCardExpiry(maskExpiry(v))}
                      placeholder="MM/AA"
                      inputMode="numeric"
                    />
                    <Field
                      label="CVV"
                      value={cardCvv}
                      onChange={(v) =>
                        setCardCvv(v.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="000"
                      inputMode="numeric"
                    />
                    <label className="sm:col-span-2 block">
                      <span className="text-xs font-semibold text-ink-700">
                        Parcelas
                      </span>
                      <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                        {[1, 2, 3, 6, 10, 12].map((n) => {
                          const v = total / n;
                          const isSel = installments === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setInstallments(n)}
                              className={`rounded-lg border px-2 py-1.5 text-center text-[11px] font-bold transition-all ${
                                isSel
                                  ? "border-brand-400 bg-brand-50 text-brand-700"
                                  : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                              }`}
                            >
                              <span className="block">{n}x</span>
                              <span className="block text-[10px] font-medium text-ink-500">
                                {formatBRL(v)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </label>
                  </div>

                  {/* Card preview */}
                  <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-950 via-brand-900 to-ink-900 p-4 text-white shadow-[0_20px_45px_-18px_rgba(15,23,42,0.5)]">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/40 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 pattern-dots-white opacity-30" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="h-7 w-10 rounded bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                          {detectCardBrand(cardNumber) ?? "Bandeira"}
                        </span>
                      </div>
                      <p className="font-head text-base tracking-[0.18em]">
                        {cardNumber || "0000 0000 0000 0000"}
                      </p>
                      <div className="flex items-end justify-between text-[10px]">
                        <div>
                          <p className="uppercase tracking-wider text-white/55">Titular</p>
                          <p className="font-bold uppercase tracking-wider">
                            {cardName || "Seu nome"}
                          </p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-white/55">Validade</p>
                          <p className="font-bold tracking-wider">
                            {cardExpiry || "00/00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {payment === "boleto" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-ink-100 bg-ink-50/60 p-5"
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-head text-base font-extrabold text-ink-900">
                        Boleto bancário
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">
                        Após finalizar o pedido, você receberá o boleto por e-mail.
                        O pagamento pode levar até <strong className="text-ink-900">2 dias úteis</strong> para
                        ser confirmado. Vencimento em 3 dias úteis.
                      </p>
                    </div>
                  </div>

                  {/* Fake barcode */}
                  <div className="mt-4 rounded-xl border border-ink-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                      Linha digitável (exemplo)
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="line-clamp-1 flex-1 break-all text-[12px] font-bold tracking-tighter text-ink-900">
                        {fakeBoletoLine}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(fakeBoletoLine, setBoletoCopied)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
                          boletoCopied
                            ? "bg-accent-100 text-accent-700"
                            : "bg-ink-900 text-white hover:bg-brand-700"
                        }`}
                      >
                        {boletoCopied ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
                    {/* Fake bars */}
                    <div className="mt-3 flex h-12 items-end gap-[2px]">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <span
                          key={i}
                          className="block w-[2.5px] bg-ink-900"
                          style={{ height: `${30 + ((i * 53) % 70)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT — summary */}
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
            <header className="border-b border-ink-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-head text-base font-extrabold text-ink-900">
                <Package className="h-4 w-4 text-brand-600" />
                Resumo do pedido
              </h2>
            </header>
            <ul className="max-h-72 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((l) => (
                <li key={l.product.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                    <Image
                      src={l.product.image}
                      alt={l.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] font-bold text-white">
                      {l.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                      {l.product.brand}
                    </p>
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-ink-900">
                      {l.product.name}
                    </p>
                  </div>
                  <p className="font-head text-sm font-extrabold text-ink-900">
                    {formatBRL(l.product.price * l.qty)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="border-t border-ink-100 px-5 py-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-900">
                <Tag className="h-3.5 w-3.5 text-brand-600" />
                Cupom de desconto
              </p>
              {coupon ? (
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-accent-50 px-3 py-2 ring-1 ring-inset ring-accent-200">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-700">
                    <BadgeCheck className="h-4 w-4" />
                    {coupon} aplicado (-10%)
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-accent-700 hover:bg-accent-100"
                    aria-label="Remover cupom"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-2.5 flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(false);
                      }}
                      placeholder="Ex: BAZAM10"
                      className={`h-10 flex-1 rounded-lg border bg-white px-3 text-xs outline-none focus:border-brand-400 ${
                        couponError ? "border-rose-400" : "border-ink-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-lg bg-ink-900 px-3.5 text-xs font-bold text-white hover:bg-brand-700"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-1.5 text-[11px] font-semibold text-rose-600">
                      Cupom inválido
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <dl className="space-y-1.5 border-t border-ink-100 px-5 py-4 text-sm">
              <div className="flex justify-between text-ink-700">
                <dt>Subtotal</dt>
                <dd className="font-semibold">{formatBRL(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <dt>Cupom</dt>
                  <dd className="font-semibold">-{formatBRL(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-700">
                <dt>Frete</dt>
                <dd className="font-semibold">
                  {effectiveShipping === 0 ? (
                    <span className="text-accent-700">Grátis</span>
                  ) : (
                    formatBRL(effectiveShipping)
                  )}
                </dd>
              </div>
              {pixDiscount > 0 && (
                <div className="flex justify-between text-accent-700">
                  <dt>Desconto Pix (5%)</dt>
                  <dd className="font-semibold">-{formatBRL(pixDiscount)}</dd>
                </div>
              )}
              <hr className="my-2 border-ink-100" />
              <div className="flex items-baseline justify-between">
                <dt className="text-sm font-bold text-ink-900">Total</dt>
                <dd className="font-head text-2xl font-extrabold text-ink-900">
                  {formatBRL(finalTotal)}
                </dd>
              </div>
              {payment === "card" && installments > 1 && (
                <p className="text-right text-[11px] text-ink-500">
                  em {installments}x de {formatBRL(installmentValue)} sem juros
                </p>
              )}
            </dl>

            <div className="border-t border-ink-100 p-5">
              <button
                type="submit"
                disabled={submitting || lines.length === 0}
                className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(79,70,229,0.55)] transition-all hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {submitting ? (
                  <>
                    <span className="relative inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                    <span className="relative">Processando…</span>
                  </>
                ) : (
                  <>
                    <Lock className="relative h-4 w-4" />
                    <span className="relative">
                      Finalizar compra · {formatBRL(finalTotal)}
                    </span>
                  </>
                )}
              </button>
              <Link
                href="/sacola"
                className="mt-2 inline-flex h-10 w-full items-center justify-center gap-1 rounded-xl text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                <Home className="h-3.5 w-3.5" />
                Editar sacola
              </Link>

              <ul className="mt-4 space-y-1.5 text-[10.5px] text-ink-500">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-accent-600" />
                  Pagamento processado com criptografia ponta-a-ponta
                </li>
                <li className="flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-brand-600" />
                  Vendido e entregue por Bazam Comércio
                </li>
                <li className="flex items-center gap-1.5">
                  <BadgeCheck className="h-3 w-3 text-amber-600" />
                  Troca grátis em até 30 dias
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </form>
    </section>
  );
}

/* ----- Reusable subcomponents ----- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
  inputMode,
  full,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: typeof User;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  full?: boolean;
  optional?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="flex items-center justify-between text-xs font-semibold text-ink-700">
        {label}
        {optional && (
          <span className="text-[10.5px] font-medium text-ink-400">opcional</span>
        )}
      </span>
      <div className="relative mt-1.5">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        )}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-ink-200 bg-white pr-3.5 text-sm outline-none transition-all focus:border-brand-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)] ${
            Icon ? "pl-10" : "pl-3.5"
          }`}
        />
      </div>
    </label>
  );
}

function PaymentTab({
  active,
  onClick,
  title,
  desc,
  badge,
  icon: Icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  badge?: string;
  icon: typeof CreditCard;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-3.5 text-left transition-all ${
        active
          ? "border-brand-400 bg-brand-50/40 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
          : "border-ink-200 bg-white hover:border-brand-200"
      }`}
    >
      {badge && (
        <span className="absolute right-2 top-2 rounded-full bg-accent-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white shadow-[0_4px_10px_-2px_rgba(16,185,129,0.45)]">
          {badge}
        </span>
      )}
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-2 text-sm font-bold text-ink-900">{title}</p>
      <p className="text-[11px] leading-snug text-ink-500">{desc}</p>
      {active && (
        <span className="absolute bottom-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckCircle2 className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
