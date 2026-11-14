import type { Brand, Category, EmiPlan } from "./types";

/**
 * Categories. The top level mirrors the reference store (FR-CAT-01); the eight
 * shown in the header are the ones in the navigation wireframe (C4).
 */
export const categories: Category[] = [
  {
    slug: "phones",
    name: "Phones",
    nameBn: "ফোন",
    blurb: "Flagships and mid-range phones",
    specGroups: ["Display", "Chip", "Camera", "Battery", "Connectivity"],
    image: "/images/products/apple-iphone-17-pro-max/cosmic-orange.jpeg",
  },
  {
    slug: "laptops",
    name: "Laptops",
    nameBn: "ল্যাপটপ",
    blurb: "Ultrabooks, creator and gaming machines",
    specGroups: ["Display", "Chip", "Memory", "Battery", "Ports"],
  },
  {
    slug: "tablets",
    name: "Tablets",
    nameBn: "ট্যাবলেট",
    blurb: "For reading, drawing and everything between",
    specGroups: ["Display", "Chip", "Camera", "Battery", "Connectivity"],
    image: "/images/products/apple-ipad-11-a16/blue.jpeg",
  },
  {
    slug: "watches",
    name: "Watches",
    nameBn: "ঘড়ি",
    blurb: "Health, fitness and notifications on your wrist",
    specGroups: ["Display", "Sensors", "Battery", "Connectivity"],
    image: "/images/products/apple-watch-series-11/jet-black.jpeg",
  },
  {
    slug: "audio",
    name: "Audio",
    nameBn: "অডিও",
    blurb: "Headphones, earbuds and speakers",
    specGroups: ["Sound", "Battery", "Connectivity", "In the box"],
    image: "/images/products/marshall-major-v/cream.jpeg",
  },
  {
    slug: "gaming",
    name: "Gaming",
    nameBn: "গেমিং",
    blurb: "Consoles, controllers and headsets",
    specGroups: ["Display", "Performance", "Storage", "In the box"],
    image: "/images/products/nintendo-switch-2/console.jpeg",
  },
  {
    slug: "networking",
    name: "Networking",
    nameBn: "নেটওয়ার্কিং",
    blurb: "Satellite internet and mesh Wi-Fi",
    specGroups: ["Speed", "Coverage", "Ports", "Security"],
    image: "/images/products/tp-link-deco-s7-3-pack/white.jpeg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    nameBn: "অ্যাক্সেসরিজ",
    blurb: "Cases, chargers, cables and protectors",
    specGroups: ["Compatibility", "Material", "In the box"],
  },
  {
    slug: "cameras",
    name: "Cameras",
    nameBn: "ক্যামেরা",
    blurb: "Pocket cameras and phone gimbals",
    specGroups: ["Sensor", "Video", "Lens mount", "Battery"],
    image: "/images/products/dji-osmo-pocket-4-creator-combo/black.jpeg",
  },
  {
    slug: "drones",
    name: "Drones",
    nameBn: "ড্রোন",
    blurb: "Compact camera drones",
    specGroups: ["Camera", "Flight time", "Range", "In the box"],
    image: "/images/products/dji-mini-5-pro/combo-plus-rc2.jpeg",
  },

  /* Second level, used by the mega menu's subcategory column. */
  { slug: "iphone", name: "iPhone", nameBn: "আইফোন", parent: "phones" },
  {
    slug: "samsung-galaxy",
    name: "Samsung Galaxy",
    nameBn: "স্যামসাং গ্যালাক্সি",
    parent: "phones",
  },
  {
    slug: "google-pixel",
    name: "Google Pixel",
    nameBn: "গুগল পিক্সেল",
    parent: "phones",
  },
  { slug: "macbook", name: "MacBook", nameBn: "ম্যাকবুক", parent: "laptops" },
  {
    slug: "windows-laptops",
    name: "Windows laptops",
    nameBn: "উইন্ডোজ ল্যাপটপ",
    parent: "laptops",
  },
  {
    slug: "gaming-laptops",
    name: "Gaming laptops",
    nameBn: "গেমিং ল্যাপটপ",
    parent: "laptops",
  },
  { slug: "earbuds", name: "Earbuds", nameBn: "ইয়ারবাড", parent: "audio" },
  {
    slug: "headphones",
    name: "Headphones",
    nameBn: "হেডফোন",
    parent: "audio",
  },
  { slug: "speakers", name: "Speakers", nameBn: "স্পিকার", parent: "audio" },
  {
    slug: "cases",
    name: "Cases and protectors",
    nameBn: "কেস ও প্রোটেক্টর",
    parent: "accessories",
  },
  {
    slug: "chargers",
    name: "Chargers and cables",
    nameBn: "চার্জার ও কেবল",
    parent: "accessories",
  },
];

/** The eight categories in the global header (C4 navigation wireframe). */
export const headerCategories = [
  "phones",
  "laptops",
  "tablets",
  "watches",
  "audio",
  "gaming",
  "networking",
  "accessories",
] as const;

/**
 * Home page category tiles — 6 to 8 of them (DS-PG-HOME item 3). These are
 * the eight categories with photography; laptops and accessories join once
 * their images arrive.
 */
export const homeCategoryTiles = [
  "phones",
  "tablets",
  "watches",
  "audio",
  "gaming",
  "networking",
  "cameras",
  "drones",
] as const;

export const brands: Brand[] = [
  {
    slug: "apple",
    name: "Apple",
    description:
      "iPhone, Mac, iPad and Watch, with official warranty and service.",
    categories: ["phones", "laptops", "tablets", "watches", "accessories"],
  },
  {
    slug: "samsung",
    name: "Samsung",
    description: "Galaxy phones and accessories, with official warranty.",
    categories: ["phones", "accessories"],
  },
  {
    slug: "google",
    name: "Google",
    description: "Pixel phones with clean Android and seven years of updates.",
    categories: ["phones"],
  },
  {
    slug: "oneplus",
    name: "OnePlus",
    description: "Tablets and phones with fast charging and clean software.",
    categories: ["tablets"],
  },
  {
    slug: "sony",
    name: "Sony",
    description: "PlayStation controllers and accessories.",
    categories: ["gaming"],
  },
  {
    slug: "nintendo",
    name: "Nintendo",
    description: "Switch 2 consoles and bundles.",
    categories: ["gaming"],
  },
  {
    slug: "logitech",
    name: "Logitech",
    description: "Gaming headsets for PC, console and phone.",
    categories: ["gaming", "audio"],
  },
  {
    slug: "bose",
    name: "Bose",
    description: "Noise-cancelling earbuds and headphones.",
    categories: ["audio"],
  },
  {
    slug: "marshall",
    name: "Marshall",
    description: "Headphones and speakers with the Marshall sound and look.",
    categories: ["audio"],
  },
  {
    slug: "jbl",
    name: "JBL",
    description: "Party and portable speakers.",
    categories: ["audio"],
  },
  {
    slug: "anker",
    name: "Anker",
    description: "Soundcore earbuds, chargers and cases.",
    categories: ["audio", "accessories"],
  },
  {
    slug: "honor",
    name: "Honor",
    description: "Affordable headphones and audio.",
    categories: ["audio"],
  },
  {
    slug: "haylou",
    name: "Haylou",
    description: "Affordable smartwatches with AMOLED displays.",
    categories: ["watches"],
  },
  {
    slug: "dji",
    name: "DJI",
    description: "Drones, gimbals and pocket cameras.",
    categories: ["drones", "cameras"],
  },
  {
    slug: "starlink",
    name: "Starlink",
    description: "Satellite internet kits for home and office.",
    categories: ["networking"],
  },
  {
    slug: "tp-link",
    name: "TP-Link",
    description: "Mesh Wi-Fi systems that cover the whole flat.",
    categories: ["networking"],
  },
  {
    slug: "asus",
    name: "Asus",
    description: "ROG gaming laptops and Zenbooks.",
    categories: ["laptops"],
  },
  {
    slug: "dell",
    name: "Dell",
    description: "XPS ultrabooks for work.",
    categories: ["laptops"],
  },
  {
    slug: "lenovo",
    name: "Lenovo",
    description: "ThinkPad reliability for business.",
    categories: ["laptops"],
  },
  {
    slug: "baseus",
    name: "Baseus",
    description: "Everyday cables, hubs and car mounts.",
    categories: ["accessories"],
  },
];

/** Brand logos in the home page row, kept monochrome (DS-PG-HOME item 7). */
export const featuredBrands = [
  "apple",
  "samsung",
  "google",
  "sony",
  "bose",
  "marshall",
  "dji",
  "starlink",
] as const;

/** FR-EMI-01. Tenures initially 3, 6, 9, 12 and 24 months. */
export const emiPlans: EmiPlan[] = [
  {
    bank: "City Bank",
    tenures: [3, 6, 9, 12, 24],
    interestRate: 0,
    minimumAmount: 10000,
  },
  {
    bank: "BRAC Bank",
    tenures: [3, 6, 9, 12],
    interestRate: 0,
    minimumAmount: 10000,
  },
  {
    bank: "EBL",
    tenures: [3, 6, 12, 24],
    interestRate: 0,
    minimumAmount: 15000,
  },
  {
    bank: "Standard Chartered",
    tenures: [6, 12, 24],
    interestRate: 9,
    minimumAmount: 20000,
  },
];

/** Cascading address lists (FR-ORD-03). Trimmed to what the demo needs. */
export const divisions = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

export const districtsByDivision: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Munshiganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni"],
  Khulna: ["Khulna", "Jashore", "Satkhira"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj"],
  Barishal: ["Barishal", "Patuakhali", "Bhola"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona"],
};

export const areasByDistrict: Record<string, string[]> = {
  Dhaka: [
    "Dhanmondi",
    "Gulshan",
    "Banani",
    "Uttara",
    "Mirpur",
    "Mohakhali",
    "Bashundhara",
    "Motijheel",
  ],
  Gazipur: ["Tongi", "Board Bazar", "Joydebpur"],
  Narayanganj: ["Fatullah", "Siddhirganj", "Rupganj"],
  Chattogram: ["Agrabad", "Nasirabad", "Khulshi", "Pahartali"],
  Khulna: ["Sonadanga", "Khalishpur", "Daulatpur"],
  Rajshahi: ["Boalia", "Motihar", "Shahmokhdum"],
  Sylhet: ["Zindabazar", "Amberkhana", "Subid Bazar"],
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

/** Direct children of a category, for the mega menu and listing chips. */
export function getSubcategories(slug: string): Category[] {
  return categories.filter((c) => c.parent === slug);
}

/** Top-level categories only. */
export function getTopCategories(): Category[] {
  return categories.filter((c) => !c.parent);
}

/** Brands that sell into a category, for the mega menu's brand column. */
export function getBrandsForCategory(slug: string): Brand[] {
  return brands.filter((b) => b.categories.includes(slug));
}
