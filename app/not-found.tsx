import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { NotFoundSearch } from "./NotFoundSearch";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 (DS-PG-ERR).
 *
 * One headline, one sentence, one primary button back to home, plus a search
 * field — which the spec asks for specifically on 404, because a wrong URL
 * usually means the visitor was looking for a product.
 *
 * `not-found` sits above the route groups, so it carries its own shell.
 */
export default function NotFound() {
  return (
    <Providers>
      <Header />
      <main id="main" className="flex-1">
        <Container className="flex flex-col items-center py-16 text-center lg:py-24">
          <span className="flex size-14 items-center justify-center rounded-pill bg-surface text-secondary">
            <Icon name="search" size={28} />
          </span>

          <h1 className="mt-5 type-hero text-ink">Page not found</h1>
          <p className="mt-3 max-w-md text-lg text-body">
            The link may be out of date, or the product may have moved. Try a
            search, or start again from the home page.
          </p>

          <div className="mt-8 w-full max-w-xl">
            <NotFoundSearch />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/">Go to home</ButtonLink>
            <ButtonLink href="/category/phones" variant="secondary">
              Browse phones
            </ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </Providers>
  );
}
