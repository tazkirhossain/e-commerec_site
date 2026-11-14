"use client";

import { usePathname } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductImage, glyphFor } from "@/components/commerce/ProductImage";
import { defaultVariant, getProducts, primaryPhoto } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * Compare bar (DS-CMP-COMPARE).
 *
 * A sticky bar that appears once a product is selected for comparison, holding
 * up to four thumbnails and a Compare button. Sticky elements must not overlap,
 * and the compare bar is lowest in priority after the header and the mobile buy
 * bar (DS-UX-02) — hence the bottom offset on product pages, where the buy bar
 * sits underneath it.
 */

export function CompareBar() {
  const pathname = usePathname();
  const { compare, clearCompare, compareLimit, hydrated } = useStore();

  if (!hydrated || compare.length === 0) return null;
  /* On the compare page itself the bar would be redundant. */
  if (pathname === "/compare") return null;

  const selected = getProducts(compare);
  const remaining = compareLimit - selected.length;
  /* Product pages carry the mobile buy bar, which owns the bottom edge. */
  const aboveBuyBar = pathname.startsWith("/product/");

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-sticky border-t border-hairline bg-canvas/95",
        "backdrop-blur-[20px] shadow-[0_-1px_2px_rgba(0,0,0,0.06)]",
        aboveBuyBar ? "bottom-[72px] lg:bottom-0" : "bottom-0",
      )}
    >
      <div className="container-content flex items-center gap-4 py-3">
        <ul className="flex items-center gap-2">
          {selected.map((product) => (
            <li key={product.slug}>
              <ProductImage
                src={primaryPhoto(product)}
                alt={product.name}
                shape={glyphFor(product.category, product.slug)}
                tint={defaultVariant(product).colorHex}
                sizes="48px"
                className="w-12"
              />
            </li>
          ))}
        </ul>

        <p className="min-w-0 flex-1 text-sm text-secondary">
          <span className="font-medium text-ink">
            {selected.length} of {compareLimit} products
          </span>
          {remaining > 0 ? (
            <span className="hidden sm:inline"> · add {remaining} more</span>
          ) : null}
        </p>

        <Button variant="tertiary" size="sm" onClick={clearCompare}>
          Clear
        </Button>

        <ButtonLink
          href="/compare"
          size="md"
          className={selected.length < 2 ? "pointer-events-none opacity-40" : undefined}
          aria-disabled={selected.length < 2 || undefined}
        >
          Compare
        </ButtonLink>
      </div>
    </div>
  );
}
