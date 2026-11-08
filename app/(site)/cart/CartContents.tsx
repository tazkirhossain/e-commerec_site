"use client";

import { useState, type ReactNode } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { CartLineItem } from "@/components/commerce/CartLineItem";
import { Banner } from "@/components/feedback/Banner";
import { EmptyState } from "@/components/feedback/States";
import { OrderSummary } from "@/components/blocks/OrderSummary";
import { coupons } from "@/data/offers";
import { formatItemCount, formatTaka } from "@/lib/format";
import { useCartDetails, useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * The cart's contents, totals and coupon field.
 *
 * Price and stock are re-checked whenever the cart is viewed (FR-CRT-03): a
 * line that went out of stock is flagged on the line itself and blocks
 * checkout until it is removed.
 */

/** Free inside Dhaka over ৳ 5,000; ৳ 80 below that (delivery policy). */
const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_FEE = 80;

export function CartContents({ topSellers }: { topSellers: ReactNode }) {
  const { cartCount, cartSubtotal, hydrated } = useStore();
  const lines = useCartDetails();

  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<(typeof coupons)[number]>();
  const [couponError, setCouponError] = useState<string>();

  /* Nothing is known until storage has been read, so hold the layout. */
  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading your cart" aria-busy="true">
        <div className="h-9 w-48 animate-shimmer rounded-sm" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 animate-shimmer rounded-md" />
            ))}
          </div>
          <div className="h-64 animate-shimmer rounded-md" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <h1 className="type-display text-ink">Your cart</h1>
        <EmptyState
          icon="bag"
          title="Your cart is empty"
          body="Find something you love in today's top sellers."
          action={{ label: "Continue shopping", href: "/" }}
          className="mt-6"
        />
        {topSellers}
      </>
    );
  }

  const discount = applied
    ? applied.type === "fixed"
      ? applied.value
      : Math.min(
          Math.round((cartSubtotal * applied.value) / 100),
          applied.maximumDiscount ?? Infinity,
        )
    : 0;

  const afterDiscount = cartSubtotal - discount;
  const deliveryFee =
    afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = afterDiscount + deliveryFee;

  const blocked = lines.some(({ variant }) => variant.stock === "out-of-stock");

  function applyCoupon(event: React.FormEvent) {
    event.preventDefault();

    const match = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase(),
    );

    if (!match) {
      setCouponError("That code isn't valid. Check the spelling.");
      return;
    }
    if (cartSubtotal < match.minimumOrder) {
      setCouponError(
        `This code needs an order of ${formatTaka(match.minimumOrder)} or more.`,
      );
      return;
    }

    setCouponError(undefined);
    setApplied(match);
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display text-ink">Your cart</h1>
        <p className="mt-1 text-base text-secondary tabular">
          {formatItemCount(cartCount)}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {blocked ? (
            <Banner
              tone="error"
              message="One item is no longer available. Remove it to continue to checkout."
              className="mb-6"
            />
          ) : null}

          <ul className="flex flex-col gap-6">
            {lines.map(({ line, product, variant }) => (
              <CartLineItem
                key={line.sku}
                product={product}
                variant={variant}
                quantity={line.quantity}
              />
            ))}
          </ul>

          <ButtonLink href="/" variant="tertiary" className="mt-6">
            Continue shopping
          </ButtonLink>
        </div>

        {/* Desktop: a sticky summary column. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderSummary
            totals={{
              itemCount: cartCount,
              subtotal: cartSubtotal,
              discount,
              deliveryFee,
              total,
            }}
            action={
              <ButtonLink
                href="/checkout"
                fullWidth
                className={blocked ? "pointer-events-none opacity-40" : undefined}
                aria-disabled={blocked || undefined}
              >
                Checkout
              </ButtonLink>
            }
          >
            {applied ? (
              <div className="flex items-center justify-between gap-3 rounded-sm bg-success-surface px-3 py-2.5 text-sm text-success">
                <span className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} />
                  {applied.code} applied
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setApplied(undefined);
                    setCode("");
                  }}
                  className="font-medium underline underline-offset-4 focus-ring"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={applyCoupon} className="flex items-start gap-2">
                <Input
                  label="Coupon code"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setCouponError(undefined);
                  }}
                  error={couponError}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="mt-0 h-14 shrink-0"
                >
                  Apply
                </Button>
              </form>
            )}
          </OrderSummary>
        </div>
      </div>

      {/* Mobile: the summary collapses to a sticky bottom bar. */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-sticky border-t border-hairline",
          "bg-canvas/95 px-4 py-3 backdrop-blur-[20px] lg:hidden",
          "shadow-[0_-1px_2px_rgba(0,0,0,0.06)]",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-caption text-secondary">Total</p>
            <p className="text-price font-semibold text-ink tabular">
              {formatTaka(total)}
            </p>
          </div>
          <ButtonLink
            href="/checkout"
            className={blocked ? "pointer-events-none opacity-40" : undefined}
            aria-disabled={blocked || undefined}
          >
            Checkout
          </ButtonLink>
        </div>
      </div>

      {/* Clears the sticky bar. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
