import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { OrderStatus } from "@/components/commerce/Status";
import { EmptyState } from "@/components/feedback/States";
import { orders } from "@/data/account";
import { formatDate, formatItemCount, formatTaka } from "@/lib/format";
import { AccountPageHeader } from "../AccountNav";
import { ReorderButton } from "./ReorderButton";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

/**
 * Order history (DS-PG-ACCOUNT, FR-USR-05).
 *
 * Each row carries a status chip plus the status text, and a Reorder action
 * that puts the same items back in the cart — the two-tap re-order flow in
 * DS-UX-01.
 */
export default function OrdersPage() {
  if (orders.length === 0) {
    return (
      <>
        <AccountPageHeader title="Orders" />
        <EmptyState
          icon="package"
          title="No orders yet"
          body="When you buy something it will show up here."
          action={{ label: "Start shopping", href: "/" }}
        />
      </>
    );
  }

  return (
    <>
      <AccountPageHeader
        title="Orders"
        description="Track an order, download an invoice or buy the same items again."
      />

      <ul className="flex flex-col gap-4">
        {orders.map((order) => {
          const itemCount = order.lines.reduce((n, l) => n + l.quantity, 0);

          return (
            <li
              key={order.id}
              className="rounded-md border border-hairline p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-name text-ink tabular">
                    Order {order.id}
                  </h2>
                  <p className="mt-0.5 text-sm text-secondary tabular">
                    {formatDate(order.placedAt)} · {formatItemCount(itemCount)}{" "}
                    · {formatTaka(order.total)}
                  </p>
                </div>
                <OrderStatus status={order.status} />
              </div>

              <ul className="mt-3 flex flex-col gap-0.5 text-sm text-secondary">
                {order.lines.map((line) => (
                  <li key={`${order.id}-${line.name}`}>
                    {line.name} — {line.variant} · Qty {line.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/track-order?order=${order.id}`}
                  className="inline-flex min-h-11 items-center gap-1 rounded-xs text-sm font-medium text-ink hover:underline focus-ring"
                >
                  {order.status === "delivered" || order.status === "cancelled"
                    ? "View details"
                    : "Track order"}
                  <Icon name="chevron-right" size={16} />
                </Link>
                <ReorderButton lines={order.lines} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
