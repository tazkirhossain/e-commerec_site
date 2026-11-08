import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = {
  title: "Request an order",
  description:
    "Tell us what you are looking for and we will source it and quote you, usually within one working day.",
  alternates: { canonical: "/request-order" },
};

/**
 * Request an order (DS-PG-REQUEST, FR-ORD-12).
 *
 * A short form — product, link or photo, budget and phone — and a
 * confirmation that states a response time.
 */
export default function RequestOrderPage() {
  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Request an order" }]}
        className="mb-6"
      />

      <div className="max-w-[560px]">
        <h1 className="type-display text-ink">Request an order</h1>
        <p className="mt-2 text-lg text-body">
          If we do not list it, or it is out of stock, tell us what you need.
          We source it and come back with a price, usually within one working
          day.
        </p>

        <RequestForm />
      </div>
    </Container>
  );
}
