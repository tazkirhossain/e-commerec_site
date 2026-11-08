"use client";

import { cn } from "@/lib/cn";

/**
 * Colour swatch and segmented option group (DS-CMP-SWATCH, DS-CMP-TABS).
 *
 * The colour name is always shown as text next to the group, never conveyed by
 * the swatch alone (DS-FND-01a). Unavailable combinations are shown disabled
 * with a line through, never hidden, so the shape of the range stays visible
 * (DS-CMP-VARIANT).
 */

export interface SwatchOption {
  value: string;
  /** The colour name, e.g. "Natural Titanium". */
  label: string;
  hex: string;
  available: boolean;
}

export function SwatchGroup({
  legend,
  options,
  value,
  onChange,
  className,
}: {
  legend: string;
  options: SwatchOption[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-sm font-medium text-ink">
        {legend}
        {selected ? (
          <span className="ml-2 font-normal text-secondary">
            {selected.label}
          </span>
        ) : null}
      </legend>

      <div className="flex flex-wrap items-center gap-3">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative inline-flex cursor-pointer items-center",
                "hit-area",
                !option.available && "cursor-not-allowed",
              )}
              title={
                option.available
                  ? option.label
                  : `${option.label} — unavailable`
              }
            >
              <input
                type="radio"
                name={legend}
                value={option.value}
                checked={isSelected}
                disabled={!option.available}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                style={{ backgroundColor: option.hex }}
                className={cn(
                  "inline-block size-8 rounded-pill border border-black/10",
                  "transition-shadow duration-[--motion-fast]",
                  "ease-[--ease-standard]",
                  /* A 3px gap between swatch and ring, per the spec. */
                  isSelected &&
                    "shadow-[0_0_0_3px_var(--color-canvas),0_0_0_5px_var(--color-ink)]",
                  !option.available && "opacity-35",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
                  "peer-focus-visible:outline-accent",
                )}
              />
              {/* The name is what a screen reader announces. */}
              <span className="sr-only">
                {option.label}
                {option.available ? "" : " (unavailable)"}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* --------------------------------------------------------------- Segments */

export interface SegmentOption {
  value: string;
  label: string;
  /** Appended in secondary ink, e.g. "+ ৳ 25,000". */
  note?: string;
  available: boolean;
}

/**
 * Exclusive option group for 2–4 choices such as storage size. Rendered as
 * bordered tiles rather than a pill track, because the labels carry a price
 * delta and would not fit a segmented control.
 */
export function SegmentGroup({
  legend,
  options,
  value,
  onChange,
  className,
}: {
  legend: string;
  options: SegmentOption[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-sm font-medium text-ink">{legend}</legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative inline-flex min-h-12 cursor-pointer items-center",
                "rounded-sm border px-4 text-sm font-medium transition-colors",
                "duration-[--motion-fast] ease-[--ease-standard]",
                isSelected
                  ? "border-2 border-ink px-[15px] text-ink"
                  : "border-hairline text-ink hover:bg-surface",
                !option.available &&
                  "cursor-not-allowed border-hairline bg-surface text-disabled line-through",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
                "has-focus-visible:outline-accent",
              )}
            >
              <input
                type="radio"
                name={legend}
                value={option.value}
                checked={isSelected}
                disabled={!option.available}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span>
                {option.label}
                {option.note ? (
                  <span
                    className={cn(
                      "ml-1 font-normal",
                      option.available ? "text-secondary" : "text-disabled",
                    )}
                  >
                    · {option.note}
                  </span>
                ) : null}
              </span>
              {!option.available ? (
                <span className="sr-only"> (unavailable)</span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Segmented control: a pill track with the selected cell raised. Used for
 * exclusive switches where the labels are short, e.g. Phone / Email.
 */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex w-full items-center gap-1 rounded-pill",
        "bg-surface-strong p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 flex-1 rounded-pill text-sm font-medium transition-colors",
              "duration-[--motion-fast] ease-[--ease-standard] focus-ring",
              isSelected
                ? "bg-canvas text-ink shadow-(--shadow-1)"
                : "text-secondary hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
