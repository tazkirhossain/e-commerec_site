"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/data/types";
import { findVariant, getProduct } from "@/data/products";
import {
  createPersistedStore,
  useHydrated,
  usePersisted,
} from "./client-store";

/**
 * Client-side store for cart, wishlist, compare selection and toasts.
 *
 * In the real platform these live behind the API (FR-CRT-01, FR-USR-04), with
 * the guest cart persisted for 30 days and merged on sign-in. Here they are
 * mirrored to `localStorage` through an external store, which gives the same
 * observable behaviour: the cart survives navigation and a reload, and the
 * compare selection persists for the session (FR-CAT-10).
 *
 * The persisted slices are read with `useSyncExternalStore` rather than
 * hydrated by an effect, so the first client render already agrees with the
 * server HTML.
 */

const MAX_COMPARE = 4;

const cartStore = createPersistedStore<CartLine[]>("voltra.cart", []);
const wishlistStore = createPersistedStore<string[]>("voltra.wishlist", []);
const compareStore = createPersistedStore<string[]>("voltra.compare", []);

export interface ToastAction {
  label: string;
  onAction: () => void;
}

export interface Toast {
  id: number;
  message: string;
  /** Present when the action is reversible — "Undo" (DS-UX-02). */
  action?: ToastAction;
}

interface StoreValue {
  /* --- Cart --- */
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productSlug: string, sku: string, quantity?: number) => void;
  setQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;

  /* --- Mini cart drawer --- */
  miniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;

  /* --- Wishlist --- */
  wishlist: string[];
  toggleWishlist: (productSlug: string) => void;
  inWishlist: (productSlug: string) => boolean;

  /* --- Compare --- */
  compare: string[];
  toggleCompare: (productSlug: string) => void;
  inCompare: (productSlug: string) => boolean;
  clearCompare: () => void;
  compareLimit: number;

  /* --- Toasts --- */
  toasts: Toast[];
  showToast: (message: string, action?: ToastAction) => void;
  dismissToast: (id: number) => void;

  /** False on the server and during hydration, true afterwards. */
  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const cart = usePersisted(cartStore);
  const wishlist = usePersisted(wishlistStore);
  const compare = usePersisted(compareStore);
  const hydrated = useHydrated();

  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, action?: ToastAction) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, action }]);
  }, []);

  const addToCart = useCallback(
    (productSlug: string, sku: string, quantity = 1) => {
      const current = cartStore.get();
      const existing = current.find((line) => line.sku === sku);

      /* Never exceed what is available to sell (FR-CRT-02). */
      const product = getProduct(productSlug);
      const variant = product ? findVariant(product, sku) : undefined;
      const max = variant?.available ?? 1;

      cartStore.set(
        existing
          ? current.map((line) =>
              line.sku === sku
                ? { ...line, quantity: Math.min(max, line.quantity + quantity) }
                : line,
            )
          : [...current, { productSlug, sku, quantity: Math.min(max, quantity) }],
      );

      /* Adding to cart opens the mini cart and never navigates (DS-UX-02). */
      setMiniCartOpen(true);
    },
    [],
  );

  const setQuantity = useCallback((sku: string, quantity: number) => {
    const current = cartStore.get();
    cartStore.set(
      quantity <= 0
        ? current.filter((line) => line.sku !== sku)
        : current.map((line) =>
            line.sku === sku ? { ...line, quantity } : line,
          ),
    );
  }, []);

  /* Removing a cart line uses a toast with Undo, not a confirmation modal
     (DS-UX-02), so the removed line is held long enough to restore. */
  const removeFromCart = useCallback(
    (sku: string) => {
      const current = cartStore.get();
      const index = current.findIndex((line) => line.sku === sku);
      if (index === -1) return;

      const removed = current[index];
      cartStore.set(current.filter((line) => line.sku !== sku));

      showToast("Removed from cart", {
        label: "Undo",
        onAction: () => {
          const now = cartStore.get();
          const next = [...now];
          next.splice(Math.min(index, next.length), 0, removed);
          cartStore.set(next);
        },
      });
    },
    [showToast],
  );

  const clearCart = useCallback(() => cartStore.set([]), []);

  const toggleWishlist = useCallback(
    (productSlug: string) => {
      const current = wishlistStore.get();
      const has = current.includes(productSlug);

      wishlistStore.set(
        has
          ? current.filter((slug) => slug !== productSlug)
          : [...current, productSlug],
      );
      showToast(has ? "Removed from wishlist" : "Added to wishlist");
    },
    [showToast],
  );

  const toggleCompare = useCallback(
    (productSlug: string) => {
      const current = compareStore.get();

      if (current.includes(productSlug)) {
        compareStore.set(current.filter((slug) => slug !== productSlug));
        return;
      }
      if (current.length >= MAX_COMPARE) {
        showToast(`You can compare up to ${MAX_COMPARE} products`);
        return;
      }
      compareStore.set([...current, productSlug]);
    },
    [showToast],
  );

  const clearCompare = useCallback(() => compareStore.set([]), []);

  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;

    for (const line of cart) {
      const product = getProduct(line.productSlug);
      if (!product) continue;
      const variant = findVariant(product, line.sku);
      if (!variant) continue;
      count += line.quantity;
      subtotal += (variant.salePrice ?? variant.price) * line.quantity;
    }

    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart]);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      miniCartOpen,
      openMiniCart: () => setMiniCartOpen(true),
      closeMiniCart: () => setMiniCartOpen(false),
      wishlist,
      toggleWishlist,
      inWishlist: (slug) => wishlist.includes(slug),
      compare,
      toggleCompare,
      inCompare: (slug) => compare.includes(slug),
      clearCompare,
      compareLimit: MAX_COMPARE,
      toasts,
      showToast,
      dismissToast,
      hydrated,
    }),
    [
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      miniCartOpen,
      wishlist,
      toggleWishlist,
      compare,
      toggleCompare,
      clearCompare,
      toasts,
      showToast,
      dismissToast,
      hydrated,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return context;
}

/** Resolves cart lines to the product and variant they point at. */
export function useCartDetails() {
  const { cart } = useStore();

  return useMemo(
    () =>
      cart.flatMap((line) => {
        const product = getProduct(line.productSlug);
        if (!product) return [];
        const variant = findVariant(product, line.sku);
        if (!variant) return [];
        return [{ line, product, variant }];
      }),
    [cart],
  );
}
