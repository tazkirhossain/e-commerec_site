import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { ProductShelf } from "@/components/blocks/ProductShelf";
import { getProducts, shelves } from "@/data/products";
import { CartContents } from "./CartContents";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your cart before checking out.",
  robots: { index: false, follow: true },
};

/**
 * Cart (DS-PG-CART).
 *
 * Line items at the left, the order summary at the right with the coupon
 * field and the primary Checkout. On mobile the summary becomes a sticky
 * bottom bar carrying the total and the action.
 *
 * The cart itself lives on the client, so the page is a static shell and
 * `CartContents` renders what is in it. The top-sellers shelf is prerendered
 * here so the empty state has something to show immediately.
 */
export default function CartPage() {
  return (
    <Container className="py-5 lg:py-8">
      <CartContents
        topSellers={
          <Section>
            <ProductShelf
              title="Top sellers"
              products={getProducts(shelves.topSelling)}
              href="/category/phones"
            />
          </Section>
        }
      />
    </Container>
  );
}
