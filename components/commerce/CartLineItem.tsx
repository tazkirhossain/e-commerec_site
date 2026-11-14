"use client";

import Link from "next/link";
import type { Product, Variant } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Quantity } from "@/components/ui/Quantity";
import { Banner } from "@/components/feedback/Banner";
import { primaryPhoto } from "@/data/products";
import { formatTaka } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { Price } from "./Price";
import { ProductImage, glyphFor } from "./ProductImage";

/**
 * Cart line item (DS-CMP-MINICART, DS-PG-CART).
 *
 * Thumbnail, name, variant, quantity stepper, line price, and the two actions
 * — move to wishlist and remove. Removing uses a toast with Undo rather than a
 * confirmation modal (DS-UX-02).
 *
 * `compact` is the mini-cart drawer form: no action row, no stepper controls.
 *
 * A line whose price or stock changed since it was added carries a warning
 * banner on the line itself (DS-PG-CART), which is what FR-CRT-03 asks the
 * re-check to surface.
 */

export function CartLineItem({
  product,
  variant,
  quantity,
  compact = false,
  className,
}: {
  product: Product;
  variant: Variant;
  quantity: number;
  compact?: boolean;
  className?: string;
}) {
  const { setQuantity, removeFromCart, toggleWishlist } = useStore();

  const unit = variant.salePrice ?? variant.price;
  const lineTotal = unit * quantity;

  const variantLabel = [variant.color, variant.storage, variant.connectivity]
    .filter(Boolean)
    .join(" · ");

  /* Blocks checkout and explains why, rather than failing at payment. */
  const unavailable = variant.stock === "out-of-stock";
  const scarce = variant.stock === "low-stock" && quantity >= variant.available;

  return (
    <li
      className={cn(
        "flex flex-col gap-3",
        !compact && "border-b border-hairline pb-6",
        className,
      )}
    >
      <div className="flex gap-4">
        <Link
          href={`/product/${product.slug}`}
          className="shrink-0 rounded-md focus-ring"
          aria-label={product.name}
        >
          <ProductImage
            src={primaryPhoto(product, variant)}
            alt={product.name}
            shape={glyphFor(product.category, product.slug)}
            tint={variant.colorHex}
            sizes="96px"
            className={compact ? "w-16" : "w-20 sm:w-24"}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-name text-ink">
                <Link
                  href={`/product/${product.slug}`}
                  className="rounded-xs hover:underline focus-ring"
                >
                  {product.name}
                </Link>
              </h3>
              {variantLabel ? (
                <p className="text-sm text-secondary">{variantLabel}</p>
              ) : null}
            </div>

            {compact ? (
              <span className="shrink-0 text-sm font-semibold text-ink tabular">
                {formatTaka(lineTotal)}
              </span>
            ) : null}
          </div>

          {compact ? (
            <p className="text-sm text-secondary tabular">
              Qty {quantity}
              {quantity > 1 ? (
                <span> · {formatTaka(unit)} each</span>
              ) : null}
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <Quantity
                value={quantity}
                onChange={(next) => setQuantity(variant.sku, next)}
                max={Math.max(1, variant.available)}
                label={`Quantity for ${product.name}`}
                hideNote
              />
              <Price
                price={variant.price * quantity}
                salePrice={
                  variant.salePrice ? variant.salePrice * quantity : undefined
                }
              />
            </div>
          )}

          {!compact ? (
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => {
                  toggleWishlist(product.slug);
                  removeFromCart(variant.sku);
                }}
                className="text-sm"
              >
                Move to wishlist
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => removeFromCart(variant.sku)}
                className="text-sm"
              >
                Remove
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {unavailable ? (
        <Banner
          tone="error"
          message="This item went out of stock. Remove it to continue."
          action={{
            label: "Remove",
            onAction: () => removeFromCart(variant.sku),
          }}
        />
      ) : scarce ? (
        <Banner
          tone="warning"
          message={`Only ${variant.available} left. Price may change at checkout.`}
        />
      ) : null}

      {/* Keeps a reversible-action affordance on the compact form too. */}
      {compact ? (
        <button
          type="button"
          onClick={() => removeFromCart(variant.sku)}
          className="sr-only-focusable self-start text-sm underline focus-ring"
        >
          Remove {product.name}
        </button>
      ) : null}
    </li>
  );
}
