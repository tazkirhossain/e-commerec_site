import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { StyleguideBody } from "./StyleguideBody";
import { TokenTables } from "./TokenTables";

export const metadata: Metadata = {
  title: "Styleguide",
  description:
    "Every design token and component in the Voltra design system, with all variants and states.",
  robots: { index: false, follow: false },
};

/**
 * The living styleguide.
 *
 * Every token in `globals.css` and every component in `components/` appears
 * here with all of its variants and states. A component is not finished until
 * it is on this page (CLAUDE.md §2) — this is where a design lint pass and an
 * accessibility pass actually happen.
 */
export default function StyleguidePage() {
  return (
    <Container className="py-10 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-accent">Design system</p>
        <h1 className="mt-2 type-display text-ink">Voltra styleguide</h1>
        <p className="mt-3 text-lg text-body">
          Tokens, controls, commerce components, overlays, navigation and
          composed blocks. Values come from{" "}
          <code className="rounded-xs bg-surface px-1.5 py-0.5 text-sm">
            app/globals.css
          </code>{" "}
          — nothing on this page sets a raw colour or size.
        </p>
      </header>

      <TokenTables />
      <StyleguideBody />
    </Container>
  );
}
