import type { BadgeKind } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Badge (DS-CMP-BADGE).
 *
 * At most one badge per card (FR-CAT-07). Neutral badges sit on photography and
 * carry the one shadow tier so they stay legible; the sale badge is the only
 * one that uses the accent as a fill.
 */

export type BadgeTone = "neutral" | "accent" | "sale" | "success";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-canvas text-ink shadow-(--shadow-1)",
  accent: "bg-canvas text-accent shadow-(--shadow-1)",
  sale: "bg-accent text-on-accent",
  success: "bg-success-surface text-success",
};

/** The tone each badge kind renders in. */
const toneForKind: Record<BadgeKind, BadgeTone> = {
  new: "neutral",
  "online-only": "neutral",
  "pre-order": "neutral",
  exclusive: "accent",
  sale: "sale",
};

const labelForKind: Record<BadgeKind, string> = {
  new: "New",
  "online-only": "Online only",
  "pre-order": "Pre-order",
  exclusive: "Exclusive",
  sale: "Sale",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-pill px-2.5",
        "text-badge font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Renders a product's badge from its kind, or a discount if one is passed. */
export function ProductBadge({
  kind,
  discountPercent,
  className,
}: {
  kind?: BadgeKind;
  /** When set, a sale badge showing "-12%" wins over the product's own badge. */
  discountPercent?: number;
  className?: string;
}) {
  if (discountPercent && discountPercent > 0) {
    return (
      <Badge tone="sale" className={className}>
        −{discountPercent}%
      </Badge>
    );
  }

  if (!kind) return null;

  return (
    <Badge tone={toneForKind[kind]} className={className}>
      {labelForKind[kind]}
    </Badge>
  );
}

/**
 * The "NEW" tag used on navigation items (DESIGN-airbnb `new-tag`): 8px,
 * uppercase, tightly tracked, anchored to the corner of an icon or label.
 */
export function NewTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill bg-canvas px-1.5 py-0.5",
        "text-micro uppercase shadow-(--shadow-1)",
        className,
      )}
    >
      New
    </span>
  );
}
