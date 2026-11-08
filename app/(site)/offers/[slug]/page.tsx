"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard, ProductGrid } from "@/components/commerce/ProductCard";
import { Countdown } from "../Countdown";
import { getOffer, offers } from "@/data/offers";
import { getProducts } from "@/data/products";
import { formatItemCount } from "@/lib/format";
import { cn } from "@/lib/cn";

export async function generateStaticParams() {
  return offers.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata(
  props: PageProps<"/offers/[slug]">,
): Promise<Metadata> {
  "use cache";
  const { slug } = await props.params;
  const offer = getOffer(slug);
  if (!offer) return { title: "Offer not found" };

  return {
    title: offer.title,
    description: offer.blurb,
    alternates: { canonical: `/offers/${offer.slug}` },
  };
}

/** A single campaign and the products in it (DS-PG-OFFERS, FR-PRM-03). */
export default async function OfferPage(props: PageProps<"/offers/[slug]">) {
  const { slug } = await props.params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  const items = getProducts(offer.products);

  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Offers", href: "/offers" },
          { label: offer.title },
        ]}
        className="mb-6"
      />

      <header
        className={cn(
          "mb-10 rounded-lg p-6 sm:p-10",
          offer.tone === "accent"
            ? "bg-accent text-on-accent"
            : "bg-surface text-ink",
        )}
      >
        <p
          className={cn(
            "text-sm font-medium",
            offer.tone === "accent" ? "text-on-accent/80" : "text-accent",
          )}
        >
          {offer.headline}
        </p>
        <h1 className="mt-2 type-display">{offer.title}</h1>
        <p
          className={cn(
            "mt-2 max-w-prose text-base",
            offer.tone === "accent" ? "text-on-accent/85" : "text-secondary",
          )}
        >
          {offer.blurb}
        </p>
        {offer.endsAt ? <Countdown endsAt={offer.endsAt} className="mt-4" /> : null}
      </header>

      <p className="mb-6 text-sm text-secondary tabular">
        {formatItemCount(items.length)} in this offer
      </p>

      <ProductGrid>
        {items.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            showCompare
            priority={index < 4}
          />
        ))}
      </ProductGrid>
    </Container>
  );
}
