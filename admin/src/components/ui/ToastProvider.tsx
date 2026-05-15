"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

const ToastContext = createContext<{
  showToast: (toast: Omit<Toast, "id">) => void;
} | null>(null);

const toneStyles: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-100",
  error: "border-red-200 bg-red-50 text-red-900 dark:border-red-500/20 dark:bg-red-500/15 dark:text-red-100",
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-100"
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo(
    () => ({
      showToast(toast: Omit<Toast, "id">) {
        const id = crypto.randomUUID();
        setToasts((current) => [...current, { ...toast, id }]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== id));
        }, 4200);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.tone];

          return (
            <div
              key={toast.id}
              className={cn("rounded-3xl border p-4 shadow-soft backdrop-blur", toneStyles[toast.tone])}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 shrink-0" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-xs opacity-80">{toast.description}</p> : null}
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 transition hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
