import type { Store } from "./types";

/** Physical outlets (FR-STO-01). Hours are local; `opensAt` drives "Open now". */
export const stores: Store[] = [
  {
    slug: "gulshan-2",
    name: "Gulshan 2 store",
    address: "Shop 14, Gulshan Pink City, Gulshan 2, Dhaka",
    area: "Gulshan",
    phone: "01700000111",
    hours: "10:00 am – 9:00 pm",
    opensAt: "10:00",
    distanceKm: 1.2,
    services: ["Store pickup", "Exchange", "Service centre", "EMI desk"],
  },
  {
    slug: "dhanmondi",
    name: "Dhanmondi store",
    address: "House 32, Road 27, Dhanmondi, Dhaka",
    area: "Dhanmondi",
    phone: "01700000112",
    hours: "10:00 am – 9:00 pm",
    opensAt: "10:00",
    distanceKm: 3.4,
    services: ["Store pickup", "Exchange", "EMI desk"],
  },
  {
    slug: "uttara",
    name: "Uttara store",
    address: "Plot 11, Sector 7, Uttara, Dhaka",
    area: "Uttara",
    phone: "01700000113",
    hours: "10:00 am – 9:00 pm",
    opensAt: "10:00",
    distanceKm: 12.8,
    services: ["Store pickup", "Exchange"],
  },
  {
    slug: "bashundhara",
    name: "Bashundhara City store",
    address: "Level 4, Block C, Bashundhara City, Panthapath, Dhaka",
    area: "Bashundhara",
    phone: "01700000114",
    hours: "10:00 am – 8:30 pm",
    opensAt: "10:00",
    distanceKm: 4.6,
    services: ["Store pickup", "Service centre"],
  },
  {
    slug: "mirpur",
    name: "Mirpur store",
    address: "Shop 22, Sony Square, Mirpur 1, Dhaka",
    area: "Mirpur",
    phone: "01700000115",
    hours: "10:00 am – 9:00 pm",
    opensAt: "10:00",
    distanceKm: 9.1,
    services: ["Store pickup", "EMI desk"],
  },
  {
    slug: "banani",
    name: "Banani store",
    address: "House 56, Road 11, Banani, Dhaka",
    area: "Banani",
    phone: "01700000116",
    hours: "11:00 am – 9:00 pm",
    opensAt: "11:00",
    distanceKm: 2.1,
    services: ["Store pickup", "Exchange", "EMI desk"],
  },
  {
    slug: "chattogram-gec",
    name: "Chattogram GEC store",
    address: "Level 2, Finlay Square, GEC Circle, Chattogram",
    area: "Chattogram",
    phone: "01700000117",
    hours: "10:00 am – 9:00 pm",
    opensAt: "10:00",
    services: ["Store pickup", "Exchange", "Service centre"],
  },
  {
    slug: "sylhet-zindabazar",
    name: "Sylhet Zindabazar store",
    address: "Mirboxtula Road, Zindabazar, Sylhet",
    area: "Sylhet",
    phone: "01700000118",
    hours: "10:00 am – 8:30 pm",
    opensAt: "10:00",
    services: ["Store pickup", "EMI desk"],
  },
];

export function getStore(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug);
}

/** The areas available in the locator's area filter. */
export function storeAreas(): string[] {
  return [...new Set(stores.map((s) => s.area))].sort();
}

/**
 * Whether a store is open at the given moment.
 *
 * Takes `now` as an argument rather than reading the clock, so callers decide
 * when it is evaluated — during render it would be request-time data and would
 * block prerendering.
 */
export function isStoreOpen(store: Store, now: Date): boolean {
  const [openHour, openMinute] = store.opensAt.split(":").map(Number);
  const opens = openHour * 60 + (openMinute || 0);

  /* Closing times in the data are all evening; read the display string. */
  const closeMatch = /–\s*(\d+):(\d+)\s*pm/i.exec(store.hours);
  const closes = closeMatch
    ? ((Number(closeMatch[1]) % 12) + 12) * 60 + Number(closeMatch[2])
    : 21 * 60;

  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= opens && minutes < closes;
}
