"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "success" | "error";
};

type ToastContextValue = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((next: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...next, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
        {toasts.map((item) => {
          const Icon = item.variant === "error" ? XCircle : CheckCircle2;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border bg-background p-4 shadow-soft",
                item.variant === "error" ? "border-red-200" : "border-blue-100"
              )}
            >
              <div className="flex gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5", item.variant === "error" ? "text-red-600" : "text-blue-700")} />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                </div>
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
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
