"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ProductImage, glyphFor } from "@/components/commerce/ProductImage";
import { categories } from "@/data/catalog";
import {
  defaultVariant,
  lowestPrice,
  primaryPhoto,
  products,
  trendingSearches,
} from "@/data/products";
import { formatTaka } from "@/lib/format";
import { createPersistedStore, usePersisted } from "@/lib/client-store";
import { cn } from "@/lib/cn";

/**
 * Search (DS-CMP-SEARCH).
 *
 * A pill input that becomes a suggestion panel. Before typing it shows recent
 * searches, kept on the device (FR-SRC-05), and trending terms. After two
 * characters it shows up to 6 product suggestions with thumbnail, name and
 * price, and up to 4 category suggestions (FR-SRC-04). Enter opens the results
 * page.
 *
 * Implemented as a combobox following the WAI-ARIA pattern (DS-A11Y-06): arrow
 * keys move through the options, Enter activates, Escape closes.
 */

const RECENT_KEY = "voltra.recent-searches";
const MAX_RECENT = 5;
const MAX_PRODUCTS = 6;
const MAX_CATEGORIES = 4;

interface Suggestion {
  kind: "product" | "category" | "term";
  label: string;
  href: string;
  /** Product suggestions carry a thumbnail and a price. */
  slug?: string;
  categorySlug?: string;
  tint?: string;
  photo?: string;
  price?: number;
}

/* Recent searches are kept on the device (FR-SRC-05). */
const recentStore = createPersistedStore<string[]>(RECENT_KEY, []);

function pushRecent(term: string) {
  const current = recentStore.get();
  recentStore.set(
    [term, ...current.filter((t) => t !== term)].slice(0, MAX_RECENT),
  );
}

/**
 * Matches name, brand, category and key spec, and tolerates a missing or extra
 * character so "iphon" and "iphonne" both find the iPhone (FR-SRC-01).
 */
function search(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored = products
    .map((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.keySpec,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (haystack.includes(q)) score = 3;
      else if (product.name.toLowerCase().startsWith(q)) score = 4;
      /* One-character tolerance: drop each character of the query in turn. */
      else if (
        q.length >= 4 &&
        [...q].some((_, i) => haystack.includes(q.slice(0, i) + q.slice(i + 1)))
      ) {
        score = 1;
      }

      return { product, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, MAX_PRODUCTS);

  const productSuggestions: Suggestion[] = scored.map(({ product }) => ({
    kind: "product",
    label: product.name,
    href: `/product/${product.slug}`,
    slug: product.slug,
    categorySlug: product.category,
    tint: defaultVariant(product).colorHex,
    photo: primaryPhoto(product),
    price: lowestPrice(product),
  }));

  const categorySuggestions: Suggestion[] = categories
    .filter((c) => c.name.toLowerCase().includes(q))
    .slice(0, MAX_CATEGORIES)
    .map((c) => ({
      kind: "category",
      label: c.name,
      href: `/category/${c.slug}`,
    }));

  return [...productSuggestions, ...categorySuggestions];
}

export function SearchBar({
  /** `compact` is the header pill; `full` is the mobile overlay field. */
  size = "compact",
  autoFocus = false,
  onNavigate,
  className,
}: {
  size?: "compact" | "full";
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const recent = usePersisted(recentStore);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* Close when focus or the pointer leaves the whole combobox. */
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const results = useMemo(() => search(query), [query]);

  const terms: Suggestion[] =
    query.trim().length < 2
      ? [
          ...recent.map<Suggestion>((term) => ({
            kind: "term",
            label: term,
            href: `/search?q=${encodeURIComponent(term)}`,
          })),
          ...trendingSearches
            .filter((t) => !recent.includes(t))
            .map<Suggestion>((term) => ({
              kind: "term",
              label: term,
              href: `/search?q=${encodeURIComponent(term)}`,
            })),
        ]
      : [];

  const options = query.trim().length >= 2 ? results : terms;

  function go(href: string, term?: string) {
    if (term) pushRecent(term);
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  }

  function submit() {
    const term = query.trim();
    if (!term) return;
    go(`/search?q=${encodeURIComponent(term)}`, term);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % Math.max(1, options.length));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + options.length) % Math.max(1, options.length));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = options[active];
      if (option) {
        go(option.href, option.kind === "term" ? option.label : undefined);
      } else {
        submit();
      }
    }
  }

  const showPanel = open && options.length > 0;

  return (
    /* ARIA 1.2 puts the combobox role on the input itself, not a wrapper. */
    <div ref={wrapperRef} className={cn("relative flex-1", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className={cn(
          "flex items-center gap-2 rounded-pill bg-canvas pr-1.5 pl-6",
          size === "compact" ? "h-12 shadow-(--shadow-1)" : "h-14 border border-hairline",
        )}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={
            active >= 0 ? `${listId}-option-${active}` : undefined
          }
          className={cn(
            "min-w-0 flex-1 bg-transparent text-base text-ink outline-none",
            "placeholder:text-secondary",
            /* Hide the browser's own clear button; we have Escape and the orb. */
            "[&::-webkit-search-cancel-button]:hidden",
          )}
        />
        <button
          type="submit"
          aria-label="Search"
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-pill",
            "bg-accent text-on-accent hover:bg-accent-hover focus-ring",
            size === "compact" ? "size-9" : "size-11",
          )}
        >
          <Icon name="search" size={size === "compact" ? 18 : 20} strokeWidth={2.5} />
        </button>
      </form>

      {showPanel ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full z-dropdown mt-2 overflow-hidden",
            "rounded-md border border-hairline bg-canvas py-2",
            "shadow-(--shadow-2) animate-fade-in",
          )}
        >
          <ul id={listId} role="listbox" aria-label="Search suggestions">
            {options.map((option, index) => (
              <li key={`${option.kind}-${option.label}`} role="presentation">
                <Link
                  href={option.href}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    if (option.kind === "term") pushRecent(option.label);
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={cn(
                    "flex min-h-11 items-center gap-3 px-4 py-2 text-sm",
                    index === active ? "bg-surface" : "bg-canvas",
                  )}
                >
                  {option.kind === "product" ? (
                    <>
                      <ProductImage
                        src={option.photo}
                        alt=""
                        shape={glyphFor(option.categorySlug ?? "", option.slug)}
                        tint={option.tint}
                        sizes="40px"
                        className="w-10 shrink-0"
                      />
                      <span className="min-w-0 flex-1 truncate text-ink">
                        {option.label}
                      </span>
                      <span className="shrink-0 font-semibold text-ink tabular">
                        {formatTaka(option.price ?? 0)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon
                        name={option.kind === "category" ? "list" : "search"}
                        size={16}
                        className="text-secondary"
                      />
                      <span className="min-w-0 flex-1 truncate text-ink">
                        {option.label}
                      </span>
                      {option.kind === "category" ? (
                        <span className="shrink-0 text-caption text-secondary">
                          Category
                        </span>
                      ) : null}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {query.trim().length >= 2 ? (
            <div className="border-t border-hairline-soft px-4 pt-2">
              <button
                type="button"
                onClick={submit}
                className="min-h-11 text-sm font-medium text-ink underline underline-offset-4 focus-ring"
              >
                See all results for &ldquo;{query.trim()}&rdquo;
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
