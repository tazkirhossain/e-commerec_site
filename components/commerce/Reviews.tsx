import type { Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import { Rating, RatingHistogram, Stars } from "./Rating";

/**
 * Reviews and Q&A (DS-PG-PDP "Reviews and Q and A").
 *
 * Summary bars at the left, the list at the right on desktop. Reviews from
 * buyers carry a verified-purchase mark (FR-REV-01).
 */
export function Reviews({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];

  if (product.reviewCount === 0) {
    return (
      <section aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-title text-ink">
          Reviews
        </h2>
        <p className="mt-3 text-base text-secondary">
          No reviews yet. Buy this product and you can be the first.
        </p>
      </section>
    );
  }

  const breakdown =
    product.ratingBreakdown ??
    ([
      Math.round(product.reviewCount * 0.72),
      Math.round(product.reviewCount * 0.18),
      Math.round(product.reviewCount * 0.06),
      Math.round(product.reviewCount * 0.02),
      Math.round(product.reviewCount * 0.02),
    ] as [number, number, number, number, number]);

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-title text-ink">
        Reviews and questions
      </h2>

      <div className="mt-6 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Rating
            value={product.rating}
            count={product.reviewCount}
            size="display"
          />
          <RatingHistogram
            breakdown={breakdown}
            total={product.reviewCount}
          />
          <Button variant="secondary" size="md" className="self-start">
            Write a review
          </Button>
          <p className="text-caption text-secondary">
            Only verified purchasers can review a product.
          </p>
        </div>

        <ul className="flex flex-col divide-y divide-hairline">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review.id} className="flex flex-col gap-2 py-6 first:pt-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-ink">
                    {review.author}
                  </span>
                  {review.verified ? (
                    <span className="flex items-center gap-1 text-caption text-success">
                      <Icon name="check-circle" size={14} />
                      Verified purchase
                    </span>
                  ) : null}
                  <span className="text-caption text-secondary">
                    {formatDate(review.date)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Stars value={review.rating} size={14} />
                  <span className="sr-only">
                    Rated {review.rating} out of 5
                  </span>
                  <h3 className="text-name text-ink">{review.title}</h3>
                </div>

                <p className="max-w-prose text-base text-body">{review.body}</p>
              </li>
            ))
          ) : (
            <li className="py-6 text-base text-secondary">
              This product has {product.reviewCount} ratings but no written
              reviews yet.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
