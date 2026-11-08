"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Container as Shell } from "@/components/ui/Container";
import { OrderTimeline } from "@/components/blocks/OrderTimeline";
import { getOrder, orders } from "@/data/account";
import { formatDate, formatItemCount, formatPhone, formatTaka } from "@/lib/format";

export async function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export async function generateMetadata(
  props: PageProps<"/order/[id]">,
): Promise<Metadata> {
  "use cache";
  const { id } = await props.params;
  return {
    title: `Order ${id}`,
    description: "Your Voltra order confirmation.",
    robots: { index: false, follow: false },
  };
}

/**
 * Order confirmation (DS-PG-CHECKOUT item 6).
 *
 * A large check, the order number, the status timeline, the totals, and the
 * two actions — Track order and Continue shopping. A payment failure shows an
 * error banner with a retry and keeps the cart intact, which is handled on the
 * checkout page itself rather than here.
 */
export default async function OrderConfirmationPage(
  props: PageProps<"/order/[id]">,
) {
  const { id } = await props.params;
  const order = getOrder(id);
  if (!order) notFound();

  const itemCount = order.lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <Shell className="py-10 lg:py-16">
      <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-pill bg-success-surface text-success">
          <Icon name="check" size={32} strokeWidth={2.5} />
        </span>

        <h1 className="mt-5 type-display text-ink">Order placed</h1>
        <p className="mt-2 text-lg text-body">
          Order <strong className="font-semibold tabular">{order.id}</strong>.
          We sent a confirmation to {formatPhone(order.phone)}.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-[680px] flex-col gap-8">
        <section
          aria-labelledby="timeline-heading"
          className="rounded-md border border-hairline p-5 sm:p-6"
        >
          <h2 id="timeline-heading" className="mb-5 text-strong text-ink">
            What happens next
          </h2>
          <OrderTimeline timeline={order.timeline} />
        </section>

        <section
          aria-labelledby="order-details-heading"
          className="rounded-md border border-hairline p-5 sm:p-6"
        >
          <h2 id="order-details-heading" className="mb-4 text-strong text-ink">
            Your order
          </h2>

          <ul className="flex flex-col divide-y divide-hairline-soft">
            {order.lines.map((line) => (
              <li
                key={`${line.name}-${line.variant}`}
                className="flex items-start justify-between gap-4 py-3 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="text-name text-ink">{line.name}</p>
                  <p className="text-sm text-secondary">
                    {line.variant} · Qty {line.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-ink tabular">
                  {formatTaka(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-col gap-2 border-t border-hairline pt-4 text-sm">
            <Row
              label={`Subtotal (${formatItemCount(itemCount)})`}
              value={formatTaka(order.subtotal)}
            />
            {order.discount > 0 ? (
              <Row
                label="Discount"
                value={`− ${formatTaka(order.discount)}`}
                tone="danger"
              />
            ) : null}
            <Row
              label={order.method === "pickup" ? "Pickup" : "Delivery"}
              value={
                order.deliveryFee === 0 ? "Free" : formatTaka(order.deliveryFee)
              }
            />
            <Row label="Payment" value={order.paymentMethod} />
            <Row
              label={order.method === "pickup" ? "Ready by" : "Expected"}
              value={formatDate(order.expectedDelivery)}
            />

            <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-hairline pt-3">
              <dt className="text-strong text-ink">Total</dt>
              <dd className="text-price-lg font-semibold text-ink tabular">
                {formatTaka(order.total)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-secondary">
            {order.method === "pickup" ? "Collect from" : "Delivering to"}{" "}
            {order.address}
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <ButtonLink href={`/track-order?order=${order.id}`}>
            Track order
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    </Shell>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-secondary">{label}</dt>
      <dd
        className={tone === "danger" ? "text-danger tabular" : "text-ink tabular"}
      >
        {value}
      </dd>
    </div>
  );
}
