import type { Address, Order } from "./types";

/** The signed-in customer the account pages demonstrate. */
export const customer = {
  name: "Rafiq Ahmed",
  phone: "01712345678",
  email: "rafiq@mail.example",
  language: "en" as const,
  points: 1650,
  memberSince: "2024-03-12",
};

export const orders: Order[] = [
  {
    id: "VL-24781",
    placedAt: "2026-11-02",
    status: "shipped",
    method: "delivery",
    address: "House 12, Road 7, Dhanmondi, Dhaka",
    phone: "01712345678",
    paymentMethod: "Bank EMI · City Bank · 12 months",
    expectedDelivery: "2026-11-07",
    lines: [
      {
        name: "Apple iPhone 17 Pro",
        variant: "Natural Titanium · 256GB",
        quantity: 1,
        price: 164999,
      },
      {
        name: "Apple AirPods Pro 3",
        variant: "White",
        quantity: 1,
        price: 32999,
      },
    ],
    subtotal: 197998,
    discount: 10000,
    deliveryFee: 0,
    total: 187998,
    pointsEarned: 1980,
    timeline: [
      {
        status: "Placed",
        at: "2026-11-02",
        note: "Order received",
        done: true,
      },
      {
        status: "Confirmed",
        at: "2026-11-02",
        note: "Payment approved by City Bank",
        done: true,
      },
      {
        status: "Shipped",
        at: "2026-11-05",
        note: "Picked up by Pathao Courier · PT-889214",
        done: true,
      },
      {
        status: "Delivered",
        at: "2026-11-07",
        note: "Expected by 7:00 pm",
        done: false,
      },
    ],
  },
  {
    id: "VL-24590",
    placedAt: "2026-10-18",
    status: "delivered",
    method: "pickup",
    address: "Gulshan 2 store · Shop 14, Gulshan Pink City",
    phone: "01712345678",
    paymentMethod: "bKash",
    expectedDelivery: "2026-10-19",
    lines: [
      {
        name: "Anker Nano II 65W",
        variant: "Black",
        quantity: 2,
        price: 4299,
      },
      {
        name: "Baseus 100W USB-C Cable (2m)",
        variant: "Black · 2m",
        quantity: 1,
        price: 999,
      },
    ],
    subtotal: 9597,
    discount: 0,
    deliveryFee: 0,
    total: 9597,
    pointsEarned: 105,
    timeline: [
      { status: "Placed", at: "2026-10-18", done: true },
      { status: "Confirmed", at: "2026-10-18", done: true },
      {
        status: "Ready for pickup",
        at: "2026-10-19",
        note: "Held at Gulshan 2 store",
        done: true,
      },
      {
        status: "Delivered",
        at: "2026-10-19",
        note: "Collected in store",
        done: true,
      },
    ],
  },
  {
    id: "VL-24402",
    placedAt: "2026-09-28",
    status: "cancelled",
    method: "delivery",
    address: "House 12, Road 7, Dhanmondi, Dhaka",
    phone: "01712345678",
    paymentMethod: "Cash on delivery",
    expectedDelivery: "2026-09-30",
    lines: [
      {
        name: "JBL Charge 6",
        variant: "Blue",
        quantity: 1,
        price: 16499,
      },
    ],
    subtotal: 16499,
    discount: 0,
    deliveryFee: 0,
    total: 16499,
    timeline: [
      { status: "Placed", at: "2026-09-28", done: true },
      {
        status: "Cancelled",
        at: "2026-09-29",
        note: "Cancelled at your request",
        done: true,
      },
    ],
  },
];

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export const addresses: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    recipient: "Rafiq Ahmed",
    division: "Dhaka",
    district: "Dhaka",
    area: "Dhanmondi",
    line: "House 12, Road 7",
    landmark: "Near Dhanmondi Lake",
    phone: "01712345678",
    isDefault: true,
  },
  {
    id: "addr-office",
    label: "Office",
    recipient: "Rafiq Ahmed",
    division: "Dhaka",
    district: "Dhaka",
    area: "Gulshan",
    line: "Level 9, 45 Gulshan Avenue",
    landmark: "Gulshan 1 circle",
    phone: "01712345678",
    isDefault: false,
  },
];

/** Saved for later (FR-USR-04). */
export const wishlist = [
  "sony-wh-1000xm6",
  "apple-ipad-pro-13-m5",
  "dji-mini-6-pro",
];

/** Points ledger (FR-LOY-02). */
export const pointsLedger = [
  {
    id: "p1",
    type: "earned" as const,
    points: 105,
    note: "Order VL-24590",
    at: "2026-10-19",
  },
  {
    id: "p2",
    type: "redeemed" as const,
    points: -500,
    note: "Redeemed on order VL-24402",
    at: "2026-09-28",
  },
  {
    id: "p3",
    type: "earned" as const,
    points: 1980,
    note: "Order VL-24781 — credits on delivery",
    at: "2026-11-07",
  },
  {
    id: "p4",
    type: "earned" as const,
    points: 65,
    note: "Order VL-24118",
    at: "2026-08-04",
  },
];

/** Request-an-order queue (FR-ORD-12). */
export const requests = [
  {
    id: "RQ-1182",
    product: "Sony Alpha 7 V with 24-70mm lens",
    budget: 400000,
    status: "Quoted" as const,
    at: "2026-10-30",
    note: "Quoted ৳ 3,94,000 including lens. Valid for 7 days.",
  },
  {
    id: "RQ-1150",
    product: "Steam Deck OLED 1TB",
    budget: 90000,
    status: "New" as const,
    at: "2026-11-03",
  },
];
