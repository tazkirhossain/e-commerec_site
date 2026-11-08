"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Banner } from "@/components/feedback/Banner";

/**
 * Newsletter sign-up (FR-CMS-09).
 *
 * One email field, one submit, and a single line of consent above the button —
 * recording consent is the point, so it is stated rather than buried. There is
 * no backend here, so a successful submit shows the confirmation the real
 * endpoint would trigger.
 */

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();

    /* Validate on submit, and keep the message about what to do next. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a full email, like name@mail.com");
      return;
    }

    setError(undefined);
    setDone(true);
  }

  if (done) {
    return (
      <Banner
        tone="success"
        message="You are on the list. Check your inbox to confirm."
      />
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div>
        <h2 className="text-strong font-medium text-ink">
          Get early access to launches
        </h2>
        <p className="mt-0.5 text-sm text-secondary">
          One email a week. Unsubscribe any time.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() =>
          setError(
            email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
              ? "Enter a full email, like name@mail.com"
              : undefined,
          )
        }
        error={error}
      />

      <Button type="submit" variant="secondary" size="md">
        Subscribe
      </Button>
    </form>
  );
}
