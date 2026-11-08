"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/Swatch";
import { Banner } from "@/components/feedback/Banner";
import { formatPhone } from "@/lib/format";

/**
 * The sign-in card (DS-PG-AUTH).
 *
 * Two stages: ask for a phone number or email, then ask for the six-digit
 * code. The resend countdown stands in for the rate limit the real endpoint
 * applies per phone, email and IP (FR-USR-08).
 */

const RESEND_SECONDS = 42;

export function SignInCard() {
  const router = useRouter();
  const [channel, setChannel] = useState("phone");
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState<string>();
  const [stage, setStage] = useState<"contact" | "code">("contact");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const contactRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  /* Count the resend window down while the code stage is open. */
  useEffect(() => {
    if (stage !== "code" || seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [stage, seconds]);

  useEffect(() => {
    if (stage === "code") codeRef.current?.focus();
  }, [stage]);

  function validContact(value: string) {
    return channel === "phone"
      ? /^01\d{9}$/.test(value.replace(/\D/g, ""))
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function sendCode(event: React.FormEvent) {
    event.preventDefault();

    if (!validContact(contact)) {
      setContactError(
        channel === "phone"
          ? "Enter an 11-digit number, like 01712-345678"
          : "Enter a full email, like name@mail.com",
      );
      contactRef.current?.focus();
      return;
    }

    setContactError(undefined);
    setSeconds(RESEND_SECONDS);
    setStage("code");
  }

  function verify(event: React.FormEvent) {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setCodeError("Enter the six digits we sent you");
      codeRef.current?.focus();
      return;
    }

    setCodeError(undefined);
    /* No auth backend here, so land on the account overview. */
    router.push("/account");
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-(--shadow-1) sm:p-8">
        <h1 className="text-title text-ink">Sign in or create an account</h1>
        <p className="mt-1.5 text-sm text-secondary">
          We send a one-time code. No password needed.
        </p>

        {stage === "contact" ? (
          <form onSubmit={sendCode} className="mt-6 flex flex-col gap-5">
            <SegmentedControl
              label="Send the code to"
              value={channel}
              onChange={(next) => {
                setChannel(next);
                setContact("");
                setContactError(undefined);
              }}
              options={[
                { value: "phone", label: "Phone" },
                { value: "email", label: "Email" },
              ]}
            />

            <Input
              ref={contactRef}
              key={channel}
              label={channel === "phone" ? "Phone number" : "Email address"}
              type={channel === "phone" ? "tel" : "email"}
              inputMode={channel === "phone" ? "numeric" : "email"}
              autoComplete={channel === "phone" ? "tel" : "email"}
              placeholder={
                channel === "phone" ? "01712-345678" : "name@mail.com"
              }
              value={contact}
              onChange={(event) => {
                setContact(event.target.value);
                setContactError(undefined);
              }}
              onBlur={() =>
                setContactError(
                  contact && !validContact(contact)
                    ? channel === "phone"
                      ? "Enter an 11-digit number, like 01712-345678"
                      : "Enter a full email, like name@mail.com"
                    : undefined,
                )
              }
              error={contactError}
            />

            <Button type="submit" fullWidth>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-6 flex flex-col gap-5">
            <Banner
              tone="info"
              message={
                <>
                  Code sent to{" "}
                  <strong className="font-medium">
                    {channel === "phone" ? formatPhone(contact) : contact}
                  </strong>
                  .
                </>
              }
            />

            <Input
              ref={codeRef}
              label="One-time code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="······"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                setCodeError(undefined);
              }}
              error={codeError}
              className="[&_input]:tracking-[0.5em]"
            />

            <Button type="submit" fullWidth>
              Verify and continue
            </Button>

            <div className="flex items-center justify-between gap-3 text-sm">
              {seconds > 0 ? (
                <p className="text-secondary tabular" aria-live="polite">
                  Resend code in 0:{String(seconds).padStart(2, "0")}
                </p>
              ) : (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setSeconds(RESEND_SECONDS)}
                >
                  Resend code
                </Button>
              )}
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setStage("contact")}
              >
                Change {channel === "phone" ? "number" : "email"}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-6 border-t border-hairline pt-5 text-caption text-secondary">
          By continuing you accept our{" "}
          <Link
            href="/pages/terms-of-use"
            className="underline underline-offset-4 hover:text-ink"
          >
            terms of use
          </Link>{" "}
          and{" "}
          <Link
            href="/pages/privacy-policy"
            className="underline underline-offset-4 hover:text-ink"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
