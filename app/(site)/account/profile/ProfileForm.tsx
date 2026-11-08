"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { ChoiceGroup, Radio, Switch } from "@/components/ui/Choice";
import { Banner } from "@/components/feedback/Banner";
import { Modal } from "@/components/feedback/Overlay";
import { customer } from "@/data/account";
import { formatPhone } from "@/lib/format";
import { useStore } from "@/lib/store";

/**
 * The profile form.
 *
 * Marketing consent is opt-in and separate from order notices, which are part
 * of the service and always sent (FR-NTF-04). Account deletion is destructive
 * and confirms in a modal (DS-UX-02).
 */
export function ProfileForm() {
  const { showToast } = useStore();

  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [language, setLanguage] = useState<"en" | "bn">(customer.language);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function save(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    showToast("Profile saved");
  }

  return (
    <>
      {saved ? (
        <Banner tone="success" message="Profile saved." className="mb-5" />
      ) : null}

      <form onSubmit={save} className="flex max-w-lg flex-col gap-5">
        <Input
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSaved(false);
          }}
        />

        <Input
          label="Phone number"
          type="tel"
          value={formatPhone(customer.phone)}
          disabled
          helper="Your phone number is your sign-in. Contact support to change it."
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          optional
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSaved(false);
          }}
          helper="Receipts and invoices are sent here."
        />

        <ChoiceGroup legend="Preferred language">
          <Radio
            name="language"
            checked={language === "en"}
            onChange={() => setLanguage("en")}
            label="English"
          />
          <Radio
            name="language"
            checked={language === "bn"}
            onChange={() => setLanguage("bn")}
            label={<span lang="bn">বাংলা</span>}
          />
        </ChoiceGroup>

        <div className="rounded-md border border-hairline p-4">
          <Switch
            checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)}
            label="Offers and launch news"
            description="One email a week. Order updates are sent either way."
          />
        </div>

        <Button type="submit" className="self-start">
          Save changes
        </Button>
      </form>

      <section
        aria-labelledby="data-heading"
        className="mt-10 border-t border-hairline pt-6"
      >
        <h2 id="data-heading" className="text-strong text-ink">
          Your data
        </h2>
        <p className="mt-1 max-w-prose text-sm text-secondary">
          You can download everything we hold about you, or ask us to delete
          your account. Orders and invoices are kept for the period tax law
          requires.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="md"
            iconLeading="share"
            onClick={() => showToast("We will email your data within 30 days")}
          >
            Request my data
          </Button>
          <Button
            variant="tertiary"
            size="md"
            onClick={() => setConfirmDelete(true)}
          >
            Delete my account
          </Button>
        </div>
      </section>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete your account?"
        description="This removes your profile, saved addresses, wishlist and reward points. Order and invoice records are kept for the period tax law requires. This cannot be undone."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmDelete(false);
                showToast("Deletion requested. We will confirm by SMS.");
              }}
            >
              Request deletion
            </Button>
          </div>
        }
      >
        <span />
      </Modal>
    </>
  );
}
