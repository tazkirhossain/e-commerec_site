import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OrderStatus } from "@/components/commerce/Status";
import { addresses, customer, orders, wishlist } from "@/data/account";
import { formatDate, formatItemCount, formatPoints, formatTaka } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

/**
 * Account overview (DS-PG-ACCOUNT).
 *
 * On mobile this route is the menu itself, so the panel only renders from
 * tablet up — otherwise the menu and the overview would stack and the drill-
 * down would have nothing to drill into.
 */
export default function AccountOverviewPage() {
  const latest = orders[0];

  const stats: { label: string; value: string; href: string; icon: IconName }[] =
    [
      {
        label: "Orders",
        value: String(orders.length),
        href: "/account/orders",
        icon: "package",
      },
      {
        label: "Reward points",
        value: formatPoints(customer.points),
        href: "/account/points",
        icon: "award",
      },
      {
        label: "Saved addresses",
        value: String(addresses.length),
        href: "/account/addresses",
        icon: "map-pin",
      },
      {
        label: "Wishlist",
        value: formatItemCount(wishlist.length),
        href: "/account/wishlist",
        icon: "heart",
      },
    ];

  return (
    <div className="hidden lg:block">
      <h2 className="text-title text-ink">
        Welcome back, {customer.name.split(" ")[0]}
      </h2>
      <p className="mt-1 text-sm text-secondary">
        Member since {formatDate(customer.memberSince)}.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className={cn(
                "flex h-full flex-col gap-1 rounded-md border border-hairline",
                "bg-canvas p-4 transition-shadow duration-[--motion-fast]",
                "hover:shadow-(--shadow-1) focus-ring",
              )}
            >
              <Icon name={stat.icon} size={18} className="text-secondary" />
              <span className="mt-1 text-subtitle text-ink tabular">
                {stat.value}
              </span>
              <span className="text-sm text-secondary">{stat.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="latest-heading" className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h3 id="latest-heading" className="text-strong text-ink">
            Latest order
          </h3>
          <Link
            href="/account/orders"
            className="rounded-xs text-sm font-medium text-ink hover:underline focus-ring"
          >
            All orders
          </Link>
        </div>

        <div className="rounded-md border border-hairline p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-name text-ink tabular">Order {latest.id}</p>
              <p className="mt-0.5 text-sm text-secondary tabular">
                {formatDate(latest.placedAt)} ·{" "}
                {formatItemCount(
                  latest.lines.reduce((n, l) => n + l.quantity, 0),
                )}{" "}
                · {formatTaka(latest.total)}
              </p>
            </div>
            <OrderStatus status={latest.status} />
          </div>

          <ul className="mt-4 flex flex-col gap-1 text-sm text-secondary">
            {latest.lines.map((line) => (
              <li key={line.name}>
                {line.name} — {line.variant}
              </li>
            ))}
          </ul>

          <Link
            href={`/track-order?order=${latest.id}`}
            className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-xs text-sm font-medium text-ink hover:underline focus-ring"
          >
            Track this order
            <Icon name="chevron-right" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
