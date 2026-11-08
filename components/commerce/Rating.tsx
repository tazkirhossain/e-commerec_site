import { Icon } from "@/components/ui/Icon";
import { formatRating, formatReviewCount, formatReviewCountShort } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Rating (DS-CMP-RATING).
 *
 * Stars render in primary ink rather than gold — a deliberate choice carried
 * over from DESIGN-airbnb. Hidden entirely when there are no reviews.
 *
 * - `compact` — one star, value, "(212)". Used on cards.
 * - `full` — five stars, value, "212 reviews". Used in the buy box.
 * - `display` — the large summary figure on the reviews section.
 */

export type RatingSize = "compact" | "full" | "display";

export function Rating({
  value,
  count,
  size = "compact",
  className,
}: {
  value: number;
  count: number;
  size?: RatingSize;
  className?: string;
}) {
  /* No reviews, no component (DS-CMP-RATING). */
  if (count === 0) return null;

  const accessibleName = `Rated ${formatRating(value)} out of 5 from ${formatReviewCount(count)}`;

  if (size === "display") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <p className="text-rating text-ink tabular" aria-hidden="true">
          {formatRating(value)}
        </p>
        <Stars value={value} size={16} />
        <p className="text-sm text-secondary">{formatReviewCount(count)}</p>
        <span className="sr-only">{accessibleName}</span>
      </div>
    );
  }

  return (
    <p className={cn("flex items-center gap-1.5 text-sm", className)}>
      {size === "full" ? (
        <Stars value={value} size={14} />
      ) : (
        <Icon name="star" size={14} filled className="text-ink" />
      )}
      <span className="font-medium text-ink tabular" aria-hidden="true">
        {formatRating(value)}
      </span>
      <span className="text-secondary" aria-hidden="true">
        {size === "full"
          ? formatReviewCount(count)
          : formatReviewCountShort(count)}
      </span>
      <span className="sr-only">{accessibleName}</span>
    </p>
  );
}

/** Five stars, filled up to the rating. Decorative — the text carries it. */
export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: 14 | 16 | 20;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={size}
          filled={star <= Math.round(value)}
          strokeWidth={star <= Math.round(value) ? 0 : 1.5}
          className={star <= Math.round(value) ? "text-ink" : "text-hairline"}
        />
      ))}
    </span>
  );
}

/**
 * Rating histogram (FR-REV-03): one bar per star level, used in the reviews
 * summary beside the display figure.
 */
export function RatingHistogram({
  breakdown,
  total,
  className,
}: {
  /** Counts for 5 stars down to 1. */
  breakdown: readonly [number, number, number, number, number];
  total: number;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {breakdown.map((count, index) => {
        const stars = 5 - index;
        const share = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <li key={stars} className="flex items-center gap-3 text-sm">
            <span className="w-3 text-right text-secondary tabular">
              {stars}
            </span>
            <Icon name="star" size={14} filled className="text-ink" />
            <span
              className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-strong"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-pill bg-ink"
                style={{ width: `${share}%` }}
              />
            </span>
            <span className="w-10 text-right text-secondary tabular">
              {count}
            </span>
            <span className="sr-only">
              {stars} star: {count} reviews, {share} percent
            </span>
          </li>
        );
      })}
    </ul>
  );
}
