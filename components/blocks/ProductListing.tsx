"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup } from "@/components/ui/Choice";
import { Chip } from "@/components/ui/Chip";
import { Accordion } from "@/components/ui/Accordion";
import { Drawer } from "@/components/feedback/Overlay";
import { EmptyState } from "@/components/feedback/States";
import { ProductCard, ProductGrid } from "@/components/commerce/ProductCard";
import { brands as allBrands } from "@/data/catalog";
import { isOnSale, isOutOfStock, lowestPrice } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Filtered product listing (DS-PG-CAT, DS-CMP-FILTER).
 *
 * Filter and sort state lives in the URL, so results can be shared and the
 * back button works (DS-PG-CAT). 24 items a page with a "Load more" button
 * rather than infinite scroll, so the footer stays reachable (FR-CAT-05).
 *
 * Desktop puts the filters in a 280px left rail; mobile uses a bottom-sheet
 * drawer with a sticky Apply button showing the result count.
 */

const PAGE_SIZE = 24;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
] as const;

const priceBands = [
  { value: "0-20000", label: "Under ৳ 20,000", min: 0, max: 20000 },
  { value: "20000-50000", label: "৳ 20,000 – ৳ 50,000", min: 20000, max: 50000 },
  { value: "50000-100000", label: "৳ 50,000 – ৳ 1,00,000", min: 50000, max: 100000 },
  { value: "100000-", label: "Over ৳ 1,00,000", min: 100000, max: Infinity },
] as const;

const availabilityOptions = [
  { value: "in-stock", label: "In stock" },
  { value: "pre-order", label: "Pre-order" },
  { value: "on-sale", label: "On sale" },
] as const;

export function ProductListing({
  products,
  /** Shown when nothing matches, above the Clear filters action. */
  emptyBody = "Try removing a filter, or browse another category.",
  /** Hides the brand group on a brand page, where it would be pointless. */
  showBrandFilter = true,
  className,
}: {
  products: Product[];
  emptyBody?: string;
  showBrandFilter?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);

  const selectedBrands = params.getAll("brand");
  const selectedPrice = params.getAll("price");
  const selectedAvailability = params.getAll("availability");
  const sort = params.get("sort") ?? "featured";

  /** Writes the next filter state into the URL. */
  function update(key: string, value: string, on: boolean) {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key).filter((v) => v !== value);
    next.delete(key);
    for (const v of current) next.append(key, v);
    if (on) next.append(key, value);

    setShown(PAGE_SIZE);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clearAll() {
    setShown(PAGE_SIZE);
    router.replace(pathname, { scroll: false });
  }

  /* Brands present in this result set, so the rail never offers a filter
     that would return nothing. */
  const brandFacets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    return [...counts.entries()]
      .map(([slug, count]) => ({
        slug,
        count,
        name: allBrands.find((b) => b.slug === slug)?.name ?? slug,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [products]);

  const filtered = useMemo(() => {
    let out = products;

    if (selectedBrands.length > 0) {
      out = out.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedPrice.length > 0) {
      const bands = priceBands.filter((b) => selectedPrice.includes(b.value));
      out = out.filter((p) => {
        const price = lowestPrice(p);
        return bands.some((b) => price >= b.min && price < b.max);
      });
    }

    if (selectedAvailability.length > 0) {
      out = out.filter((p) => {
        if (selectedAvailability.includes("in-stock") && !isOutOfStock(p)) {
          return true;
        }
        if (
          selectedAvailability.includes("pre-order") &&
          p.variants.some((v) => v.stock === "pre-order")
        ) {
          return true;
        }
        if (selectedAvailability.includes("on-sale") && isOnSale(p)) return true;
        return false;
      });
    }

    const sorted = [...out];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            Number(b.badge === "new" || b.badge === "pre-order") -
            Number(a.badge === "new" || a.badge === "pre-order"),
        );
        break;
      case "best-selling":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        /* Featured: rating first, which is the closest proxy we have. */
        sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  }, [products, selectedBrands, selectedPrice, selectedAvailability, sort]);

  const visible = filtered.slice(0, shown);
  const hasFilters =
    selectedBrands.length + selectedPrice.length + selectedAvailability.length >
    0;

  const filterGroups = (
    <div className="flex flex-col">
      <Accordion
        defaultOpen={["brand", "price", "availability"]}
        items={[
          ...(showBrandFilter && brandFacets.length > 1
            ? [
                {
                  id: "brand",
                  title: "Brand",
                  content: (
                    <ChoiceGroup legend="Brand">
                      {brandFacets.map((facet) => (
                        <Checkbox
                          key={facet.slug}
                          label={facet.name}
                          description={`${facet.count} products`}
                          checked={selectedBrands.includes(facet.slug)}
                          onChange={(event) =>
                            update("brand", facet.slug, event.target.checked)
                          }
                        />
                      ))}
                    </ChoiceGroup>
                  ),
                },
              ]
            : []),
          {
            id: "price",
            title: "Price range",
            content: (
              <ChoiceGroup legend="Price range">
                {priceBands.map((band) => (
                  <Checkbox
                    key={band.value}
                    label={band.label}
                    checked={selectedPrice.includes(band.value)}
                    onChange={(event) =>
                      update("price", band.value, event.target.checked)
                    }
                  />
                ))}
              </ChoiceGroup>
            ),
          },
          {
            id: "availability",
            title: "Availability",
            content: (
              <ChoiceGroup legend="Availability">
                {availabilityOptions.map((option) => (
                  <Checkbox
                    key={option.value}
                    label={option.label}
                    checked={selectedAvailability.includes(option.value)}
                    onChange={(event) =>
                      update("availability", option.value, event.target.checked)
                    }
                  />
                ))}
              </ChoiceGroup>
            ),
          },
        ]}
      />
    </div>
  );

  return (
    <div className={cn("flex gap-10", className)}>
      {/* Desktop: a 280px left rail. */}
      <aside
        aria-label="Filters"
        className="hidden w-[280px] shrink-0 lg:block"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-strong text-ink">Filters</h2>
          {hasFilters ? (
            <Button variant="tertiary" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          ) : null}
        </div>
        {filterGroups}
      </aside>

      <div className="min-w-0 flex-1">
        {/* Toolbar: filter button on mobile, active chips, sort. */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            iconLeading="sliders"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden"
          >
            Filter
          </Button>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {selectedBrands.map((slug) => (
              <Chip
                key={`brand-${slug}`}
                variant="removable"
                onRemove={() => update("brand", slug, false)}
              >
                {allBrands.find((b) => b.slug === slug)?.name ?? slug}
              </Chip>
            ))}
            {selectedPrice.map((value) => (
              <Chip
                key={`price-${value}`}
                variant="removable"
                onRemove={() => update("price", value, false)}
              >
                {priceBands.find((b) => b.value === value)?.label ?? value}
              </Chip>
            ))}
            {selectedAvailability.map((value) => (
              <Chip
                key={`avail-${value}`}
                variant="removable"
                onRemove={() => update("availability", value, false)}
              >
                {availabilityOptions.find((a) => a.value === value)?.label ??
                  value}
              </Chip>
            ))}
            {hasFilters ? (
              <Button variant="tertiary" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            ) : null}
          </div>

          <label className="ml-auto flex shrink-0 items-center gap-2 text-sm">
            <span className="text-secondary">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className={cn(
                "h-9 rounded-pill border border-hairline bg-canvas px-4",
                "pr-8 text-sm font-medium text-ink focus-ring",
              )}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No products match these filters"
            body={emptyBody}
            action={{ label: "Clear filters", href: pathname }}
          />
        ) : (
          <>
            <ProductGrid>
              {visible.map((product, index) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  showCompare
                  priority={index < 4}
                />
              ))}
            </ProductGrid>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p aria-live="polite" className="text-sm text-secondary tabular">
                Showing {visible.length} of {filtered.length}
              </p>
              {visible.length < filtered.length ? (
                <Button
                  variant="secondary"
                  onClick={() => setShown((n) => n + PAGE_SIZE)}
                >
                  Load more
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>

      {/* Mobile: the same groups in a bottom-sheet drawer. */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-3">
            {hasFilters ? (
              <Button variant="secondary" onClick={clearAll} className="shrink-0">
                Clear all
              </Button>
            ) : null}
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        }
      >
        {filterGroups}
      </Drawer>
    </div>
  );
}

/** Subcategory chips above the toolbar (DS-PG-CAT item 2). */
export function SubcategoryChips({
  items,
  activeSlug,
  className,
}: {
  items: { slug: string; name: string }[];
  activeSlug?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Subcategories" className={className}>
      <ul className="scroll-shelf flex gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <a
              href={`/category/${item.slug}`}
              aria-current={item.slug === activeSlug ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-pill border px-4",
                "text-sm font-medium whitespace-nowrap focus-ring",
                item.slug === activeSlug
                  ? "border-ink bg-ink text-on-inverse"
                  : "border-hairline bg-canvas text-ink hover:bg-surface",
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

