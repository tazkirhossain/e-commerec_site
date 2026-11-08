import Link from "next/link";
import { CheckoutHeader } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { Container } from "@/components/ui/Container";

/**
 * The checkout shell (DS-PG-CHECKOUT item 1).
 *
 * The header is reduced to the logo and a "Secure checkout" label, with no
 * mega menu, so nothing competes with finishing the order. The footer is a
 * single legal line for the same reason.
 */
export default function CheckoutLayout({ children }: LayoutProps<"/"> ) {
  return (
    <Providers>
      <CheckoutHeader />
      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-hairline">
        <Container>
          <div className="flex flex-col gap-2 py-5 text-caption text-secondary sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <p>© 2026 Voltra Ltd.</p>
            <nav aria-label="Legal">
              <ul className="flex gap-4">
                <li>
                  <FooterLink href="/pages/privacy-policy">Privacy</FooterLink>
                </li>
                <li>
                  <FooterLink href="/pages/terms-of-use">Terms</FooterLink>
                </li>
                <li>
                  <FooterLink href="/pages/return-policy">Returns</FooterLink>
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </footer>
    </Providers>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-xs hover:text-ink hover:underline focus-ring sm:min-h-0"
    >
      {children}
    </Link>
  );
}
