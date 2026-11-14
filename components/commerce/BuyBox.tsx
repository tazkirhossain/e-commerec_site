"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Product } from "@/data/types";
import { MobileBuyBar } from "@/components/blocks/MobileBuyBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentGroup, SwatchGroup } from "@/components/ui/Swatch";
import { defaultVariant, variantPhotos } from "@/data/products";
import { getBrand } from "@/data/catalog";
import { formatDate, formatPoints, formatTaka } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { StockStatus } from "./Status";
import { ProductGallery } from "./ProductGallery";
import { glyphFor } from "./ProductImage";

/**
 * The product page's gallery-and-buy-box pair (DS-PG-PDP).
 *
 * Owns the selected variant, because changing colour or storage updates the
 * price, the gallery and the stock state in place and writes the variant into
 * the URL — no reload (DS-UX-02). Gallery and buy box therefore live under one
 * client component rather than two that would have to sync.
 *
 * On desktop the buy box is sticky; on mobile the sticky bar below the fold
 * carries the action instead.
 */

export const ADD_TO_CART_ID = "pdp-add-to-cart";

export function BuyBox({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart, inWishlist, toggleWishlist, inCompare, toggleCompare, hydrated, showToast } =
    useStore();

  const initial = defaultVariant(product);
  const [color, setColor] = useState(initial.color);
  const [storage, setStorage] = useState(initial.storage);

  /* A shared `?sku=` link should open on that variant.
     Read from `window` rather than `searchParams` so the page itself stays
     fully static, and apply it during the first post-hydration render rather
     than in an effect — `hydrated` is false while the server HTML is being
     matched, so this never causes a mismatch. */
  const [urlApplied, setUrlApplied] = useState(false);

  if (hydrated && !urlApplied) {
    setUrlApplied(true);
    const sku = new URLSearchParams(window.location.search).get("sku");
    const match = sku
      ? product.variants.find((v) => v.sku === sku)
      : undefined;
    if (match) {
      setColor(match.color);
      setStorage(match.storage);
    }
  }

  /* The selected SKU is derived, never stored, so the two axes cannot drift
     out of sync with it. */
  const variant = useMemo(() => {
    const exact = product.variants.find(
      (v) => v.color === color && v.storage === storage,
    );
    if (exact) return exact;
    /* The chosen storage is not made in this colour — fall back within it. */
    return (
      product.variants.find((v) => v.color === color) ?? product.variants[0]
    );
  }, [product.variants, color, storage]);

  const colors = useMemo(() => {
    const seen = new Map<string, { hex: string; available: boolean }>();
    for (const v of product.variants) {
      const existing = seen.get(v.color);
      const sellable = v.stock !== "out-of-stock" && v.stock !== "discontinued";
      seen.set(v.color, {
        hex: v.colorHex,
        available: (existing?.available ?? false) || sellable,
      });
    }
    return [...seen.entries()].map(([label, meta]) => ({
      value: label,
      label,
      hex: meta.hex,
      available: meta.available,
    }));
  }, [product.variants]);

  /* Storage options are scoped to the chosen colour, and the unavailable ones
     are shown struck through rather than hidden (DS-CMP-VARIANT). */
  const storages = useMemo(() => {
    const inColor = product.variants.filter((v) => v.color === color);
    if (inColor.length <= 1 || !inColor[0].storage) return [];

    const cheapest = Math.min(
      ...product.variants.map((v) => v.salePrice ?? v.price),
    );

    return inColor.map((v) => {
      const price = v.salePrice ?? v.price;
      const delta = price - cheapest;
      return {
        value: v.storage!,
        label: v.storage!,
        note: delta > 0 ? `+ ${formatTaka(delta)}` : undefined,
        available: v.stock !== "out-of-stock" && v.stock !== "discontinued",
      };
    });
  }, [product.variants, color]);

  function select(nextColor: string, nextStorage?: string) {
    setColor(nextColor);
    if (nextStorage !== undefined) setStorage(nextStorage);

    const next = product.variants.find(
      (v) =>
        v.color === nextColor &&
        v.storage === (nextStorage ?? storage),
    );

    if (next) {
      /* The URL carries the variant so the page can be shared (DS-UX-02).
         `replace` with scroll off keeps the back button meaningful. */
      router.replace(`${pathname}?sku=${next.sku}`, { scroll: false });
    }
  }

  const soldOut = variant.stock === "out-of-stock";
  const preOrder = variant.stock === "pre-order";
  const saved = hydrated && inWishlist(product.slug);
  const comparing = hydrated && inCompare(product.slug);
  const brand = getBrand(product.brand);

  /* The selected variant's photos, then the views shared by every variant.
     A product without photography gets three tinted plates instead, so the
     gallery still responds to the colour picker. */
  const views = useMemo(() => {
    const photos = variantPhotos(product, variant);
    if (photos.length > 0) {
      return photos.map((src, index) => ({
        id: src,
        src,
        tint: variant.colorHex,
        label: index === 0 ? variant.color : `${variant.color}, view ${index + 1}`,
      }));
    }
    return [
      { id: "front", tint: variant.colorHex, label: "Front" },
      { id: "back", tint: shade(variant.colorHex, -12), label: "Back" },
      { id: "side", tint: shade(variant.colorHex, 10), label: "Side" },
    ];
  }, [product, variant]);

  return (
    <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
      <ProductGallery
        /* Remount when the photo set changes, so the gallery returns to its
           first view without an effect that resets it afterwards. */
        key={views[0]?.id}
        productName={product.name}
        shape={glyphFor(product.category, product.slug)}
        views={views}
      />

      {/* Sticky on desktop so the price and action stay in reach. */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
        <div>
          {brand ? (
            <p className="text-sm font-medium text-secondary">{brand.name}</p>
          ) : null}
          <h1 className="mt-1 text-title text-ink lg:text-hero lg:leading-tight">
            {product.name}
          </h1>
          <p className="mt-1 text-base text-secondary">{product.keySpec}</p>
        </div>

        <Rating value={product.rating} count={product.reviewCount} size="full" />

        <Price
          price={variant.price}
          salePrice={variant.salePrice}
          size="large"
          outOfStock={soldOut}
          preOrder={preOrder}
          emiMonths={soldOut ? undefined : 12}
          notifySlot={soldOut ? <span /> : undefined}
        />

        <SwatchGroup
          legend="Color"
          options={colors}
          value={color}
          onChange={(next) => select(next)}
        />

        {storages.length > 0 ? (
          <SegmentGroup
            legend={secondAxisLabel(storages.map((o) => o.value))}
            options={storages}
            value={storage ?? storages[0].value}
            onChange={(next) => select(color, next)}
          />
        ) : null}

        <StockStatus
          state={variant.stock}
          available={variant.available}
          note={
            preOrder && product.preOrderArrival
              ? `Ships ${formatDate(product.preOrderArrival)}`
              : soldOut
                ? undefined
                : "Delivery by 08 Nov in Dhanmondi"
          }
        />

        {product.rewardPoints ? (
          <p className="flex items-center gap-2 text-sm text-secondary">
            <Icon name="award" size={16} />
            Earn {formatPoints(product.rewardPoints)} on this order
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          {soldOut ? (
            <Button
              fullWidth
              id={ADD_TO_CART_ID}
              iconLeading="bell"
              onClick={() =>
                showToast(`We will text you when ${product.name} is back in stock`)
              }
            >
              Notify me
            </Button>
          ) : (
            <>
              <Button
                id={ADD_TO_CART_ID}
                fullWidth
                onClick={() => addToCart(product.slug, variant.sku)}
              >
                {preOrder ? "Pre-order" : "Add to cart"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  addToCart(product.slug, variant.sku);
                  router.push("/checkout");
                }}
                className="shrink-0"
              >
                Buy now
              </Button>
            </>
          )}

          <IconButton
            icon="heart"
            styleVariant={saved ? "saved" : "outline"}
            label={saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.slug)}
            size={48}
            className="shrink-0"
          />
          <IconButton
            icon="scale"
            styleVariant="outline"
            label={comparing ? "Remove from compare" : "Add to compare"}
            aria-pressed={comparing}
            onClick={() => toggleCompare(product.slug)}
            size={48}
            className={cn(
              "shrink-0",
              comparing && "border-ink bg-ink text-on-inverse",
            )}
          />
        </div>

        {/* The warranty statement sits directly under the buttons (§4.4). */}
        <p className="flex items-start gap-2 text-sm text-secondary">
          <Icon name="shield-check" size={18} className="mt-0.5 text-success" />
          Official Bangladesh stock with a one-year brand warranty. Serial
          number recorded on your invoice.
        </p>
      </div>

      {/* The buy box owns the selected variant, so it owns the sticky bar
          that mirrors it below the fold. */}
      <MobileBuyBar
        product={product}
        variant={variant}
        watchId={ADD_TO_CART_ID}
      />
    </div>
  );
}

/**
 * What to call the second variant axis. Usually storage, but a console bundle
 * or a watch's cellular option is an edition, and "Storage" would mislead.
 */
function secondAxisLabel(values: string[]): string {
  if (values.every((v) => /^\d+\s?(GB|TB)$/i.test(v))) return "Storage";
  if (values.some((v) => /cellular|gps/i.test(v))) return "Connectivity";
  return "Edition";
}

/** Nudges a hex lighter or darker, to stand in for a second photograph. */
function shade(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
