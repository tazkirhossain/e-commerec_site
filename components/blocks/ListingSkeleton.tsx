import {
  ProductCardSkeleton,
  ProductGrid,
} from "@/components/commerce/ProductCard";
import { SkeletonRegion } from "@/components/feedback/States";

/**
 * The loading shape of a filtered listing (DS-CMP-SKEL).
 *
 * Mirrors `ProductListing` block for block — a 280px rail and a product grid —
 * so nothing moves when the real listing hydrates.
 */
export function ListingSkeleton() {
  return (
    <SkeletonRegion label="Loading products" className="flex gap-10">
      <div className="hidden w-[280px] shrink-0 flex-col gap-4 lg:flex">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-shimmer rounded-sm" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <ProductGrid>
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      </div>
    </SkeletonRegion>
  );
}
