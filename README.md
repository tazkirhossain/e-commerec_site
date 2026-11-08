# Voltra

Storefront for a multi-brand premium gadget store in Bangladesh — phones,
laptops, tablets, wearables, audio, gaming, networking and accessories.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · no runtime dependencies
beyond React.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build; prerenders every route |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |

---

## What is here

Every one of the 18 screens in the Design SRS page inventory, built from a
five-layer component library on a single set of design tokens. The whole site
prerenders to static HTML — 126 routes, no server at request time — because
all catalogue data is local.

**Start at [`/styleguide`](http://localhost:3000/styleguide).** It renders every
token and every component with all of its variants and states, and is the
fastest way to see what exists before writing anything new.

### Routes

| Route | Screen | SRS |
| --- | --- | --- |
| `/` | Home | DS-PG-HOME |
| `/category/[slug]` | Category listing | DS-PG-CAT |
| `/brand` · `/brand/[slug]` | Brand index and brand listing | DS-PG-BRAND, DS-PG-CAT |
| `/search` | Search results | DS-PG-SEARCH |
| `/product/[slug]` | Product detail | DS-PG-PDP |
| `/cart` | Cart | DS-PG-CART |
| `/checkout` · `/order/[id]` | Checkout and confirmation | DS-PG-CHECKOUT |
| `/account/login` | Sign in | DS-PG-AUTH |
| `/account/*` | Overview, orders, addresses, points, wishlist, requests, profile | DS-PG-ACCOUNT |
| `/offers` · `/offers/[slug]` | Campaigns | DS-PG-OFFERS |
| `/store-locator` | Store locator | DS-PG-STORES |
| `/compare` | Compare | DS-PG-COMPARE |
| `/request-order` | Request an order | DS-PG-REQUEST |
| `/track-order` | Order tracking | DS-PG-TRACK |
| `/pages/[slug]` | Help, policies, about, contact | DS-PG-CONTENT |
| `not-found` · `error` | 404 and 500 | DS-PG-ERR |
| `/styleguide` | Living design system | — |

---

## Layout of the repository

```
app/
  (site)/      pages inside the main shell — header, footer, compare bar
  (checkout)/  checkout and confirmation, with a reduced header
  globals.css  every design token, as @theme custom properties
components/
  ui/          L1 core controls — Button, Field, Choice, Chip, Tabs, …
  commerce/    L2 commerce display — Price, ProductCard, BuyBox, Rating, …
  feedback/    L3 banners, toasts, modal, drawer, skeletons, empty states
  layout/      L4 Header, Footer, MegaMenu, SearchBar, Breadcrumb
  blocks/      L5 composed sections — Hero, ProductShelf, OrderSummary, …
data/          sample catalogue, shaped to the Software SRS entity model
lib/           formatting, client store, class helper
docs/          the specifications this is built from
```

Higher layers compose lower ones and never re-implement them. The rules are in
[`CLAUDE.md`](CLAUDE.md) and apply to every change.

---

## The specifications

| Document | Authority |
| --- | --- |
| [`docs/DESIGN-airbnb.md`](docs/DESIGN-airbnb.md) | Visual style — palette, type scale, radii, shadow, density |
| [`docs/Design-SRS.md`](docs/Design-SRS.md) | Page structure, components, behaviour, accessibility (`DS-*`) |
| [`docs/Software-SRS.md`](docs/Software-SRS.md) | Functional scope and data model (`FR-*`, `NFR-*`) |
| [`docs/wireframes/`](docs/wireframes) | Figma-exported HTML frames: `C1`–`C5` components, `W01`–`W18` screens |

The wireframes are the rendered truth for layout and sizing. They are kept
because they are the reference the components were built against, not because
anything imports them — nothing in `app/` or `components/` does.

Code comments cite requirement IDs (`DS-CMP-CARD`, `FR-CRT-03`) rather than
restating the rule, so a reader can follow a decision back to the document that
made it.

### Where this departs from the Design SRS, and why

- **Accent is Rausch `#ff385c`**, not the SRS's `#0071E3`. The SRS marks its own
  blue as a placeholder (§5.9); visual style comes from DESIGN-airbnb.
- **Neutrals and the type scale follow DESIGN-airbnb.** Token *names* still
  follow the SRS convention, so `DS-FND-01` and `DS-FND-02` still describe the
  structure even where the values differ.
- **Fonts are Inter + Hind Siliguri**, which is what the SRS itself specifies.

---

## How the data works

There is no API. `data/` holds a sample catalogue — 36 products with real
variant matrices, 20 brands, 8 stores, 5 campaigns, 10 content pages — typed to
the entities in Software SRS §4.1. Lookups (`getProduct`, `productsByCategory`,
`lowestPrice`) are the seam: replacing them with real fetches is a change of
source, not of shape.

**Product photography is not in the repository.** Rather than ship broken
images or grey boxes, `ProductImage` draws a device silhouette tinted with the
selected variant's colour — so changing colour on a product page visibly
changes the image, which is the behaviour the real gallery will have. Passing a
real `src` is a one-line data change.

**Money** is held everywhere as a whole number of taka and formatted at the
edge by `lib/format.ts` (`formatTaka(164999)` → `৳ 1,64,999`). No floating-point
amounts, no inline formatting.

## Client state

Cart, wishlist and compare live in `lib/store.tsx`, mirrored to `localStorage`
through the external stores in `lib/client-store.ts` and read with
`useSyncExternalStore`. That matters for more than lint: the hook renders the
server snapshot during hydration and swaps to the client value in the same
commit, so there is no mismatch and no second render — which is what lets every
page stay prerendered.

The same file holds the primitives for the other two things that only exist on
the client, the scroll position and the clock. Neither is read during render,
because both are request-time data and would block prerendering.

---

## Before you call a change done

```bash
npm run lint && npx tsc --noEmit && npm run build
```

- No raw hex or px design values outside `app/globals.css`.
- New components appear on `/styleguide` with all their states.
- Checked at 390px, 834px and 1440px.
- Keyboard-only pass: tab order is logical, focus is always visible.

## Known gaps

These are deliberate, and each is where the real platform takes over:

- **No backend.** Checkout, sign-in, newsletter and the request form validate
  fully and then show the state the server would produce. Placing an order
  clears the cart and routes to a prerendered sample confirmation.
- **No real map.** `IF-08` is not wired up, so the store locator plots stores on
  a schematic rather than a fake map image. Directions link out to real maps.
- **No translation files.** `NFR-I18N-02` wants strings in translation files;
  the language switch records the preference and sets `lang` on the document
  (which does change the font and line height for Bangla), but the copy itself
  is still English in the components.
- **Dark theme** is listed as an open question in Design SRS §5.9 and is not
  built. The tokens are structured so values can swap without renaming.
