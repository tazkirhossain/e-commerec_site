import { formatDeduction, formatItemCount, formatTaka } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Order summary (DS-CMP-SHELF sibling; DS-PG-CART, DS-PG-CHECKOUT).
 *
 * Subtotal, discount, delivery and total, with the total separated by a rule.
 * Every figure is tabular so the column of numbers lines up (DS-FND-02b).
 * Free delivery reads "Free" rather than "৳ 0", which is clearer.
 */

export interface SummaryTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  /** Reward points redeemed against this order (FR-LOY-03). */
  pointsRedeemed?: number;
  total: number;
}

export function OrderSummary({
  totals,
  /** The primary action — Checkout on the cart, Place order on review. */
  action,
  /** Coupon field, terms checkbox, or anything else above the action. */
  children,
  heading = "Order summary",
  className,
}: {
  totals: SummaryTotals;
  action?: React.ReactNode;
  children?: React.ReactNode;
  heading?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="summary-heading"
      className={cn(
        "rounded-md border border-hairline bg-canvas p-5 shadow-(--shadow-1)",
        className,
      )}
    >
      <h2 id="summary-heading" className="text-strong text-ink">
        {heading}
      </h2>

      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <Row
          label={`Subtotal (${formatItemCount(totals.itemCount)})`}
          value={formatTaka(totals.subtotal)}
        />

        {totals.discount > 0 ? (
          <Row
            label="Discount"
            value={formatDeduction(totals.discount)}
            tone="danger"
          />
        ) : null}

        {totals.pointsRedeemed && totals.pointsRedeemed > 0 ? (
          <Row
            label="Reward points"
            value={formatDeduction(totals.pointsRedeemed)}
            tone="danger"
          />
        ) : null}

        <Row
          label="Delivery"
          value={totals.deliveryFee === 0 ? "Free" : formatTaka(totals.deliveryFee)}
        />

        <div className="mt-1.5 border-t border-hairline pt-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-strong text-ink">Total</dt>
            <dd className="text-price-lg font-semibold text-ink tabular">
              {formatTaka(totals.total)}
            </dd>
          </div>
          <p className="mt-1 text-caption text-secondary">
            Includes VAT where applicable.
          </p>
        </div>
      </dl>

      {children ? <div className="mt-5">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-secondary">{label}</dt>
      <dd
        className={cn(
          "tabular",
          tone === "danger" ? "text-danger" : "text-ink",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
