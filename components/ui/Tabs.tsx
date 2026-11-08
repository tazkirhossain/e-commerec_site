"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Underline tabs for content switching (DS-CMP-TABS), following the WAI-ARIA
 * tabs pattern (DS-A11Y-06): one tab in the tab order, arrow keys move between
 * them, Home and End jump to the ends.
 */

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  items,
  label,
  defaultTab,
  className,
}: {
  items: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  defaultTab?: string;
  className?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: React.KeyboardEvent) {
    const index = items.findIndex((i) => i.id === active);
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;

    event.preventDefault();
    const id = items[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-6 overflow-x-auto border-b border-hairline"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative -mb-px shrink-0 border-b-2 pb-3 text-base",
                "whitespace-nowrap transition-colors duration-[--motion-fast]",
                "ease-[--ease-standard] focus-ring",
                isActive
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent font-medium text-secondary hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-6 focus-ring"
        >
          {item.id === active ? item.content : null}
        </div>
      ))}
    </div>
  );
}
