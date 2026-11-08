import type { Metadata } from "next";
import { addresses } from "@/data/account";
import { AccountPageHeader } from "../AccountNav";
import { AddressList } from "./AddressList";

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false, follow: false },
};

/**
 * Saved addresses (DS-PG-ACCOUNT, FR-USR-03).
 *
 * Up to ten addresses with one default. Removing one is destructive, so it
 * asks for confirmation in a modal (DS-UX-02).
 */
export default function AddressesPage() {
  return (
    <>
      <AccountPageHeader
        title="Addresses"
        description="Up to ten saved addresses. The default is used first at checkout."
      />
      <AddressList initial={addresses} />
    </>
  );
}
