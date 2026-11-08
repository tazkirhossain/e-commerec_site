"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Banner } from "@/components/feedback/Banner";
import { OrderStatus } from "@/components/commerce/Status";
import { OrderTimeline } from "@/components/blocks/OrderTimeline";
import { getOrder } from "@/data/account";
import type { Order } from "@/data/types";
import { formatDate, formatItemCount, formatPhone, formatTaka } from "@/lib/format";

/**
 * The lookup form and result (FR-ORD-10).
 *
 * The real endpoint checks the order number against the phone it was placed
 * with. Here the sample orders all belong to one number, so any valid phone
 * is accepted and the order number is what resolves the lookup.
 */
export function TrackForm() {
  const params = useSearchParams();
  const prefilled = params.get("order") ?? "";

  const [orderNumber, setOrderNumber] = useState(prefilled);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string>();
  /* Arriving from a confirmation link looks the order up straight away.
     This component only ever renders on the client — the page keeps it behind
     a Suspense boundary because it reads the query string — so resolving the
     order in the initialiser is safe and avoids a second render. */
  const [result, setResult] = useState<Order | undefined>(() =>
    prefilled ? getOrder(prefilled) : undefined,
  );

  const orderRef = useRef<HTMLInputElement>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const found = getOrder(orderNumber.trim());
    if (!found) {
      setError(
        "We couldn't find that order. Check the number on your confirmation SMS.",
      );
      setResult(undefined);
      orderRef.current?.focus();
      return;
    }

    setError(undefined);
    setResult(found);
  }

  const itemCount =
    result?.lines.reduce((n, line) => n + line.quantity, 0) ?? 0;

  return (
    <>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            ref={orderRef}
            label="Order number"
            placeholder="VL-24781"
            value={orderNumber}
            onChange={(event) => {
              setOrderNumber(event.target.value);
              setError(undefined);
            }}
            error={error}
          />
          <Input
            label="Phone number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="01712-345678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <Button type="submit" className="self-start">
          Track
        </Button>
      </form>

      {result ? (
        <section
          aria-labelledby="result-heading"
          className="mt-10 rounded-md border border-hairline p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="result-heading" className="text-subtitle text-ink tabular">
                Order {result.id}
              </h2>
              <p className="mt-0.5 text-sm text-secondary tabular">
                Placed {formatDate(result.placedAt)} ·{" "}
                {formatItemCount(itemCount)} · {formatTaka(result.total)}
              </p>
            </div>
            <OrderStatus status={result.status} />
          </div>

          {result.status === "cancelled" ? (
            <Banner
              tone="warning"
              message="This order was cancelled. Any payment has been refunded to the original method."
              className="mt-4"
            />
          ) : null}

          <div className="mt-6">
            <OrderTimeline timeline={result.timeline} />
          </div>

          <dl className="mt-2 grid grid-cols-[120px_1fr] gap-y-2 border-t border-hairline pt-4 text-sm">
            <dt className="text-secondary">
              {result.method === "pickup" ? "Pickup" : "Delivering to"}
            </dt>
            <dd className="text-ink">{result.address}</dd>
            <dt className="text-secondary">Contact</dt>
            <dd className="text-ink tabular">{formatPhone(result.phone)}</dd>
            <dt className="text-secondary">Payment</dt>
            <dd className="text-ink">{result.paymentMethod}</dd>
          </dl>

          <ul className="mt-5 flex flex-col gap-1 border-t border-hairline pt-4 text-sm text-secondary">
            {result.lines.map((line) => (
              <li key={line.name}>
                {line.name} — {line.variant} · Qty {line.quantity}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/pages/contact-us" variant="secondary" size="md">
              Contact support
            </ButtonLink>
            {result.status === "delivered" ? (
              <ButtonLink
                href="/pages/return-policy"
                variant="tertiary"
                size="md"
              >
                Request a return
              </ButtonLink>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
