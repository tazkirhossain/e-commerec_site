import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { CompareBar } from "@/components/blocks/CompareBar";

/**
 * The shared site shell: header on top, footer at the bottom, on every page in
 * this group (Design SRS §4 preamble). Checkout has its own reduced shell.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <Providers>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CompareBar />
    </Providers>
  );
}
