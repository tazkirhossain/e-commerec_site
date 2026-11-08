"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useStore, type Toast as ToastModel } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * Toast (DS-CMP-TOAST).
 *
 * Bottom centre on mobile, bottom left on desktop. Inverse surface, auto
 * dismiss after 4s, an Undo action when the thing it reports is reversible,
 * announced through a polite live region (DS-A11Y-06).
 *
 * The region itself is always mounted — a live region added at the same moment
 * as its content is not reliably announced.
 */

const DISMISS_AFTER = 4000;

export function ToastRegion() {
  const { toasts } = useStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-toast flex flex-col",
        "items-center gap-2 sm:inset-x-auto sm:left-10 sm:items-start",
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastModel }) {
  const { dismissToast } = useStore();

  useEffect(() => {
    const timer = window.setTimeout(
      () => dismissToast(toast.id),
      DISMISS_AFTER,
    );
    return () => window.clearTimeout(timer);
  }, [toast.id, dismissToast]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex max-w-sm items-center gap-4 rounded-sm",
        "bg-inverse px-4 py-3.5 text-sm text-on-inverse shadow-(--shadow-2)",
        "animate-slide-up",
      )}
    >
      <p className="min-w-0 flex-1">{toast.message}</p>

      {toast.action ? (
        <button
          type="button"
          onClick={() => {
            toast.action?.onAction();
            dismissToast(toast.id);
          }}
          className={cn(
            "shrink-0 font-medium underline underline-offset-4",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-on-inverse",
          )}
        >
          {toast.action.label}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss"
        className={cn(
          "-mr-1 inline-flex size-6 shrink-0 items-center justify-center",
          "rounded-pill hover:bg-white/15",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-on-inverse",
        )}
      >
        <Icon name="x" size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
