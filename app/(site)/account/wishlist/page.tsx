import type { Metadata } from "next";
import { AccountPageHeader } from "../AccountNav";
import { WishlistGrid } from "./WishlistGrid";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: false },
};

/**
 * Wishlist (DS-PG-ACCOUNT, FR-USR-04).
 *
 * The guest wishlist is kept on the device and merges into the account on
 * sign-in, so the list is read from the client store rather than the server.
 */
export default function WishlistPage() {
  return (
    <>
      <AccountPageHeader
        title="Wishlist"
        description="Saved on this device. It merges into your account when you sign in."
      />
      <WishlistGrid />
    </>
  );
}
