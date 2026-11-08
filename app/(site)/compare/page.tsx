import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CompareTable } from "./CompareTable";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to four products side by side.",
  robots: { index: false, follow: true },
};

/**
 * Compare (DS-PG-COMPARE, FR-CAT-10).
 *
 * Up to four products side by side. The selection lives in the client store
 * and persists for the session, so the table is rendered on the client around
 * this static shell.
 */
export default function ComparePage() {
  return (
    <Container className="py-5 lg:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Compare" }]}
        className="mb-6"
      />
      <CompareTable />
    </Container>
  );
}
