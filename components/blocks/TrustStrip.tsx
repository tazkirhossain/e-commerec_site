import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Trust strip (DS-CMP-TRUST).
 *
 * Five items, icon plus label, on the surface token with no borders. Scrolls
 * horizontally on mobile rather than wrapping, so the row stays one line.
 */

const items: { icon: IconName; label: string }[] = [
  { icon: "shield-check", label: "Authorized reseller" },
  { icon: "package", label: "Official product" },
  { icon: "credit-card", label: "0% EMI up to 24 months" },
  { icon: "repeat", label: "Exchange your old device" },
  { icon: "shield", label: "Secure payment" },
];

export function TrustStrip({ className }: { className?: string }) {
  return (
    <section aria-label="Why buy from Voltra" className={className}>
      <ul
        className={cn(
          "scroll-shelf flex gap-8 rounded-lg bg-surface px-6 py-5",
          "sm:justify-between sm:gap-4 sm:px-10",
        )}
      >
        {items.map((item) => (
          <li
            key={item.label}
            className="flex shrink-0 items-center gap-3 text-sm font-medium text-ink"
          >
            <Icon name={item.icon} size={24} className="text-secondary" />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
