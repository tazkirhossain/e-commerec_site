"use client";

import { Button } from "@/components/ui/Button";
import type { OrderLine } from "@/data/types";
import { products } from "@/data/products";
import { useStore } from "@/lib/store";

/**
 * Reorder (FR-USR-05, DS-UX-01 "Quick re-order").
 *
 * Puts the same items back in the cart in one tap. Order lines store the
 * product *name* as it was at purchase, not a SKU reference, because a line
 * must not change when the catalogue does (Software SRS §4.2) — so we match on
 * name and fall back to the variant that is actually sellable today.
 */
export function ReorderButton({ lines }: { lines: OrderLine[] }) {
  const { addToCart, showToast } = useStore();

  function reorder() {
    let added = 0;
    let unavailable = 0;

    for (const line of lines) {
      const product = products.find((p) => p.name === line.name);
      if (!product) {
        unavailable += 1;
        continue;
      }

      const variant =
        product.variants.find(
          (v) =>
            line.variant.includes(v.color) &&
            (!v.storage || line.variant.includes(v.storage)) &&
            v.stock !== "out-of-stock",
        ) ??
        product.variants.find((v) => v.stock !== "out-of-stock");

      if (!variant) {
        unavailable += 1;
        continue;
      }

      addToCart(product.slug, variant.sku, line.quantity);
      added += 1;
    }

    if (added === 0) {
      showToast("None of these items are available right now");
    } else if (unavailable > 0) {
      showToast(`Added ${added}. ${unavailable} is no longer available.`);
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={reorder}>
      Reorder
    </Button>
  );
}
