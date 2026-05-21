"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useToast, type Toast } from "@/lib/toast-context";

const variants: Record<
  Toast["variant"],
  { Icon: typeof Info; bar: string; icon: string; ring: string }
> = {
  success: {
    Icon: CheckCircle2,
    bar: "bg-gradient-to-r from-accent-500 to-accent-700",
    icon: "text-accent-600",
    ring: "ring-accent-200",
  },
  info: {
    Icon: Info,
    bar: "bg-gradient-to-r from-brand-500 to-brand-700",
    icon: "text-brand-600",
    ring: "ring-brand-200",
  },
  error: {
    Icon: XCircle,
    bar: "bg-gradient-to-r from-rose-500 to-rose-700",
    icon: "text-rose-600",
    ring: "ring-rose-200",
  },
  warn: {
    Icon: AlertTriangle,
    bar: "bg-gradient-to-r from-amber-500 to-orange-500",
    icon: "text-amber-600",
    ring: "ring-amber-200",
  },
  loading: {
    Icon: Loader2,
    bar: "bg-gradient-to-r from-ink-700 to-ink-900",
    icon: "text-ink-700",
    ring: "ring-ink-200",
  },
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const v = variants[t.variant];
          const Icon = v.Icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              role="status"
              className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-premium ring-1 ${v.ring}`}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${v.bar}`} />
              <div className="flex items-start gap-3 py-3 pl-4 pr-3">
                <div className={`mt-0.5 ${v.icon}`}>
                  <Icon
                    className={`h-5 w-5 ${t.variant === "loading" ? "animate-spin" : ""}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug text-ink-900">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                  aria-label="Fechar notificação"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
