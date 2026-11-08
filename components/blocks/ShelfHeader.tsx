import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Shelf header (DS-CMP-SHELF): the section title with a "Show all" link at the
 * right. `children` fills the slot beside that link — the shelf scroller puts
 * its arrow buttons there.
 */
export function ShelfHeader({
  title,
  href,
  /** Links the heading to its section for assistive tech. */
  id,
  description,
  children,
  className,
}: {
  title: string;
  href?: string;
  id?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-title text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {href ? (
          <Link
            href={href}
            className={cn(
              "flex items-center gap-1 rounded-xs text-sm font-medium",
              "text-ink hover:underline focus-ring",
            )}
          >
            Show all
            <Icon name="chevron-right" size={16} />
          </Link>
        ) : null}
        {children}
      </div>
    </div>
  );
}
