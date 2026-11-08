"use client";

import { useRef, useState } from "react";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

/**
 * The request form (FR-ORD-12).
 *
 * Product, link or photo, budget and phone. Validation runs on blur and on
 * submit, and the first error takes focus (DS-UX-02). The confirmation states
 * the response time, as the page spec requires.
 */
export function RequestForm() {
  const [product, setProduct] = useState("");
  const [link, setLink] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<{ product?: string; phone?: string }>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const productRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  function validPhone(value: string) {
    return /^01\d{9}$/.test(value.replace(/\D/g, ""));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const next: typeof errors = {};
    if (product.trim().length < 3) {
      next.product = "Tell us what you are looking for";
    }
    if (!validPhone(phone)) {
      next.phone = "Enter an 11-digit number, like 01712-345678";
    }

    setErrors(next);

    /* The first error in document order takes focus. */
    if (next.product) {
      productRef.current?.focus();
      return;
    }
    if (next.phone) {
      phoneRef.current?.focus();
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-md border border-hairline bg-surface p-6">
        <span className="flex size-12 items-center justify-center rounded-pill bg-success-surface text-success">
          <Icon name="check" size={24} strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-subtitle text-ink">Request received</h2>
        <p className="mt-2 text-base text-body">
          We will text you on{" "}
          <strong className="font-medium tabular">{phone}</strong> with a price
          and availability within one working day. You can follow it in your
          account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/account/requests">View my requests</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
      <Input
        ref={productRef}
        label="What are you looking for?"
        placeholder="Sony Alpha 7 V with 24-70mm lens"
        value={product}
        onChange={(event) => {
          setProduct(event.target.value);
          setErrors((e) => ({ ...e, product: undefined }));
        }}
        onBlur={() =>
          setErrors((e) => ({
            ...e,
            product:
              product && product.trim().length < 3
                ? "Tell us what you are looking for"
                : undefined,
          }))
        }
        error={errors.product}
      />

      <Input
        label="Link or model number"
        optional
        placeholder="A link to the product, or the exact model"
        value={link}
        onChange={(event) => setLink(event.target.value)}
        helper="A link helps us match the exact configuration."
      />

      <Input
        label="Your budget"
        type="text"
        inputMode="numeric"
        optional
        placeholder="৳ 4,00,000"
        value={budget}
        onChange={(event) => setBudget(event.target.value)}
      />

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
          setErrors((e) => ({ ...e, phone: undefined }));
        }}
        onBlur={() =>
          setErrors((e) => ({
            ...e,
            phone:
              phone && !validPhone(phone)
                ? "Enter an 11-digit number, like 01712-345678"
                : undefined,
          }))
        }
        error={errors.phone}
        helper="We reply by SMS."
      />

      <Textarea
        label="Anything else"
        optional
        rows={3}
        placeholder="Colour, storage, how soon you need it"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <Button type="submit" className="self-start">
        Send request
      </Button>
    </form>
  );
}
