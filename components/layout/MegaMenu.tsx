"use client";

import Link from "next/link";
import type { Category } from "@/data/types";
import { getBrandsForCategory, getSubcategories } from "@/data/catalog";
import { offers } from "@/data/offers";
import { getProduct, primaryPhoto } from "@/data/products";
import { Icon } from "@/components/ui/Icon";
import { ProductImage, glyphFor } from "@/components/commerce/ProductImage";
import { cn } from "@/lib/cn";

/**
 * Mega menu panel (DS-CMP-MEGA).
 *
 * A full-width panel on the overlay shadow tier: subcategories at the left,
 * popular brands in the middle, and a single 4:3 promo tile at the right.
 * Opening on intent and closing on Escape or outside click are the header's
 * job, since it owns which category is open.
 */

export function MegaMenuPanel({
  category,
  onNavigate,
}: {
  category: Category;
  onNavigate: () => void;
}) {
  const subcategories = getSubcategories(category.slug);
  const brands = getBrandsForCategory(category.slug).slice(0, 6);

  /* The single promo tile (DS-CMP-MEGA): the lead campaign and its first
     product's photo, so the tile changes when the campaign does. */
  const promo = offers[0];
  const promoProduct = promo ? getProduct(promo.products[0]) : undefined;
  const promoPhoto = promoProduct ? primaryPhoto(promoProduct) : undefined;

  return (
    <div
      className={cn(
        "grid gap-8 border-t border-hairline bg-canvas px-10 py-8",
        "lg:grid-cols-[1fr_1fr_320px]",
      )}
    >
      <Column heading={category.name}>
        <MenuLink
          href={`/category/${category.slug}`}
          onNavigate={onNavigate}
          strong
        >
          All {category.name.toLowerCase()}
        </MenuLink>
        {subcategories.map((sub) => (
          <MenuLink
            key={sub.slug}
            href={`/category/${sub.slug}`}
            onNavigate={onNavigate}
          >
            {sub.name}
          </MenuLink>
        ))}
      </Column>

      <Column heading="Popular brands">
        {brands.map((brand) => (
          <MenuLink
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            onNavigate={onNavigate}
          >
            {brand.name}
          </MenuLink>
        ))}
        <MenuLink href="/brand" onNavigate={onNavigate} strong>
          All brands
        </MenuLink>
      </Column>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-secondary">Shop by need</h3>
        <div className="flex flex-wrap gap-2">
          <MenuPill href="/offers" onNavigate={onNavigate}>
            Offers
          </MenuPill>
          <MenuPill
            href={`/category/${category.slug}?availability=pre-order`}
            onNavigate={onNavigate}
          >
            Pre-order
          </MenuPill>
          <MenuPill href="/pages/exchange" onNavigate={onNavigate}>
            Exchange
          </MenuPill>
        </div>

        {promo ? (
          <Link
            href={`/offers/${promo.slug}`}
            onClick={onNavigate}
            className="group mt-2 flex flex-col gap-2 rounded-md focus-ring"
          >
            <ProductImage
              src={promoPhoto}
              alt=""
              ratio="four-three"
              shape={glyphFor(category.slug)}
              sizes="320px"
              className="transition-shadow duration-[--motion-fast] group-hover:shadow-(--shadow-1)"
            />
            <span className="text-strong text-ink">{promo.title}</span>
            <span className="flex items-center gap-1 text-sm text-secondary group-hover:text-ink">
              {promo.headline}
              <Icon name="chevron-right" size={16} />
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Column({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="mb-2 text-sm font-semibold text-secondary">{heading}</h3>
      {children}
    </div>
  );
}

function MenuLink({
  href,
  children,
  onNavigate,
  strong = false,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-9 items-center rounded-xs text-base hover:underline",
        "focus-ring",
        strong ? "font-semibold text-ink" : "text-body",
      )}
    >
      {children}
    </Link>
  );
}

function MenuPill({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "inline-flex h-9 items-center rounded-pill border border-hairline",
        "px-4 text-sm font-medium text-ink hover:bg-surface focus-ring",
      )}
    >
      {children}
    </Link>
  );
}
