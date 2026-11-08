"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AddressCard } from "@/components/blocks/Tiles";
import { Modal } from "@/components/feedback/Overlay";
import { EmptyState } from "@/components/feedback/States";
import type { Address } from "@/data/types";
import { useStore } from "@/lib/store";

/**
 * The saved-address list, with the confirm-before-remove flow.
 *
 * Removing an address is destructive and not reversible by a toast, so it
 * goes through a modal (DS-UX-02).
 */
export function AddressList({ initial }: { initial: Address[] }) {
  const { showToast } = useStore();
  const [items, setItems] = useState(initial);
  const [pendingRemoval, setPendingRemoval] = useState<Address>();

  function remove(address: Address) {
    setItems((current) => current.filter((a) => a.id !== address.id));
    setPendingRemoval(undefined);
    showToast(`${address.label} removed`);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="map-pin"
        title="No saved addresses"
        body="Add one at checkout and it will be saved here."
        action={{ label: "Start shopping", href: "/" }}
      />
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((address) => (
          <li key={address.id}>
            <AddressCard
              address={address}
              onEdit={() => showToast("Address editing is not wired up yet")}
              onRemove={() => setPendingRemoval(address)}
            />
          </li>
        ))}
      </ul>

      <Button
        variant="secondary"
        iconLeading="plus"
        className="mt-6"
        onClick={() => showToast("Add an address at checkout")}
      >
        Add an address
      </Button>

      <Modal
        open={Boolean(pendingRemoval)}
        onClose={() => setPendingRemoval(undefined)}
        title={`Remove ${pendingRemoval?.label ?? "address"}?`}
        description={`"${pendingRemoval?.label}" will be removed from your saved addresses. You can add it again later.`}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setPendingRemoval(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => pendingRemoval && remove(pendingRemoval)}
            >
              Remove
            </Button>
          </div>
        }
      >
        <span />
      </Modal>
    </>
  );
}
