"use client";

import type { Address, Store } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { isStoreOpen } from "@/data/stores";
import type { PaymentMethod } from "@/data/payments";
import { useNow } from "@/lib/client-store";
import { formatPhone } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Selectable tiles for checkout (DS-CMP-PAY, DS-CMP-ADDRESS, DS-CMP-STORECARD).
 *
 * Each is a radio card: the whole tile is the label, and the selected one gets
 * a 2px ink border. Built on real radio inputs so arrow keys move through the
 * group and the choice submits with the form.
 */

function tileClasses(selected: boolean) {
  return cn(
    "flex cursor-pointer items-start gap-3.5 rounded-md border bg-canvas p-4",
    "transition-colors duration-[--motion-fast] ease-[--ease-standard]",
    selected
      ? "border-2 border-ink p-[15px]"
      : "border-hairline hover:bg-surface",
    "has-focus-visible:outline-2 has-focus-visible:outline-offset-2",
    "has-focus-visible:outline-accent",
  );
}

/** The drawn radio dot shared by every tile. */
function RadioDot() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 inline-block size-[22px] shrink-0 rounded-pill bg-canvas",
        "border-[1.5px] border-border-strong",
        "transition-[border-width,border-color] duration-[--motion-fast]",
        "peer-checked:border-[7px] peer-checked:border-ink",
      )}
    />
  );
}

/* ---------------------------------------------------------- Payment tile */

export function PaymentTile({
  method,
  selected,
  onSelect,
  name = "payment",
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  name?: string;
}) {
  return (
    <label
      className={cn(
        tileClasses(selected),
        method.disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        type="radio"
        name={name}
        value={method.id}
        checked={selected}
        disabled={method.disabled}
        onChange={onSelect}
        className="peer sr-only"
      />
      <RadioDot />

      <span
        aria-hidden="true"
        style={{ backgroundColor: method.markColor }}
        className={cn(
          "inline-flex h-8 w-11 shrink-0 items-center justify-center",
          "rounded-xs text-[10px] font-bold text-white",
        )}
      >
        {method.mark}
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-ink">{method.name}</span>
        <span className="text-sm text-secondary">
          {method.disabled && method.disabledReason
            ? method.disabledReason
            : method.note}
        </span>
      </span>
    </label>
  );
}

/* ---------------------------------------------------------- Address card */

export function AddressCard({
  address,
  selected,
  onSelect,
  name = "address",
  /** Account page actions, which the checkout form does not show. */
  onEdit,
  onRemove,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  name?: string;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  const summary = `${address.line}, ${address.area}, ${address.district}`;

  /* Without `onSelect` this is a plain card on the account page, not a radio. */
  if (!onSelect) {
    return (
      <div className="flex flex-col gap-3 rounded-md border border-hairline bg-canvas p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              {address.label}
              {address.isDefault ? (
                <span className="rounded-pill bg-surface px-2 py-0.5 text-caption font-normal text-secondary">
                  Default
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-sm text-secondary">
              {summary} · {formatPhone(address.phone)}
            </p>
          </div>
        </div>

        {onEdit || onRemove ? (
          <div className="flex gap-4">
            {onEdit ? (
              <Button variant="tertiary" size="sm" onClick={onEdit}>
                Edit
              </Button>
            ) : null}
            {onRemove ? (
              <Button variant="tertiary" size="sm" onClick={onRemove}>
                Remove
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <label className={tileClasses(Boolean(selected))}>
      <input
        type="radio"
        name={name}
        value={address.id}
        checked={selected}
        onChange={onSelect}
        className="peer sr-only"
      />
      <RadioDot />
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-ink">{address.label}</span>
        <span className="text-sm text-secondary">
          {summary} · {formatPhone(address.phone)}
        </span>
      </span>
    </label>
  );
}

/* ------------------------------------------------------------ Store card */

/**
 * Whether the store is open right now, or `null` before the clock resolves.
 *
 * The clock is request-time data: reading it during the first render would
 * make the server HTML and the client disagree. `useNow` returns null until
 * after hydration, which keeps the card prerenderable and the markup stable.
 */
export function useIsOpenNow(store: Store): boolean | null {
  const now = useNow();
  return now ? isStoreOpen(store, now) : null;
}

export function StoreCard({
  store,
  /** Renders as a selectable pickup option instead of an information card. */
  selected,
  onSelect,
  name = "store",
  /** Shown on the pickup step: whether this branch holds the item. */
  stockNote,
  className,
}: {
  store: Store;
  selected?: boolean;
  onSelect?: () => void;
  name?: string;
  stockNote?: string;
  className?: string;
}) {
  const open = useIsOpenNow(store);

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-strong text-ink">{store.name}</h3>
        {open === null ? null : (
          <OpenBadge open={open} opensAt={store.opensAt} />
        )}
      </div>

      <p className="mt-1.5 text-sm text-secondary">{store.address}</p>
      <p className="mt-0.5 text-sm text-secondary tabular">
        {store.hours} · {formatPhone(store.phone)}
        {store.distanceKm !== undefined ? ` · ${store.distanceKm} km` : ""}
      </p>

      {stockNote ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
          <Icon name="check" size={16} strokeWidth={2} />
          {stockNote}
        </p>
      ) : null}
    </>
  );

  if (onSelect) {
    return (
      <label className={cn(tileClasses(Boolean(selected)), className)}>
        <input
          type="radio"
          name={name}
          value={store.slug}
          checked={selected}
          onChange={onSelect}
          className="peer sr-only"
        />
        <RadioDot />
        <span className="flex min-w-0 flex-col">{body}</span>
      </label>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md border border-hairline bg-canvas p-5 shadow-(--shadow-1)",
        className,
      )}
    >
      {body}

      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
          external
          variant="secondary"
          size="md"
          iconLeading="navigation"
          iconTrailing={"chevron-right" as IconName}
        >
          Directions
        </ButtonLink>
        <ButtonLink
          href={`tel:+88${store.phone}`}
          variant="secondary"
          size="md"
          iconLeading="phone"
        >
          Call store
        </ButtonLink>
      </div>
    </div>
  );
}

function OpenBadge({ open, opensAt }: { open: boolean; opensAt: string }) {
  const [hour, minute] = opensAt.split(":").map(Number);
  const display = `${hour > 12 ? hour - 12 : hour}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "pm" : "am"}`;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5",
        "text-badge font-semibold",
        open
          ? "bg-success-surface text-success"
          : "bg-surface text-secondary",
      )}
    >
      <Icon name={open ? "check" : "clock"} size={14} strokeWidth={2} />
      {open ? "Open now" : `Opens ${display}`}
    </span>
  );
}
