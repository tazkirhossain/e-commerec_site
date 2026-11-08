"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/Container";
import { Accordion, SpecRows } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BuyBox } from "@/components/commerce/BuyBox";
import { Reviews } from "@/components/commerce/Reviews";
import { ProductShelf } from "@/components/blocks/ProductShelf";
import { EmiCalculator } from "@/components/blocks/EmiCalculator";
import { Banner } from "@/components/feedback/Banner";
import { Icon } from "@/components/ui/Icon";
import { getCategory } from "@/data/catalog";
import {
  defaultVariant,
  getProduct,
  getProducts,
  lowestPrice,
  products,
  productsByCategory,
} from "@/data/products";
import { formatPoints, formatTaka } from "@/lib/format";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  "use cache";
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.name} — ${product.keySpec}. ${formatTaka(lowestPrice(product))} at Voltra, with official warranty and 0% EMI.`,
    alternates: { canonical: `/product/${product.slug}` },
  };
}

/**
 * Product detail (DS-PG-PDP).
 *
 * Gallery and buy box first, then offers and finance, highlights, the
 * specification accordion, reviews, and the two related shelves. Add to cart
 * opens the mini cart rather than navigating (DS-UX-02).
 *
 * The page is cached and its params are prerendered, so the whole thing is
 * static HTML; only the cart and variant state are client-side.
 */
export default async function ProductPage(
  props: PageProps<"/product/[slug]">,
) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const variant = defaultVariant(product);
  const price = variant.salePrice ?? variant.price;

  const accessories = getProducts(product.accessories ?? []);
  const alsoLike = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 6);

  /* Product structured data (FR-CAT-11). */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BDT",
      lowPrice: lowestPrice(product),
      availability:
        variant.stock === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : variant.stock === "pre-order"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
    },
  };

  return (
    <Container className="py-5 lg:py-8">
      <script
        type="application/ld+json"
        // Static, generated from our own data — no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
        className="mb-6"
      />

      <BuyBox product={product} />

      <Section aria-labelledby="finance-heading">
        <h2 id="finance-heading" className="text-title text-ink">
          Offers and finance
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <EmiCalculator amount={price} />

          <div className="flex flex-col gap-4">
            <Banner
              tone="info"
              message="Extra ৳ 3,000 on any exchange valuation until 30 Nov."
              action={{ label: "Check your device", href: "/pages/exchange" }}
            />
            <div className="rounded-md border border-hairline bg-canvas p-5">
              <h3 className="flex items-center gap-2 text-strong text-ink">
                <Icon name="repeat" size={18} className="text-secondary" />
                Exchange estimate
              </h3>
              <p className="mt-1.5 text-sm text-secondary">
                Trade in a working phone, tablet or laptop and the valuation
                comes off this price at checkout.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-hairline bg-canvas p-5">
              <h3 className="flex items-center gap-2 text-strong text-ink">
                <Icon name="award" size={18} className="text-secondary" />
                Reward points
              </h3>
              <p className="mt-1.5 text-sm text-secondary">
                {product.rewardPoints
                  ? `Earn ${formatPoints(product.rewardPoints)} when this order is delivered, worth about ${formatTaka(product.rewardPoints)} off a later order.`
                  : "Earn points on every delivered order."}
              </p>
            </div>
            <div className="rounded-md border border-hairline bg-canvas p-5">
              <h3 className="flex items-center gap-2 text-strong text-ink">
                <Icon name="map-pin" size={18} className="text-secondary" />
                Store pickup
              </h3>
              <p className="mt-1.5 text-sm text-secondary">
                {product.stockedAt?.length
                  ? `Ready for pickup at ${product.stockedAt.length} stores, usually within two hours.`
                  : "Available for home delivery nationwide."}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="highlights-heading">
        <h2 id="highlights-heading" className="text-title text-ink">
          Highlights
        </h2>
        <ul className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {product.highlights.map((highlight) => (
            <li key={highlight.label}>
              <p className="text-sm font-medium text-accent">
                {highlight.label}
              </p>
              <p className="mt-1 text-subtitle text-balance text-ink">
                {highlight.headline}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="specs-heading">
        <h2 id="specs-heading" className="text-title text-ink">
          Specifications
        </h2>
        <Accordion
          className="mt-4 max-w-3xl"
          defaultOpen={[product.specs[0]?.name ?? ""]}
          items={product.specs.map((group) => ({
            id: group.name,
            title: group.name,
            content: <SpecRows rows={group.rows} />,
          }))}
        />
      </Section>

      <Section aria-labelledby="description-heading">
        <h2 id="description-heading" className="text-title text-ink">
          About this product
        </h2>
        {/* Capped at a 680px measure for readability (DS-PG-PDP). */}
        <p className="mt-4 max-w-[680px] text-lg text-body">
          {product.description}
        </p>
      </Section>

      <Section>
        <Reviews product={product} />
      </Section>

      {accessories.length > 0 ? (
        <Section>
          <ProductShelf
            title="Accessories for this device"
            products={accessories}
            href="/category/accessories"
          />
        </Section>
      ) : null}

      {alsoLike.length > 0 ? (
        <Section>
          <ProductShelf
            title="You may also like"
            products={alsoLike}
            href={category ? `/category/${category.slug}` : "/"}
          />
        </Section>
      ) : null}

      {/* Clears the fixed mobile buy bar at the bottom of the page. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </Container>
  );
}
