import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BrandTile } from "@/components/commerce/Tiles";
import { brands } from "@/data/catalog";
import { AlphabetJump } from "./AlphabetJump";

export const metadata: Metadata = {
  title: "All brands",
  description:
    "Every brand Voltra carries, from Apple and Samsung to Anker and TP-Link, with official warranty on all of them.",
  alternates: { canonical: "/brand" },
};

/**
 * All brands index (DS-PG-BRAND).
 *
 * An alphabetical index of logo tiles with a sticky A–Z jump bar. Letters
 * with no brands are rendered disabled rather than omitted, so the bar does
 * not reflow as the catalogue grows.
 */
export default function BrandIndexPage() {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  /* Group by first letter, preserving alphabetical order. */
  const groups = new Map<string, typeof brands>();
  for (const brand of sorted) {
    const letter = brand.name[0].toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), brand]);
  }

  const letters = [...groups.keys()];

  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Brands" }]}
        className="mb-6"
      />

      <header className="mb-6">
        <h1 className="type-display text-ink">All brands</h1>
        <p className="mt-1 max-w-prose text-base text-secondary">
          Every brand we carry is an authorized line, with warranty honoured by
          the brand&rsquo;s own service centres in Bangladesh.
        </p>
      </header>

      <AlphabetJump available={letters} />

      <div className="mt-10 flex flex-col gap-12">
        {[...groups.entries()].map(([letter, items]) => (
          <section key={letter} id={`letter-${letter}`} aria-labelledby={`heading-${letter}`}>
            <h2
              id={`heading-${letter}`}
              className="mb-4 text-title text-ink"
            >
              {letter}
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((brand) => (
                <li key={brand.slug}>
                  <BrandTile brand={brand} withDescription />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
