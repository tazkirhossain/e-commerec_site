"use client";

import { useEffect, useRef, useState } from "react";
import type { Product, Variant } from "@/data/types";
import { AddToCartButton, NotifyMeButton } from "@/components/commerce/CardActions";
import { formatTaka, monthlyInstalment } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Mobile sticky buy bar (DS-PG-PDP "Mobile sticky bar").
 *
 * Appears once the main Add to cart button has scrolled out of view, carrying
 * the price and the same action. Mobile and tablet only — on desktop the buy
 * box is sticky instead.
 *
 * It sits at the bottom edge and is above the compare bar in the stacking
 * priority for sticky elements (DS-UX-02).
 */

export function MobileBuyBar({
  product,
  variant,
  /** The id of the in-page Add to cart button to watch. */
  watchId,
}: {
  product: Product;
  variant: Variant;
  watchId: string;
}) {
  const [visible, setVisible] = useState(false);
  const observed = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    observed.current = target;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  const soldOut = variant.stock === "out-of-stock";
  const price = variant.salePrice ?? variant.price;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-sticky border-t border-hairline",
        "bg-canvas/95 backdrop-blur-[20px] lg:hidden",
        "shadow-[0_-1px_2px_rgba(0,0,0,0.06)]",
        "transition-transform duration-[--motion-base] ease-[--ease-standard]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-content flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-price font-semibold text-ink tabular">
            {formatTaka(price)}
          </p>
          <p className="truncate text-caption text-secondary tabular">
            {soldOut
              ? "Out of stock"
              : `or ${formatTaka(monthlyInstalment(price, 12))}/month at 0% EMI`}
          </p>
        </div>

        {soldOut ? (
          <NotifyMeButton
            productName={product.name}
            variant="secondary"
            size="lg"
          />
        ) : (
          <AddToCartButton
            productSlug={product.slug}
            sku={variant.sku}
            label={variant.stock === "pre-order" ? "Pre-order" : "Add to cart"}
            /* Not focusable while off screen, so the tab order stays sane. */
            className={!visible ? "pointer-events-none" : undefined}
          />
        )}
      </div>
    </div>
  );
}
