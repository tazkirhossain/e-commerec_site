# Product images

How photography is organised, what is in place, and what is still needed.

## Where images live

```
public/images/products/<product-slug>/<view>.jpeg
```

The slug is the one in the product's URL (`/product/apple-iphone-17` →
`apple-iphone-17/`). Inside each folder:

| File | Meaning |
| --- | --- |
| `<colour>.jpeg` | Main shot of that colour, e.g. `deep-blue.jpeg` |
| `<colour>-2.jpeg`, `-3` | More angles of the same colour |
| `extra-1.jpeg`, `extra-2` | Shared by every colour: box contents, a lifestyle shot |

A file on disk is not shown until it is listed in `data/products.ts`. Each
variant names its photos with `photos(slug, "colour", "colour-2")`, and shared
shots go in the product's `gallery`. Category tiles take one photo each from
`image` in `data/catalog.ts`.

### Requirements

- **Square, 800×800 or larger.** 2000×2000 if you want zoom to be sharp.
- **White or very light background**, product centred with a little margin.
  The site blends white into its own surface colour, so a coloured or busy
  background will show as a box (DS-FND-01b).
- **JPEG, PNG or WebP.** Next.js resizes and converts on the fly.
- **Official press images** from the brand or distributor. Images taken from
  other shops can be a copyright problem.

## In place — 27 products, 68 photos

| Category | Products |
| --- | --- |
| Phones | iPhone 17 Pro Max (3 colours), iPhone 17 (4), iPhone Air, Galaxy S26 Ultra (3), Galaxy S26+, Galaxy A36 (2), Pixel 10 Pro, Pixel 10 |
| Tablets | iPad 11-inch (A16), OnePlus Pad Lite |
| Watches | Apple Watch Series 11 (2 colours), Haylou Velo (2) |
| Audio | Bose QC Ultra Earbuds (2), Marshall Major V (3), Anker Liberty 5 (2), Honor Choice Headphones Pro (2), JBL PartyBox 720, Logitech G435 (2) |
| Gaming | Nintendo Switch 2 (console and Mario Kart World bundle), DualSense Edge (2), Logitech G335 |
| Networking | Starlink Standard Kit, TP-Link Deco S7 3-pack |
| Cameras | DJI Osmo Pocket 4 Creator Combo, DJI Osmo Mobile 7 |
| Drones | DJI Mini 5 Pro (two controller editions), DJI Flip |

Category tiles, the home hero, the feature banner and the mega menu promo all
reuse these.

## Still needed

### Products with no photos (11)

These show a silhouette until photos arrive.

| Folder to create | Product | Colours in the catalogue |
| --- | --- | --- |
| `apple-macbook-pro-14-m5/` | MacBook Pro 14 (M5 Pro) | space-black, silver |
| `apple-macbook-air-13-m4/` | MacBook Air 13 (M4) | sky-blue, midnight, starlight |
| `asus-rog-zephyrus-g16/` | ROG Zephyrus G16 | eclipse-grey |
| `dell-xps-14/` | XPS 14 | platinum |
| `lenovo-thinkpad-x1-carbon/` | ThinkPad X1 Carbon | black |
| `apple-pencil-pro/` | Apple Pencil Pro | white |
| `anker-nano-ii-65w/` | Anker Nano II 65W | black, white |
| `baseus-usb-c-cable-2m/` | Baseus 100W USB-C Cable | black, blue |
| `voltra-clear-case-iphone-17-pro/` | Clear case | clear |
| `samsung-45w-charger/` | Samsung 45W adapter | black |
| `voltra-screen-protector-s26/` | S26 Ultra glass protector | clear |

Once laptops and accessories have photos, add them back to the home page
category tiles in `homeCategoryTiles` (`data/catalog.ts`).

### Photos waiting for identification (3)

In `public/images/unassigned/`. They are not listed because the exact model
cannot be confirmed from the photo, and a wrong model name on a product page is
worse than no listing.

| File | What it shows | Needed |
| --- | --- | --- |
| `galaxy-a35-or-a55-lilac.jpeg` | Samsung Galaxy A-series, lilac | Which model — A35 or A55 — and its storage and price |
| `tp-link-archer-router-front.jpeg`, `-back.jpeg` | TP-Link Archer router, four antennas | The model number, e.g. Archer C6 or C80, and its price |

### Nice to have

- **More angles** for products with a single shot (most phones): back, side.
- **Brand logos**, SVG, monochrome, max 32px tall, for the brand row and pages.
- **A wide lifestyle hero**, 2400×1030, if you want a photographic hero instead
  of a product on white. The current hero uses a 4:3 frame because that suits
  square product shots.
