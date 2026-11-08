"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { CartLineItem } from "@/components/commerce/CartLineItem";
import { formatTaka, formatItemCount } from "@/lib/format";
import { useCartDetails, useStore } from "@/lib/store";
import { Drawer } from "./Overlay";
import { Banner } from "./Banner";

/**
 * Mini cart drawer (DS-CMP-MINICART).
 *
 * Opens from the header cart icon or straight after add-to-cart, which is why
 * adding never navigates away (DS-UX-02). Lists the lines, then a pinned footer
 * with the subtotal, the primary Checkout button and a secondary View cart.
 */

export function MiniCartDrawer() {
  const { miniCartOpen, closeMiniCart, cartSubtotal, cartCount } = useStore();
  const lines = useCartDetails();

  const blocked = lines.some(
    ({ variant }) => variant.stock === "out-of-stock",
  );

  return (
    <Drawer
      open={miniCartOpen}
      onClose={closeMiniCart}
      title={`Cart (${cartCount})`}
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between text-base">
              <span className="text-secondary">Subtotal</span>
              <span className="text-price font-semibold text-ink tabular">
                {formatTaka(cartSubtotal)}
              </span>
            </div>
            <p className="text-caption text-secondary">
              Delivery and any discount are calculated at checkout.
            </p>
            <ButtonLink
              href="/checkout"
              fullWidth
              onClick={closeMiniCart}
              className={blocked ? "pointer-events-none opacity-40" : undefined}
              aria-disabled={blocked || undefined}
            >
              Checkout
            </ButtonLink>
            <ButtonLink
              href="/cart"
              variant="secondary"
              fullWidth
              onClick={closeMiniCart}
            >
              View cart
            </ButtonLink>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-start gap-4 py-6">
          <p className="text-base text-secondary">Your cart is empty.</p>
          <Button variant="secondary" onClick={closeMiniCart}>
            Continue shopping
          </Button>
        </div>
      ) : (
        <>
          {blocked ? (
            <Banner
              tone="error"
              message="One item is no longer available. Remove it to check out."
              className="mb-4"
            />
          ) : null}

          <p className="sr-only">{formatItemCount(cartCount)} in your cart</p>

          <ul className="flex flex-col gap-5">
            {lines.map(({ line, product, variant }) => (
              <CartLineItem
                key={line.sku}
                product={product}
                variant={variant}
                quantity={line.quantity}
                compact
              />
            ))}
          </ul>
        </>
      )}
    </Drawer>
  );
}
