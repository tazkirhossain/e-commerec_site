import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Filter / option chip (DS-CMP-CHIP).
 *
 * 36px pill. Selected fills with ink and white text. The removable variant
 * carries an × and is what an active filter looks like above the grid
 * (DS-PG-CAT item 3). The dropdown variant opens a menu, e.g. the sort select.
 */

export type ChipVariant = "default" | "selected" | "removable" | "dropdown";

const base = cn(
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill border px-4",
  "text-sm font-medium whitespace-nowrap transition-colors",
  "duration-[--motion-fast] ease-[--ease-standard] focus-ring",
  "disabled:pointer-events-none disabled:opacity-40",
);

const variants: Record<ChipVariant, string> = {
  default: "border-hairline bg-canvas text-ink hover:bg-surface",
  selected: "border-ink bg-ink text-on-inverse hover:bg-body",
  removable: "border-surface bg-surface text-ink hover:bg-surface-strong",
  dropdown: "border-hairline bg-canvas text-ink hover:bg-surface",
};

interface CommonProps {
  variant?: ChipVariant;
  className?: string;
  children: React.ReactNode;
}

export interface ChipProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  /** Called by the removable variant's × — the chip itself stays clickable. */
  onRemove?: () => void;
  href?: never;
}

export function Chip({
  variant = "default",
  className,
  children,
  onRemove,
  type = "button",
  ...rest
}: ChipProps) {
  /* Removable chips are two controls in one pill: the chip and its ×. The
     outer element must not be a button, or the × would nest inside it. */
  if (variant === "removable" && onRemove) {
    return (
      <span className={cn(base, variants.removable, "pr-2", className)}>
        <span>{children}</span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter ${String(children)}`}
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-pill",
            "text-ink hover:bg-hairline focus-ring hit-area",
          )}
        >
          <Icon name="x" size={14} strokeWidth={2} />
        </button>
      </span>
    );
  }

  return (
    <button
      type={type}
      aria-pressed={variant === "selected" ? true : undefined}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      <span>{children}</span>
      {variant === "dropdown" ? (
        <Icon name="chevron-down" size={16} />
      ) : null}
    </button>
  );
}

/** The same pill as a link, for subcategory chips that are navigation. */
export function ChipLink({
  href,
  variant = "default",
  className,
  children,
}: {
  href: string;
  variant?: ChipVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={variant === "selected" ? "page" : undefined}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </Link>
  );
}
