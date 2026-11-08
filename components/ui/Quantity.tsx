"use client";

import { useId } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Quantity stepper (DS-CMP-QTY).
 *
 * 40px pill with minus, the number, and plus. Minimum 1; maximum is the stock
 * available to sell (FR-CRT-02). At the maximum, plus is disabled and a note
 * reads "Only N left" so the reason is visible, not just implied.
 */

export interface QuantityProps {
  value: number;
  onChange: (next: number) => void;
  /** Units available to sell. Caps the stepper. */
  max: number;
  min?: number;
  /** The thing being counted, for the accessible name. */
  label?: string;
  /** Hides the "Only N left" note when the surrounding row already says it. */
  hideNote?: boolean;
  className?: string;
}

export function Quantity({
  value,
  onChange,
  max,
  min = 1,
  label = "Quantity",
  hideNote = false,
  className,
}: QuantityProps) {
  const id = useId();
  const atMin = value <= min;
  const atMax = value >= max;
  /* Worth saying only when the cap is close enough to be a real constraint. */
  const showNote = !hideNote && atMax && max <= 5;

  return (
    <div className={cn("flex flex-col items-start gap-1.5", className)}>
      <div
        className={cn(
          "inline-flex h-10 items-center gap-4 rounded-pill border",
          "border-hairline bg-canvas px-1.5",
        )}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          aria-label={`Decrease ${label.toLowerCase()}`}
          aria-controls={id}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-pill",
            "border border-hairline text-ink transition-colors",
            "duration-[--motion-fast] ease-[--ease-standard]",
            "hover:bg-surface focus-ring",
            "disabled:pointer-events-none disabled:opacity-35",
            "hit-area",
          )}
        >
          <Icon name="minus" size={14} strokeWidth={2} />
        </button>

        {/* A live region so the new value is announced after a tap. */}
        <output
          id={id}
          aria-live="polite"
          aria-label={label}
          className="min-w-5 text-center text-[15px] font-medium tabular"
        >
          {value}
        </output>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          aria-label={`Increase ${label.toLowerCase()}`}
          aria-controls={id}
          title={atMax ? `Only ${max} left` : undefined}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-pill",
            "border border-hairline text-ink transition-colors",
            "duration-[--motion-fast] ease-[--ease-standard]",
            "hover:bg-surface focus-ring",
            "disabled:pointer-events-none disabled:opacity-35",
            "hit-area",
          )}
        >
          <Icon name="plus" size={14} strokeWidth={2} />
        </button>
      </div>

      {showNote ? (
        <span className="text-caption text-secondary">Only {max} left</span>
      ) : null}
    </div>
  );
}
