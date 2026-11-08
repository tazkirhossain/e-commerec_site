import {
  formatSaving,
  formatTaka,
  monthlyInstalment,
} from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Price block (DS-CMP-PRICE).
 *
 * Current price in primary ink, the old price struck through in secondary, and
 * the saving in danger ink. Taka with lakh grouping and no decimals, in tabular
 * figures so columns line up (DS-FND-02b).
 *
 * Out of stock replaces the price with "Notify me"; pre-order keeps the price
 * and adds a label.
 */

export type PriceSize = "card" | "large";

export interface PriceProps {
  /** The regular price. */
  price: number;
  /** Set when on sale; must be lower than `price`. */
  salePrice?: number;
  size?: PriceSize;
  /** Replaces the figure with "Out of stock" and a Notify me affordance. */
  outOfStock?: boolean;
  /** Adds the "Pre-order" label beside the price. */
  preOrder?: boolean;
  /** Shows the "or ৳ X/month at 0% EMI" line under a large price. */
  emiMonths?: number;
  /** Rendered in place of the Notify me text when the parent owns the action. */
  notifySlot?: React.ReactNode;
  className?: string;
}

export function Price({
  price,
  salePrice,
  size = "card",
  outOfStock = false,
  preOrder = false,
  emiMonths,
  notifySlot,
  className,
}: PriceProps) {
  const current = salePrice ?? price;
  const onSale = salePrice !== undefined && salePrice < price;
  const large = size === "large";

  if (outOfStock) {
    return (
      <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
        <span
          className={cn(
            "font-semibold text-secondary",
            large ? "text-price-lg" : "text-price",
          )}
        >
          Out of stock
        </span>
        {notifySlot ?? (
          <span className="text-sm font-medium text-accent underline underline-offset-4">
            Notify me
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", large ? "gap-1.5" : "gap-0", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={cn(
            "font-semibold text-ink tabular",
            large ? "text-price-lg" : "text-price",
          )}
        >
          {formatTaka(current)}
        </span>

        {onSale ? (
          <>
            <span
              className={cn(
                "text-secondary line-through tabular",
                large ? "text-base" : "text-sm",
              )}
            >
              {formatTaka(price)}
              <span className="sr-only"> was the regular price</span>
            </span>
            <span
              className={cn(
                "font-medium text-danger tabular",
                large ? "text-sm" : "text-caption",
              )}
            >
              {formatSaving(price, salePrice)}
            </span>
          </>
        ) : null}

        {preOrder ? (
          <span
            className={cn(
              "font-medium text-secondary",
              large ? "text-sm" : "text-caption",
            )}
          >
            Pre-order
          </span>
        ) : null}
      </div>

      {/* The monthly figure that makes a large price legible (DS-CMP-EMI). */}
      {emiMonths ? (
        <p className="text-sm text-secondary tabular">
          or {formatTaka(monthlyInstalment(current, emiMonths))}/month at 0% EMI
        </p>
      ) : null}
    </div>
  );
}
