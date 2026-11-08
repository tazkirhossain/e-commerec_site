import Link from "next/link";
import { footerGroups } from "@/data/content";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { Newsletter } from "./Newsletter";
import { cn } from "@/lib/cn";

/**
 * Footer (DS-CMP-FOOTER).
 *
 * Surface background, four link columns (Shop, Company, Help, Policy) that
 * collapse to accordions on mobile, a newsletter field with a one-line consent
 * note, payment and delivery partners in monochrome, and the copyright line in
 * the caption size.
 */

const partners = ["bKash", "Nagad", "VISA", "Mastercard", "AMEX", "Pathao"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-surface">
      <Container>
        {/* Tablet and up: four columns plus a wider newsletter cell. */}
        <div
          className={cn(
            "hidden gap-6 py-12 sm:grid",
            "sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_1.4fr]",
          )}
        >
          {footerGroups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="mb-3 text-strong font-medium text-ink">
                {group.heading}
              </h2>
              <ul className="flex flex-col">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-4">
            <Newsletter />
            <Partners />
          </div>
        </div>

        {/* Mobile: the same groups as accordions (DS-CMP-FOOTER). */}
        <div className="py-8 sm:hidden">
          <Accordion
            single
            items={footerGroups.map((group) => ({
              id: group.heading,
              title: group.heading,
              content: (
                <ul className="flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              ),
            }))}
          />

          <div className="mt-8 flex flex-col gap-5">
            <Newsletter />
            <Partners />
          </div>
        </div>
      </Container>

      <div className="border-t border-hairline">
        <Container>
          <div
            className={cn(
              "flex flex-col gap-3 py-5 text-caption text-secondary",
              "sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0",
            )}
          >
            <div className="flex items-center gap-4">
              <Logo className="text-[18px]" />
              <p>© 2026 Voltra Ltd. · Authorized reseller</p>
            </div>
            <div className="flex items-center gap-5">
              <LanguageSwitch className="text-caption" />
              <span aria-label="Currency">৳ BDT</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
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
      className={cn(
        "flex min-h-11 items-center rounded-xs text-sm text-body",
        "hover:text-ink hover:underline focus-ring sm:min-h-8",
      )}
    >
      {children}
    </Link>
  );
}

function Partners() {
  return (
    <div>
      <h2 className="sr-only">Payment and delivery partners</h2>
      <ul className="flex flex-wrap items-center gap-2">
        {partners.map((partner) => (
          <li
            key={partner}
            className={cn(
              "inline-flex h-8 items-center rounded-xs border border-hairline",
              "bg-canvas px-2.5 text-caption font-semibold text-secondary",
            )}
          >
            {partner}
          </li>
        ))}
      </ul>
    </div>
  );
}
