import type { Product, Variant } from "./types";

/**
 * Sample catalogue.
 *
 * Product names follow "Brand Model (Key spec)" (DS-CNT-05). Prices are whole
 * taka and are sample figures — confirm them against the distributor price
 * list before launch. A sale is set per SKU (FR-CAT-06), so `salePrice` sits on
 * the variants it applies to.
 *
 * Photography lives in `public/images/products/<slug>/`, one file per view:
 * `<colour>.jpeg` is the main shot of that colour, `<colour>-2.jpeg` a second
 * angle, and `extra-N.jpeg` a view shared by every variant (box contents,
 * lifestyle). Laptops and accessories have no photography yet and fall back to
 * the tinted silhouette in `ProductImage`.
 */

/** Paths to a product's photos, in the order given. */
function photos(slug: string, ...views: string[]): string[] {
  return views.map((view) => `/images/products/${slug}/${view}.jpeg`);
}

interface ColorOption {
  color: string;
  colorHex: string;
  /** This colour's photos, main view first. */
  images?: string[];
}

interface StorageOption {
  storage: string;
  price: number;
  salePrice?: number;
}

function availableFor(state: Variant["stock"]): number {
  switch (state) {
    case "out-of-stock":
    case "discontinued":
      return 0;
    case "low-stock":
      return 2;
    case "pre-order":
      return 25;
    default:
      return 12;
  }
}

/** Builds the common "one colour axis × one storage axis" variant matrix. */
function matrix(
  skuPrefix: string,
  colors: ColorOption[],
  storages: StorageOption[],
  stock: Partial<Record<string, Variant["stock"]>> = {},
): Variant[] {
  const out: Variant[] = [];
  for (const c of colors) {
    for (const s of storages) {
      const sku = `${skuPrefix}-${c.color.toLowerCase().replace(/\s+/g, "")}-${s.storage.toLowerCase().replace(/\s+/g, "")}`;
      const state = stock[sku] ?? "in-stock";
      out.push({
        sku,
        color: c.color,
        colorHex: c.colorHex,
        storage: s.storage,
        price: s.price,
        salePrice: s.salePrice,
        stock: state,
        available: availableFor(state),
        images: c.images,
      });
    }
  }
  return out;
}

/** A single-configuration product, e.g. a pair of earbuds in one colour. */
function single(
  sku: string,
  color: string,
  colorHex: string,
  price: number,
  opts: {
    salePrice?: number;
    stock?: Variant["stock"];
    available?: number;
    images?: string[];
  } = {},
): Variant[] {
  const stock = opts.stock ?? "in-stock";
  return [
    {
      sku,
      color,
      colorHex,
      price,
      salePrice: opts.salePrice,
      stock,
      available: opts.available ?? availableFor(stock),
      images: opts.images,
    },
  ];
}

export const products: Product[] = [
  /* ---------------------------------------------------------------- Phones */
  {
    slug: "apple-iphone-17-pro-max",
    name: "Apple iPhone 17 Pro Max",
    brand: "apple",
    category: "phones",
    subcategory: "iphone",
    keySpec: '6.9" ProMotion · A19 Pro',
    badge: "exclusive",
    rating: 4.9,
    reviewCount: 212,
    ratingBreakdown: [178, 24, 6, 2, 2],
    rewardPoints: 1950,
    stockedAt: ["gulshan-2", "dhanmondi", "uttara"],
    accessories: [
      "anker-nano-ii-65w",
      "baseus-usb-c-cable-2m",
      "voltra-clear-case-iphone-17-pro",
    ],
    variants: matrix(
      "ip17pm",
      [
        {
          color: "Cosmic Orange",
          colorHex: "#d9773b",
          images: photos("apple-iphone-17-pro-max", "cosmic-orange"),
        },
        {
          color: "Deep Blue",
          colorHex: "#2c3e55",
          images: photos("apple-iphone-17-pro-max", "deep-blue"),
        },
        {
          color: "Silver",
          colorHex: "#e3e4e6",
          images: photos("apple-iphone-17-pro-max", "silver"),
        },
      ],
      [
        { storage: "256GB", price: 204999, salePrice: 194999 },
        { storage: "512GB", price: 229999, salePrice: 219999 },
        { storage: "1TB", price: 259999 },
      ],
      {
        "ip17pm-deepblue-1tb": "low-stock",
        "ip17pm-silver-1tb": "out-of-stock",
      },
    ),
    highlights: [
      { label: "Camera", headline: "Three 48MP cameras, up to 8x optical-quality zoom" },
      { label: "Chip", headline: "A19 Pro with a vapour chamber to stay cool" },
      { label: "Display", headline: '6.9" ProMotion, the biggest iPhone screen' },
      { label: "Battery", headline: "The longest battery life of any iPhone" },
      { label: "Build", headline: "Aluminium unibody with Ceramic Shield 2" },
      { label: "Charging", headline: "USB-C fast charging and MagSafe" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "6.9-inch Super Retina XDR" },
          { label: "Refresh", value: "ProMotion adaptive up to 120Hz" },
          { label: "Always-on", value: "Yes" },
        ],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "A19 Pro" }],
      },
      {
        name: "Camera",
        rows: [
          { label: "Rear", value: "48MP Fusion, 48MP Ultra Wide, 48MP Telephoto" },
          { label: "Front", value: "18MP Center Stage" },
          { label: "Video", value: "4K Dolby Vision" },
        ],
      },
      {
        name: "Connectivity",
        rows: [
          { label: "Cellular", value: "5G" },
          { label: "Port", value: "USB-C" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C charge cable" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The iPhone 17 Pro Max is the largest and longest-lasting iPhone, with a 6.9-inch ProMotion display, the A19 Pro chip and three 48MP rear cameras. Every unit sold at Voltra is official Bangladesh stock with a one-year Apple warranty.",
    reviews: [
      {
        id: "r1",
        author: "Rafiq Ahmed",
        rating: 5,
        date: "2026-10-28",
        title: "The zoom is the reason to upgrade",
        body: "Coming from a 15 Pro the telephoto is the biggest change. It is genuinely usable in daylight and the night shots are cleaner. Battery easily lasts a full day with heavy use.",
        verified: true,
      },
      {
        id: "r2",
        author: "Nusrat Jahan",
        rating: 5,
        date: "2026-10-21",
        title: "Fast delivery, sealed box",
        body: "Ordered on Sunday and it arrived in Dhanmondi on Monday morning. Box was sealed and the warranty was registered in store.",
        verified: true,
      },
      {
        id: "r3",
        author: "Tanvir Hossain",
        rating: 4,
        date: "2026-10-14",
        title: "Great phone, heavy in the hand",
        body: "Everything is quick and the screen is lovely. It is a big phone, so get a case with a good grip.",
        verified: true,
      },
    ],
  },
  {
    slug: "apple-iphone-17",
    name: "Apple iPhone 17",
    brand: "apple",
    category: "phones",
    subcategory: "iphone",
    keySpec: '6.3" ProMotion · A19',
    badge: "new",
    rating: 4.8,
    reviewCount: 143,
    rewardPoints: 1300,
    stockedAt: ["gulshan-2", "dhanmondi", "banani"],
    accessories: ["anker-nano-ii-65w", "baseus-usb-c-cable-2m"],
    variants: matrix(
      "ip17",
      [
        {
          color: "Lavender",
          colorHex: "#c9b8dc",
          images: photos("apple-iphone-17", "lavender"),
        },
        {
          color: "Mist Blue",
          colorHex: "#a9c4d8",
          images: photos("apple-iphone-17", "mist-blue"),
        },
        {
          color: "Black",
          colorHex: "#2b2b2b",
          images: photos("apple-iphone-17", "black"),
        },
        {
          color: "White",
          colorHex: "#f1f1ef",
          images: photos("apple-iphone-17", "white"),
        },
      ],
      [
        { storage: "256GB", price: 139999, salePrice: 132999 },
        { storage: "512GB", price: 164999 },
      ],
    ),
    highlights: [
      { label: "Display", headline: "ProMotion comes to the standard iPhone" },
      { label: "Chip", headline: "A19, fast enough for years of updates" },
      { label: "Camera", headline: "48MP Fusion and Ultra Wide cameras" },
      { label: "Front camera", headline: "Center Stage selfies in portrait or landscape" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "6.3-inch Super Retina XDR" },
          { label: "Refresh", value: "ProMotion adaptive up to 120Hz" },
        ],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "A19" }],
      },
      {
        name: "Camera",
        rows: [
          { label: "Rear", value: "48MP Fusion, 48MP Ultra Wide" },
          { label: "Front", value: "18MP Center Stage" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C charge cable" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The iPhone 17 brings ProMotion, an always-on display and 256GB of starting storage to the standard iPhone, in four colours.",
  },
  {
    slug: "apple-iphone-air",
    name: "Apple iPhone Air",
    brand: "apple",
    category: "phones",
    subcategory: "iphone",
    keySpec: "The thinnest iPhone · A19 Pro",
    rating: 4.6,
    reviewCount: 58,
    rewardPoints: 1650,
    accessories: ["anker-nano-ii-65w"],
    variants: matrix(
      "ipair",
      [
        {
          color: "Space Black",
          colorHex: "#232326",
          images: photos("apple-iphone-air", "space-black"),
        },
      ],
      [
        { storage: "256GB", price: 164999 },
        { storage: "512GB", price: 189999 },
      ],
    ),
    highlights: [
      { label: "Design", headline: "The thinnest iPhone ever made" },
      { label: "Chip", headline: "A19 Pro in a body this light" },
      { label: "Display", headline: '6.5" ProMotion display' },
      { label: "Build", headline: "Titanium frame, Ceramic Shield on both sides" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.5-inch Super Retina XDR" }],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "A19 Pro" }],
      },
      {
        name: "Connectivity",
        rows: [{ label: "SIM", value: "eSIM only" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Apple warranty" }],
      },
    ],
    description:
      "iPhone Air puts the A19 Pro chip and a 6.5-inch ProMotion display into the thinnest iPhone yet. It uses eSIM only, so check with your operator before buying.",
  },
  {
    slug: "samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "samsung",
    category: "phones",
    subcategory: "samsung-galaxy",
    keySpec: "200MP · S Pen included",
    badge: "new",
    rating: 4.8,
    reviewCount: 64,
    rewardPoints: 1800,
    stockedAt: ["gulshan-2", "bashundhara"],
    accessories: ["samsung-45w-charger", "voltra-screen-protector-s26"],
    variants: matrix(
      "s26u",
      [
        {
          color: "Violet",
          colorHex: "#6f6283",
          images: photos("samsung-galaxy-s26-ultra", "violet"),
        },
        {
          color: "Black",
          colorHex: "#232326",
          images: photos("samsung-galaxy-s26-ultra", "black"),
        },
        {
          color: "White",
          colorHex: "#e6ecf0",
          images: photos("samsung-galaxy-s26-ultra", "white"),
        },
      ],
      [
        { storage: "256GB", price: 179999, salePrice: 172999 },
        { storage: "512GB", price: 199999 },
      ],
      { "s26u-white-512gb": "low-stock" },
    ),
    highlights: [
      { label: "Camera", headline: "200MP main camera with periscope zoom" },
      { label: "S Pen", headline: "Built-in S Pen, no charging needed" },
      { label: "Display", headline: "Large QHD+ AMOLED at 120Hz" },
      { label: "Software", headline: "Seven years of Android updates" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Type", value: "Dynamic AMOLED 2X, 120Hz" }],
      },
      {
        name: "Camera",
        rows: [{ label: "Main", value: "200MP" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "S Pen", value: "Included" },
          { label: "Warranty", value: "1 year official Samsung warranty" },
        ],
      },
    ],
    description:
      "Samsung's flagship, with a 200MP camera, a built-in S Pen and a large QHD+ display, and seven years of Android updates.",
  },
  {
    slug: "samsung-galaxy-s26-plus",
    name: "Samsung Galaxy S26+",
    brand: "samsung",
    category: "phones",
    subcategory: "samsung-galaxy",
    keySpec: "Slim · 120Hz AMOLED",
    rating: 4.6,
    reviewCount: 37,
    rewardPoints: 1350,
    accessories: ["samsung-45w-charger"],
    variants: matrix(
      "s26p",
      [
        {
          color: "Black",
          colorHex: "#232326",
          images: photos("samsung-galaxy-s26-plus", "black", "black-2"),
        },
      ],
      [{ storage: "256GB", price: 134999, salePrice: 128999 }],
    ),
    highlights: [
      { label: "Design", headline: "A slim body with flat edges" },
      { label: "Display", headline: "Large 120Hz AMOLED display" },
      { label: "Charging", headline: "45W fast charging" },
      { label: "Software", headline: "Seven years of Android updates" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Type", value: "Dynamic AMOLED 2X, 120Hz" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Samsung warranty" }],
      },
    ],
    description:
      "The Galaxy S26+ gives you a large flagship display and fast charging in a slimmer body than the Ultra.",
  },
  {
    slug: "samsung-galaxy-a36",
    name: "Samsung Galaxy A36 5G",
    brand: "samsung",
    category: "phones",
    subcategory: "samsung-galaxy",
    keySpec: "5G · 6.7\" Super AMOLED",
    rating: 4.5,
    reviewCount: 96,
    rewardPoints: 400,
    accessories: ["samsung-45w-charger"],
    variants: matrix(
      "a36",
      [
        {
          color: "Awesome Black",
          colorHex: "#2b2b30",
          images: photos("samsung-galaxy-a36", "black"),
        },
        {
          color: "Awesome Lavender",
          colorHex: "#c8c3e6",
          images: photos("samsung-galaxy-a36", "lavender"),
        },
      ],
      [
        { storage: "128GB", price: 39999, salePrice: 37499 },
        { storage: "256GB", price: 44999 },
      ],
      { "a36-awesomelavender-256gb": "low-stock" },
    ),
    highlights: [
      { label: "Display", headline: "6.7-inch Super AMOLED at 120Hz" },
      { label: "Network", headline: "5G ready" },
      { label: "Durability", headline: "IP67 dust and water resistance" },
      { label: "Software", headline: "Six years of Android updates" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.7-inch Super AMOLED, 120Hz" }],
      },
      {
        name: "Connectivity",
        rows: [{ label: "Cellular", value: "5G" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Samsung warranty" }],
      },
    ],
    description:
      "A mid-range Galaxy with a 120Hz AMOLED display, 5G and years of updates — the sensible choice for most people.",
  },
  {
    slug: "google-pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "google",
    category: "phones",
    subcategory: "google-pixel",
    keySpec: "Tensor G5 · 5x telephoto",
    rating: 4.7,
    reviewCount: 88,
    rewardPoints: 1450,
    variants: matrix(
      "px10p",
      [
        {
          color: "Obsidian",
          colorHex: "#26262a",
          images: photos("google-pixel-10-pro", "obsidian", "obsidian-2"),
        },
      ],
      [{ storage: "256GB", price: 149999, salePrice: 142999 }],
    ),
    highlights: [
      { label: "Camera", headline: "Pro triple camera with 5x telephoto" },
      { label: "Chip", headline: "Tensor G5 with on-device Gemini" },
      { label: "Software", headline: "Seven years of OS and security updates" },
      { label: "Charging", headline: "Qi2 magnetic wireless charging" },
    ],
    specs: [
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "Google Tensor G5" }],
      },
      {
        name: "Camera",
        rows: [{ label: "Telephoto", value: "5x optical" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official warranty" }],
      },
    ],
    description:
      "Pixel 10 Pro pairs Google's computational photography with a 5x telephoto, and ships with seven years of updates.",
  },
  {
    slug: "google-pixel-10",
    name: "Google Pixel 10",
    brand: "google",
    category: "phones",
    subcategory: "google-pixel",
    keySpec: "Tensor G5 · triple camera",
    rating: 4.5,
    reviewCount: 61,
    rewardPoints: 1050,
    variants: matrix(
      "px10",
      [
        {
          color: "Indigo",
          colorHex: "#3d4a8c",
          images: photos("google-pixel-10", "indigo", "indigo-2"),
        },
      ],
      [{ storage: "128GB", price: 104999 }],
    ),
    highlights: [
      { label: "Camera", headline: "A telephoto camera on the standard Pixel" },
      { label: "Chip", headline: "Tensor G5 with on-device Gemini" },
      { label: "Software", headline: "Seven years of updates" },
      { label: "Charging", headline: "Qi2 magnetic wireless charging" },
    ],
    specs: [
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "Google Tensor G5" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official warranty" }],
      },
    ],
    description:
      "The standard Pixel 10 adds a telephoto camera and magnetic charging, with Pixel's clean software and long update support.",
  },

  /* --------------------------------------------------------------- Tablets */
  {
    slug: "apple-ipad-11-a16",
    name: "Apple iPad 11-inch (A16)",
    brand: "apple",
    category: "tablets",
    keySpec: "11\" Liquid Retina · Wi-Fi",
    rating: 4.7,
    reviewCount: 94,
    rewardPoints: 620,
    gallery: photos("apple-ipad-11-a16", "extra-1", "extra-2"),
    variants: matrix(
      "ipad11",
      [
        {
          color: "Blue",
          colorHex: "#8fb3d9",
          images: photos("apple-ipad-11-a16", "blue"),
        },
      ],
      [
        { storage: "128GB", price: 54999 },
        { storage: "256GB", price: 66999, salePrice: 63999 },
      ],
    ),
    highlights: [
      { label: "Display", headline: "11-inch Liquid Retina display" },
      { label: "Chip", headline: "A16 chip for everyday apps and games" },
      { label: "Battery", headline: "All-day battery life" },
      { label: "Port", headline: "USB-C with Apple Pencil (USB-C) support" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "11-inch Liquid Retina" }],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "A16" }],
      },
      {
        name: "Connectivity",
        rows: [
          { label: "Network", value: "Wi-Fi" },
          { label: "Port", value: "USB-C" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C charge cable" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The standard iPad, now with the A16 chip and 128GB of starting storage. Good for study, streaming and notes.",
  },
  {
    slug: "oneplus-pad-lite",
    name: "OnePlus Pad Lite",
    brand: "oneplus",
    category: "tablets",
    keySpec: '11" · 9340mAh',
    rating: 4.4,
    reviewCount: 41,
    rewardPoints: 280,
    variants: matrix(
      "oppadl",
      [
        {
          color: "Aero Blue",
          colorHex: "#9fb3c4",
          images: photos("oneplus-pad-lite", "grey", "grey-2"),
        },
      ],
      [{ storage: "128GB", price: 27999, salePrice: 25999 }],
    ),
    highlights: [
      { label: "Battery", headline: "A large battery for days of reading" },
      { label: "Display", headline: "11-inch screen for video and study" },
      { label: "Audio", headline: "Quad speakers" },
      { label: "Price", headline: "A big tablet at a small price" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "11-inch" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official warranty" }],
      },
    ],
    description:
      "An affordable 11-inch tablet with a large battery and quad speakers, made for video, reading and online classes.",
  },

  /* --------------------------------------------------------------- Watches */
  {
    slug: "apple-watch-series-11",
    name: "Apple Watch Series 11 (46mm)",
    brand: "apple",
    category: "watches",
    keySpec: "Always-on · sleep score",
    badge: "new",
    rating: 4.8,
    reviewCount: 156,
    rewardPoints: 650,
    variants: matrix(
      "aw11",
      [
        {
          color: "Jet Black",
          colorHex: "#232326",
          images: photos("apple-watch-series-11", "jet-black"),
        },
        {
          color: "Rose Gold",
          colorHex: "#dbb2a4",
          images: photos("apple-watch-series-11", "rose-gold"),
        },
      ],
      [
        { storage: "GPS", price: 64999 },
        { storage: "GPS + Cellular", price: 79999 },
      ],
      { "aw11-rosegold-gps+cellular": "low-stock" },
    ),
    highlights: [
      { label: "Health", headline: "Sleep score and hypertension notifications" },
      { label: "Display", headline: "Always-on Retina display" },
      { label: "Battery", headline: "Up to 24 hours" },
      { label: "Durability", headline: "Water resistant for swimming" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "46mm, always-on Retina" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Life", value: "Up to 24 hours" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Band", value: "Sport band" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "Series 11 adds a sleep score and hypertension notifications, and keeps the always-on display readable in direct sun.",
  },
  {
    slug: "haylou-velo",
    name: "Haylou Velo Smart Watch",
    brand: "haylou",
    category: "watches",
    keySpec: "AMOLED · Bluetooth calling",
    rating: 4.3,
    reviewCount: 122,
    rewardPoints: 50,
    variants: matrix(
      "hvelo",
      [
        {
          color: "Black",
          colorHex: "#232326",
          images: photos("haylou-velo", "black"),
        },
        {
          color: "Silver",
          colorHex: "#d6d6d8",
          images: photos("haylou-velo", "silver", "silver-2"),
        },
      ],
      [{ storage: "Standard", price: 4999, salePrice: 4499 }],
    ),
    highlights: [
      { label: "Display", headline: "Bright AMOLED display" },
      { label: "Calls", headline: "Take Bluetooth calls on your wrist" },
      { label: "Fitness", headline: "Heart rate, sleep and workout tracking" },
      { label: "Price", headline: "A smartwatch for under ৳ 5,000" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Type", value: "AMOLED" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Charger", value: "Magnetic charging cable" }],
      },
    ],
    description:
      "An affordable AMOLED smartwatch with Bluetooth calling and everyday fitness tracking.",
  },

  /* ----------------------------------------------------------------- Audio */
  {
    slug: "bose-quietcomfort-ultra-earbuds",
    name: "Bose QuietComfort Ultra Earbuds",
    brand: "bose",
    category: "audio",
    subcategory: "earbuds",
    keySpec: "Noise cancelling · Immersive audio",
    rating: 4.7,
    reviewCount: 388,
    ratingBreakdown: [310, 54, 16, 5, 3],
    rewardPoints: 330,
    stockedAt: ["gulshan-2", "dhanmondi", "chattogram-gec"],
    variants: matrix(
      "bqcue",
      [
        {
          color: "Black",
          colorHex: "#232323",
          images: photos("bose-quietcomfort-ultra-earbuds", "black"),
        },
        {
          color: "White Smoke",
          colorHex: "#e8e6e1",
          images: photos("bose-quietcomfort-ultra-earbuds", "white", "white-2"),
        },
      ],
      [{ storage: "Standard", price: 32999 }],
    ),
    highlights: [
      { label: "Noise", headline: "Bose's best noise cancellation in earbuds" },
      { label: "Audio", headline: "Immersive audio widens the sound stage" },
      { label: "Calls", headline: "Clear calls in noisy places" },
      { label: "Fit", headline: "Stability bands in three sizes" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Cancellation", value: "Active, with Aware mode" }],
      },
      {
        name: "Connectivity",
        rows: [{ label: "Bluetooth", value: "Multipoint" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Tips", value: "Three ear tip and stability band sizes" },
          { label: "Case", value: "Charging case" },
        ],
      },
    ],
    description:
      "Bose's flagship earbuds, built around the noise cancellation the brand is known for, with Immersive audio for a wider sound stage.",
    reviews: [
      {
        id: "a1",
        author: "Imran Kabir",
        rating: 5,
        date: "2026-10-30",
        title: "The bus noise disappears",
        body: "Used them on a Dhaka to Chattogram bus and the engine noise basically disappeared. They stay put better than any earbuds I have owned.",
        verified: true,
      },
      {
        id: "a2",
        author: "Sadia Rahman",
        rating: 4,
        date: "2026-10-12",
        title: "Great, but the white case marks easily",
        body: "Sound and fit are excellent. The white case picks up scuffs within a couple of weeks, so get a cover with it.",
        verified: true,
      },
    ],
  },
  {
    slug: "marshall-major-v",
    name: "Marshall Major V",
    brand: "marshall",
    category: "audio",
    subcategory: "headphones",
    keySpec: "On-ear · 100+ hours",
    badge: "online-only",
    rating: 4.6,
    reviewCount: 74,
    rewardPoints: 190,
    variants: matrix(
      "mmv",
      [
        {
          color: "Black",
          colorHex: "#232323",
          images: photos("marshall-major-v", "black"),
        },
        {
          color: "Cream",
          colorHex: "#e5dcc8",
          images: photos("marshall-major-v", "cream"),
        },
        {
          color: "Midnight Blue",
          colorHex: "#2c3a55",
          images: photos("marshall-major-v", "blue"),
        },
      ],
      [{ storage: "Standard", price: 18999, salePrice: 16999 }],
    ),
    highlights: [
      { label: "Battery", headline: "Over 100 hours of playtime" },
      { label: "Design", headline: "Folding on-ear design" },
      { label: "Control", headline: "Multi-directional control knob" },
      { label: "Charging", headline: "Wireless charging" },
    ],
    specs: [
      {
        name: "Battery",
        rows: [{ label: "Playtime", value: "100+ hours" }],
      },
      {
        name: "Connectivity",
        rows: [{ label: "Wireless", value: "Bluetooth" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "USB-C charging cable" }],
      },
    ],
    description:
      "Marshall's folding on-ear headphones, with the brand's look and well over 100 hours between charges.",
  },
  {
    slug: "anker-soundcore-liberty-5",
    name: "Anker Soundcore Liberty 5",
    brand: "anker",
    category: "audio",
    subcategory: "earbuds",
    keySpec: "Adaptive ANC · LDAC",
    rating: 4.5,
    reviewCount: 211,
    rewardPoints: 130,
    variants: matrix(
      "lib5",
      [
        {
          color: "Black",
          colorHex: "#232323",
          images: photos("anker-soundcore-liberty-5", "black"),
        },
        {
          color: "Blue",
          colorHex: "#3a5fa8",
          images: photos("anker-soundcore-liberty-5", "blue"),
        },
      ],
      [{ storage: "Standard", price: 12999, salePrice: 11499 }],
    ),
    highlights: [
      { label: "Noise", headline: "Adaptive noise cancelling" },
      { label: "Audio", headline: "Hi-Res wireless with LDAC" },
      { label: "Calls", headline: "Multiple mics for clear calls" },
      { label: "Case", headline: "Compact charging case" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Codecs", value: "LDAC, AAC, SBC" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Tips", value: "Multiple ear tip sizes" }],
      },
    ],
    description:
      "Strong noise cancelling and LDAC audio for a fraction of flagship prices.",
  },
  {
    slug: "honor-choice-headphones-pro",
    name: "Honor Choice Headphones Pro",
    brand: "honor",
    category: "audio",
    subcategory: "headphones",
    keySpec: "Over-ear · ANC",
    rating: 4.3,
    reviewCount: 52,
    rewardPoints: 70,
    variants: matrix(
      "hchp",
      [
        {
          color: "Black",
          colorHex: "#232323",
          images: photos("honor-choice-headphones-pro", "black"),
        },
        {
          color: "White",
          colorHex: "#f0f0ee",
          images: photos("honor-choice-headphones-pro", "white"),
        },
      ],
      [{ storage: "Standard", price: 6999 }],
    ),
    highlights: [
      { label: "Noise", headline: "Active noise cancelling" },
      { label: "Comfort", headline: "Soft over-ear cushions" },
      { label: "Battery", headline: "Long battery life" },
      { label: "Price", headline: "ANC headphones under ৳ 7,000" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Cancellation", value: "Active" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "USB-C charging cable" }],
      },
    ],
    description:
      "Affordable over-ear headphones with active noise cancelling, for commutes and study.",
  },
  {
    slug: "jbl-partybox-720",
    name: "JBL PartyBox 720",
    brand: "jbl",
    category: "audio",
    subcategory: "speakers",
    keySpec: "Party speaker · light show",
    rating: 4.6,
    reviewCount: 33,
    rewardPoints: 1200,
    variants: single("jblpb720", "Black", "#232323", 119999, {
      salePrice: 112999,
      images: photos("jbl-partybox-720", "black", "black-2"),
    }),
    highlights: [
      { label: "Sound", headline: "Room-filling sound for parties" },
      { label: "Light", headline: "Built-in light show synced to music" },
      { label: "Portable", headline: "Wheels and a handle to move it" },
      { label: "Inputs", headline: "Mic and guitar inputs for karaoke" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Type", value: "Portable party speaker" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official warranty" }],
      },
    ],
    description:
      "A party speaker with a built-in light show, wheels for moving it, and inputs for a mic and guitar.",
  },
  {
    slug: "logitech-g435",
    name: "Logitech G435 Lightspeed",
    brand: "logitech",
    category: "audio",
    subcategory: "headphones",
    keySpec: "Wireless · Bluetooth · 165g",
    rating: 4.4,
    reviewCount: 178,
    rewardPoints: 100,
    variants: matrix(
      "g435",
      [
        {
          color: "Blue",
          colorHex: "#3f6fd8",
          images: photos("logitech-g435", "blue"),
        },
        {
          color: "Off White",
          colorHex: "#ecebe6",
          images: photos("logitech-g435", "off-white"),
        },
      ],
      [{ storage: "Standard", price: 9999, salePrice: 8999 }],
    ),
    highlights: [
      { label: "Weight", headline: "Very light at around 165g" },
      { label: "Wireless", headline: "Lightspeed and Bluetooth" },
      { label: "Battery", headline: "Up to 18 hours" },
      { label: "Mic", headline: "Built-in beamforming mics" },
    ],
    specs: [
      {
        name: "Connectivity",
        rows: [{ label: "Wireless", value: "Lightspeed USB receiver, Bluetooth" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Life", value: "Up to 18 hours" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Receiver", value: "Lightspeed USB receiver" }],
      },
    ],
    description:
      "A very light wireless headset that works with PC, PlayStation and phones over Bluetooth.",
  },

  /* ---------------------------------------------------------------- Gaming */
  {
    slug: "nintendo-switch-2",
    name: "Nintendo Switch 2",
    brand: "nintendo",
    category: "gaming",
    keySpec: '7.9" 1080p · 4K docked',
    badge: "exclusive",
    rating: 4.8,
    reviewCount: 267,
    rewardPoints: 650,
    stockedAt: ["gulshan-2", "bashundhara"],
    variants: [
      {
        sku: "ns2-console",
        color: "Black",
        colorHex: "#232326",
        storage: "Console",
        price: 64999,
        stock: "in-stock",
        available: 12,
        images: photos("nintendo-switch-2", "console"),
      },
      {
        sku: "ns2-mkw-bundle",
        color: "Black",
        colorHex: "#232326",
        storage: "Mario Kart World bundle",
        price: 72999,
        salePrice: 69999,
        stock: "low-stock",
        available: 2,
        images: photos("nintendo-switch-2", "bundle"),
      },
    ],
    highlights: [
      { label: "Display", headline: '7.9" 1080p screen at up to 120Hz' },
      { label: "Dock", headline: "Up to 4K output on the TV" },
      { label: "Storage", headline: "256GB built in" },
      { label: "Library", headline: "Plays most Switch games" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "7.9-inch 1080p LCD, up to 120Hz" }],
      },
      {
        name: "Performance",
        rows: [{ label: "Output", value: "Up to 4K docked" }],
      },
      {
        name: "Storage",
        rows: [{ label: "Internal", value: "256GB" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Controllers", value: "Two Joy-Con 2" },
          { label: "Dock", value: "Switch 2 dock with HDMI" },
        ],
      },
    ],
    description:
      "A bigger, brighter screen, 4K output when docked, and a library that carries over from the original Switch. The bundle includes Mario Kart World.",
  },
  {
    slug: "sony-dualsense-edge",
    name: "Sony DualSense Edge Controller",
    brand: "sony",
    category: "gaming",
    keySpec: "PS5 · back buttons · swappable sticks",
    rating: 4.6,
    reviewCount: 143,
    rewardPoints: 270,
    gallery: photos("sony-dualsense-edge", "extra-1"),
    variants: matrix(
      "dse",
      [
        {
          color: "White",
          colorHex: "#f1f1ef",
          images: photos("sony-dualsense-edge", "white", "white-2"),
        },
        {
          color: "Midnight Black",
          colorHex: "#1f2233",
          images: photos("sony-dualsense-edge", "midnight-black"),
        },
      ],
      [{ storage: "Standard", price: 26999, salePrice: 24999 }],
    ),
    highlights: [
      { label: "Control", headline: "Remappable back buttons" },
      { label: "Durability", headline: "Replaceable stick modules" },
      { label: "Profiles", headline: "Switch profiles on the fly" },
      { label: "Feel", headline: "Adjustable trigger stops" },
    ],
    specs: [
      {
        name: "Performance",
        rows: [{ label: "Works with", value: "PlayStation 5, PC" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Case", value: "Carrying case" },
          { label: "Cable", value: "Braided USB-C cable" },
        ],
      },
    ],
    description:
      "Sony's pro controller for PS5, with back buttons, replaceable stick modules and profiles you can switch mid-game.",
  },
  {
    slug: "logitech-g335",
    name: "Logitech G335 Wired Headset",
    brand: "logitech",
    category: "gaming",
    keySpec: "3.5mm · 240g",
    rating: 4.3,
    reviewCount: 96,
    rewardPoints: 75,
    variants: single("g335-white", "White", "#f1f1ef", 7499, {
      salePrice: 6799,
      images: photos("logitech-g335", "white", "white-2"),
    }),
    highlights: [
      { label: "Weight", headline: "Light at around 240g" },
      { label: "Compatibility", headline: "3.5mm jack for consoles, PC and phone" },
      { label: "Mic", headline: "Flip-to-mute microphone" },
      { label: "Comfort", headline: "Memory foam ear pads" },
    ],
    specs: [
      {
        name: "Performance",
        rows: [{ label: "Connection", value: "3.5mm wired" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "3.5mm cable and PC splitter" }],
      },
    ],
    description:
      "A light wired headset that plugs into anything with a 3.5mm jack, with a flip-to-mute mic.",
  },

  /* ------------------------------------------------------------ Networking */
  {
    slug: "starlink-standard-kit",
    name: "Starlink Standard Kit",
    brand: "starlink",
    category: "networking",
    keySpec: "Satellite internet · Wi-Fi router",
    badge: "exclusive",
    rating: 4.6,
    reviewCount: 48,
    rewardPoints: 470,
    gallery: photos("starlink-standard-kit", "extra-1"),
    variants: single("starlink-std", "White", "#f2f2f0", 47000, {
      images: photos("starlink-standard-kit", "white", "white-2"),
    }),
    highlights: [
      { label: "Coverage", headline: "High-speed internet almost anywhere" },
      { label: "Setup", headline: "Self-orienting dish, set up in minutes" },
      { label: "Wi-Fi", headline: "Router included" },
      { label: "Weather", headline: "Built for rain and heat" },
    ],
    specs: [
      {
        name: "Coverage",
        rows: [{ label: "Service", value: "Requires a Starlink subscription" }],
      },
      {
        name: "Ports",
        rows: [{ label: "Router", value: "Wi-Fi router included" }],
      },
      {
        name: "Security",
        rows: [{ label: "Setup", value: "Managed in the Starlink app" }],
      },
    ],
    description:
      "Satellite internet for homes and offices where fibre does not reach. The kit includes the dish, router and cables; the monthly service is bought from Starlink.",
  },
  {
    slug: "tp-link-deco-s7-3-pack",
    name: "TP-Link Deco S7 (3-pack)",
    brand: "tp-link",
    category: "networking",
    keySpec: "AC1900 mesh · whole-home Wi-Fi",
    rating: 4.5,
    reviewCount: 64,
    rewardPoints: 160,
    gallery: photos("tp-link-deco-s7-3-pack", "extra-1"),
    variants: single("deco-s7-3", "White", "#f2f2f0", 16499, {
      salePrice: 14999,
      images: photos("tp-link-deco-s7-3-pack", "white"),
    }),
    highlights: [
      { label: "Coverage", headline: "Three units cover a large flat" },
      { label: "Speed", headline: "AC1900 dual-band Wi-Fi" },
      { label: "Roaming", headline: "One network name everywhere" },
      { label: "Setup", headline: "Set up in the Deco app" },
    ],
    specs: [
      {
        name: "Speed",
        rows: [{ label: "Standard", value: "AC1900 dual-band" }],
      },
      {
        name: "Coverage",
        rows: [{ label: "Units", value: "3" }],
      },
      {
        name: "Ports",
        rows: [{ label: "Ethernet", value: "Gigabit ports on each unit" }],
      },
      {
        name: "Security",
        rows: [{ label: "Included", value: "WPA2, parental controls" }],
      },
    ],
    description:
      "Three mesh units that blanket a flat in Wi-Fi under one network name, set up from your phone.",
  },

  /* --------------------------------------------------------------- Laptops */
  {
    slug: "apple-macbook-pro-14-m5",
    name: "Apple MacBook Pro 14 (M5 Pro)",
    brand: "apple",
    category: "laptops",
    subcategory: "macbook",
    keySpec: "M5 Pro · 24GB unified memory",
    badge: "exclusive",
    rating: 4.9,
    reviewCount: 131,
    rewardPoints: 2800,
    stockedAt: ["gulshan-2", "dhanmondi"],
    accessories: ["anker-nano-ii-65w", "baseus-usb-c-cable-2m"],
    variants: matrix(
      "mbp14m5",
      [
        { color: "Space Black", colorHex: "#3a3a3c" },
        { color: "Silver", colorHex: "#e3e4e6" },
      ],
      [
        { storage: "512GB", price: 274999, salePrice: 259999 },
        { storage: "1TB", price: 309999 },
      ],
      { "mbp14m5-silver-1tb": "low-stock" },
    ),
    highlights: [
      { label: "Chip", headline: "M5 Pro, 12-core CPU and 18-core GPU" },
      { label: "Display", headline: "Liquid Retina XDR with ProMotion" },
      { label: "Battery", headline: "Up to 22 hours of video playback" },
      { label: "Ports", headline: "Three Thunderbolt 5, HDMI, SDXC" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "14.2-inch Liquid Retina XDR" },
          { label: "Resolution", value: "3024 × 1964 at 254 ppi" },
          { label: "Brightness", value: "1600 nits peak HDR" },
        ],
      },
      {
        name: "Chip",
        rows: [
          { label: "Processor", value: "Apple M5 Pro, 12-core CPU" },
          { label: "Graphics", value: "18-core GPU" },
        ],
      },
      {
        name: "Memory",
        rows: [
          { label: "Unified memory", value: "24GB" },
          { label: "Bandwidth", value: "273GB/s" },
        ],
      },
      {
        name: "Battery",
        rows: [
          { label: "Video playback", value: "Up to 22 hours" },
          { label: "Charging", value: "96W USB-C, MagSafe 3" },
        ],
      },
      {
        name: "Ports",
        rows: [
          { label: "Thunderbolt", value: "3 × Thunderbolt 5" },
          { label: "Display", value: "HDMI 2.1" },
          { label: "Other", value: "SDXC, MagSafe 3, headphone jack" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Adapter", value: "96W USB-C power adapter" },
          { label: "Cable", value: "USB-C to MagSafe 3, 2m" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The 14-inch MacBook Pro with M5 Pro handles multi-stream video edits and large builds without the fans becoming the loudest thing in the room, and still runs most of a working day on battery.",
  },
  {
    slug: "apple-macbook-air-13-m4",
    name: "Apple MacBook Air 13 (M4)",
    brand: "apple",
    category: "laptops",
    subcategory: "macbook",
    keySpec: "M4 · 16GB · 1.24kg",
    rating: 4.8,
    reviewCount: 204,
    rewardPoints: 1600,
    variants: matrix(
      "mba13m4",
      [
        { color: "Sky Blue", colorHex: "#b3c6d9" },
        { color: "Midnight", colorHex: "#2e3642" },
        { color: "Starlight", colorHex: "#eee6d8" },
      ],
      [
        { storage: "256GB", price: 154999, salePrice: 146999 },
        { storage: "512GB", price: 174999 },
      ],
    ),
    highlights: [
      { label: "Weight", headline: "1.24kg, fits any bag" },
      { label: "Chip", headline: "M4 with a 10-core CPU" },
      { label: "Battery", headline: "Up to 18 hours of web browsing" },
      { label: "Silence", headline: "Completely fanless" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "13.6-inch Liquid Retina" }],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "Apple M4, 10-core CPU" }],
      },
      {
        name: "Memory",
        rows: [{ label: "Unified memory", value: "16GB" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Adapter", value: "35W dual USB-C adapter" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "Fanless, 1.24kg and quick enough for everything short of sustained video rendering. The default choice for most people.",
  },
  {
    slug: "asus-rog-zephyrus-g16",
    name: "Asus ROG Zephyrus G16 (RTX 5070)",
    brand: "asus",
    category: "laptops",
    subcategory: "gaming-laptops",
    keySpec: "OLED 240Hz · RTX 5070",
    rating: 4.6,
    reviewCount: 67,
    rewardPoints: 2400,
    variants: matrix(
      "rogg16",
      [{ color: "Eclipse Grey", colorHex: "#4a4a4f" }],
      [
        { storage: "1TB", price: 239999, salePrice: 224999 },
        { storage: "2TB", price: 269999 },
      ],
      { "rogg16-eclipsegrey-2tb": "low-stock" },
    ),
    highlights: [
      { label: "Graphics", headline: "GeForce RTX 5070 Laptop GPU" },
      { label: "Display", headline: "16-inch OLED at 240Hz" },
      { label: "Build", headline: "1.95kg CNC aluminium chassis" },
      { label: "Cooling", headline: "Vapour chamber with liquid metal" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "16-inch ROG Nebula OLED" },
          { label: "Refresh", value: "240Hz, 0.2ms" },
        ],
      },
      {
        name: "Performance",
        rows: [
          { label: "Processor", value: "AMD Ryzen AI 9 HX 370" },
          { label: "Graphics", value: "RTX 5070 Laptop, 8GB GDDR7" },
        ],
      },
      {
        name: "Memory",
        rows: [{ label: "RAM", value: "32GB LPDDR5X-7500" }],
      },
      {
        name: "Ports",
        rows: [
          { label: "USB-C", value: "2 × USB4 with DisplayPort" },
          { label: "Other", value: "2 × USB-A, HDMI 2.1, SD card" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Adapter", value: "200W slim adapter" },
          { label: "Warranty", value: "2 year official Asus warranty" },
        ],
      },
    ],
    description:
      "A 16-inch OLED gaming laptop that is thin enough to carry daily, with an RTX 5070 that holds high settings at 1600p.",
  },
  {
    slug: "dell-xps-14",
    name: "Dell XPS 14 (Core Ultra 7)",
    brand: "dell",
    category: "laptops",
    subcategory: "windows-laptops",
    keySpec: "Core Ultra 7 · 32GB",
    rating: 4.4,
    reviewCount: 48,
    rewardPoints: 2000,
    variants: matrix(
      "xps14",
      [{ color: "Platinum", colorHex: "#d9dadc" }],
      [{ storage: "1TB", price: 204999, salePrice: 194999 }],
    ),
    highlights: [
      { label: "Display", headline: "14.5-inch 3K OLED touch" },
      { label: "Chip", headline: "Intel Core Ultra 7 with NPU" },
      { label: "Build", headline: "Machined aluminium, 1.68kg" },
      { label: "Audio", headline: "Quad speakers tuned by Waves" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "14.5-inch 3K OLED" }],
      },
      {
        name: "Performance",
        rows: [{ label: "Processor", value: "Intel Core Ultra 7 155H" }],
      },
      {
        name: "Memory",
        rows: [{ label: "RAM", value: "32GB LPDDR5X" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Dell warranty" }],
      },
    ],
    description:
      "A machined aluminium ultrabook with a 3K OLED panel, aimed at people who want a Windows machine that feels as solid as it looks.",
  },
  {
    slug: "lenovo-thinkpad-x1-carbon",
    name: "Lenovo ThinkPad X1 Carbon (Gen 13)",
    brand: "lenovo",
    category: "laptops",
    subcategory: "windows-laptops",
    keySpec: "1.09kg · Core Ultra 7",
    rating: 4.7,
    reviewCount: 39,
    rewardPoints: 2300,
    variants: matrix(
      "x1c13",
      [{ color: "Black", colorHex: "#1c1c1e" }],
      [{ storage: "1TB", price: 229999 }],
    ),
    highlights: [
      { label: "Weight", headline: "1.09kg carbon fibre chassis" },
      { label: "Keyboard", headline: "The best keyboard on any laptop" },
      { label: "Durability", headline: "Tested to MIL-STD-810H" },
      { label: "Battery", headline: "Up to 16 hours of mixed use" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "14-inch 2.8K OLED" }],
      },
      {
        name: "Performance",
        rows: [{ label: "Processor", value: "Intel Core Ultra 7 165U" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "3 year official warranty" }],
      },
    ],
    description:
      "A 1.09kg business laptop with the keyboard ThinkPads are bought for, and a three-year warranty as standard.",
  },

  /* ----------------------------------------------------------- Accessories */
  {
    slug: "apple-pencil-pro",
    name: "Apple Pencil Pro",
    brand: "apple",
    category: "accessories",
    keySpec: "Squeeze · barrel roll · haptics",
    rating: 4.7,
    reviewCount: 112,
    rewardPoints: 140,
    variants: single("appl-pencil-pro", "White", "#f4f4f2", 16999),
    highlights: [
      { label: "Input", headline: "Squeeze to bring up the tool palette" },
      { label: "Control", headline: "Barrel roll for shaped brushes" },
      { label: "Feedback", headline: "Haptic confirmation on every action" },
      { label: "Tracking", headline: "Find My support if it rolls away" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Works with", value: "Recent iPad Pro and iPad Air models" }],
      },
      {
        name: "Material",
        rows: [{ label: "Body", value: "Matte composite" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Pencil", value: "Apple Pencil Pro" }],
      },
    ],
    description:
      "Squeeze, roll and haptic feedback make the Pencil Pro the first real change to the format since pressure sensitivity.",
  },
  {
    slug: "anker-nano-ii-65w",
    name: "Anker Nano II 65W",
    brand: "anker",
    category: "accessories",
    subcategory: "chargers",
    keySpec: "GaN II · 65W USB-C",
    rating: 4.8,
    reviewCount: 523,
    rewardPoints: 45,
    variants: matrix(
      "ankn65",
      [
        { color: "Black", colorHex: "#232323" },
        { color: "White", colorHex: "#f2f2f0" },
      ],
      [{ storage: "Standard", price: 4999, salePrice: 4299 }],
    ),
    highlights: [
      { label: "Size", headline: "Half the size of the stock adapter" },
      { label: "Power", headline: "65W, enough for a MacBook Air" },
      { label: "Safety", headline: "ActiveShield temperature monitoring" },
      { label: "Travel", headline: "Foldable pins" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Output", value: "65W USB-C Power Delivery" }],
      },
      {
        name: "Material",
        rows: [{ label: "Technology", value: "GaN II" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Adapter", value: "Nano II 65W" }],
      },
    ],
    description:
      "A 65W charger that is small enough to leave in a bag permanently, and powerful enough for a laptop.",
  },
  {
    slug: "baseus-usb-c-cable-2m",
    name: "Baseus 100W USB-C Cable (2m)",
    brand: "baseus",
    category: "accessories",
    subcategory: "chargers",
    keySpec: "100W · braided · 2m",
    rating: 4.6,
    reviewCount: 341,
    rewardPoints: 15,
    variants: matrix(
      "bsc2m",
      [
        { color: "Black", colorHex: "#232323" },
        { color: "Blue", colorHex: "#3a5f9e" },
      ],
      [{ storage: "2m", price: 1299, salePrice: 999 }],
    ),
    highlights: [
      { label: "Power", headline: "100W charging with E-marker chip" },
      { label: "Build", headline: "Braided nylon, 30,000 bend tested" },
      { label: "Length", headline: "2m, reaches the far side of a sofa" },
      { label: "Data", headline: "480Mbps transfer" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Power", value: "Up to 100W PD" }],
      },
      {
        name: "Material",
        rows: [{ label: "Jacket", value: "Braided nylon" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "2m USB-C to USB-C" }],
      },
    ],
    description:
      "A braided 2m cable rated for 100W, which is the one most people should own two of.",
  },
  {
    slug: "voltra-clear-case-iphone-17-pro",
    name: "Voltra Clear Case (iPhone 17 Pro)",
    brand: "anker",
    category: "accessories",
    subcategory: "cases",
    keySpec: "MagSafe · anti-yellow",
    badge: "online-only",
    rating: 4.3,
    reviewCount: 76,
    rewardPoints: 25,
    variants: single("vcc-17pro", "Clear", "#e8e8e6", 2499, {
      salePrice: 1999,
    }),
    highlights: [
      { label: "Magnets", headline: "Full-strength MagSafe ring" },
      { label: "Clarity", headline: "Anti-yellowing coating" },
      { label: "Protection", headline: "2m drop tested with raised lip" },
      { label: "Grip", headline: "Textured sides, slim profile" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Fits", value: "iPhone 17 Pro only" }],
      },
      {
        name: "Material",
        rows: [{ label: "Body", value: "Polycarbonate with TPU edge" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Case", value: "Clear MagSafe case" }],
      },
    ],
    description:
      "A clear MagSafe case with a coating that keeps it from yellowing after a few months in the sun.",
  },
  {
    slug: "samsung-45w-charger",
    name: "Samsung 45W Travel Adapter",
    brand: "samsung",
    category: "accessories",
    subcategory: "chargers",
    keySpec: "45W · USB-C PD",
    rating: 4.5,
    reviewCount: 189,
    rewardPoints: 30,
    variants: single("sam45w", "Black", "#232323", 3499),
    highlights: [
      { label: "Power", headline: "45W Super Fast Charging 2.0" },
      { label: "Compatibility", headline: "Works with any USB-C PD device" },
      { label: "Size", headline: "Compact, folding pins" },
      { label: "Safety", headline: "Official Samsung adapter" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Output", value: "45W USB-C PD PPS" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Adapter", value: "45W travel adapter" }],
      },
    ],
    description:
      "The official 45W adapter, needed to reach full charging speed on Galaxy S and Tab devices.",
  },
  {
    slug: "voltra-screen-protector-s26",
    name: "Voltra Glass Protector (Galaxy S26 Ultra)",
    brand: "anker",
    category: "accessories",
    subcategory: "cases",
    keySpec: "9H glass · 2-pack",
    rating: 4.2,
    reviewCount: 54,
    rewardPoints: 10,
    variants: single("vgp-s26u", "Clear", "#e8e8e6", 1499, {
      stock: "low-stock",
    }),
    highlights: [
      { label: "Hardness", headline: "9H tempered glass" },
      { label: "Fit", headline: "Cut for the ultrasonic fingerprint sensor" },
      { label: "Value", headline: "Two in the pack" },
      { label: "Install", headline: "Alignment frame included" },
    ],
    specs: [
      {
        name: "Compatibility",
        rows: [{ label: "Fits", value: "Galaxy S26 Ultra" }],
      },
      {
        name: "Material",
        rows: [{ label: "Glass", value: "9H tempered, oleophobic coated" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Protectors", value: "2 × glass protector" },
          { label: "Tools", value: "Alignment frame, wipes" },
        ],
      },
    ],
    description:
      "Two 9H glass protectors with an alignment frame, cut so the in-display fingerprint sensor still works.",
  },

  /* --------------------------------------------------------------- Cameras */
  {
    slug: "dji-osmo-pocket-4-creator-combo",
    name: "DJI Osmo Pocket 4 (Creator Combo)",
    brand: "dji",
    category: "cameras",
    keySpec: '1" sensor · 3-axis gimbal',
    badge: "new",
    rating: 4.7,
    reviewCount: 58,
    rewardPoints: 800,
    gallery: photos("dji-osmo-pocket-4-creator-combo", "extra-1"),
    variants: single("op4-cc", "Black", "#232325", 79999, {
      salePrice: 76999,
      images: photos("dji-osmo-pocket-4-creator-combo", "black", "black-2"),
    }),
    highlights: [
      { label: "Sensor", headline: "1-inch sensor for low light" },
      { label: "Stabilisation", headline: "Three-axis mechanical gimbal" },
      { label: "Tracking", headline: "ActiveTrack keeps you in frame" },
      { label: "Combo", headline: "Wireless mic and accessories included" },
    ],
    specs: [
      {
        name: "Sensor",
        rows: [{ label: "Type", value: "1-inch CMOS" }],
      },
      {
        name: "Video",
        rows: [{ label: "Stabilisation", value: "3-axis gimbal" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Charging", value: "USB-C" }],
      },
      {
        name: "Lens mount",
        rows: [{ label: "Lens", value: "Fixed" }],
      },
    ],
    description:
      "A pocket gimbal camera with a one-inch sensor. The Creator Combo adds a wireless mic and the accessories you will want for vlogging.",
  },
  {
    slug: "dji-osmo-mobile-7",
    name: "DJI Osmo Mobile 7",
    brand: "dji",
    category: "cameras",
    keySpec: "Phone gimbal · built-in tripod",
    rating: 4.5,
    reviewCount: 71,
    rewardPoints: 150,
    gallery: photos("dji-osmo-mobile-7", "extra-1"),
    variants: single("om7", "Grey", "#9a9a9d", 14999, {
      salePrice: 13499,
      images: photos("dji-osmo-mobile-7", "grey", "grey-2", "grey-3"),
    }),
    highlights: [
      { label: "Stabilisation", headline: "Three-axis stabilisation for phone video" },
      { label: "Tripod", headline: "Built-in extension rod and tripod" },
      { label: "Tracking", headline: "Subject tracking in the app" },
      { label: "Portable", headline: "Folds small for a bag" },
    ],
    specs: [
      {
        name: "Video",
        rows: [{ label: "Stabilisation", value: "3-axis" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Charging", value: "USB-C" }],
      },
      {
        name: "Sensor",
        rows: [{ label: "Works with", value: "Most smartphones" }],
      },
      {
        name: "Lens mount",
        rows: [{ label: "Mount", value: "Magnetic phone clamp" }],
      },
    ],
    description:
      "A folding phone gimbal with a built-in tripod, for smooth handheld video from the phone you already have.",
  },

  /* ---------------------------------------------------------------- Drones */
  {
    slug: "dji-mini-5-pro",
    name: "DJI Mini 5 Pro (Fly More Combo Plus)",
    brand: "dji",
    category: "drones",
    keySpec: "Under 250g · 1\" sensor",
    badge: "new",
    rating: 4.8,
    reviewCount: 46,
    rewardPoints: 1300,
    variants: [
      {
        sku: "mini5p-fmcp",
        color: "Grey",
        colorHex: "#9a9a9d",
        storage: "With RC-N3",
        price: 129999,
        salePrice: 124999,
        stock: "in-stock",
        available: 6,
        images: photos("dji-mini-5-pro", "combo-plus"),
      },
      {
        sku: "mini5p-fmcp-rc2",
        color: "Grey",
        colorHex: "#9a9a9d",
        storage: "With DJI RC 2",
        price: 144999,
        stock: "low-stock",
        available: 2,
        images: photos("dji-mini-5-pro", "combo-plus-rc2"),
      },
    ],
    highlights: [
      { label: "Weight", headline: "Under 250g, easy to carry" },
      { label: "Camera", headline: "1-inch sensor for sharper footage" },
      { label: "Safety", headline: "Omnidirectional obstacle sensing" },
      { label: "Combo", headline: "Extra batteries and a charging hub" },
    ],
    specs: [
      {
        name: "Camera",
        rows: [{ label: "Sensor", value: "1-inch CMOS" }],
      },
      {
        name: "Flight time",
        rows: [{ label: "Batteries", value: "Three in the Fly More Combo Plus" }],
      },
      {
        name: "Range",
        rows: [{ label: "Controller", value: "RC-N3 or DJI RC 2 (with screen)" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Bag", value: "Shoulder bag, charging hub" }],
      },
    ],
    description:
      "A sub-250g drone with a one-inch sensor. The Fly More Combo Plus includes the extra batteries you will want; the RC 2 edition adds a controller with its own screen.",
  },
  {
    slug: "dji-flip",
    name: "DJI Flip (RC-N3)",
    brand: "dji",
    category: "drones",
    keySpec: "Foldable · full propeller guards",
    rating: 4.5,
    reviewCount: 39,
    rewardPoints: 600,
    variants: single("flip-rcn3", "Grey", "#9a9a9d", 59999, {
      images: photos("dji-flip", "grey", "grey-2", "grey-3"),
    }),
    highlights: [
      { label: "Safety", headline: "Full-coverage propeller guards" },
      { label: "Design", headline: "Folds flat for travel" },
      { label: "Flying", headline: "Palm take-off and auto modes" },
      { label: "Weight", headline: "Under 250g" },
    ],
    specs: [
      {
        name: "Camera",
        rows: [{ label: "Video", value: "4K" }],
      },
      {
        name: "Range",
        rows: [{ label: "Controller", value: "DJI RC-N3" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Controller", value: "RC-N3 included" }],
      },
    ],
    description:
      "A beginner-friendly vlogging drone with full propeller guards that folds flat for travel.",
  },
];

/* ------------------------------------------------------------------ Lookups */

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProducts(slugs: readonly string[]): Product[] {
  return slugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => Boolean(p));
}

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function productsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brand === brandSlug);
}

/** The lowest current price across a product's variants. */
export function lowestPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.salePrice ?? v.price));
}

/** The regular price matching `lowestPrice`, for the struck-out comparison. */
export function lowestRegularPrice(product: Product): number {
  const cheapest = product.variants.reduce((best, v) =>
    (v.salePrice ?? v.price) < (best.salePrice ?? best.price) ? v : best,
  );
  return cheapest.price;
}

/** The variant a product page opens on: the first one that can be bought. */
export function defaultVariant(product: Product): Variant {
  return (
    product.variants.find(
      (v) => v.stock === "in-stock" || v.stock === "low-stock",
    ) ??
    product.variants.find((v) => v.stock === "pre-order") ??
    product.variants[0]
  );
}

/** A product is out of stock only when every variant is. */
export function isOutOfStock(product: Product): boolean {
  return product.variants.every((v) => v.stock === "out-of-stock");
}

export function isOnSale(product: Product): boolean {
  return product.variants.some((v) => v.salePrice !== undefined);
}

export function findVariant(
  product: Product,
  sku: string,
): Variant | undefined {
  return product.variants.find((v) => v.sku === sku);
}

/**
 * Every photo for a variant: its own views first, then the views shared by the
 * whole product. Empty when the product has no photography yet.
 */
export function variantPhotos(product: Product, variant: Variant): string[] {
  return [...(variant.images ?? []), ...(product.gallery ?? [])];
}

/** The one photo to show for a variant on a card or thumbnail, if any. */
export function primaryPhoto(
  product: Product,
  variant: Variant = defaultVariant(product),
): string | undefined {
  return (
    variant.images?.[0] ??
    product.variants.find((v) => v.images?.length)?.images?.[0] ??
    product.gallery?.[0]
  );
}

/* ------------------------------------------------------- Shelves (FR-CMS-03) */

/** Hand-picked and rule-driven shelves, as a CMS would supply them. */
export const shelves = {
  exclusive: [
    "apple-iphone-17-pro-max",
    "nintendo-switch-2",
    "starlink-standard-kit",
    "samsung-galaxy-s26-ultra",
  ],
  topSelling: [
    "apple-iphone-17",
    "bose-quietcomfort-ultra-earbuds",
    "samsung-galaxy-a36",
    "apple-ipad-11-a16",
    "marshall-major-v",
    "apple-watch-series-11",
  ],
  newArrival: [
    "apple-iphone-air",
    "google-pixel-10-pro",
    "dji-mini-5-pro",
    "dji-osmo-pocket-4-creator-combo",
    "samsung-galaxy-s26-plus",
  ],
  gaming: [
    "nintendo-switch-2",
    "sony-dualsense-edge",
    "logitech-g435",
    "logitech-g335",
  ],
  audio: [
    "bose-quietcomfort-ultra-earbuds",
    "marshall-major-v",
    "anker-soundcore-liberty-5",
    "jbl-partybox-720",
    "honor-choice-headphones-pro",
  ],
  cases: [
    "voltra-clear-case-iphone-17-pro",
    "voltra-screen-protector-s26",
    "anker-nano-ii-65w",
    "baseus-usb-c-cable-2m",
    "samsung-45w-charger",
  ],
} as const;

/** Trending search terms shown before typing (FR-SRC-05). */
export const trendingSearches = [
  "iPhone 17 Pro Max",
  "Galaxy S26 Ultra",
  "Switch 2",
  "Starlink",
  "DJI Mini 5 Pro",
  "0% EMI offers",
] as const;
