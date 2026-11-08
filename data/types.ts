/**
 * Domain types for the storefront.
 *
 * These mirror the entity model in Software SRS §4.1 (Product, Variant/SKU,
 * Category, Brand, Store, Order, …) so that swapping this sample data for a
 * real API is a change of source, not a change of shape.
 *
 * Money is always a whole number of taka.
 */

export type StockState =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "pre-order"
  | "discontinued";

/** FR-CAT-07. At most one badge is shown per card. */
export type BadgeKind =
  | "new"
  | "online-only"
  | "pre-order"
  | "exclusive"
  | "sale";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface Category {
  slug: string;
  name: string;
  /** Bangla name (FR-CMS-06). */
  nameBn: string;
  /** Parent slug, for the up-to-3-level tree of FR-CAT-01. */
  parent?: string;
  /** Shown on the home page tiles and the mega menu. */
  blurb?: string;
  /** Attribute groups that drive the spec table and filters (FR-CAT-03). */
  specGroups?: string[];
}

export interface Brand {
  slug: string;
  name: string;
  /** One-line description for the brand page header (DS-PG-CAT item 6). */
  description: string;
  /** Categories this brand sells into, for the mega menu's brand column. */
  categories: string[];
}

/** A specific configuration of a product: the unit that is stocked (SKU). */
export interface Variant {
  sku: string;
  /** Colour name — always shown as text, never colour alone (DS-CMP-SWATCH). */
  color: string;
  /** The swatch fill. A design value, but it is product data, not styling. */
  colorHex: string;
  /** Storage or size, e.g. "256GB". Omitted for products without the axis. */
  storage?: string;
  /** Region or connectivity, e.g. "Wi-Fi + Cellular". */
  connectivity?: string;
  price: number;
  /** Set when the SKU is on sale; always lower than `price` (FR-CAT-06). */
  salePrice?: number;
  stock: StockState;
  /** Units available to sell; caps the quantity stepper (FR-CRT-02). */
  available: number;
}

export interface SpecGroup {
  /** "Display", "Chip", "Camera", … — one accordion section each. */
  name: string;
  rows: { label: string; value: string }[];
}

export interface Highlight {
  /** Short label above the headline, e.g. "Camera". */
  label: string;
  /** The benefit in a few words (DS-CNT-01). */
  headline: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  /** FR-REV-01: reviews from buyers are marked as verified purchases. */
  verified: boolean;
}

export interface Product {
  slug: string;
  /** Brand Model (Key spec) — the naming rule in DS-CNT-05. */
  name: string;
  brand: string;
  category: string;
  /** The one-line spec under the name on a card. */
  keySpec: string;
  badge?: BadgeKind;
  rating: number;
  reviewCount: number;
  /** Histogram, 5 stars down to 1, for the review summary bars. */
  ratingBreakdown?: [number, number, number, number, number];
  variants: Variant[];
  highlights: Highlight[];
  specs: SpecGroup[];
  description: string;
  reviews?: Review[];
  /** Slugs of accessories that fit this device (FR-CAT-09). */
  accessories?: string[];
  /** Reward points earned on purchase (FR-LOY-01). */
  rewardPoints?: number;
  /** Expected arrival, for pre-order SKUs (FR-INV-04). */
  preOrderArrival?: string;
  /** Stores holding the item, for pickup (FR-INV-08). */
  stockedAt?: string[];
}

export interface Store {
  slug: string;
  name: string;
  address: string;
  area: string;
  phone: string;
  /** Display string for opening hours, e.g. "10:00 am – 9:00 pm". */
  hours: string;
  opensAt: string;
  /** Distance in km, shown only when the visitor allows location. */
  distanceKm?: number;
  services: string[];
}

/** FR-EMI-01. */
export interface EmiPlan {
  bank: string;
  /** Tenures in months this bank offers. */
  tenures: number[];
  /** 0 means a true 0% plan. */
  interestRate: number;
  minimumAmount: number;
}

export interface Offer {
  slug: string;
  title: string;
  blurb: string;
  /** Discount headline, e.g. "Up to ৳ 15,000 off". */
  headline: string;
  /** ISO date the campaign ends; drives the countdown (FR-PRM-01). */
  endsAt?: string;
  /** Product slugs in the campaign. */
  products: string[];
  tone: "accent" | "neutral";
}

export interface ContentPage {
  slug: string;
  title: string;
  /** Lead paragraph, set in the larger body size (DS-PG-CONTENT). */
  intro: string;
  sections: { heading: string; body: string[] }[];
  updated: string;
}

export interface OrderLine {
  /** Price as it was at purchase — later edits never change history (§4.2). */
  name: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  /** Home delivery or store pickup (FR-ORD-04). */
  method: "delivery" | "pickup";
  address: string;
  phone: string;
  paymentMethod: string;
  expectedDelivery: string;
  /** Status events for the tracking timeline (DS-PG-TRACK). */
  timeline: { status: string; at: string; note?: string; done: boolean }[];
  pointsEarned?: number;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  division: string;
  district: string;
  area: string;
  line: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
}

/** A line in the cart: a variant plus a quantity (FR-CRT-01). */
export interface CartLine {
  productSlug: string;
  sku: string;
  quantity: number;
}
