"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Accordion (DS-CMP-ACC).
 *
 * Full-width rows with a 1px divider and a plus/minus at the right. One row
 * open at a time on mobile, which is what `single` does; the spec table on a
 * product page uses it. Built on buttons with `aria-expanded` rather than
 * `<details>`, so the single-open rule is enforceable (DS-A11Y-06).
 */

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  /** Shown to the right of the title, e.g. a count. */
  meta?: string;
}

export function Accordion({
  items,
  /** Only one row open at a time. */
  single = false,
  /** Ids open on first render. */
  defaultOpen = [],
  className,
}: {
  items: AccordionItem[];
  single?: boolean;
  defaultOpen?: string[];
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  function toggle(id: string) {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((i) => i !== id);
      return single ? [id] : [...current, id];
    });
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="border-b border-hairline">
            <h3>
              <button
                type="button"
                id={`${baseId}-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-region-${item.id}`}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between gap-4",
                  "py-5 text-left text-strong text-ink focus-ring",
                  "transition-colors duration-[--motion-fast]",
                  "ease-[--ease-standard] hover:text-body",
                )}
              >
                <span>{item.title}</span>
                <span className="flex items-center gap-3">
                  {item.meta ? (
                    <span className="text-sm font-normal text-secondary">
                      {item.meta}
                    </span>
                  ) : null}
                  <Icon name={isOpen ? "minus" : "plus"} size={18} />
                </span>
              </button>
            </h3>

            <div
              id={`${baseId}-region-${item.id}`}
              role="region"
              aria-labelledby={`${baseId}-trigger-${item.id}`}
              hidden={!isOpen}
              className="pb-5"
            >
              {isOpen ? item.content : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The specification table body used inside an accordion row: a two-column
 * label/value grid that collapses to stacked rows on small screens.
 */
export function SpecRows({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-y-2.5 text-sm sm:grid-cols-[160px_1fr]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="text-secondary">{row.label}</dt>
          <dd className="mb-2 text-ink sm:mb-0">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
