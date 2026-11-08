"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Switch } from "@/components/ui/Choice";
import { Price } from "@/components/commerce/Price";
import { Rating } from "@/components/commerce/Rating";
import { StockStatus } from "@/components/commerce/Status";
import {
  ProductImage,
  glyphFor,
} from "@/components/commerce/ProductImage";
import { EmptyState, SkeletonRegion } from "@/components/feedback/States";
import { defaultVariant, getProducts } from "@/data/products";
import { getBrand } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * The comparison table (DS-CMP-COMPARE).
 *
 * The first column is sticky and rows where the products differ can be
 * highlighted, which is the quickest way to read a spec sheet. Rows are built
 * from the union of every product's spec labels, so a spec one product does
 * not publish shows as "—" rather than silently dropping the row.
 */
export function CompareTable() {
  const { compare, toggleCompare, clearCompare, compareLimit, addToCart, hydrated } =
    useStore();
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const products = useMemo(() => getProducts(compare), [compare]);

  /* The union of spec labels across the selected products, in first-seen
     order, so the table reads in the order the specs are published. */
  const rows = useMemo(() => {
    const labels: string[] = [];
    for (const product of products) {
      for (const group of product.specs) {
        for (const row of group.rows) {
          const key = `${group.name} · ${row.label}`;
          if (!labels.includes(key)) labels.push(key);
        }
      }
    }

    return labels.map((key) => {
      const [groupName, label] = key.split(" · ");
      const values = products.map((product) => {
        const group = product.specs.find((g) => g.name === groupName);
        return group?.rows.find((r) => r.label === label)?.value ?? "—";
      });
      const differs = new Set(values).size > 1;
      return { key, groupName, label, values, differs };
    });
  }, [products]);

  const visibleRows = onlyDifferences ? rows.filter((r) => r.differs) : rows;

  if (!hydrated) {
    return (
      <SkeletonRegion label="Loading comparison">
        <div className="h-9 w-40 animate-shimmer rounded-sm" />
        <div className="mt-6 h-96 animate-shimmer rounded-md" />
      </SkeletonRegion>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <h1 className="type-display text-ink">Compare</h1>
        <EmptyState
          icon="scale"
          title="Nothing to compare yet"
          body={`Tap the compare icon on up to ${compareLimit} products and they will line up here.`}
          action={{ label: "Browse phones", href: "/category/phones" }}
          className="mt-6"
        />
      </>
    );
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-display text-ink">Compare</h1>
          <p className="mt-1 text-sm text-secondary">
            {products.length} of {compareLimit} products
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Switch
            checked={onlyDifferences}
            onChange={(event) => setOnlyDifferences(event.target.checked)}
            label="Highlight differences"
          />
          <Button variant="tertiary" size="sm" onClick={clearCompare}>
            Clear all
          </Button>
        </div>
      </header>

      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Specifications for {products.map((p) => p.name).join(", ")}
          </caption>

          <thead>
            <tr>
              {/* The sticky label column. */}
              <th
                scope="col"
                className="sticky left-0 z-base w-36 bg-canvas pr-4 pb-6 text-left align-bottom sm:w-48"
              >
                <span className="sr-only">Specification</span>
              </th>

              {products.map((product) => {
                const variant = defaultVariant(product);
                const brand = getBrand(product.brand);

                return (
                  <th
                    key={product.slug}
                    scope="col"
                    className="w-56 min-w-56 px-3 pb-6 text-left align-top font-normal"
                  >
                    <div className="relative">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex flex-col gap-2 rounded-md focus-ring"
                      >
                        <ProductImage
                          alt={product.name}
                          shape={glyphFor(product.category, product.slug)}
                          tint={variant.colorHex}
                          sizes="224px"
                        />
                        {brand ? (
                          <span className="text-caption text-secondary">
                            {brand.name}
                          </span>
                        ) : null}
                        <span className="text-name text-ink">
                          {product.name}
                        </span>
                      </Link>

                      {/* Positioning lives on the wrapper — see IconButton. */}
                      <span className="absolute top-3 right-3">
                        <IconButton
                          icon="x"
                          label={`Remove ${product.name} from compare`}
                          styleVariant="on-photo"
                          onClick={() => toggleCompare(product.slug)}
                        />
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <Rating
                        value={product.rating}
                        count={product.reviewCount}
                      />
                      <Price
                        price={variant.price}
                        salePrice={variant.salePrice}
                        outOfStock={variant.stock === "out-of-stock"}
                      />
                      <StockStatus
                        state={variant.stock}
                        available={variant.available}
                      />
                      <Button
                        size="md"
                        fullWidth
                        disabled={variant.stock === "out-of-stock"}
                        onClick={() => addToCart(product.slug, variant.sku)}
                      >
                        Add to cart
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.key}
                className={cn(
                  "border-t border-hairline",
                  /* Differing rows get a quiet tint, not a loud one. */
                  onlyDifferences && row.differs && "bg-surface",
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-base py-3 pr-4 text-left align-top",
                    "font-normal text-secondary",
                    onlyDifferences && row.differs ? "bg-surface" : "bg-canvas",
                  )}
                >
                  {row.label}
                  <span className="block text-caption text-disabled">
                    {row.groupName}
                  </span>
                </th>

                {row.values.map((value, index) => (
                  <td
                    key={`${row.key}-${index}`}
                    className={cn(
                      "px-3 py-3 align-top text-ink",
                      row.differs && "font-medium",
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows.length === 0 ? (
        <p className="mt-6 text-base text-secondary">
          These products match on every published specification.
        </p>
      ) : null}
    </>
  );
}
