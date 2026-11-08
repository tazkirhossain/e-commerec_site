import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Breadcrumb (DS-CMP-CRUMB).
 *
 * Small secondary text with chevron separators; the last item is the current
 * page and is not a link. On mobile the trail collapses to a single "Back to
 * <parent>" link, which is what the wireframes show.
 */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  /** Home first, current page last. The last item needs no `href`. */
  items: Crumb[];
  className?: string;
}) {
  /* The deepest ancestor that still has a link is where "Back" should go. */
  const parent = [...items]
    .slice(0, -1)
    .reverse()
    .find((item) => item.href);

  return (
    <nav aria-label="Breadcrumb" className={className}>
      {/* Mobile: one link back up the tree. */}
      {parent ? (
        <Link
          href={parent.href!}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-xs text-sm",
            "text-ink hover:underline focus-ring sm:hidden",
          )}
        >
          <Icon name="chevron-left" size={16} />
          Back to {parent.label}
        </Link>
      ) : null}

      {/* Tablet and up: the full trail. */}
      <ol className="hidden flex-wrap items-center gap-1.5 text-sm text-secondary sm:flex">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <Icon
                  name="chevron-right"
                  size={14}
                  className="text-border-strong"
                />
              ) : null}

              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="rounded-xs hover:text-ink hover:underline focus-ring"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
