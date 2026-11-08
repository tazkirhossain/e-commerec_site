import { Container } from "@/components/ui/Container";
import { AccountNav } from "./AccountNav";

/**
 * The account shell (DS-PG-ACCOUNT).
 *
 * A left menu and a content panel on desktop; on mobile the menu becomes a
 * list screen you drill into, which `AccountNav` handles by hiding itself on
 * a sub-page and hiding the panel on the index.
 */
export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <Container className="py-5 lg:py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
