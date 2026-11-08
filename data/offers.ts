import type { Offer } from "./types";

/** Active campaigns (FR-PRM-01, FR-PRM-03). Timed deals get a countdown. */
export const offers: Offer[] = [
  {
    slug: "iphone-launch-week",
    title: "iPhone 17 launch week",
    blurb:
      "Save on the iPhone 17 Pro and Pro Max, with 0% EMI for up to 24 months.",
    headline: "Up to ৳ 10,000 off",
    endsAt: "2026-11-13T23:59:00+06:00",
    products: ["apple-iphone-17-pro", "apple-iphone-17", "apple-iphone-16e"],
    tone: "accent",
  },
  {
    slug: "mac-for-work",
    title: "Mac for work",
    blurb:
      "MacBook Air and Pro at launch-week pricing, with free AppleCare setup in store.",
    headline: "Up to ৳ 15,000 off",
    endsAt: "2026-11-20T23:59:00+06:00",
    products: ["apple-macbook-air-13-m4", "apple-macbook-pro-14-m5"],
    tone: "neutral",
  },
  {
    slug: "sound-week",
    title: "Sound week",
    blurb: "Headphones and speakers from Sony, Bose and JBL at reduced prices.",
    headline: "Up to 20% off",
    endsAt: "2026-11-09T23:59:00+06:00",
    products: [
      "bose-quietcomfort-ultra",
      "jbl-charge-6",
      "samsung-galaxy-buds4-pro",
    ],
    tone: "neutral",
  },
  {
    slug: "desk-essentials",
    title: "Desk essentials",
    blurb: "Chargers, cables and mice that make a desk work properly.",
    headline: "From ৳ 999",
    products: [
      "anker-nano-ii-65w",
      "baseus-usb-c-cable-2m",
      "logitech-mx-master-4",
      "samsung-45w-charger",
    ],
    tone: "neutral",
  },
  {
    slug: "exchange-bonus",
    title: "Exchange bonus",
    blurb:
      "Trade in any working phone and get an extra ৳ 3,000 on top of the valuation.",
    headline: "Extra ৳ 3,000",
    products: ["apple-iphone-17-pro", "samsung-galaxy-s26-ultra", "xiaomi-16-pro"],
    tone: "neutral",
  },
];

export function getOffer(slug: string): Offer | undefined {
  return offers.find((o) => o.slug === slug);
}

/** The one promo banner on the home page (DS-PG-HOME item 5). */
export const featureBanner = {
  eyebrow: "Trade in",
  headline: "Your old phone is worth more this month",
  body: "Get an extra ৳ 3,000 on top of any exchange valuation until 30 Nov.",
  cta: { label: "Check your device", href: "/offers/exchange-bonus" },
} as const;

/** Coupon codes the cart accepts (FR-PRM-02, FR-CRT-04). */
export const coupons = [
  {
    code: "VOLTRA500",
    description: "৳ 500 off orders over ৳ 10,000",
    type: "fixed" as const,
    value: 500,
    minimumOrder: 10000,
  },
  {
    code: "AUDIO10",
    description: "10% off audio, up to ৳ 3,000",
    type: "percent" as const,
    value: 10,
    minimumOrder: 5000,
    maximumDiscount: 3000,
  },
];
