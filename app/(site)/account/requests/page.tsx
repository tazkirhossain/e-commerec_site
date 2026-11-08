import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/States";
import { requests } from "@/data/account";
import { formatDate, formatTaka } from "@/lib/format";
import { cn } from "@/lib/cn";
import { AccountPageHeader } from "../AccountNav";

export const metadata: Metadata = {
  title: "Requests",
  robots: { index: false, follow: false },
};

/** Status styling for the request queue (FR-ORD-12). */
const statusStyles: Record<string, string> = {
  New: "bg-surface text-body",
  Quoted: "bg-success-surface text-success",
  Converted: "bg-surface-strong text-ink",
  Closed: "bg-surface text-secondary",
};

/**
 * Requested orders (DS-PG-ACCOUNT, FR-ORD-12).
 *
 * Items a customer asked for that we do not list or do not have in stock.
 * Staff move them through New, Quoted, Converted and Closed.
 */
export default function RequestsPage() {
  if (requests.length === 0) {
    return (
      <>
        <AccountPageHeader title="Requests" />
        <EmptyState
          icon="mail"
          title="No requests yet"
          body="Ask us for anything we do not list and we will quote you."
          action={{ label: "Request an order", href: "/request-order" }}
        />
      </>
    );
  }

  return (
    <>
      <AccountPageHeader
        title="Requests"
        description="Items you asked us to source. We usually reply within one working day."
      />

      <ul className="flex flex-col gap-4">
        {requests.map((request) => (
          <li key={request.id} className="rounded-md border border-hairline p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-name text-ink">{request.product}</h2>
                <p className="mt-0.5 text-sm text-secondary tabular">
                  {request.id} · {formatDate(request.at)} · budget{" "}
                  {formatTaka(request.budget)}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex h-7 shrink-0 items-center rounded-pill px-2.5",
                  "text-[12px] font-semibold",
                  statusStyles[request.status] ?? "bg-surface text-body",
                )}
              >
                {request.status}
              </span>
            </div>

            {request.note ? (
              <p className="mt-3 rounded-sm bg-surface px-3 py-2.5 text-sm text-body">
                {request.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <ButtonLink href="/request-order" variant="secondary" className="mt-6">
        Request another item
      </ButtonLink>
    </>
  );
}
