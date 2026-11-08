import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Banner } from "@/components/feedback/Banner";
import { customer, pointsLedger } from "@/data/account";
import { formatDate, formatPoints, formatTaka, groupLakh } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AccountPageHeader } from "../AccountNav";

export const metadata: Metadata = {
  title: "Reward points",
  robots: { index: false, follow: false },
};

/**
 * Reward points balance and ledger (DS-PG-ACCOUNT, FR-LOY-02).
 *
 * Points are credited when an order reaches Delivered, so a pending entry is
 * shown as such rather than counted in the balance.
 */
export default function PointsPage() {
  const sorted = [...pointsLedger].sort((a, b) => b.at.localeCompare(a.at));
  /* Fixed rather than read from the clock, so the page prerenders. */
  const today = "2026-11-06";

  return (
    <>
      <AccountPageHeader
        title="Reward points"
        description="Earned on delivered orders. Redeem against up to 20% of a later order."
      />

      <div className="rounded-md bg-surface p-6">
        <p className="text-sm text-secondary">Available balance</p>
        <p className="mt-1 text-rating leading-none text-ink tabular">
          {groupLakh(customer.points)}
        </p>
        <p className="mt-2 text-sm text-secondary tabular">
          points · worth about {formatTaka(customer.points)} off your next order
        </p>
      </div>

      <Banner
        tone="info"
        message="Points are credited once an order reaches Delivered, and reversed if it is cancelled or returned."
        className="mt-5"
      />

      <h2 className="mt-8 mb-3 text-strong text-ink">History</h2>
      <ul className="flex flex-col divide-y divide-hairline">
        {sorted.map((entry) => {
          const pending = entry.at > today;
          const earned = entry.points > 0;

          return (
            <li
              key={entry.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div className="flex min-w-0 gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center",
                    "rounded-pill",
                    pending
                      ? "bg-surface text-secondary"
                      : earned
                        ? "bg-success-surface text-success"
                        : "bg-surface-strong text-ink",
                  )}
                >
                  <Icon
                    name={pending ? "clock" : earned ? "plus" : "minus"}
                    size={16}
                    strokeWidth={2}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink">{entry.note}</p>
                  <p className="text-caption text-secondary tabular">
                    {formatDate(entry.at)}
                    {pending ? " · pending delivery" : ""}
                  </p>
                </div>
              </div>

              <p
                className={cn(
                  "shrink-0 text-sm font-semibold tabular",
                  pending
                    ? "text-secondary"
                    : earned
                      ? "text-success"
                      : "text-ink",
                )}
              >
                {earned ? "+" : "−"}
                {formatPoints(Math.abs(entry.points))}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
