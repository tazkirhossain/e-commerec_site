"use cache";

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductListing } from "@/components/blocks/ProductListing";
import { brands, getBrand, getCategory } from "@/data/catalog";
import { productsByBrand } from "@/data/products";
import { formatItemCount } from "@/lib/format";
import { ListingSkeleton } from "@/components/blocks/ListingSkeleton";

export async function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata(
  props: PageProps<"/brand/[slug]">,
): Promise<Metadata> {
  "use cache";
  const { slug } = await props.params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Brand not found" };

  return {
    title: brand.name,
    description: brand.description,
    alternates: { canonical: `/brand/${brand.slug}` },
  };
}

/**
 * Brand listing (DS-PG-CAT, with the brand header of item 6).
 *
 * The same listing as a category page, with a brand header above the toolbar
 * and the brand filter dropped — on a brand page it would always have one
 * option.
 */
export default async function BrandPage(props: PageProps<"/brand/[slug]">) {
  const { slug } = await props.params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const items = productsByBrand(brand.slug);
  const categoryNames = brand.categories
    .map((c) => getCategory(c)?.name)
    .filter((n) => n !== undefined);

  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brand" },
          { label: brand.name },
        ]}
        className="mb-6"
      />

      <header className="mb-8 flex flex-col gap-3 rounded-lg bg-surface p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        {/* The wordmark stands in for the logo, which ships as an SVG. */}
        <p className="text-title text-ink">{brand.name}</p>
        <div className="min-w-0">
          <h1 className="text-strong text-ink">
            {brand.name} at Voltra
          </h1>
          <p className="mt-0.5 text-sm text-secondary">
            {brand.description}
          </p>
          <p className="mt-1 text-caption text-secondary tabular">
            {formatItemCount(items.length)}
            {categoryNames.length > 0
              ? ` · ${categoryNames.join(", ")}`
              : ""}
          </p>
        </div>
      </header>

      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing
          products={items}
          showBrandFilter={false}
          emptyBody={`Try removing a filter, or browse everything from ${brand.name}.`}
        />
      </Suspense>
    </Container>
  );
}
