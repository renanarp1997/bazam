"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "info" | "error" | "warn" | "loading";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  toast: (t: ToastInput) => string;
  success: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warn: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
  update: (id: string, t: Partial<Toast>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastState | null>(null);

let __counter = 0;
const uid = () => `t_${Date.now()}_${++__counter}`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      if (duration > 0 && Number.isFinite(duration)) {
        const handle = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, handle);
      }
    },
    [dismiss],
  );

  const toast = useCallback(
    ({ title, description, variant = "info", duration }: ToastInput) => {
      const id = uid();
      const finalDuration =
        duration ?? (variant === "loading" ? Infinity : 3800);
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration: finalDuration,
      };
      setToasts((prev) => [...prev, newToast]);
      scheduleDismiss(id, finalDuration);
      return id;
    },
    [scheduleDismiss],
  );

  const update = useCallback(
    (id: string, patch: Partial<Toast>) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      if (patch.duration !== undefined) {
        scheduleDismiss(id, patch.duration);
      }
    },
    [scheduleDismiss],
  );

  const success = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "success" }),
    [toast],
  );
  const info = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "info" }),
    [toast],
  );
  const error = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "error" }),
    [toast],
  );
  const warn = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "warn" }),
    [toast],
  );
  const loading = useCallback(
    (title: string, description?: string) =>
      toast({ title, description, variant: "loading", duration: Infinity }),
    [toast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, info, error, warn, loading, update, dismiss }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
