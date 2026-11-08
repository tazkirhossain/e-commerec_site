"use client";

import { useState } from "react";
import Link from "next/link";
import { emiPlans } from "@/data/catalog";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { formatTaka, monthlyInstalment } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * EMI calculator (DS-CMP-EMI).
 *
 * Bank and tenure pickers, the monthly amount in the large price size, a note
 * on 0% eligibility, and a link to terms. Every offer states the total payable,
 * the interest and any fee before payment (FR-EMI-04) — which is why the
 * breakdown is shown here rather than only at checkout.
 */

export function EmiCalculator({
  /** The amount being financed. */
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const [bank, setBank] = useState(emiPlans[0].bank);
  const [tenure, setTenure] = useState(12);

  const plan = emiPlans.find((p) => p.bank === bank) ?? emiPlans[0];
  /* Keep the tenure valid when the bank changes. */
  const activeTenure = plan.tenures.includes(tenure)
    ? tenure
    : plan.tenures[plan.tenures.length - 1];

  const eligible = amount >= plan.minimumAmount;
  const monthly = monthlyInstalment(amount, activeTenure, plan.interestRate);
  const totalPayable = monthly * activeTenure;
  const interest = totalPayable - amount;

  return (
    <section
      aria-labelledby="emi-heading"
      className={cn(
        "rounded-md border border-hairline bg-canvas p-5 shadow-(--shadow-1)",
        className,
      )}
    >
      <div className="mb-4">
        <h3 id="emi-heading" className="text-strong text-ink">
          EMI calculator
        </h3>
        <p className="mt-0.5 text-sm text-secondary">
          0% EMI on {emiPlans.filter((p) => p.interestRate === 0).length * 5} bank
          credit cards
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Bank</legend>
          <div className="flex flex-wrap gap-2">
            {emiPlans.map((p) => (
              <Chip
                key={p.bank}
                variant={p.bank === bank ? "selected" : "default"}
                onClick={() => setBank(p.bank)}
              >
                {p.bank}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Tenure</legend>
          <div className="flex flex-wrap gap-2">
            {plan.tenures.map((months) => (
              <Chip
                key={months}
                variant={months === activeTenure ? "selected" : "default"}
                onClick={() => setTenure(months)}
              >
                {months} mo
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="rounded-sm bg-surface p-4">
          {eligible ? (
            <>
              <p className="text-sm text-secondary">Monthly payment</p>
              <p className="mt-0.5 text-price-lg font-semibold text-ink tabular">
                {formatTaka(monthly)}
              </p>

              <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
                <dt className="text-secondary">Total payable</dt>
                <dd className="text-right text-ink tabular">
                  {formatTaka(totalPayable)}
                </dd>
                <dt className="text-secondary">Interest</dt>
                <dd className="text-right text-ink tabular">
                  {interest <= 0 ? "None" : formatTaka(interest)}
                </dd>
                <dt className="text-secondary">Processing fee</dt>
                <dd className="text-right text-ink">Set by your bank</dd>
              </dl>

              <p
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-sm font-medium",
                  plan.interestRate === 0 ? "text-success" : "text-warning",
                )}
              >
                <Icon
                  name={plan.interestRate === 0 ? "check-circle" : "info"}
                  size={16}
                />
                {plan.interestRate === 0
                  ? "0% interest eligible"
                  : `${plan.interestRate}% annual interest applies`}
              </p>
            </>
          ) : (
            <p className="flex items-start gap-2 text-sm text-secondary">
              <Icon name="info" size={16} className="mt-0.5 shrink-0" />
              {plan.bank} needs an order of at least{" "}
              {formatTaka(plan.minimumAmount)} for an EMI plan.
            </p>
          )}
        </div>

        <Link
          href="/pages/emi-and-payments"
          className={cn(
            "inline-flex min-h-11 items-center gap-1 self-start rounded-xs",
            "text-sm font-medium text-ink underline underline-offset-4",
            "focus-ring",
          )}
        >
          EMI terms
          <Icon name="chevron-right" size={16} />
        </Link>
      </div>
    </section>
  );
}
