import type { Product } from "@/data/types";
import { ProductCard } from "@/components/commerce/ProductCard";
import { cn } from "@/lib/cn";
import { ShelfScroller } from "./ShelfScroller";

export { ShelfHeader } from "./ShelfHeader";

/**
 * Product shelf (DS-CMP-SHELF).
 *
 * A horizontal scroll-snap row of product cards — two visible on mobile, three
 * on tablet, four on desktop, with arrow buttons from desktop.
 */
export function ProductShelf({
  title,
  products,
  href,
  description,
  /** The first shelf above the fold can load its images eagerly. */
  priority = false,
  className,
}: {
  title: string;
  products: Product[];
  href?: string;
  description?: string;
  priority?: boolean;
  className?: string;
}) {
  if (products.length === 0) return null;

  const headingId = `shelf-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className={className}>
      <ShelfScroller
        id={headingId}
        title={title}
        href={href}
        description={description}
      >
        {products.map((product, index) => (
          <li
            key={product.slug}
            className={cn(
              /* 2-up mobile, 3-up tablet, 4-up desktop, allowing for gaps. */
              "w-[calc((100%-1rem)/2)] shrink-0",
              "sm:w-[calc((100%-3rem)/3)]",
              "lg:w-[calc((100%-4.5rem)/4)]",
            )}
          >
            <ProductCard
              product={product}
              priority={priority && index < 4}
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 30vw, 45vw"
            />
          </li>
        ))}
      </ShelfScroller>
    </section>
  );
}
