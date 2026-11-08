import type { OrderStatus as OrderStatusKind, StockState } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Order and stock status.
 *
 * Both pair an icon with the text, so the state never rests on colour alone
 * (DS-FND-01a). Order statuses are the six in FR-ORD-05; stock states are the
 * five in FR-INV-03.
 */

const orderStyles: Record<
  OrderStatusKind,
  { label: string; icon: IconName; className: string }
> = {
  placed: {
    label: "Placed",
    icon: "clock",
    className: "bg-surface text-body",
  },
  confirmed: {
    label: "Confirmed",
    icon: "check",
    className: "bg-surface-strong text-ink",
  },
  shipped: {
    label: "Shipped",
    icon: "truck",
    className: "bg-warning-surface text-warning-ink",
  },
  delivered: {
    label: "Delivered",
    icon: "check-circle",
    className: "bg-success-surface text-success",
  },
  cancelled: {
    label: "Cancelled",
    icon: "x",
    className: "bg-danger-surface text-danger",
  },
  returned: {
    label: "Returned",
    icon: "undo",
    className: "bg-surface text-secondary",
  },
};

export function OrderStatus({
  status,
  className,
}: {
  status: OrderStatusKind;
  className?: string;
}) {
  const style = orderStyles[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-pill px-2.5",
        "text-[12px] leading-4 font-semibold whitespace-nowrap",
        style.className,
        className,
      )}
    >
      <Icon name={style.icon} size={16} strokeWidth={2} />
      {style.label}
    </span>
  );
}

const stockStyles: Record<
  StockState,
  { icon: IconName; className: string }
> = {
  "in-stock": { icon: "check", className: "text-success" },
  "low-stock": { icon: "alert-circle", className: "text-warning" },
  "out-of-stock": { icon: "x", className: "text-danger" },
  "pre-order": { icon: "calendar", className: "text-body" },
  discontinued: { icon: "x", className: "text-secondary" },
};

/** Default wording per state; `available` sharpens the low-stock case. */
function stockLabel(state: StockState, available?: number): string {
  switch (state) {
    case "in-stock":
      return "In stock";
    case "low-stock":
      return available ? `Only ${available} left` : "Low stock";
    case "out-of-stock":
      return "Out of stock";
    case "pre-order":
      return "Pre-order";
    case "discontinued":
      return "Discontinued";
  }
}

export function StockStatus({
  state,
  available,
  /** Appended after a middot, e.g. a delivery estimate. */
  note,
  className,
}: {
  state: StockState;
  available?: number;
  note?: string;
  className?: string;
}) {
  const style = stockStyles[state];

  return (
    <p
      className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}
    >
      <span className={cn("flex items-center gap-1.5", style.className)}>
        <Icon name={style.icon} size={16} strokeWidth={2} />
        <span className="font-medium">{stockLabel(state, available)}</span>
      </span>
      {note ? (
        <span className="text-secondary">
          <span aria-hidden="true">· </span>
          {note}
        </span>
      ) : null}
    </p>
  );
}
