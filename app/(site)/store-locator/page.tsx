import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StoreFinder } from "./StoreFinder";
import { stores, storeAreas } from "@/data/stores";

export const metadata: Metadata = {
  title: "Store locator",
  description:
    "Voltra stores in Dhaka, Chattogram and Sylhet. Opening hours, directions and store pickup.",
  alternates: { canonical: "/store-locator" },
};

/**
 * Store locator (DS-PG-STORES).
 *
 * A list of store cards at the left with an interactive map at the right; the
 * map sits above the list on mobile. Search by area, an open-now filter, and
 * a directions link on every card (FR-STO-02).
 */
export default function StoreLocatorPage() {
  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Store locator" }]}
        className="mb-6"
      />

      <header className="mb-8">
        <h1 className="type-display text-ink">Store locator</h1>
        <p className="mt-1 max-w-prose text-base text-secondary">
          {stores.length} stores. Order online and collect in about two hours,
          or come in and we will set the device up with you.
        </p>
      </header>

      <StoreFinder stores={stores} areas={storeAreas()} />
    </Container>
  );
}
