"use client";

import type { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { MiniCartDrawer } from "@/components/feedback/MiniCartDrawer";
import { ToastRegion } from "@/components/feedback/Toast";

/**
 * The client boundary for the whole storefront: cart, wishlist, compare and
 * toasts, plus the two overlays that any page can trigger.
 *
 * Kept as one component so pages and layouts stay Server Components.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <MiniCartDrawer />
      <ToastRegion />
    </StoreProvider>
  );
}
