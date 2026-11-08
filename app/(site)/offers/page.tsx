import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { ProductShelf } from "@/components/blocks/ProductShelf";
import { Countdown } from "./Countdown";
import { offers } from "@/data/offers";
import { getProducts } from "@/data/products";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Active campaigns at Voltra — launch-week pricing, exchange bonuses and 0% EMI on phones, laptops and audio.",
  alternates: { canonical: "/offers" },
};

/**
 * Offers and campaigns (DS-PG-OFFERS).
 *
 * Campaign banners at the top, then the products in each campaign. Time-
 * limited deals carry a countdown in the sub-section size (FR-PRM-01).
 */
export default function OffersPage() {
  const timed = offers.filter((offer) => offer.endsAt);

  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Offers" }]}
        className="mb-6"
      />

      <header className="mb-8">
        <h1 className="type-display text-ink">Offers</h1>
        <p className="mt-1 max-w-prose text-base text-secondary">
          {offers.length} campaigns running now. Prices shown already include
          the campaign discount.
        </p>
      </header>

      {/* Campaign banners. */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <li key={offer.slug}>
            <Link
              href={`/offers/${offer.slug}`}
              className={cn(
                "group flex h-full flex-col gap-2 rounded-lg p-6",
                "transition-shadow duration-[--motion-fast] focus-ring",
                "hover:shadow-(--shadow-1)",
                offer.tone === "accent"
                  ? "bg-accent text-on-accent"
                  : "bg-surface text-ink",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  offer.tone === "accent" ? "text-on-accent/80" : "text-accent",
                )}
              >
                {offer.headline}
              </span>
              <h2 className="text-subtitle">{offer.title}</h2>
              <p
                className={cn(
                  "text-sm",
                  offer.tone === "accent"
                    ? "text-on-accent/85"
                    : "text-secondary",
                )}
              >
                {offer.blurb}
              </p>

              {offer.endsAt ? (
                <Countdown
                  endsAt={offer.endsAt}
                  className={cn(
                    "mt-auto pt-3",
                    offer.tone === "accent" && "text-on-accent",
                  )}
                />
              ) : null}

              <span className="mt-2 flex items-center gap-1 text-sm font-medium">
                Shop this offer
                <Icon name="chevron-right" size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* The products in each campaign. */}
      {timed.map((offer) => (
        <Section key={offer.slug}>
          <ProductShelf
            title={offer.title}
            description={offer.blurb}
            products={getProducts(offer.products)}
            href={`/offers/${offer.slug}`}
          />
        </Section>
      ))}
    </Container>
  );
}
