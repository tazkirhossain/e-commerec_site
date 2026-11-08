"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

/**
 * Modal and drawer (DS-CMP-MODAL).
 *
 * Both trap focus, close on Escape, and return focus to whatever opened them
 * (DS-A11Y-06). Modal: centred, max 560px, extra-large radius, the overlay
 * shadow, scrim at 40% black. Drawer: 420px from the right, full width on
 * mobile.
 *
 * Shared machinery lives in `Overlay`; `Modal` and `Drawer` are the two shapes.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function useOverlay(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  /* Remember the trigger, move focus in, and give it back on close. */
  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    /* The page behind must not scroll while an overlay is up. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, [open]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);

      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      /* Wrap at both ends so focus never escapes the overlay. */
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return { panelRef, onKeyDown };
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Hides the visible title but keeps it as the accessible name. */
  hideTitle?: boolean;
  description?: string;
  children: ReactNode;
  /** Pinned action row at the bottom — the drawer's Checkout, a modal's buttons. */
  footer?: ReactNode;
  shape: "modal" | "drawer";
  className?: string;
}

function Overlay({
  open,
  onClose,
  title,
  hideTitle = false,
  description,
  children,
  footer,
  shape,
  className,
}: OverlayProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { panelRef, onKeyDown } = useOverlay(open, onClose);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  const isDrawer = shape === "drawer";

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex",
        isDrawer ? "z-drawer justify-end" : "z-modal items-center justify-center p-4",
      )}
      onKeyDown={onKeyDown}
    >
      {/* Scrim. Inert to assistive tech; clicking it closes the overlay. */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-full flex-col bg-canvas shadow-(--shadow-2)",
          "focus:outline-none",
          isDrawer
            ? "h-full w-full animate-slide-in sm:w-[420px]"
            : "w-full max-w-[560px] rounded-xl animate-slide-up",
          className,
        )}
      >
        <header
          className={cn(
            "flex items-start justify-between gap-4 px-5 pt-5",
            isDrawer && "border-b border-hairline pb-4",
            !isDrawer && !hideTitle && "pb-0",
          )}
        >
          <div className="min-w-0">
            <h2
              id={titleId}
              className={cn(
                "text-subtitle text-ink",
                hideTitle && "sr-only",
              )}
            >
              {title}
            </h2>
          </div>
          <IconButton
            icon="x"
            label="Close"
            styleVariant="filled"
            onClick={onClose}
            className="-mt-1 shrink-0"
          />
        </header>

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-5",
            isDrawer ? "py-4" : "pt-3 pb-5",
          )}
        >
          {description ? (
            <p id={descriptionId} className="text-base text-body">
              {description}
            </p>
          ) : null}
          {children}
        </div>

        {footer ? (
          <footer className="border-t border-hairline px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export function Modal(props: Omit<OverlayProps, "shape">) {
  return <Overlay {...props} shape="modal" />;
}

export function Drawer(props: Omit<OverlayProps, "shape">) {
  return <Overlay {...props} shape="drawer" />;
}
