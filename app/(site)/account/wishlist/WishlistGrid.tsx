"use client";

import {
  ProductCard,
  ProductCardSkeleton,
  ProductGrid,
} from "@/components/commerce/ProductCard";
import { EmptyState, SkeletonRegion } from "@/components/feedback/States";
import { getProducts } from "@/data/products";
import { useStore } from "@/lib/store";

/** The saved products, read from the client store. */
export function WishlistGrid() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) {
    return (
      <SkeletonRegion label="Loading your wishlist">
        <ProductGrid>
          {Array.from({ length: 3 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </SkeletonRegion>
    );
  }

  const items = getProducts(wishlist);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Nothing saved yet"
        body="Tap the heart on any product to keep it here."
        action={{ label: "Browse products", href: "/" }}
      />
    );
  }

  return (
    <ProductGrid className="lg:grid-cols-3">
      {items.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </ProductGrid>
  );
}
