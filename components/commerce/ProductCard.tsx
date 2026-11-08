import Link from "next/link";
import type { Product } from "@/data/types";
import {
  defaultVariant,
  isOutOfStock,
  lowestPrice,
  lowestRegularPrice,
} from "@/data/products";
import { discountPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ProductBadge } from "./Badge";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { ProductImage, glyphFor } from "./ProductImage";
import { CompareButton, SaveButton } from "./CardActions";

/**
 * Product card (DS-CMP-CARD).
 *
 * Photo-first: a 1:1 plate on the surface token with the badge floating top
 * left and the wishlist heart top right, then name, key spec, rating and price
 * beneath. Hover lifts the plate 4px and adds the one shadow tier.
 *
 * The card is one link (DS-CMP-CARD). The heart and compare toggle are
 * separate controls, rendered *after* the link so they stack above it rather
 * than nesting inside the anchor.
 *
 * Grid widths belong to the caller: 2-up mobile, 3-up tablet, 4-up desktop.
 */

export function ProductCard({
  product,
  /** Lets the first visible row skip lazy loading (DS-FND-07b). */
  priority = false,
  /** Adds the compare toggle beside the heart (DS-UX-01 "Compare"). */
  showCompare = false,
  sizes,
  className,
}: {
  product: Product;
  priority?: boolean;
  showCompare?: boolean;
  sizes?: string;
  className?: string;
}) {
  const variant = defaultVariant(product);
  const soldOut = isOutOfStock(product);
  const current = lowestPrice(product);
  const regular = lowestRegularPrice(product);
  const discount = discountPercent(regular, current);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col rounded-md focus-ring"
      >
        <ProductImage
          alt={product.name}
          shape={glyphFor(product.category, product.slug)}
          tint={variant.colorHex}
          priority={priority}
          sizes={sizes}
          muted={soldOut}
          className={cn(
            "transition-[transform,box-shadow] duration-[--motion-fast]",
            "ease-[--ease-standard]",
            "group-hover:-translate-y-1 group-hover:shadow-(--shadow-1)",
          )}
        />

        <div className="mt-2 flex flex-col gap-1">
          <h3 className="line-clamp-2 text-name text-ink">{product.name}</h3>
          <p className="text-sm text-secondary">{product.keySpec}</p>

          <Rating value={product.rating} count={product.reviewCount} />

          <Price
            price={regular}
            salePrice={current < regular ? current : undefined}
            outOfStock={soldOut}
            preOrder={!soldOut && variant.stock === "pre-order"}
            className="mt-0.5"
          />
        </div>
      </Link>

      {/* Overlays. The badge is inert so clicks reach the card link. */}
      {discount > 0 || product.badge ? (
        <ProductBadge
          kind={product.badge}
          discountPercent={discount}
          className="pointer-events-none absolute top-3 left-3"
        />
      ) : null}

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <SaveButton productSlug={product.slug} productName={product.name} />
        {showCompare ? (
          <CompareButton
            productSlug={product.slug}
            productName={product.name}
          />
        ) : null}
      </div>
    </article>
  );
}

/**
 * Card skeleton (DS-CMP-SKEL): matches the final layout block for block, so
 * nothing moves when the content arrives.
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)} aria-hidden="true">
      <div className="aspect-square w-full animate-shimmer rounded-md" />
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-4 w-4/5 animate-shimmer rounded-xs" />
        <div className="h-3 w-3/5 animate-shimmer rounded-xs" />
        <div className="h-3 w-2/5 animate-shimmer rounded-xs" />
        <div className="mt-1 h-4 w-1/2 animate-shimmer rounded-xs" />
      </div>
    </div>
  );
}

/** The 2 / 3 / 4-column product grid used by listings and search. */
export function ProductGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6",
        "lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
