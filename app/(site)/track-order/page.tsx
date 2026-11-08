import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TrackForm } from "./TrackForm";

export const metadata: Metadata = {
  title: "Track order",
  description:
    "Track a Voltra order with your order number and phone number. No account needed.",
  alternates: { canonical: "/track-order" },
};

/**
 * Order tracking (DS-PG-TRACK, FR-ORD-10).
 *
 * Order number and phone, then a vertical timeline. Guests can track without
 * an account, which is why this page is outside the account area.
 */
export default function TrackOrderPage() {
  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Track order" }]}
        className="mb-6"
      />

      <div className="max-w-[680px]">
        <h1 className="type-display text-ink">Track your order</h1>
        <p className="mt-2 text-lg text-body">
          Enter the order number from your confirmation SMS and the phone
          number you ordered with.
        </p>

        {/* The order number can arrive in the URL from a confirmation link. */}
        <Suspense fallback={<div className="mt-8 h-64" />}>
          <TrackForm />
        </Suspense>
      </div>
    </Container>
  );
}
