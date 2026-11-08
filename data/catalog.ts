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
    blurb: "Flagships, mid-range and feature phones",
    specGroups: ["Display", "Chip", "Camera", "Battery", "Connectivity"],
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
  },
  {
    slug: "watches",
    name: "Watches",
    nameBn: "ঘড়ি",
    blurb: "Health, fitness and notifications on your wrist",
    specGroups: ["Display", "Sensors", "Battery", "Connectivity"],
  },
  {
    slug: "audio",
    name: "Audio",
    nameBn: "অডিও",
    blurb: "Headphones, earbuds and speakers",
    specGroups: ["Sound", "Battery", "Connectivity", "In the box"],
  },
  {
    slug: "gaming",
    name: "Gaming",
    nameBn: "গেমিং",
    blurb: "Consoles, controllers and handhelds",
    specGroups: ["Display", "Performance", "Storage", "In the box"],
  },
  {
    slug: "networking",
    name: "Networking",
    nameBn: "নেটওয়ার্কিং",
    blurb: "Routers, mesh systems and range extenders",
    specGroups: ["Speed", "Coverage", "Ports", "Security"],
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
    blurb: "Mirrorless bodies, lenses and action cameras",
    specGroups: ["Sensor", "Video", "Lens mount", "Battery"],
  },
  {
    slug: "drones",
    name: "Drones",
    nameBn: "ড্রোন",
    blurb: "Aerial cameras and FPV kits",
    specGroups: ["Camera", "Flight time", "Range", "In the box"],
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
    slug: "xiaomi-redmi",
    name: "Xiaomi and Redmi",
    nameBn: "শাওমি ও রেডমি",
    parent: "phones",
  },
  {
    slug: "google-pixel",
    name: "Google Pixel",
    nameBn: "গুগল পিক্সেল",
    parent: "phones",
  },
  { slug: "oneplus", name: "OnePlus", nameBn: "ওয়ানপ্লাস", parent: "phones" },
  {
    slug: "feature-phones",
    name: "Feature phones",
    nameBn: "ফিচার ফোন",
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

/** Home page category tiles — 6 to 8 of them (DS-PG-HOME item 3). */
export const homeCategoryTiles = [
  "phones",
  "laptops",
  "tablets",
  "watches",
  "audio",
  "gaming",
  "networking",
  "accessories",
] as const;

export const brands: Brand[] = [
  {
    slug: "apple",
    name: "Apple",
    description:
      "iPhone, Mac, iPad and Watch, with official warranty and service.",
    categories: ["phones", "laptops", "tablets", "watches", "audio"],
  },
  {
    slug: "samsung",
    name: "Samsung",
    description:
      "Galaxy phones, tablets and wearables, plus displays and storage.",
    categories: ["phones", "tablets", "watches", "audio"],
  },
  {
    slug: "sony",
    name: "Sony",
    description: "Noise-cancelling audio, mirrorless cameras and PlayStation.",
    categories: ["audio", "gaming", "cameras"],
  },
  {
    slug: "xiaomi",
    name: "Xiaomi",
    description: "Phones, wearables and smart home gear at sharp prices.",
    categories: ["phones", "watches", "audio"],
  },
  {
    slug: "google",
    name: "Google",
    description: "Pixel phones with clean Android and years of updates.",
    categories: ["phones", "audio"],
  },
  {
    slug: "oneplus",
    name: "OnePlus",
    description: "Fast charging, high refresh rates and clean software.",
    categories: ["phones", "audio"],
  },
  {
    slug: "dell",
    name: "Dell",
    description: "XPS ultrabooks and Alienware gaming machines.",
    categories: ["laptops"],
  },
  {
    slug: "asus",
    name: "Asus",
    description: "ROG gaming laptops, Zenbooks and networking gear.",
    categories: ["laptops", "networking"],
  },
  {
    slug: "lenovo",
    name: "Lenovo",
    description: "ThinkPad reliability and Legion performance.",
    categories: ["laptops"],
  },
  {
    slug: "hp",
    name: "HP",
    description: "Spectre, Envy and Omen, for work and play.",
    categories: ["laptops"],
  },
  {
    slug: "anker",
    name: "Anker",
    description: "Chargers, cables and power banks that last.",
    categories: ["accessories", "audio"],
  },
  {
    slug: "jbl",
    name: "JBL",
    description: "Portable speakers and everyday headphones.",
    categories: ["audio"],
  },
  {
    slug: "bose",
    name: "Bose",
    description: "Quiet comfort for long flights and louder commutes.",
    categories: ["audio"],
  },
  {
    slug: "logitech",
    name: "Logitech",
    description: "Keyboards, mice and webcams for every desk.",
    categories: ["accessories", "gaming"],
  },
  {
    slug: "tp-link",
    name: "TP-Link",
    description: "Routers and mesh systems that cover the whole flat.",
    categories: ["networking"],
  },
  {
    slug: "nintendo",
    name: "Nintendo",
    description: "Switch consoles and first-party games.",
    categories: ["gaming"],
  },
  {
    slug: "canon",
    name: "Canon",
    description: "EOS mirrorless bodies and RF lenses.",
    categories: ["cameras"],
  },
  {
    slug: "dji",
    name: "DJI",
    description: "Drones, gimbals and action cameras.",
    categories: ["drones", "cameras"],
  },
  {
    slug: "realme",
    name: "Realme",
    description: "Big batteries and fast charging on a budget.",
    categories: ["phones", "audio"],
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
  "sony",
  "xiaomi",
  "google",
  "asus",
  "dji",
  "anker",
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
