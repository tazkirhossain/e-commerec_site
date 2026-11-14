"use cache";

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  ProductListing,
  SubcategoryChips,
} from "@/components/blocks/ProductListing";
import { ListingSkeleton } from "@/components/blocks/ListingSkeleton";
import {
  categories,
  getCategory,
  getSubcategories,
} from "@/data/catalog";
import { products, productsByCategory } from "@/data/products";
import { formatItemCount } from "@/lib/format";

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[slug]">,
): Promise<Metadata> {
  "use cache";
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description:
      category.blurb ??
      `Shop ${category.name.toLowerCase()} at Voltra, with official warranty and 0% EMI.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

/**
 * Category listing (DS-PG-CAT).
 *
 * Breadcrumb and title with the product count, optional subcategory chips, the
 * filter rail and the product grid. Filter state lives in the URL, which is
 * why the listing sits behind Suspense: it reads search params, and the shell
 * around it stays static.
 */
export default async function CategoryPage(
  props: PageProps<"/category/[slug]">,
) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const subcategories = getSubcategories(category.slug);

  /* A parent lists everything in it; a subcategory lists only its own. */
  const items = category.parent
    ? products.filter((p) => p.subcategory === category.slug)
    : productsByCategory(category.slug);

  const parent = category.parent ? getCategory(category.parent) : undefined;

  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(parent
            ? [{ label: parent.name, href: `/category/${parent.slug}` }]
            : []),
          { label: category.name },
        ]}
        className="mb-6"
      />

      <header className="mb-6">
        <h1 className="type-display text-ink">{category.name}</h1>
        <p className="mt-1 text-base text-secondary tabular">
          {formatItemCount(items.length)}
          {category.blurb ? ` · ${category.blurb}` : ""}
        </p>
      </header>

      {subcategories.length > 0 ? (
        <SubcategoryChips
          items={subcategories.map((c) => ({ slug: c.slug, name: c.name }))}
          className="mb-8"
        />
      ) : null}

      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing
          products={items}
          emptyBody={`Try removing a filter, or browse all ${category.name.toLowerCase()}.`}
        />
      </Suspense>
    </Container>
  );
}
