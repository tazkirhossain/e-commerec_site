import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutFlow } from "./CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Voltra order.",
  robots: { index: false, follow: false },
};

/**
 * Checkout (DS-PG-CHECKOUT).
 *
 * Three steps — Details, Delivery and payment, Review — with a persistent
 * order summary at the right on desktop and collapsible at the top on mobile.
 * The whole flow is client-side because it reads the cart, so the page is a
 * static shell around it.
 */
export default function CheckoutPage() {
  return (
    <Container className="py-6 lg:py-10">
      <CheckoutFlow />
    </Container>
  );
}
