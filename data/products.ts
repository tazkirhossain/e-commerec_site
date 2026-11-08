import type { Product, Variant } from "./types";

/**
 * Sample catalogue.
 *
 * Product names follow "Brand Model (Key spec)" (DS-CNT-05). Prices are whole
 * taka. A product on sale carries `salePrice` on the affected variants only,
 * because a sale is set per SKU (FR-CAT-06).
 */

/** Builds the common "one colour axis × one storage axis" variant matrix. */
function matrix(
  skuPrefix: string,
  colors: { color: string; colorHex: string }[],
  storages: { storage: string; price: number; salePrice?: number }[],
  stock: Partial<Record<string, Variant["stock"]>> = {},
): Variant[] {
  const out: Variant[] = [];
  for (const c of colors) {
    for (const s of storages) {
      const sku = `${skuPrefix}-${c.color.toLowerCase().replace(/\s+/g, "")}-${s.storage.toLowerCase()}`;
      const state = stock[sku] ?? "in-stock";
      out.push({
        sku,
        color: c.color,
        colorHex: c.colorHex,
        storage: s.storage,
        price: s.price,
        salePrice: s.salePrice,
        stock: state,
        available:
          state === "out-of-stock"
            ? 0
            : state === "low-stock"
              ? 2
              : state === "pre-order"
                ? 25
                : 12,
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
      available:
        opts.available ??
        (stock === "out-of-stock"
          ? 0
          : stock === "low-stock"
            ? 2
            : stock === "pre-order"
              ? 25
              : 20),
    },
  ];
}

export const products: Product[] = [
  /* ---------------------------------------------------------------- Phones */
  {
    slug: "apple-iphone-17-pro",
    name: "Apple iPhone 17 Pro",
    brand: "apple",
    category: "phones",
    keySpec: '6.3" ProMotion · A19 Pro',
    badge: "exclusive",
    rating: 4.9,
    reviewCount: 212,
    ratingBreakdown: [178, 24, 6, 2, 2],
    rewardPoints: 1650,
    stockedAt: ["gulshan-2", "dhanmondi", "uttara"],
    accessories: [
      "apple-airpods-pro-3",
      "voltra-clear-case-iphone-17-pro",
      "anker-nano-ii-65w",
      "baseus-usb-c-cable-2m",
    ],
    variants: matrix(
      "ip17p",
      [
        { color: "Natural Titanium", colorHex: "#c8bfb4" },
        { color: "Deep Blue", colorHex: "#2c3e55" },
        { color: "Black Titanium", colorHex: "#2b2b2b" },
      ],
      [
        { storage: "256GB", price: 174999, salePrice: 164999 },
        { storage: "512GB", price: 199999, salePrice: 189999 },
        { storage: "1TB", price: 229999 },
      ],
      {
        "ip17p-deepblue-1tb": "low-stock",
        "ip17p-blacktitanium-1tb": "out-of-stock",
      },
    ),
    highlights: [
      { label: "Camera", headline: "48MP fusion camera with 5x telephoto" },
      { label: "Chip", headline: "A19 Pro, built for on-device intelligence" },
      { label: "Display", headline: "ProMotion up to 120Hz, always-on" },
      { label: "Battery", headline: "Up to 31 hours of video playback" },
      { label: "Build", headline: "Grade 5 titanium with Ceramic Shield 2" },
      { label: "Charging", headline: "USB-C with 40W fast charge support" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: '6.3-inch Super Retina XDR' },
          { label: "Resolution", value: "2622 × 1206 at 460 ppi" },
          { label: "Refresh", value: "ProMotion adaptive 1–120Hz" },
          { label: "Brightness", value: "2000 nits peak outdoor" },
        ],
      },
      {
        name: "Chip",
        rows: [
          { label: "Processor", value: "A19 Pro, 6-core CPU" },
          { label: "Graphics", value: "6-core GPU with ray tracing" },
          { label: "Neural engine", value: "16-core" },
        ],
      },
      {
        name: "Camera",
        rows: [
          { label: "Main", value: "48MP, ƒ/1.78, second-gen sensor shift" },
          { label: "Telephoto", value: "48MP, 5x optical zoom, ƒ/2.8" },
          { label: "Ultra wide", value: "48MP, ƒ/2.2, macro" },
          { label: "Front", value: "18MP Center Stage, ƒ/1.9" },
          { label: "Video", value: "4K Dolby Vision at 120 fps" },
        ],
      },
      {
        name: "Battery",
        rows: [
          { label: "Video playback", value: "Up to 31 hours" },
          { label: "Fast charge", value: "50% in 30 minutes with 40W" },
          { label: "Wireless", value: "MagSafe 25W, Qi2" },
        ],
      },
      {
        name: "Connectivity",
        rows: [
          { label: "Cellular", value: "5G sub-6GHz, dual eSIM" },
          { label: "Wi-Fi", value: "Wi-Fi 7" },
          { label: "Bluetooth", value: "6.0" },
          { label: "Port", value: "USB-C, USB 3 up to 10Gb/s" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C to USB-C, 1m woven" },
          { label: "Documentation", value: "Quick start guide" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The iPhone 17 Pro pairs a grade 5 titanium body with the A19 Pro chip, so heavy photo and video work finishes quickly and the phone still lasts the day. The 5x telephoto brings distant subjects close without cropping, and ProMotion keeps scrolling smooth while dropping to 1Hz to save power. Every unit sold at Voltra is official Bangladesh stock with a one-year Apple warranty.",
    reviews: [
      {
        id: "r1",
        author: "Rafiq Ahmed",
        rating: 5,
        date: "2026-10-28",
        title: "The camera is the reason to upgrade",
        body: "Coming from a 15 Pro the zoom is the biggest change. 5x is genuinely usable in daylight and the night shots are cleaner. Battery easily lasts a full day with heavy use.",
        verified: true,
      },
      {
        id: "r2",
        author: "Nusrat Jahan",
        rating: 5,
        date: "2026-10-21",
        title: "Fast delivery, sealed box",
        body: "Ordered on Sunday and it arrived in Dhanmondi on Monday morning. Box was sealed and the warranty was registered in store. No complaints.",
        verified: true,
      },
      {
        id: "r3",
        author: "Tanvir Hossain",
        rating: 4,
        date: "2026-10-14",
        title: "Great phone, gets warm while gaming",
        body: "Everything is quick and the screen is lovely. It does get warm after half an hour of heavy gaming, though it never throttled badly for me.",
        verified: true,
      },
    ],
  },
  {
    slug: "apple-iphone-17-pro-max",
    name: "Apple iPhone 17 Pro Max",
    brand: "apple",
    category: "phones",
    keySpec: '6.9" · 5x telephoto',
    rating: 4.9,
    reviewCount: 178,
    rewardPoints: 1950,
    accessories: ["apple-airpods-pro-3", "anker-nano-ii-65w"],
    variants: matrix(
      "ip17pm",
      [
        { color: "Natural Titanium", colorHex: "#c8bfb4" },
        { color: "Black Titanium", colorHex: "#2b2b2b" },
      ],
      [
        { storage: "256GB", price: 194999 },
        { storage: "512GB", price: 219999 },
      ],
      {
        "ip17pm-naturaltitanium-256gb": "out-of-stock",
        "ip17pm-naturaltitanium-512gb": "out-of-stock",
        "ip17pm-blacktitanium-256gb": "out-of-stock",
        "ip17pm-blacktitanium-512gb": "out-of-stock",
      },
    ),
    highlights: [
      { label: "Display", headline: "The largest ProMotion display yet" },
      { label: "Battery", headline: "Up to 39 hours of video playback" },
      { label: "Camera", headline: "48MP fusion camera with 5x telephoto" },
      { label: "Chip", headline: "A19 Pro with 6-core graphics" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "6.9-inch Super Retina XDR" },
          { label: "Refresh", value: "ProMotion adaptive 1–120Hz" },
        ],
      },
      {
        name: "Battery",
        rows: [{ label: "Video playback", value: "Up to 39 hours" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C to USB-C, 1m woven" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The same A19 Pro chip and camera system as the iPhone 17 Pro, in a larger body with the longest battery life of any iPhone.",
  },
  {
    slug: "samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "samsung",
    category: "phones",
    keySpec: "200MP · S Pen included",
    badge: "pre-order",
    rating: 4.8,
    reviewCount: 64,
    rewardPoints: 1800,
    preOrderArrival: "2026-11-28",
    accessories: ["samsung-45w-charger", "voltra-screen-protector-s26"],
    variants: matrix(
      "s26u",
      [
        { color: "Titanium Grey", colorHex: "#6e7076" },
        { color: "Titanium Black", colorHex: "#232326" },
      ],
      [
        { storage: "256GB", price: 179999 },
        { storage: "512GB", price: 199999 },
      ],
      {
        "s26u-titaniumgrey-256gb": "pre-order",
        "s26u-titaniumgrey-512gb": "pre-order",
        "s26u-titaniumblack-256gb": "pre-order",
        "s26u-titaniumblack-512gb": "pre-order",
      },
    ),
    highlights: [
      { label: "Camera", headline: "200MP main sensor with 5x periscope" },
      { label: "S Pen", headline: "Built-in S Pen, no charging needed" },
      { label: "Display", headline: '6.9" QHD+ at 120Hz, 2600 nits' },
      { label: "Battery", headline: "5000mAh with 45W wired charging" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "6.9-inch Dynamic AMOLED 2X" },
          { label: "Resolution", value: "3120 × 1440" },
          { label: "Refresh", value: "Adaptive 1–120Hz" },
        ],
      },
      {
        name: "Camera",
        rows: [
          { label: "Main", value: "200MP, ƒ/1.7, OIS" },
          { label: "Periscope", value: "50MP, 5x optical, ƒ/3.4" },
          { label: "Ultra wide", value: "50MP, ƒ/1.9" },
        ],
      },
      {
        name: "Battery",
        rows: [
          { label: "Capacity", value: "5000mAh" },
          { label: "Charging", value: "45W wired, 15W wireless" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C to USB-C" },
          { label: "S Pen", value: "Included" },
          { label: "Warranty", value: "1 year official Samsung warranty" },
        ],
      },
    ],
    description:
      "Pre-order the Galaxy S26 Ultra and collect it on launch day. A 200MP main camera, a built-in S Pen and a 6.9-inch QHD+ display at 120Hz, with seven years of Android updates.",
  },
  {
    slug: "apple-iphone-17",
    name: "Apple iPhone 17",
    brand: "apple",
    category: "phones",
    keySpec: '6.1" · A19 chip',
    rating: 4.8,
    reviewCount: 143,
    rewardPoints: 1250,
    accessories: ["apple-airpods-pro-3", "anker-nano-ii-65w"],
    variants: matrix(
      "ip17",
      [
        { color: "Mist Blue", colorHex: "#a9c4d8" },
        { color: "Sage", colorHex: "#9fae9a" },
        { color: "Black", colorHex: "#2b2b2b" },
      ],
      [
        { storage: "128GB", price: 124999 },
        { storage: "256GB", price: 139999 },
      ],
    ),
    highlights: [
      { label: "Chip", headline: "A19 with a 5-core GPU" },
      { label: "Camera", headline: "Dual 48MP system with 2x zoom" },
      { label: "Display", headline: "6.1-inch Super Retina XDR" },
      { label: "Battery", headline: "Up to 26 hours of video playback" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.1-inch Super Retina XDR" }],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "A19, 6-core CPU" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C to USB-C" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The iPhone 17 brings the A19 chip, a dual 48MP camera system and USB-C in a lighter aluminium body.",
  },
  {
    slug: "google-pixel-11-pro",
    name: "Google Pixel 11 Pro",
    brand: "google",
    category: "phones",
    keySpec: "Tensor G6 · 7 years of updates",
    badge: "new",
    rating: 4.7,
    reviewCount: 88,
    rewardPoints: 1300,
    variants: matrix(
      "px11p",
      [
        { color: "Obsidian", colorHex: "#26262a" },
        { color: "Porcelain", colorHex: "#eae6dd" },
      ],
      [
        { storage: "256GB", price: 134999, salePrice: 128999 },
        { storage: "512GB", price: 149999 },
      ],
    ),
    highlights: [
      { label: "Camera", headline: "Best-in-class computational photography" },
      { label: "Software", headline: "Seven years of OS and security updates" },
      { label: "Chip", headline: "Tensor G6 with on-device Gemini" },
      { label: "Display", headline: '6.7" Super Actua at 120Hz' },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.7-inch Super Actua LTPO" }],
      },
      {
        name: "Camera",
        rows: [
          { label: "Main", value: "50MP, ƒ/1.68, OIS" },
          { label: "Telephoto", value: "48MP, 5x optical" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Cable", value: "USB-C to USB-C" },
          { label: "Warranty", value: "1 year official warranty" },
        ],
      },
    ],
    description:
      "Pixel 11 Pro leans on Tensor G6 for photo and audio processing that happens entirely on the device, and ships with seven years of updates.",
  },
  {
    slug: "xiaomi-16-pro",
    name: "Xiaomi 16 Pro",
    brand: "xiaomi",
    category: "phones",
    keySpec: "Leica optics · 120W charging",
    rating: 4.6,
    reviewCount: 96,
    rewardPoints: 950,
    variants: matrix(
      "xm16p",
      [
        { color: "Black", colorHex: "#232323" },
        { color: "White", colorHex: "#f0efeb" },
      ],
      [
        { storage: "256GB", price: 94999, salePrice: 87999 },
        { storage: "512GB", price: 104999 },
      ],
      { "xm16p-white-512gb": "low-stock" },
    ),
    highlights: [
      { label: "Camera", headline: "Leica-tuned triple camera system" },
      { label: "Charging", headline: "120W wired, full charge in 19 minutes" },
      { label: "Display", headline: '6.73" AMOLED at 120Hz' },
      { label: "Battery", headline: "5400mAh silicon-carbon cell" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.73-inch AMOLED" }],
      },
      {
        name: "Battery",
        rows: [
          { label: "Capacity", value: "5400mAh" },
          { label: "Charging", value: "120W wired, 50W wireless" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Charger", value: "120W adapter included" },
          { label: "Warranty", value: "1 year official warranty" },
        ],
      },
    ],
    description:
      "Leica-tuned cameras and 120W charging, so a full day of battery takes under twenty minutes to put back.",
  },
  {
    slug: "oneplus-15",
    name: "OnePlus 15",
    brand: "oneplus",
    category: "phones",
    keySpec: "6500mAh · 100W charging",
    rating: 4.5,
    reviewCount: 72,
    rewardPoints: 900,
    variants: matrix(
      "op15",
      [
        { color: "Sand Storm", colorHex: "#cbb79b" },
        { color: "Absolute Black", colorHex: "#1f1f21" },
      ],
      [{ storage: "256GB", price: 89999, salePrice: 84999 }],
    ),
    highlights: [
      { label: "Battery", headline: "6500mAh, two days of normal use" },
      { label: "Display", headline: '6.78" LTPO at 165Hz' },
      { label: "Charging", headline: "100W wired charging included" },
      { label: "Software", headline: "OxygenOS, clean and quick" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.78-inch LTPO AMOLED" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Capacity", value: "6500mAh" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Charger", value: "100W SuperVOOC adapter" }],
      },
    ],
    description:
      "A 6500mAh battery with 100W charging in the box, and a 165Hz display that stays smooth under load.",
  },
  {
    slug: "apple-iphone-16e",
    name: "Apple iPhone 16e",
    brand: "apple",
    category: "phones",
    keySpec: '6.1" · A18 chip',
    rating: 4.4,
    reviewCount: 54,
    rewardPoints: 850,
    variants: matrix(
      "ip16e",
      [
        { color: "White", colorHex: "#f2f1ec" },
        { color: "Black", colorHex: "#2b2b2b" },
      ],
      [{ storage: "128GB", price: 89999, salePrice: 84999 }],
    ),
    highlights: [
      { label: "Chip", headline: "A18 with Apple Intelligence" },
      { label: "Battery", headline: "Up to 26 hours of video playback" },
      { label: "Camera", headline: "48MP fusion camera with 2x zoom" },
      { label: "Price", headline: "The most affordable new iPhone" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "6.1-inch Super Retina XDR" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Apple warranty" }],
      },
    ],
    description:
      "The A18 chip and a 48MP camera at the lowest price in the current iPhone line-up.",
  },

  /* --------------------------------------------------------------- Laptops */
  {
    slug: "apple-macbook-pro-14-m5",
    name: "Apple MacBook Pro 14 (M5 Pro)",
    brand: "apple",
    category: "laptops",
    keySpec: "M5 Pro · 24GB unified memory",
    badge: "exclusive",
    rating: 4.9,
    reviewCount: 131,
    rewardPoints: 2800,
    stockedAt: ["gulshan-2", "dhanmondi"],
    accessories: ["anker-nano-ii-65w", "logitech-mx-master-4"],
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

  /* --------------------------------------------------------------- Tablets */
  {
    slug: "apple-ipad-pro-13-m5",
    name: "Apple iPad Pro 13 (M5)",
    brand: "apple",
    category: "tablets",
    keySpec: "Tandem OLED · M5",
    rating: 4.8,
    reviewCount: 94,
    rewardPoints: 2200,
    accessories: ["apple-pencil-pro"],
    variants: matrix(
      "ipp13m5",
      [
        { color: "Space Black", colorHex: "#3a3a3c" },
        { color: "Silver", colorHex: "#e3e4e6" },
      ],
      [
        { storage: "256GB", price: 194999, salePrice: 184999 },
        { storage: "512GB", price: 224999 },
      ],
    ),
    highlights: [
      { label: "Display", headline: "Ultra Retina XDR tandem OLED" },
      { label: "Chip", headline: "M5, faster than most laptops" },
      { label: "Build", headline: "5.1mm thin, 579g" },
      { label: "Pencil", headline: "Works with Apple Pencil Pro" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "13-inch Ultra Retina XDR" },
          { label: "Technology", value: "Tandem OLED, 1600 nits HDR" },
        ],
      },
      {
        name: "Chip",
        rows: [{ label: "Processor", value: "Apple M5" }],
      },
      {
        name: "Connectivity",
        rows: [
          { label: "Wi-Fi", value: "Wi-Fi 7" },
          { label: "Port", value: "Thunderbolt / USB 4" },
        ],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official Apple warranty" }],
      },
    ],
    description:
      "A 5.1mm tablet with a tandem OLED display and an M5 chip, which makes it a genuine drawing and editing machine rather than a large phone.",
  },
  {
    slug: "samsung-galaxy-tab-s11-ultra",
    name: "Samsung Galaxy Tab S11 Ultra",
    brand: "samsung",
    category: "tablets",
    keySpec: '14.6" AMOLED · S Pen',
    rating: 4.6,
    reviewCount: 41,
    rewardPoints: 1800,
    variants: matrix(
      "tabs11u",
      [{ color: "Graphite", colorHex: "#4b4b50" }],
      [
        { storage: "256GB", price: 154999, salePrice: 144999 },
        { storage: "512GB", price: 174999 },
      ],
    ),
    highlights: [
      { label: "Display", headline: '14.6" Dynamic AMOLED 2X at 120Hz' },
      { label: "S Pen", headline: "S Pen included in the box" },
      { label: "Multitasking", headline: "DeX mode for a desktop layout" },
      { label: "Battery", headline: "11200mAh with 45W charging" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "14.6-inch Dynamic AMOLED 2X" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Capacity", value: "11200mAh" }],
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
      "A 14.6-inch AMOLED tablet with the S Pen in the box and DeX for when it needs to behave like a desktop.",
  },

  /* --------------------------------------------------------------- Watches */
  {
    slug: "apple-watch-series-11",
    name: "Apple Watch Series 11 (46mm)",
    brand: "apple",
    category: "watches",
    keySpec: "Always-on · 5G cellular",
    badge: "new",
    rating: 4.8,
    reviewCount: 156,
    rewardPoints: 650,
    variants: matrix(
      "aw11",
      [
        { color: "Jet Black", colorHex: "#232326" },
        { color: "Rose Gold", colorHex: "#dbb2a4" },
        { color: "Silver", colorHex: "#e3e4e6" },
      ],
      [
        { storage: "GPS", price: 64999 },
        { storage: "GPS + Cellular", price: 79999 },
      ],
      { "aw11-rosegold-gps + cellular": "low-stock" },
    ),
    highlights: [
      { label: "Health", headline: "Sleep score and hypertension alerts" },
      { label: "Display", headline: "Always-on Retina, 2000 nits" },
      { label: "Battery", headline: "24 hours, 18 with heavy use" },
      { label: "Durability", headline: "Ion-X glass, 50m water resistant" },
    ],
    specs: [
      {
        name: "Display",
        rows: [
          { label: "Size", value: "46mm, 1.2-inch LTPO3 OLED" },
          { label: "Brightness", value: "2000 nits peak" },
        ],
      },
      {
        name: "Sensors",
        rows: [
          { label: "Heart", value: "Electrical and optical heart sensor" },
          { label: "Other", value: "Blood oxygen, temperature, depth" },
        ],
      },
      {
        name: "Battery",
        rows: [{ label: "Life", value: "Up to 24 hours" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Band", value: "Sport band, two sizes" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "Series 11 adds a sleep score and hypertension notifications, and keeps the always-on display readable in direct sun.",
  },
  {
    slug: "samsung-galaxy-watch8-44mm",
    name: "Samsung Galaxy Watch8 (44mm)",
    brand: "samsung",
    category: "watches",
    keySpec: "AMOLED · BioActive sensor",
    rating: 4.5,
    reviewCount: 122,
    rewardPoints: 380,
    variants: matrix(
      "gw8",
      [
        { color: "Graphite", colorHex: "#4b4b50" },
        { color: "Cream", colorHex: "#e8ddc8" },
      ],
      [{ storage: "Bluetooth", price: 39999, salePrice: 36999 }],
    ),
    highlights: [
      { label: "Health", headline: "BioActive sensor with body composition" },
      { label: "Display", headline: "Super AMOLED at 3000 nits" },
      { label: "Battery", headline: "Up to 40 hours with AOD off" },
      { label: "Fitness", headline: "Automatic workout detection" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "44mm Super AMOLED" }],
      },
      {
        name: "Sensors",
        rows: [{ label: "BioActive", value: "Heart rate, ECG, BIA" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Warranty", value: "1 year official warranty" }],
      },
    ],
    description:
      "Body composition readings, automatic workout detection and a display that stays legible outdoors.",
  },

  /* ----------------------------------------------------------------- Audio */
  {
    slug: "apple-airpods-pro-3",
    name: "Apple AirPods Pro 3",
    brand: "apple",
    category: "audio",
    keySpec: "Adaptive audio · USB-C",
    rating: 4.8,
    reviewCount: 388,
    ratingBreakdown: [310, 54, 16, 5, 3],
    rewardPoints: 330,
    stockedAt: ["gulshan-2", "dhanmondi", "uttara", "chattogram-gec"],
    variants: single("app3-white", "White", "#f4f4f2", 32999),
    highlights: [
      { label: "Noise", headline: "Twice the noise cancellation of Pro 2" },
      { label: "Audio", headline: "Adaptive audio adjusts as you move" },
      { label: "Health", headline: "Live heart-rate sensing in workouts" },
      { label: "Battery", headline: "8 hours of listening, 30 with the case" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [
          { label: "Driver", value: "Custom high-excursion Apple driver" },
          { label: "Cancellation", value: "Active, adaptive, transparency" },
          { label: "Audio", value: "Personalised spatial audio" },
        ],
      },
      {
        name: "Battery",
        rows: [
          { label: "Earbuds", value: "Up to 8 hours with ANC on" },
          { label: "With case", value: "Up to 30 hours" },
        ],
      },
      {
        name: "Connectivity",
        rows: [
          { label: "Bluetooth", value: "5.3 with Apple H3" },
          { label: "Charging", value: "USB-C, MagSafe, Qi" },
        ],
      },
      {
        name: "In the box",
        rows: [
          { label: "Tips", value: "Five sizes of foam-infused tips" },
          { label: "Case", value: "USB-C charging case with speaker" },
          { label: "Warranty", value: "1 year official Apple warranty" },
        ],
      },
    ],
    description:
      "The third-generation AirPods Pro double the noise cancellation and add a heart-rate sensor, with foam-infused tips in five sizes for a seal that actually holds.",
    reviews: [
      {
        id: "a1",
        author: "Imran Kabir",
        rating: 5,
        date: "2026-10-30",
        title: "Noise cancellation is a step up",
        body: "Used them on a Dhaka to Chattogram bus and the engine noise basically disappeared. The new tips seal much better than the old ones for me.",
        verified: true,
      },
      {
        id: "a2",
        author: "Sadia Rahman",
        rating: 4,
        date: "2026-10-12",
        title: "Great, but the case marks easily",
        body: "Sound and fit are excellent. The white case picks up scuffs within a couple of weeks, so get a cover with it.",
        verified: true,
      },
    ],
  },
  {
    slug: "sony-wh-1000xm6",
    name: "Sony WH-1000XM6",
    brand: "sony",
    category: "audio",
    keySpec: "Noise cancelling · 40h",
    badge: "new",
    rating: 4.7,
    reviewCount: 41,
    rewardPoints: 480,
    variants: matrix(
      "xm6",
      [
        { color: "Black", colorHex: "#232323" },
        { color: "Platinum Silver", colorHex: "#d6d4cf" },
      ],
      [{ storage: "Standard", price: 47999 }],
    ),
    highlights: [
      { label: "Noise", headline: "Twelve microphones for quieter travel" },
      { label: "Battery", headline: "40 hours, 3 hours from a 3-minute charge" },
      { label: "Comfort", headline: "Folds flat into a slim case" },
      { label: "Calls", headline: "Six beamforming mics for clear voice" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [
          { label: "Driver", value: "30mm carbon fibre composite" },
          { label: "Codecs", value: "LDAC, AAC, SBC, LC3" },
        ],
      },
      {
        name: "Battery",
        rows: [
          { label: "Life", value: "Up to 40 hours with ANC" },
          { label: "Quick charge", value: "3 hours from 3 minutes" },
        ],
      },
      {
        name: "Connectivity",
        rows: [{ label: "Bluetooth", value: "5.4, multipoint" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Case", value: "Folding carry case" },
          { label: "Cables", value: "USB-C and 3.5mm" },
        ],
      },
    ],
    description:
      "Sony's flagship over-ears, now folding flat again, with forty hours of battery and the quietest cancellation in the range.",
  },
  {
    slug: "bose-quietcomfort-ultra",
    name: "Bose QuietComfort Ultra",
    brand: "bose",
    category: "audio",
    keySpec: "Immersive audio · 24h",
    rating: 4.6,
    reviewCount: 87,
    rewardPoints: 420,
    variants: matrix(
      "bqcu",
      [{ color: "Black", colorHex: "#232323" }],
      [{ storage: "Standard", price: 42999, salePrice: 38999 }],
    ),
    highlights: [
      { label: "Comfort", headline: "The lightest clamp of any flagship" },
      { label: "Audio", headline: "Immersive audio widens the stage" },
      { label: "Noise", headline: "Bose cancellation, still the benchmark" },
      { label: "Battery", headline: "24 hours with immersive audio off" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Audio", value: "Bose Immersive Audio" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Life", value: "Up to 24 hours" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Case", value: "Hard carry case" }],
      },
    ],
    description:
      "Still the most comfortable flagship over-ears for long days, with cancellation that holds up on a plane.",
  },
  {
    slug: "jbl-charge-6",
    name: "JBL Charge 6",
    brand: "jbl",
    category: "audio",
    keySpec: "IP68 · 28h playtime",
    rating: 4.5,
    reviewCount: 211,
    rewardPoints: 190,
    variants: matrix(
      "jblc6",
      [
        { color: "Black", colorHex: "#232323" },
        { color: "Blue", colorHex: "#2f5f9e" },
      ],
      [{ storage: "Standard", price: 18999, salePrice: 16499 }],
    ),
    highlights: [
      { label: "Durability", headline: "IP68 dust and water resistant" },
      { label: "Battery", headline: "28 hours, and charges your phone" },
      { label: "Sound", headline: "Bigger bass radiators than Charge 5" },
      { label: "Pairing", headline: "Auracast to link more speakers" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Output", value: "45W RMS" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Playtime", value: "Up to 28 hours" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "USB-C charging cable" }],
      },
    ],
    description:
      "A portable speaker that survives being taken outdoors, with 28 hours of playtime and a power bank built in.",
  },
  {
    slug: "samsung-galaxy-buds4-pro",
    name: "Samsung Galaxy Buds4 Pro",
    brand: "samsung",
    category: "audio",
    keySpec: "ANC · 24-bit Hi-Fi",
    rating: 4.4,
    reviewCount: 98,
    rewardPoints: 220,
    variants: matrix(
      "gb4p",
      [{ color: "Silver", colorHex: "#d6d6d8" }],
      [{ storage: "Standard", price: 21999, salePrice: 19499 }],
    ),
    highlights: [
      { label: "Audio", headline: "24-bit Hi-Fi over Galaxy devices" },
      { label: "Noise", headline: "Adaptive ANC with voice detect" },
      { label: "Battery", headline: "7 hours, 26 with the case" },
      { label: "Fit", headline: "Blade design that stays put" },
    ],
    specs: [
      {
        name: "Sound",
        rows: [{ label: "Codec", value: "SSC Hi-Fi, AAC, SBC" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Earbuds", value: "Up to 7 hours with ANC" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Tips", value: "Three sizes" }],
      },
    ],
    description:
      "24-bit audio when paired with a Galaxy phone, and an adaptive mode that drops the volume when you start talking.",
  },

  /* ---------------------------------------------------------------- Gaming */
  {
    slug: "sony-playstation-5-pro",
    name: "Sony PlayStation 5 Pro (2TB)",
    brand: "sony",
    category: "gaming",
    keySpec: "2TB · 8K ready",
    rating: 4.7,
    reviewCount: 143,
    rewardPoints: 1100,
    variants: matrix(
      "ps5pro",
      [{ color: "White", colorHex: "#f1f1ef" }],
      [{ storage: "2TB", price: 109999 }],
      { "ps5pro-white-2tb": "low-stock" },
    ),
    highlights: [
      { label: "Graphics", headline: "67% more compute than PS5" },
      { label: "Upscaling", headline: "PlayStation Spectral Super Resolution" },
      { label: "Storage", headline: "2TB SSD built in" },
      { label: "Ray tracing", headline: "Up to triple the ray-tracing speed" },
    ],
    specs: [
      {
        name: "Performance",
        rows: [
          { label: "GPU", value: "Custom RDNA, 67% more compute units" },
          { label: "Ray tracing", value: "Up to 3× faster than PS5" },
        ],
      },
      {
        name: "Storage",
        rows: [{ label: "SSD", value: "2TB NVMe" }],
      },
      {
        name: "Display",
        rows: [{ label: "Output", value: "Up to 8K, 4K at 120Hz" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Controller", value: "DualSense wireless controller" },
          { label: "Warranty", value: "1 year official warranty" },
        ],
      },
    ],
    description:
      "The PS5 Pro targets 4K at 60fps with ray tracing left on, using Sony's own upscaler to get there.",
  },
  {
    slug: "nintendo-switch-2",
    name: "Nintendo Switch 2",
    brand: "nintendo",
    category: "gaming",
    keySpec: '7.9" 1080p · 120Hz',
    rating: 4.8,
    reviewCount: 267,
    rewardPoints: 560,
    variants: matrix(
      "ns2",
      [{ color: "Black", colorHex: "#232326" }],
      [{ storage: "256GB", price: 54999 }],
    ),
    highlights: [
      { label: "Display", headline: '7.9" 1080p LCD at 120Hz' },
      { label: "Dock", headline: "4K output when docked" },
      { label: "Storage", headline: "256GB built in" },
      { label: "Backwards", headline: "Plays most Switch games" },
    ],
    specs: [
      {
        name: "Display",
        rows: [{ label: "Size", value: "7.9-inch 1080p LCD, 120Hz, HDR" }],
      },
      {
        name: "Performance",
        rows: [{ label: "Output", value: "Up to 4K 60fps docked" }],
      },
      {
        name: "Storage",
        rows: [{ label: "Internal", value: "256GB UFS" }],
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
      "A bigger, brighter 120Hz screen, 4K when docked, and a library that carries over from the original Switch.",
  },
  {
    slug: "logitech-mx-master-4",
    name: "Logitech MX Master 4",
    brand: "logitech",
    category: "gaming",
    keySpec: "8K DPI · haptic feedback",
    rating: 4.6,
    reviewCount: 178,
    rewardPoints: 95,
    variants: matrix(
      "mxm4",
      [
        { color: "Graphite", colorHex: "#4a4a4c" },
        { color: "Pale Grey", colorHex: "#d8d6d1" },
      ],
      [{ storage: "Standard", price: 13999, salePrice: 12499 }],
    ),
    highlights: [
      { label: "Precision", headline: "8000 DPI on glass or wood" },
      { label: "Feedback", headline: "Haptic actions on the thumb rest" },
      { label: "Battery", headline: "70 days from a full charge" },
      { label: "Devices", headline: "Switches between three machines" },
    ],
    specs: [
      {
        name: "Performance",
        rows: [{ label: "Sensor", value: "Darkfield 8000 DPI" }],
      },
      {
        name: "Storage",
        rows: [{ label: "Onboard profiles", value: "Three devices" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Cable", value: "USB-C charging cable" }],
      },
    ],
    description:
      "The MX Master with haptics on the thumb rest, and a sensor that tracks on glass. Seventy days between charges.",
  },

  /* ------------------------------------------------------------ Networking */
  {
    slug: "tp-link-deco-be65",
    name: "TP-Link Deco BE65 (3-pack)",
    brand: "tp-link",
    category: "networking",
    keySpec: "Wi-Fi 7 · 6500 sq ft",
    rating: 4.5,
    reviewCount: 64,
    rewardPoints: 340,
    variants: matrix(
      "decobe65",
      [{ color: "White", colorHex: "#f2f2f0" }],
      [{ storage: "3-pack", price: 34999, salePrice: 31999 }],
    ),
    highlights: [
      { label: "Speed", headline: "Wi-Fi 7 at up to 11Gbps" },
      { label: "Coverage", headline: "6500 sq ft across three units" },
      { label: "Ports", headline: "2.5G WAN and LAN on each unit" },
      { label: "Security", headline: "HomeShield protection included" },
    ],
    specs: [
      {
        name: "Speed",
        rows: [{ label: "Standard", value: "Wi-Fi 7, BE11000 tri-band" }],
      },
      {
        name: "Coverage",
        rows: [{ label: "Area", value: "Up to 6500 sq ft" }],
      },
      {
        name: "Ports",
        rows: [{ label: "Ethernet", value: "2 × 2.5Gbps per unit" }],
      },
      {
        name: "Security",
        rows: [{ label: "Included", value: "HomeShield basic" }],
      },
    ],
    description:
      "Three Wi-Fi 7 mesh units that cover a large flat or a small office, with 2.5G ports on every node.",
  },
  {
    slug: "asus-rt-be88u",
    name: "Asus RT-BE88U",
    brand: "asus",
    category: "networking",
    keySpec: "Wi-Fi 7 · dual 10G ports",
    rating: 4.4,
    reviewCount: 31,
    rewardPoints: 290,
    variants: matrix(
      "rtbe88u",
      [{ color: "Black", colorHex: "#222225" }],
      [{ storage: "Standard", price: 42999 }],
    ),
    highlights: [
      { label: "Speed", headline: "BE7200 dual-band Wi-Fi 7" },
      { label: "Ports", headline: "Two 10G and four 2.5G ports" },
      { label: "Security", headline: "Lifetime AiProtection Pro" },
      { label: "Control", headline: "Per-device QoS and VPN server" },
    ],
    specs: [
      {
        name: "Speed",
        rows: [{ label: "Standard", value: "Wi-Fi 7 BE7200" }],
      },
      {
        name: "Ports",
        rows: [
          { label: "10G", value: "1 × WAN/LAN, 1 × SFP+" },
          { label: "2.5G", value: "4 × LAN" },
        ],
      },
      {
        name: "Security",
        rows: [{ label: "Included", value: "AiProtection Pro, lifetime" }],
      },
    ],
    description:
      "A router for people who run their own servers: two 10G ports, four 2.5G ports and a built-in VPN.",
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
        rows: [{ label: "Works with", value: "iPad Pro M4 and later" }],
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
    slug: "sony-alpha-7-v",
    name: "Sony Alpha 7 V (Body)",
    brand: "sony",
    category: "cameras",
    keySpec: "33MP full frame · 8K",
    rating: 4.8,
    reviewCount: 37,
    rewardPoints: 3200,
    variants: matrix(
      "a7v",
      [{ color: "Black", colorHex: "#232325" }],
      [{ storage: "Body only", price: 319999 }],
    ),
    highlights: [
      { label: "Sensor", headline: "33MP back-illuminated full frame" },
      { label: "Autofocus", headline: "AI subject recognition" },
      { label: "Video", headline: "8K at 30p, 4K at 120p" },
      { label: "Stabilisation", headline: "8 stops of in-body IS" },
    ],
    specs: [
      {
        name: "Sensor",
        rows: [{ label: "Type", value: "33MP full-frame Exmor R" }],
      },
      {
        name: "Video",
        rows: [{ label: "Maximum", value: "8K 30p, 4K 120p 10-bit" }],
      },
      {
        name: "Lens mount",
        rows: [{ label: "Mount", value: "Sony E" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Type", value: "NP-FZ100, 580 shots" }],
      },
    ],
    description:
      "A 33MP full-frame body with eight stops of stabilisation and 8K video, aimed at people shooting both stills and film.",
  },
  {
    slug: "dji-osmo-pocket-4",
    name: "DJI Osmo Pocket 4",
    brand: "dji",
    category: "cameras",
    keySpec: '1" sensor · 3-axis gimbal',
    badge: "new",
    rating: 4.6,
    reviewCount: 58,
    rewardPoints: 640,
    variants: matrix(
      "op4",
      [{ color: "Black", colorHex: "#232325" }],
      [{ storage: "Standard", price: 63999, salePrice: 59999 }],
    ),
    highlights: [
      { label: "Sensor", headline: '1-inch sensor for low light' },
      { label: "Stabilisation", headline: "Three-axis mechanical gimbal" },
      { label: "Tracking", headline: "ActiveTrack keeps you centred" },
      { label: "Size", headline: "Fits in a shirt pocket" },
    ],
    specs: [
      {
        name: "Camera",
        rows: [{ label: "Sensor", value: '1-inch CMOS, 4K 120fps' }],
      },
      {
        name: "Video",
        rows: [{ label: "Maximum", value: "4K at 120fps, 10-bit D-Log M" }],
      },
      {
        name: "Battery",
        rows: [{ label: "Runtime", value: "Up to 166 minutes" }],
      },
      {
        name: "In the box",
        rows: [{ label: "Accessories", value: "Wrist strap, USB-C cable" }],
      },
    ],
    description:
      "A gimbal camera with a one-inch sensor that fits in a pocket, which makes it the one that actually comes along.",
  },

  /* ---------------------------------------------------------------- Drones */
  {
    slug: "dji-mini-6-pro",
    name: "DJI Mini 6 Pro (Fly More)",
    brand: "dji",
    category: "drones",
    keySpec: "249g · 4K/120 HDR",
    rating: 4.7,
    reviewCount: 46,
    rewardPoints: 1400,
    variants: matrix(
      "mini6p",
      [{ color: "Grey", colorHex: "#9a9a9d" }],
      [{ storage: "Fly More Combo", price: 139999, salePrice: 132999 }],
    ),
    highlights: [
      { label: "Weight", headline: "Under 249g, no registration needed" },
      { label: "Camera", headline: '1/1.3" sensor, 4K at 120fps' },
      { label: "Flight", headline: "45 minutes per battery" },
      { label: "Safety", headline: "Omnidirectional obstacle sensing" },
    ],
    specs: [
      {
        name: "Camera",
        rows: [{ label: "Sensor", value: '1/1.3-inch CMOS, 48MP' }],
      },
      {
        name: "Flight time",
        rows: [{ label: "Per battery", value: "Up to 45 minutes" }],
      },
      {
        name: "Range",
        rows: [{ label: "Transmission", value: "O4+, up to 20km" }],
      },
      {
        name: "In the box",
        rows: [
          { label: "Batteries", value: "Three intelligent batteries" },
          { label: "Bag", value: "Shoulder bag, charging hub" },
        ],
      },
    ],
    description:
      "At 249g it stays under the threshold that needs registration, and the Fly More combo includes the two extra batteries you will want.",
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

/* ------------------------------------------------------- Shelves (FR-CMS-03) */

/** Hand-picked and rule-driven shelves, as a CMS would supply them. */
export const shelves = {
  exclusive: [
    "apple-iphone-17-pro",
    "apple-macbook-pro-14-m5",
    "apple-ipad-pro-13-m5",
    "sony-playstation-5-pro",
  ],
  topSelling: [
    "apple-airpods-pro-3",
    "apple-iphone-17",
    "apple-macbook-air-13-m4",
    "nintendo-switch-2",
    "samsung-galaxy-watch8-44mm",
    "anker-nano-ii-65w",
  ],
  newArrival: [
    "samsung-galaxy-s26-ultra",
    "sony-wh-1000xm6",
    "google-pixel-11-pro",
    "apple-watch-series-11",
    "dji-osmo-pocket-4",
  ],
  gaming: [
    "sony-playstation-5-pro",
    "nintendo-switch-2",
    "asus-rog-zephyrus-g16",
    "logitech-mx-master-4",
  ],
  audio: [
    "apple-airpods-pro-3",
    "sony-wh-1000xm6",
    "bose-quietcomfort-ultra",
    "jbl-charge-6",
    "samsung-galaxy-buds4-pro",
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
  "iPhone 17 Pro",
  "Galaxy S26 Ultra",
  "AirPods Pro 3",
  "MacBook Air M4",
  "PlayStation 5 Pro",
  "0% EMI offers",
] as const;
