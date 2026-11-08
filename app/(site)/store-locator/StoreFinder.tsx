"use client";

import { useMemo, useState } from "react";
import type { Store } from "@/data/types";
import { isStoreOpen } from "@/data/stores";
import { useNow } from "@/lib/client-store";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Choice";
import { StoreCard } from "@/components/blocks/Tiles";
import { EmptyState } from "@/components/feedback/States";
import { cn } from "@/lib/cn";

/**
 * The store list, filters and map (DS-PG-STORES, FR-STO-02).
 *
 * A real map needs a Maps provider (IF-08), which is not wired up here, so
 * the map panel shows the stores plotted on a schematic rather than a fake
 * map image. Every card still links out to real directions.
 */
export function StoreFinder({
  stores,
  areas,
}: {
  stores: Store[];
  areas: string[];
}) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>();
  const [openOnly, setOpenOnly] = useState(false);
  const [selected, setSelected] = useState(stores[0]?.slug);

  /* Null until after hydration, so the first render matches the prerendered
     HTML; it then ticks every minute and the open-now filter follows. */
  const now = useNow();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return stores.filter((store) => {
      if (area && store.area !== area) return false;
      if (
        q &&
        !`${store.name} ${store.address} ${store.area}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      /* Before the clock resolves, show everything rather than guess. */
      if (openOnly && now && !isStoreOpen(store, now)) return false;
      return true;
    });
  }, [stores, query, area, openOnly, now]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Search by area"
          type="search"
          placeholder="Gulshan, Dhanmondi, Chattogram…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-md"
          adornment={<Icon name="search" size={18} className="text-secondary" />}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Chip
            variant={area === undefined ? "selected" : "default"}
            onClick={() => setArea(undefined)}
          >
            All areas
          </Chip>
          {areas.map((name) => (
            <Chip
              key={name}
              variant={area === name ? "selected" : "default"}
              onClick={() => setArea(area === name ? undefined : name)}
            >
              {name}
            </Chip>
          ))}
        </div>

        <div className="max-w-xs">
          <Switch
            checked={openOnly}
            onChange={(event) => setOpenOnly(event.target.checked)}
            label="Open now"
            description="Hide stores that are currently closed"
          />
        </div>
      </div>

      {/* Map above the list on mobile, beside it from desktop. */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="order-1 lg:order-2 lg:sticky lg:top-28">
          <StoreMap
            stores={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        <div className="order-2 lg:order-1">
          {filtered.length === 0 ? (
            <EmptyState
              icon="map-pin"
              title="No stores match"
              body="Try another area, or clear the search."
            />
          ) : (
            <ul className="flex flex-col gap-5">
              {filtered.map((store) => (
                <li key={store.slug}>
                  <StoreCard
                    store={store}
                    className={cn(
                      selected === store.slug && "ring-2 ring-ink",
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A schematic map. Positions are derived from the store's own coordinates in
 * the real system (FR-STO-01); here they are spread deterministically so the
 * panel reads as a map without pretending to be one.
 */
function StoreMap({
  stores,
  selected,
  onSelect,
}: {
  stores: Store[];
  selected?: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-hairline bg-surface">
      <div className="relative aspect-[4/3] w-full">
        {/* Grid, to read as a map rather than an empty plate. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full text-hairline"
          viewBox="0 0 400 300"
        >
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="300"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 50}
              x2="400"
              y2={i * 50}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>

        <ul>
          {stores.map((store, index) => {
            /* Deterministic spread, stable across renders. */
            const x = 14 + ((index * 37) % 72);
            const y = 16 + ((index * 53) % 68);
            const isSelected = store.slug === selected;

            return (
              <li
                key={store.slug}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(store.slug)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex -translate-x-1/2 -translate-y-full items-center gap-1.5",
                    "rounded-pill px-2.5 py-1.5 text-caption font-medium",
                    "shadow-(--shadow-1) focus-ring",
                    isSelected
                      ? "bg-accent text-on-accent"
                      : "bg-canvas text-ink hover:bg-surface-strong",
                  )}
                >
                  <Icon name="map-pin" size={14} />
                  {store.name.replace(" store", "")}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="border-t border-hairline bg-canvas px-4 py-3 text-caption text-secondary">
        Schematic view. Use Directions on a store card for turn-by-turn
        navigation.
      </p>
    </div>
  );
}
