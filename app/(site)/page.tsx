import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { CategoryTile, BrandRow } from "@/components/commerce/Tiles";
import { Hero } from "@/components/blocks/Hero";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { ProductShelf, ShelfHeader } from "@/components/blocks/ProductShelf";
import { FeatureBanner, ServiceBand } from "@/components/blocks/FeatureBanner";
import {
  brands,
  categories,
  featuredBrands,
  homeCategoryTiles,
} from "@/data/catalog";
import {
  defaultVariant,
  getProduct,
  getProducts,
  shelves,
} from "@/data/products";
import { featureBanner } from "@/data/offers";

export const metadata: Metadata = {
  title: "Voltra — Premium gadgets in Bangladesh",
  description:
    "Phones, laptops, tablets, wearables, audio and gaming gear from an authorized reseller. 0% EMI up to 24 months, nationwide delivery and store pickup.",
  alternates: { canonical: "/" },
};

/**
 * Home (DS-PG-HOME).
 *
 * Sections in the order of Design SRS §4.2: hero, trust strip, category tiles,
 * the three headline shelves, one feature banner, three category shelves, the
 * brand row, and the store and service band. The newsletter lives in the
 * footer.
 *
 * Six shelves is the ceiling, and exactly one promotional banner is visible
 * (§4.2 Rules), which is why the campaign band appears once, in the middle.
 */
export default function HomePage() {
  /* The hero features one product, so its colour comes from that product
     rather than being written into the page. */
  const featured = getProduct("samsung-galaxy-s26-ultra");

  const tiles = homeCategoryTiles
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c) => c !== undefined);

  const brandRow = featuredBrands
    .map((slug) => brands.find((b) => b.slug === slug))
    .filter((b) => b !== undefined);

  return (
    <>
      {/* The hero carries the page's h1. */}
      <Hero
        badge="New"
        eyebrow="Available for pre-order"
        headline="Pro camera. All-day battery."
        subhead="From ৳ 1,74,999 or ৳ 14,583/month at 0% EMI."
        primary={{ label: "Pre-order now", href: "/product/samsung-galaxy-s26-ultra" }}
        secondary={{ label: "Learn more", href: "/category/phones" }}
        shape="phone"
        tint={featured ? defaultVariant(featured).colorHex : undefined}
      />

      <Container>
        <Section>
          <TrustStrip />
        </Section>

        <Section aria-labelledby="categories-heading">
          <ShelfHeader
            id="categories-heading"
            title="Shop by category"
            href="/brand"
          />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {tiles.map((category, index) => (
              <li key={category.slug}>
                <CategoryTile category={category} priority={index < 4} />
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <ProductShelf
            title="Exclusive"
            products={getProducts(shelves.exclusive)}
            href="/offers"
          />
        </Section>

        <Section>
          <ProductShelf
            title="Top selling"
            products={getProducts(shelves.topSelling)}
            href="/category/phones"
          />
        </Section>

        <Section>
          <ProductShelf
            title="New arrival"
            products={getProducts(shelves.newArrival)}
            href="/offers"
          />
        </Section>

        <Section>
          <FeatureBanner {...featureBanner} />
        </Section>

        <Section>
          <ProductShelf
            title="Gaming"
            products={getProducts(shelves.gaming)}
            href="/category/gaming"
          />
        </Section>

        <Section>
          <ProductShelf
            title="Audio"
            products={getProducts(shelves.audio)}
            href="/category/audio"
          />
        </Section>

        <Section>
          <ProductShelf
            title="Cases and protectors"
            products={getProducts(shelves.cases)}
            href="/category/accessories"
          />
        </Section>

        <Section aria-labelledby="brands-heading">
          <ShelfHeader id="brands-heading" title="Brands" href="/brand" />
          <BrandRow brands={brandRow} />
        </Section>

        <Section>
          <ServiceBand />
        </Section>
      </Container>
    </>
  );
}
