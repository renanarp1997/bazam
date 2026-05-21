"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { allProducts, type Product } from "./products";

export type CartLine = { product: Product; qty: number };

type CartState = {
  lines: CartLine[];
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addProduct: (id: string, qty?: number) => void;
  removeLine: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemsCount: number;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
  shipping: number;
  total: number;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const addProduct = useCallback((id: string, qty: number = 1) => {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === id ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { product, qty }];
    });
    setOpen(true);
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.product.id === id ? { ...l, qty: Math.max(0, l.qty + delta) } : l,
        )
        .filter((l) => l.qty > 0),
    );
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.product.id === id ? { ...l, qty: Math.max(0, qty) } : l,
        )
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + l.product.price * l.qty, 0),
    [lines],
  );

  const itemsCount = useMemo(
    () => lines.reduce((acc, l) => acc + l.qty, 0),
    [lines],
  );

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === "BAZAM10") {
      setCoupon("BAZAM10");
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const discount = coupon === "BAZAM10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 199 || subtotal === 0 ? 0 : 19.9;
  const total = Math.max(0, subtotal - discount + shipping);

  const value: CartState = {
    lines,
    open,
    openCart,
    closeCart,
    addProduct,
    removeLine,
    updateQty,
    setQty,
    clearCart,
    subtotal,
    itemsCount,
    coupon,
    applyCoupon,
    removeCoupon,
    discount,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
