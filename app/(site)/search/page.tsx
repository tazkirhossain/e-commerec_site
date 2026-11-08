import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SearchResults } from "./SearchResults";
import { ListingSkeleton } from "@/components/blocks/ListingSkeleton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search phones, laptops, audio and accessories at Voltra.",
  /* Result pages are not worth indexing (NFR-SEO-02). */
  robots: { index: false, follow: true },
};

/**
 * Search results (DS-PG-SEARCH).
 *
 * The same layout as a category listing, with a "Showing results for" line and
 * a spelling suggestion when there are few matches. The query lives in the URL,
 * so the results component reads it behind a Suspense boundary and the page
 * shell stays static.
 */
export default function SearchPage() {
  return (
    <Container className="py-5 lg:py-8">
      <Suspense
        fallback={
          <>
            <div className="mb-8 h-16" />
            <ListingSkeleton />
          </>
        }
      >
        <SearchResults />
      </Suspense>
    </Container>
  );
}
