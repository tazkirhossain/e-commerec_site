"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup, Radio, Switch } from "@/components/ui/Choice";
import { Input, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Banner } from "@/components/feedback/Banner";
import { EmptyState } from "@/components/feedback/States";
import { CheckoutStepper } from "@/components/blocks/CheckoutStepper";
import { OrderSummary } from "@/components/blocks/OrderSummary";
import { AddressCard, PaymentTile, StoreCard } from "@/components/blocks/Tiles";
import { paymentMethods, type PaymentMethod } from "@/data/payments";
import { addresses, customer } from "@/data/account";
import {
  areasByDistrict,
  districtsByDivision,
  divisions,
} from "@/data/catalog";
import { stores } from "@/data/stores";
import { formatPhone, formatPoints, formatTaka } from "@/lib/format";
import { useCartDetails, useStore } from "@/lib/store";
import { cn } from "@/lib/cn";

/**
 * The three-step checkout (DS-PG-CHECKOUT, FR-ORD-01).
 *
 * Step 1 asks for a phone number first and keeps email optional; guest
 * checkout is allowed and sign-in is offered, not required. Step 2 collects
 * the delivery method, a cascading address and a payment method. Step 3
 * reviews the order behind a terms checkbox.
 *
 * Validation runs on blur and on submit, and the first error takes focus
 * (DS-UX-02).
 */

const FREE_DELIVERY_THRESHOLD = 5000;
const DELIVERY_FEE = 80;
const POINTS_RATE = 1; /* 1 point = ৳ 1 (FR-LOY-03). */

type Step = 1 | 2 | 3;

/** A method is unavailable when the order exceeds its cap (FR-PAY-01). */
function overCap(method: PaymentMethod, total: number): boolean {
  return method.maximumOrder !== undefined && total > method.maximumOrder;
}

export function CheckoutFlow() {
  const router = useRouter();
  const { cartCount, cartSubtotal, hydrated, clearCart } = useStore();
  const lines = useCartDetails();

  const [step, setStep] = useState<Step>(1);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  /* Stays true from the moment the order is created until the confirmation
     page takes over, so clearing the cart does not swap this component for
     the empty-cart state mid-navigation. */
  const [placed, setPlaced] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Step 1 */
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const phoneRef = useRef<HTMLInputElement>(null);

  /* Step 2 */
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [savedAddress, setSavedAddress] = useState<string>(addresses[0].id);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [division, setDivision] = useState<string>(divisions[0]);
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("Dhanmondi");
  const [line, setLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [lineError, setLineError] = useState<string>();
  const [store, setStore] = useState(stores[0].slug);
  const [payment, setPayment] = useState("bkash");
  const [usePoints, setUsePoints] = useState(false);

  /* Step 3 */
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState<string>();

  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading checkout" aria-busy="true">
        <div className="h-10 w-80 animate-shimmer rounded-sm" />
        <div className="mt-8 h-96 animate-shimmer rounded-md" />
      </div>
    );
  }

  if (placed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3 py-24 text-center"
      >
        <span className="size-8 animate-spin rounded-pill border-2 border-hairline border-t-accent" />
        <p className="text-base text-secondary">Taking you to your order…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon="bag"
        title="There is nothing to check out"
        body="Your cart is empty. Add something first."
        action={{ label: "Continue shopping", href: "/" }}
      />
    );
  }

  const pointsRedeemed =
    usePoints
      ? Math.min(customer.points * POINTS_RATE, Math.round(cartSubtotal * 0.2))
      : 0;
  const afterPoints = cartSubtotal - pointsRedeemed;
  const deliveryFee =
    method === "pickup" || afterPoints >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;
  const total = afterPoints + deliveryFee;

  const selectedStore = stores.find((s) => s.slug === store);
  const selectedAddress = addresses.find((a) => a.id === savedAddress);
  const selectedPayment = paymentMethods.find((p) => p.id === payment);

  const addressSummary =
    method === "pickup"
      ? `${selectedStore?.name} · ${selectedStore?.address}`
      : useNewAddress
        ? `${line}, ${area}, ${district}, ${division}`
        : `${selectedAddress?.line}, ${selectedAddress?.area}, ${selectedAddress?.district}`;

  function validPhone(value: string) {
    return /^01\d{9}$/.test(value.replace(/\D/g, ""));
  }

  function submitDetails(event: React.FormEvent) {
    event.preventDefault();
    if (!validPhone(phone)) {
      setPhoneError("Enter an 11-digit number, like 01712-345678");
      /* The first error takes focus and is announced (DS-UX-02). */
      phoneRef.current?.focus();
      return;
    }
    setPhoneError(undefined);
    setStep(2);
  }

  function submitDelivery(event: React.FormEvent) {
    event.preventDefault();
    if (method === "delivery" && useNewAddress && line.trim().length < 5) {
      setLineError("Enter the house and road, so the courier can find you");
      return;
    }
    setLineError(undefined);
    setStep(3);
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();

    if (!terms) {
      setTermsError("Accept the terms to place your order");
      return;
    }

    setTermsError(undefined);
    setPlacing(true);
    setFailed(false);

    /* Stands in for the server call. Order creation is idempotent on the real
       platform (FR-ORD-14), so a double click never creates two orders. */
    window.setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      router.push("/order/VL-24781");
      clearCart();
    }, 900);
  }

  const summary = (
    <OrderSummary
      totals={{
        itemCount: cartCount,
        subtotal: cartSubtotal,
        discount: 0,
        pointsRedeemed,
        deliveryFee,
        total,
      }}
    >
      <ul className="flex flex-col gap-3 border-t border-hairline pt-4">
        {lines.map(({ line: cartLine, product, variant }) => (
          <li
            key={cartLine.sku}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="min-w-0">
              <span className="text-ink">{product.name}</span>
              <span className="block text-caption text-secondary">
                {[variant.color, variant.storage].filter(Boolean).join(" · ")} ·
                Qty {cartLine.quantity}
              </span>
            </span>
            <span className="shrink-0 text-ink tabular">
              {formatTaka(
                (variant.salePrice ?? variant.price) * cartLine.quantity,
              )}
            </span>
          </li>
        ))}
      </ul>
    </OrderSummary>
  );

  return (
    <>
      <CheckoutStepper current={step} className="mb-8" />

      {/* Mobile: the summary collapses to a disclosure at the top. */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3",
            "rounded-sm bg-surface px-4 text-sm font-medium text-ink focus-ring",
          )}
        >
          <span className="flex items-center gap-2">
            <Icon name="bag" size={18} />
            {summaryOpen ? "Hide" : "Show"} order summary
          </span>
          <span className="flex items-center gap-1.5 tabular">
            {formatTaka(total)}
            <Icon name={summaryOpen ? "chevron-up" : "chevron-down"} size={16} />
          </span>
        </button>
        {summaryOpen ? <div className="mt-4">{summary}</div> : null}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="flex flex-col gap-6">
          {failed ? (
            <Banner
              tone="error"
              message="Payment didn't go through. Your cart is unchanged."
              action={{ label: "Try again", onAction: () => setFailed(false) }}
            />
          ) : null}

          {/* ---------------------------------------------- Step 1 */}
          {step === 1 ? (
            <form onSubmit={submitDetails} className="flex flex-col gap-5">
              <div>
                <h1 className="text-title text-ink">Your details</h1>
                <p className="mt-1 text-sm text-secondary">
                  We send order updates by SMS. You can check out as a guest.
                </p>
              </div>

              <Input
                ref={phoneRef}
                label="Phone number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01712-345678"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setPhoneError(undefined);
                }}
                onBlur={() =>
                  setPhoneError(
                    phone && !validPhone(phone)
                      ? "Enter an 11-digit number, like 01712-345678"
                      : undefined,
                  )
                }
                error={phoneError}
                helper="We verify this with a one-time code before delivery."
                className="max-w-md"
              />

              <Input
                label="Email"
                type="email"
                autoComplete="email"
                optional
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                helper="For the receipt and invoice."
                className="max-w-md"
              />

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg">
                  Continue to delivery
                </Button>
                <ButtonLink href="/account/login" variant="tertiary">
                  Sign in instead
                </ButtonLink>
              </div>
            </form>
          ) : (
            <CollapsedStep
              title="Details"
              value={`${formatPhone(phone)} · guest`}
              onEdit={() => setStep(1)}
            />
          )}

          {/* ---------------------------------------------- Step 2 */}
          {step === 2 ? (
            <form onSubmit={submitDelivery} className="flex flex-col gap-8">
              <section aria-labelledby="method-heading">
                <h2 id="method-heading" className="mb-3 text-title text-ink">
                  Delivery method
                </h2>
                <ChoiceGroup legend="How would you like it?">
                  <Radio
                    name="method"
                    checked={method === "delivery"}
                    onChange={() => setMethod("delivery")}
                    label="Home delivery"
                    description="Next day inside Dhaka, 2–4 days elsewhere"
                  />
                  <Radio
                    name="method"
                    checked={method === "pickup"}
                    onChange={() => setMethod("pickup")}
                    label="Store pickup"
                    description="Free, usually ready within two hours"
                  />
                </ChoiceGroup>
              </section>

              {method === "delivery" ? (
                <section aria-labelledby="address-heading">
                  <h2 id="address-heading" className="mb-3 text-title text-ink">
                    Delivery address
                  </h2>

                  <div className="flex flex-col gap-3">
                    {addresses.map((item) => (
                      <AddressCard
                        key={item.id}
                        address={item}
                        selected={!useNewAddress && savedAddress === item.id}
                        onSelect={() => {
                          setUseNewAddress(false);
                          setSavedAddress(item.id);
                        }}
                      />
                    ))}

                    <label
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-2.5",
                        "text-sm text-ink",
                      )}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-block size-[22px] shrink-0 rounded-pill",
                          "border-[1.5px] border-border-strong bg-canvas",
                          "peer-checked:border-[7px] peer-checked:border-ink",
                        )}
                      />
                      Use a new address
                    </label>
                  </div>

                  {useNewAddress ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <Select
                        label="Division"
                        options={[...divisions]}
                        value={division}
                        onChange={(event) => {
                          const next = event.target.value;
                          setDivision(next);
                          /* Cascading lists: reset what is now invalid. */
                          const firstDistrict =
                            districtsByDivision[next]?.[0] ?? "";
                          setDistrict(firstDistrict);
                          setArea(areasByDistrict[firstDistrict]?.[0] ?? "");
                        }}
                      />
                      <Select
                        label="District"
                        options={districtsByDivision[division] ?? []}
                        value={district}
                        onChange={(event) => {
                          setDistrict(event.target.value);
                          setArea(
                            areasByDistrict[event.target.value]?.[0] ?? "",
                          );
                        }}
                      />
                      <Select
                        label="Area or Thana"
                        options={areasByDistrict[district] ?? []}
                        value={area}
                        onChange={(event) => setArea(event.target.value)}
                      />
                      <Input
                        label="Address line"
                        placeholder="House 12, Road 7"
                        value={line}
                        onChange={(event) => {
                          setLine(event.target.value);
                          setLineError(undefined);
                        }}
                        onBlur={() =>
                          setLineError(
                            line && line.trim().length < 5
                              ? "Enter the house and road, so the courier can find you"
                              : undefined,
                          )
                        }
                        error={lineError}
                        className="sm:col-span-2"
                      />
                      <Input
                        label="Landmark"
                        optional
                        placeholder="Near Dhanmondi Lake"
                        value={landmark}
                        onChange={(event) => setLandmark(event.target.value)}
                      />
                    </div>
                  ) : null}
                </section>
              ) : (
                <section aria-labelledby="pickup-heading">
                  <h2 id="pickup-heading" className="mb-3 text-title text-ink">
                    Pick up from
                  </h2>
                  <div className="flex flex-col gap-3">
                    {stores.slice(0, 4).map((item) => (
                      <StoreCard
                        key={item.slug}
                        store={item}
                        selected={store === item.slug}
                        onSelect={() => setStore(item.slug)}
                        stockNote="All items in stock"
                      />
                    ))}
                  </div>
                </section>
              )}

              <section aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="mb-3 text-title text-ink">
                  Payment
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((item) => (
                    <PaymentTile
                      key={item.id}
                      method={{
                        ...item,
                        disabled: overCap(item, total),
                        disabledReason: overCap(item, total)
                          ? `Not available above ${formatTaka(item.maximumOrder!)}`
                          : undefined,
                      }}
                      selected={payment === item.id}
                      onSelect={() => setPayment(item.id)}
                    />
                  ))}
                </div>

                <div className="mt-5 rounded-md border border-hairline p-4">
                  <Switch
                    checked={usePoints}
                    onChange={(event) => setUsePoints(event.target.checked)}
                    label="Use reward points"
                    description={`${formatPoints(customer.points)} available · up to 20% of the order`}
                  />
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg">
                  Continue to review
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              </div>
            </form>
          ) : step === 3 ? (
            <CollapsedStep
              title="Delivery and payment"
              value={`${addressSummary} · ${selectedPayment?.name}`}
              onEdit={() => setStep(2)}
            />
          ) : null}

          {/* ---------------------------------------------- Step 3 */}
          {step === 3 ? (
            <form onSubmit={placeOrder} className="flex flex-col gap-6">
              <h2 className="text-title text-ink">Review your order</h2>

              <ul className="flex flex-col divide-y divide-hairline rounded-md border border-hairline">
                {lines.map(({ line: cartLine, product, variant }) => (
                  <li
                    key={cartLine.sku}
                    className="flex items-start justify-between gap-4 p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-name text-ink">{product.name}</p>
                      <p className="text-sm text-secondary">
                        {[variant.color, variant.storage]
                          .filter(Boolean)
                          .join(" · ")}{" "}
                        · Qty {cartLine.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink tabular">
                      {formatTaka(
                        (variant.salePrice ?? variant.price) * cartLine.quantity,
                      )}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                <dt className="text-secondary">Contact</dt>
                <dd className="text-ink tabular">{formatPhone(phone)}</dd>
                <dt className="text-secondary">
                  {method === "pickup" ? "Pickup" : "Delivery"}
                </dt>
                <dd className="text-ink">{addressSummary}</dd>
                <dt className="text-secondary">Payment</dt>
                <dd className="text-ink">{selectedPayment?.name}</dd>
              </dl>

              <div>
                <Checkbox
                  checked={terms}
                  onChange={(event) => {
                    setTerms(event.target.checked);
                    setTermsError(undefined);
                  }}
                  label={
                    <>
                      I accept the{" "}
                      <Link
                        href="/pages/terms-of-use"
                        className="underline underline-offset-4"
                      >
                        terms of use
                      </Link>{" "}
                      and the{" "}
                      <Link
                        href="/pages/return-policy"
                        className="underline underline-offset-4"
                      >
                        return policy
                      </Link>
                      .
                    </>
                  }
                />
                {termsError ? (
                  <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-caption text-danger">
                    <Icon name="alert-triangle" size={16} />
                    {termsError}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" size="lg" loading={placing}>
                  Place order
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
              </div>
            </form>
          ) : null}
        </div>

        {/* Desktop: the summary stays visible throughout. */}
        <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          {summary}
        </div>
      </div>
    </>
  );
}

/** A finished step, shown as one line with an Edit link. */
function CollapsedStep({
  title,
  value,
  onEdit,
}: {
  title: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md bg-surface p-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <Icon name="check-circle" size={16} className="text-success" />
          {title}
        </p>
        <p className="mt-0.5 truncate text-sm text-secondary">{value}</p>
      </div>
      <Button variant="tertiary" size="sm" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}
