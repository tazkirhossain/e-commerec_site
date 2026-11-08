import Link from "next/link";
import type { Brand, Category } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { ProductImage, glyphFor } from "./ProductImage";

/**
 * Category tile (DS-PG-HOME item 3): a 4:3 plate with the category name and a
 * "Shop" affordance. The product card without a price, in effect.
 */
export function CategoryTile({
  category,
  priority = false,
  className,
}: {
  category: Category;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn("group flex flex-col rounded-md focus-ring", className)}
    >
      <ProductImage
        alt=""
        ratio="four-three"
        shape={glyphFor(category.slug)}
        priority={priority}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className={cn(
          "transition-[transform,box-shadow] duration-[--motion-fast]",
          "ease-[--ease-standard]",
          "group-hover:-translate-y-1 group-hover:shadow-(--shadow-1)",
        )}
      />
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-strong text-ink">{category.name}</h3>
        <span className="flex items-center gap-1 text-sm font-medium text-secondary group-hover:text-ink">
          Shop
          <Icon name="chevron-right" size={16} />
        </span>
      </div>
      {category.blurb ? (
        <p className="mt-0.5 text-sm text-secondary">{category.blurb}</p>
      ) : null}
    </Link>
  );
}

/**
 * Brand tile (DS-PG-BRAND). Logos are not in the repository, so the wordmark
 * stands in — rendered monochrome, which is how the real logos are specified
 * (DS-FND-07).
 */
export function BrandTile({
  brand,
  /** Shows the one-line description under the name, for the index page. */
  withDescription = false,
  className,
}: {
  brand: Brand;
  withDescription?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 rounded-md",
        "border border-hairline bg-canvas px-4 py-6 text-center",
        "transition-[transform,box-shadow] duration-[--motion-fast]",
        "ease-[--ease-standard] hover:-translate-y-1",
        "hover:shadow-(--shadow-1) focus-ring",
        className,
      )}
    >
      <span className="text-strong text-ink">{brand.name}</span>
      {withDescription ? (
        <span className="text-caption text-secondary">
          {brand.description}
        </span>
      ) : null}
    </Link>
  );
}

/** The monochrome logo row on the home page (DS-PG-HOME item 7). */
export function BrandRow({
  brands,
  className,
}: {
  brands: Brand[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-hairline-soft",
        "sm:grid-cols-4 lg:grid-cols-8",
        className,
      )}
    >
      {brands.map((brand) => (
        <li key={brand.slug} className="bg-canvas">
          <Link
            href={`/brand/${brand.slug}`}
            className={cn(
              "flex h-20 items-center justify-center px-3 text-center",
              "text-sm font-semibold text-secondary transition-colors",
              "duration-[--motion-fast] ease-[--ease-standard]",
              "hover:bg-surface hover:text-ink focus-ring",
            )}
          >
            {brand.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
