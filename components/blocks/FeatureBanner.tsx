import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ProductImage } from "@/components/commerce/ProductImage";
import { cn } from "@/lib/cn";

/**
 * Feature banner (DS-PG-HOME item 5).
 *
 * One full-width promo at the extra-large radius. No more than one promotional
 * banner is visible per viewport, so the home page carries exactly one.
 */
export function FeatureBanner({
  eyebrow,
  headline,
  body,
  cta,
  className,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
  className?: string;
}) {
  return (
    <section
      aria-labelledby="feature-banner-heading"
      className={cn(
        "overflow-hidden rounded-xl bg-surface",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-8 p-8 lg:flex-row lg:gap-16 lg:p-12">
        <div className="flex flex-1 flex-col items-start gap-3">
          <span className="text-sm font-medium text-accent">{eyebrow}</span>
          <h2
            id="feature-banner-heading"
            className="text-title text-balance text-ink lg:text-hero"
          >
            {headline}
          </h2>
          <p className="max-w-md text-base text-body">{body}</p>
          <ButtonLink href={cta.href} className="mt-2">
            {cta.label}
          </ButtonLink>
        </div>

        <div className="w-full lg:w-[40%]">
          <ProductImage
            alt=""
            ratio="four-three"
            shape="phone"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="bg-canvas"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Store and service band (DS-PG-HOME item 8): nearest store, the EMI and
 * exchange explainer, and reward points — three quiet links, not a promo.
 */

const services: {
  icon: IconName;
  title: string;
  body: string;
  action: { label: string; href: string };
}[] = [
  {
    icon: "map-pin",
    title: "Find your nearest store",
    body: "Eight outlets in Dhaka, Chattogram and Sylhet, with pickup from two hours.",
    action: { label: "Store locator", href: "/store-locator" },
  },
  {
    icon: "credit-card",
    title: "EMI and exchange",
    body: "0% EMI up to 24 months on fifteen banks, and a quote for your old device.",
    action: { label: "How EMI works", href: "/pages/emi-and-payments" },
  },
  {
    icon: "award",
    title: "Reward points",
    body: "Earn on every delivered order and spend them against the next one.",
    action: { label: "See your points", href: "/account/points" },
  },
];

export function ServiceBand({ className }: { className?: string }) {
  return (
    <section aria-labelledby="services-heading" className={className}>
      <h2 id="services-heading" className="sr-only">
        Stores and services
      </h2>

      <ul className="grid gap-px overflow-hidden rounded-lg bg-hairline-soft sm:grid-cols-3">
        {services.map((service) => (
          <li key={service.title} className="bg-surface p-6">
            <Icon name={service.icon} size={24} className="text-secondary" />
            <h3 className="mt-3 text-strong text-ink">{service.title}</h3>
            <p className="mt-1 text-sm text-secondary">{service.body}</p>
            <Link
              href={service.action.href}
              className={cn(
                "mt-3 inline-flex min-h-11 items-center gap-1 rounded-xs",
                "text-sm font-medium text-ink hover:underline focus-ring",
              )}
            >
              {service.action.label}
              <Icon name="chevron-right" size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
