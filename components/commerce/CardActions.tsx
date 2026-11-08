"use client";

import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * The interactive islands on an otherwise server-rendered product card: the
 * wishlist heart that floats over the photo, the compare toggle, and the
 * add-to-cart control used by shelves and the buy box.
 *
 * Kept in one small client file so the card itself stays a Server Component.
 */

export function SaveButton({
  productSlug,
  productName,
  className,
}: {
  productSlug: string;
  productName: string;
  className?: string;
}) {
  const { inWishlist, toggleWishlist, hydrated } = useStore();
  const saved = hydrated && inWishlist(productSlug);

  return (
    <IconButton
      icon="heart"
      styleVariant={saved ? "saved" : "on-photo"}
      label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      aria-pressed={saved}
      onClick={() => toggleWishlist(productSlug)}
      className={className}
    />
  );
}

export function CompareButton({
  productSlug,
  productName,
  className,
}: {
  productSlug: string;
  productName: string;
  className?: string;
}) {
  const { inCompare, toggleCompare, hydrated } = useStore();
  const selected = hydrated && inCompare(productSlug);

  return (
    <IconButton
      icon="scale"
      styleVariant={selected ? "filled" : "on-photo"}
      label={
        selected
          ? `Remove ${productName} from compare`
          : `Add ${productName} to compare`
      }
      aria-pressed={selected}
      onClick={() => toggleCompare(productSlug)}
      className={cn(selected && "bg-ink text-on-inverse", className)}
    />
  );
}

/** Adds a specific SKU to the cart and opens the mini cart (DS-UX-02). */
export function AddToCartButton({
  productSlug,
  sku,
  label = "Add to cart",
  variant = "primary",
  size = "lg",
  fullWidth = false,
  disabled = false,
  quantity = 1,
  className,
}: {
  productSlug: string;
  sku: string;
  label?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  quantity?: number;
  className?: string;
}) {
  const { addToCart } = useStore();

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={() => addToCart(productSlug, sku, quantity)}
      className={className}
    >
      {label}
    </Button>
  );
}

/** Back-in-stock request for an out-of-stock SKU (FR-INV-05). */
export function NotifyMeButton({
  productName,
  variant = "tertiary",
  size = "md",
  fullWidth = false,
}: {
  productName: string;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}) {
  const { showToast } = useStore();

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      iconTrailing={variant === "tertiary" ? undefined : "bell"}
      onClick={() =>
        showToast(`We will text you when ${productName} is back in stock`)
      }
    >
      Notify me
    </Button>
  );
}
