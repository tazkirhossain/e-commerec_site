"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { customer } from "@/data/account";
import { formatPoints } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * The account menu (DS-PG-ACCOUNT).
 *
 * A persistent left rail on desktop. On mobile it is the index screen: the
 * menu fills the page at `/account`, and drilling into a section replaces it,
 * with the layout's content panel taking over.
 */

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/account", label: "Overview", icon: "user" },
  { href: "/account/orders", label: "Orders", icon: "package" },
  { href: "/account/addresses", label: "Addresses", icon: "map-pin" },
  { href: "/account/points", label: "Reward points", icon: "award" },
  { href: "/account/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/account/requests", label: "Requests", icon: "mail" },
  { href: "/account/profile", label: "Profile", icon: "settings" },
];

export function AccountNav() {
  const pathname = usePathname();
  const atIndex = pathname === "/account";

  return (
    <nav
      aria-label="Account"
      /* Mobile: only shown on the index, so a section gets the full width. */
      className={cn("lg:block", atIndex ? "block" : "hidden")}
    >
      <div className="mb-5">
        <h1 className="text-title text-ink lg:text-subtitle">My account</h1>
        <p className="mt-0.5 text-sm text-secondary">
          {customer.name} · {formatPoints(customer.points)}
        </p>
      </div>

      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center justify-between gap-3 rounded-sm",
                  "px-3 text-sm transition-colors duration-[--motion-fast]",
                  "ease-[--ease-standard] focus-ring",
                  active
                    ? "bg-surface font-semibold text-ink"
                    : "text-body hover:bg-surface hover:text-ink",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    size={18}
                    className={active ? "text-ink" : "text-secondary"}
                  />
                  {item.label}
                </span>
                {/* The chevron is the drill-down cue on mobile. */}
                <Icon
                  name="chevron-right"
                  size={16}
                  className="text-border-strong lg:hidden"
                />
              </Link>
            </li>
          );
        })}

        <li className="mt-3 border-t border-hairline pt-3">
          <Link
            href="/account/login"
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-sm px-3 text-sm",
              "text-body hover:bg-surface hover:text-ink focus-ring",
            )}
          >
            <Icon name="log-out" size={18} className="text-secondary" />
            Sign out
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/**
 * The heading every account sub-page starts with, carrying the mobile back
 * link up to the menu.
 */
export function AccountPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <Link
        href="/account"
        className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-xs text-sm text-ink hover:underline focus-ring lg:hidden"
      >
        <Icon name="chevron-left" size={16} />
        My account
      </Link>
      <h1 className="text-title text-ink">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm text-secondary">{description}</p>
      ) : null}
    </header>
  );
}
