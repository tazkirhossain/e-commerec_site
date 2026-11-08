"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductListing } from "@/components/blocks/ProductListing";
import { EmptyState } from "@/components/feedback/States";
import { ChipLink } from "@/components/ui/Chip";
import { products, trendingSearches } from "@/data/products";
import { categories } from "@/data/catalog";
import { formatItemCount } from "@/lib/format";

/**
 * The query-dependent half of the search page.
 *
 * Matches name, brand, category and key spec, and tolerates a dropped
 * character so a typo still finds the product (FR-SRC-01). When few results
 * come back it offers the closest term as a spelling suggestion (FR-SRC-06).
 */

const FEW_RESULTS = 3;

function score(product: (typeof products)[number], query: string): number {
  const q = query.toLowerCase();
  const name = product.name.toLowerCase();
  const haystack = [product.name, product.brand, product.category, product.keySpec]
    .join(" ")
    .toLowerCase();

  if (name.startsWith(q)) return 5;
  if (name.includes(q)) return 4;
  if (haystack.includes(q)) return 3;
  /* One-character tolerance: drop each character of the query in turn. */
  if (
    q.length >= 4 &&
    [...q].some((_, i) => haystack.includes(q.slice(0, i) + q.slice(i + 1)))
  ) {
    return 1;
  }
  return 0;
}

/** The catalogue term closest to the query, for the "did you mean" line. */
function suggest(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.length < 3) return undefined;

  const pool = [
    ...products.map((p) => p.name),
    ...categories.map((c) => c.name),
  ];

  let best: { term: string; shared: number } | undefined;
  for (const term of pool) {
    const lower = term.toLowerCase();
    /* Longest shared prefix is a cheap, predictable closeness measure. */
    let shared = 0;
    while (shared < q.length && lower[shared] === q[shared]) shared += 1;
    if (shared >= 3 && (!best || shared > best.shared)) {
      best = { term, shared };
    }
  }

  return best && best.term.toLowerCase() !== q ? best.term : undefined;
}

export function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  const results = useMemo(() => {
    if (!query) return [];
    return products
      .map((product) => ({ product, s: score(product, query) }))
      .filter((row) => row.s > 0)
      .sort((a, b) => b.s - a.s || b.product.rating - a.product.rating)
      .map((row) => row.product);
  }, [query]);

  const suggestion = useMemo(
    () => (results.length <= FEW_RESULTS ? suggest(query) : undefined),
    [query, results.length],
  );

  if (!query) {
    return (
      <>
        <h1 className="type-display text-ink">Search</h1>
        <p className="mt-1 text-base text-secondary">
          Search by product, brand or model.
        </p>

        <section aria-labelledby="trending-heading" className="mt-8">
          <h2 id="trending-heading" className="mb-3 text-strong text-ink">
            Trending searches
          </h2>
          <ul className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <li key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="inline-flex h-9 items-center rounded-pill border border-hairline bg-canvas px-4 text-sm font-medium text-ink hover:bg-surface focus-ring"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="type-display text-ink">
          Showing results for &ldquo;{query}&rdquo;
        </h1>
        <p className="mt-1 text-base text-secondary tabular">
          {formatItemCount(results.length)}
        </p>

        {suggestion ? (
          <p className="mt-3 text-base text-body">
            Did you mean{" "}
            <Link
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="font-medium text-ink underline underline-offset-4 focus-ring"
            >
              {suggestion}
            </Link>
            ?
          </p>
        ) : null}
      </header>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title={`Nothing matched "${query}"`}
          body="Check the spelling, or try a shorter search such as the brand name."
        >
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {trendingSearches.slice(0, 4).map((term) => (
              <li key={term}>
                <ChipLink href={`/search?q=${encodeURIComponent(term)}`}>
                  {term}
                </ChipLink>
              </li>
            ))}
          </ul>
        </EmptyState>
      ) : (
        <ProductListing
          products={results}
          emptyBody="Try removing a filter, or searching for something broader."
        />
      )}
    </>
  );
}
