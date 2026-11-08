import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Checkout stepper (DS-CMP-STEPPER).
 *
 * Three steps as numbered circles joined by a line: the current step in accent,
 * completed steps with a check. Rendered as an ordered list so the sequence and
 * the current position are conveyed without relying on the drawing.
 */

export const checkoutSteps = [
  "Details",
  "Delivery and payment",
  "Review",
] as const;

export function CheckoutStepper({
  /** 1-based. */
  current,
  className,
}: {
  current: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <nav aria-label="Checkout progress" className={className}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {checkoutSteps.map((label, index) => {
          const step = index + 1;
          const done = step < current;
          const active = step === current;

          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 sm:gap-3",
                /* The current step keeps its label on mobile; others hide it. */
                active ? "flex-1 sm:flex-none" : "",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex size-8 shrink-0 items-center justify-center",
                  "rounded-pill text-sm font-medium",
                  done && "bg-ink text-on-inverse",
                  active && "bg-accent text-on-accent",
                  !done && !active && "border border-border-strong text-secondary",
                )}
              >
                {done ? (
                  <Icon name="check" size={16} strokeWidth={2.5} />
                ) : (
                  step
                )}
              </span>

              <span
                className={cn(
                  "text-sm whitespace-nowrap",
                  active ? "font-medium text-ink" : "text-secondary",
                  /* Only the current label survives the narrowest screens. */
                  active ? "inline" : "hidden sm:inline",
                )}
              >
                {label}
                <span className="sr-only">
                  {done ? " — completed" : active ? " — current step" : ""}
                </span>
              </span>

              {step < checkoutSteps.length ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-1 h-0.5 w-6 shrink-0 sm:w-10",
                    done ? "bg-ink" : "bg-hairline",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
