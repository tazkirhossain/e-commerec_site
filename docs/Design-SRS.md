# Design SRS — Premium Gadget E-commerce (UI/UX)

> Source of record: "Design SRS — Premium Gadget E-commerce (UI/UX)", 04 Nov 2026.
> This is the markdown transcription used by the codebase. Requirement IDs are
> unchanged, so `DS-*` references in code comments point back here.
>
> Where this implementation deliberately departs from the document, the reason
> is recorded in [`../CLAUDE.md`](../CLAUDE.md) §1 — chiefly the accent colour
> and the type scale, which come from [`DESIGN-airbnb.md`](DESIGN-airbnb.md)
> because §5.9 of this document marks its own blue as a placeholder.

---

## 1. Introduction

This document defines every visual and interaction rule for the store's
website, so that designers and developers build one consistent product rather
than a collection of pages. It covers the design system (tokens and
components), each page, and the UX rules that connect them. The companion
Software SRS defines what the system does; this one defines how it looks and
feels.

### 1.1 Purpose and scope

- **Goal:** a clean, elegant, Apple-style retail experience for a multi-brand
  gadget store (phones, laptops, wearables, audio, accessories, gaming,
  networking).
- **In scope:** customer-facing website (mobile, tablet, desktop), design
  tokens, components, page layouts, flows, accessibility, motion, content voice.
- **Out of scope:** the admin panel's detailed screens (covered by the ADM
  module in the Software SRS; it reuses these tokens), native mobile apps, and
  brand logo creation.
- **Audience:** product owner, UI/UX designers, front-end developers, QA.

### 1.2 Reference analysis: Gadget & Gear

The reference site (gadgetandgear.com) shows the functionality we must match.
Its look is dense and promotion-heavy; ours keeps the same capabilities but
presents them with more space and less noise.

| Reference capability | Observed on reference site | Our design response |
| --- | --- | --- |
| Category navigation | 13 top-level categories in the header (Phones, Mac, Tablets, Watches, Audio, Gaming, Networking, Drone and more) | Slim global nav with a full-width mega menu (DS-CMP-NAV) |
| Hero promotion | Rotating banner carousel (9 slides, 1920×570) | Full-bleed hero with one message per slide, max 4 slides (DS-PG-HOME) |
| Trust strip | Authorized reseller, official product, 0% EMI, exchange, fast delivery, secure payment | Quiet icon row under the hero (DS-CMP-TRUST) |
| Product shelves | Exclusive, Top Selling, New Arrival, Gaming, Sound, Cases | Horizontal shelves with consistent product cards (DS-CMP-CARD) |
| Price display | Sale price, struck-out old price, "SAVE ৳" amount, ratings, Buy Now | Price block with lakh-style grouping, e.g. ৳ 2,74,999 (DS-CMP-PRICE) |
| Product badges | "online only", "Hot" | Small neutral badges (DS-CMP-BADGE) |
| Brand shelf | Logo row linking to brand pages | Monochrome logo row (DS-PG-BRAND) |
| Utility links | Offers, Store Locator, Cart, Request Order, User | Right-aligned header icons plus labelled links (DS-CMP-NAV) |
| Store locator | 22+ physical outlets in Dhaka | Map and list page (DS-PG-STORES) |
| EMI, exchange, reward points | Advertised on trust strip and footer copy | Dedicated product-page modules and checkout options (DS-PG-PDP, DS-PG-CHECKOUT) |
| Newsletter, footer | Newsletter signup; Company, Help, Policy columns | Minimal footer with the same three groups (DS-CMP-FOOTER) |

### 1.3 Design principles

Every decision in this document traces back to one of these five principles.
**When two rules conflict, the lower number wins.**

1. **Content first.** Products and photography are the interface. Chrome stays
   quiet.
2. **One clear action per view.** Each screen has a single primary button.
3. **Space is a feature.** Generous whitespace beats extra dividers, boxes and
   shadows.
4. **Consistent by construction.** Components use only the tokens in Section 2;
   no one-off values.
5. **Fast and accessible for everyone.** Meets WCAG 2.2 AA, works on low-end
   phones and slow networks, supports English and Bangla.

### 1.4 Document conventions

- Requirement IDs follow `DS-<AREA>-<NN>`. Areas: `FND` foundations, `CMP`
  components, `PG` pages, `UX` flows and behavior, `A11Y` accessibility, `PERF`
  performance, `CNT` content. Example: DS-FND-03.
- Keywords: **SHALL** = mandatory, **SHOULD** = recommended, **MAY** = optional.
- Token names use the pattern `--category-role-variant` (for example
  `--color-text-primary`). Components SHALL reference tokens, never raw hex
  values or pixel sizes.
- Terms used identically in both SRS documents: Product, Variant, SKU, Cart,
  Order, Pre-order, EMI, Reward points, Store.
- Currency: Bangladeshi taka, shown as ৳ with lakh grouping (৳ 1,24,999). Dates
  as 04 Nov 2026.

---

## 2. Design foundations

These tokens are the single source of truth. They SHALL be implemented as CSS
custom properties (and mirrored as Figma variables) so a change in one place
updates the whole site.

### 2.1 Color (DS-FND-01)

Light theme is the default. A dark theme SHOULD be provided using the same
token names (values swap only). The accent hue is used sparingly: links,
primary buttons, focus rings and selected states.

| Token | Light value | Use | Contrast on white |
| --- | --- | --- | --- |
| `--color-bg-primary` | `#FFFFFF` | Page background | n/a |
| `--color-bg-secondary` | `#F5F5F7` | Alternate sections, card surfaces | n/a |
| `--color-bg-inverse` | `#1D1D1F` | Dark sections, footer, toasts | n/a |
| `--color-text-primary` | `#1D1D1F` | Headlines, body, prices | 16:1 |
| `--color-text-secondary` | `#6E6E73` | Supporting text, old price, captions | 5:1 |
| `--color-text-disabled` | `#86868B` | Disabled controls only (never essential text) | 3.5:1 |
| `--color-text-on-inverse` | `#F5F5F7` | Text on dark surfaces | n/a |
| `--color-border-subtle` | `#D2D2D7` | Dividers, input borders | n/a |
| `--color-accent` | `#0071E3` | Primary button, selected state | 4.6:1 |
| `--color-accent-hover` | `#0077ED` | Button hover | n/a |
| `--color-accent-pressed` | `#006EDB` | Button pressed | n/a |
| `--color-link` | `#0066CC` | Text links | 5.6:1 |
| `--color-success` | `#248A3D` | In stock, confirmations | 4.6:1 |
| `--color-warning` | `#B25000` | Low stock, pending | 5.1:1 |
| `--color-danger` | `#D70015` | Errors, savings amount, out of stock | 5.4:1 |

- **DS-FND-01a:** Meaning SHALL NOT rely on color alone; pair status colors with
  an icon or label.
- **DS-FND-01b:** Product photography SHALL sit on `--color-bg-primary` or
  `--color-bg-secondary` only, never on tinted or gradient backgrounds.

### 2.2 Typography (DS-FND-02)

- **Latin:** Inter (variable, self-hosted) with fallback
  `system-ui, -apple-system, "Segoe UI", sans-serif`. Apple's own typeface is
  not licensed for third-party sites, so Inter is the closest clean substitute.
- **Bangla:** Hind Siliguri (or Noto Sans Bengali) loaded only when the Bangla
  language is active. Line height SHALL increase by 10% for Bangla text.
- **Weights used:** 400 regular, 500 medium, 600 semibold. No other weights.
- **Alignment:** left-aligned body text; centered text only for hero headlines
  and section intros.

| Token | Desktop (px/line) | Mobile (px/line) | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| `--type-display-xl` | 56/60 | 40/44 | 600 | -0.02em | Hero headline |
| `--type-display-lg` | 40/44 | 32/36 | 600 | -0.015em | Section hero, PDP title |
| `--type-h1` | 32/36 | 28/32 | 600 | -0.01em | Page title |
| `--type-h2` | 24/28 | 22/26 | 600 | 0 | Shelf title |
| `--type-h3` | 20/24 | 18/22 | 600 | 0 | Card group, modal title |
| `--type-body-lg` | 18/28 | 17/26 | 400 | 0 | Intro paragraph |
| `--type-body` | 16/24 | 16/24 | 400 | 0 | Default text |
| `--type-body-sm` | 14/20 | 14/20 | 400 | 0 | Secondary text, labels |
| `--type-caption` | 12/16 | 12/16 | 400 | 0.01em | Legal, metadata |
| `--type-price-lg` | 28/32 | 24/28 | 600 | -0.01em | PDP price |
| `--type-price` | 17/24 | 16/24 | 600 | 0 | Card price |

- **DS-FND-02a:** Body text SHALL never be smaller than 16px on mobile form
  inputs (prevents iOS zoom).
- **DS-FND-02b:** Numerals in prices SHALL use tabular figures
  (`font-variant-numeric: tabular-nums`).

### 2.3 Spacing, grid and layout (DS-FND-03)

All spacing uses a 4px base unit. Only these steps are allowed.

| Token | Value | Typical use |
| --- | --- | --- |
| `--space-1` | 4px | Icon to label |
| `--space-2` | 8px | Tight groups |
| `--space-3` | 12px | Input padding |
| `--space-4` | 16px | Default gap, mobile page margin |
| `--space-5` | 24px | Card padding, grid gutter |
| `--space-6` | 32px | Between related blocks |
| `--space-7` | 48px | Between shelves on mobile |
| `--space-8` | 64px | Between sections on tablet |
| `--space-9` | 96px | Between sections on desktop |
| `--space-10` | 128px | Hero top and bottom padding |

| Breakpoint | Range | Columns | Page margin | Gutter |
| --- | --- | --- | --- | --- |
| `--bp-mobile` | under 640px | 4 | 16px | 16px |
| `--bp-tablet` | 640 to 1023px | 8 | 32px | 24px |
| `--bp-desktop` | 1024 to 1439px | 12 | 40px | 24px |
| `--bp-wide` | 1440px and up | 12 | auto (content max 1280px) | 24px |

- **DS-FND-03a:** Content width SHALL be capped at 1280px; hero imagery MAY run
  full-bleed.
- **DS-FND-03b:** Layout SHALL be designed mobile first, because most
  Bangladeshi retail traffic is on phones.

### 2.4 Shape and elevation (DS-FND-04)

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 8px | Inputs, badges |
| `--radius-md` | 12px | Buttons, small cards |
| `--radius-lg` | 18px | Product cards, tiles |
| `--radius-xl` | 28px | Hero tiles, modals |
| `--radius-pill` | 999px | Primary buttons, chips, search |
| `--elev-0` | none | Default for cards (use background contrast instead) |
| `--elev-1` | `0 1px 2px rgba(0,0,0,0.06)` | Sticky header on scroll |
| `--elev-2` | `0 8px 24px rgba(0,0,0,0.08)` | Dropdowns, hover lift |
| `--elev-3` | `0 20px 48px rgba(0,0,0,0.14)` | Modals, mega menu, drawers |

- **DS-FND-04a:** Cards SHALL separate from the page by background color
  (`--color-bg-secondary`), not by borders or shadows.

### 2.5 Motion (DS-FND-05)

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | 150ms | Hover, press, toggles |
| `--motion-base` | 250ms | Menus, drawers, tabs |
| `--motion-slow` | 400ms | Page transitions, hero fades |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Entering elements |

- **DS-FND-05a:** Motion SHALL be subtle: fades, small translations (max 16px)
  and gentle scale (max 1.03). No bouncing or spinning.
- **DS-FND-05b:** When `prefers-reduced-motion` is on, parallax, autoplay and
  scroll-linked animation SHALL be disabled.

### 2.6 Iconography (DS-FND-06)

- One line-icon set for the whole site (for example Lucide), 24px grid, 1.5px
  stroke, round caps and joins.
- Icons take `currentColor`; sizes 16, 20 and 24px only.
- Icon-only buttons SHALL have an accessible name and a 44×44px hit area.

### 2.7 Imagery (DS-FND-07)

| Use | Aspect ratio | Min source size | Format |
| --- | --- | --- | --- |
| Hero (desktop) | 21:9, height 560 to 720px | 2400×1030 | AVIF with WebP fallback |
| Hero (mobile) | 4:5 | 1080×1350 | AVIF with WebP fallback |
| Product card | 1:1 | 800×800 | AVIF with WebP fallback |
| Product gallery | 1:1, zoom to 2000px | 2000×2000 | AVIF with WebP fallback |
| Category tile | 4:3 | 1200×900 | AVIF with WebP fallback |
| Brand logo | free, max height 32px | SVG | SVG, monochrome |

- **DS-FND-07a:** All images SHALL have `srcset`, explicit width and height (to
  prevent layout shift) and meaningful alt text.
- **DS-FND-07b:** Below-the-fold images SHALL lazy-load; the hero image SHALL be
  preloaded.

### 2.8 Layers (DS-FND-08)

`z-index` tokens: `--z-base` 0, `--z-sticky` 100, `--z-dropdown` 200,
`--z-drawer` 300, `--z-modal` 400, `--z-toast` 500. **No other z-index values
are allowed.**

---

## 3. Component library

Every page in Section 4 is assembled only from the components below. A
component SHALL NOT be restyled per page; if a page needs a variation, the
variation is added here first.

### 3.1 Interaction states

Applies to every interactive component.

| State | Visual rule |
| --- | --- |
| Default | As specified per component |
| Hover (pointer devices only) | Background shifts one step (for example `--color-accent` to `--color-accent-hover`) over `--motion-fast` |
| Pressed | Background shifts to pressed value; scale 0.98 |
| Focus-visible | 2px outline in `--color-accent`, 2px offset, on every focusable element; never removed |
| Disabled | `--color-text-disabled` text, 40% opacity surface, no pointer events, `aria-disabled` set |
| Loading | Label replaced by a 16px spinner; width unchanged; control not clickable |
| Error | 1px `--color-danger` border plus icon and message text below the field |

### 3.2 Core controls

| ID | Component | Specification |
| --- | --- | --- |
| **DS-CMP-BTN** | Button | Variants: primary (filled `--color-accent`, white text, `--radius-pill`), secondary (1px `--color-accent` outline, accent text), tertiary (text link with chevron, `--color-link`), icon (44×44px, transparent), danger (filled `--color-danger`, used only for destructive confirmations). Sizes: sm 32px, md 40px, lg 48px high; horizontal padding `--space-5`; label `--type-body` weight 500. **Only one primary button per view.** |
| **DS-CMP-INPUT** | Text input, select, textarea | 48px high, `--radius-sm`, 1px `--color-border-subtle`, label above in `--type-body-sm`, helper text below in `--color-text-secondary`. Focus border becomes `--color-accent`. Placeholder is never the only label. |
| **DS-CMP-QTY** | Quantity stepper | 40px high pill with minus, number, plus; min 1; max equals available stock; plus disabled at max with tooltip "Only N left". |
| **DS-CMP-CHECK** | Checkbox, radio, switch | 24px control, 44px hit area, accent fill when on; group has a visible legend. |
| **DS-CMP-CHIP** | Filter or option chip | 36px high pill, `--color-bg-secondary` background; selected state uses `--color-text-primary` fill with white text. |
| **DS-CMP-SWATCH** | Color swatch | 32px circle with 1px inner border; selected shows a 2px accent ring with 3px gap; color name shown as text beside the group, never color alone. |
| **DS-CMP-TABS** | Tabs and segmented control | Underline tabs for content switching, segmented pill for 2 to 4 exclusive options (for example storage size). |
| **DS-CMP-ACC** | Accordion | Full-width rows, 1px divider, plus/minus icon at right, one open at a time on mobile. |

### 3.3 Navigation and feedback

| ID | Component | Specification |
| --- | --- | --- |
| **DS-CMP-NAV** | Global header | Sticky, height 56px mobile and 64px desktop, `--color-bg-primary` at 80% opacity with 20px backdrop blur, `--elev-1` after scrolling. Desktop layout: logo (left), category links (center, `--type-body-sm`), search, account, cart icon with count badge (right). Utility links Offers and Store Locator sit in a slim 36px bar above the header on desktop and inside the drawer on mobile. Mobile: logo, search icon, cart icon, hamburger. |
| **DS-CMP-MEGA** | Mega menu | Opens on hover or focus of a category (200ms intent delay) as a full-width panel on `--elev-3`: left column subcategories, middle column popular brands, right a single 4:3 promo tile. Closes on Escape or outside click. Mobile uses a full-height drawer with drill-down lists and a back button. |
| **DS-CMP-SEARCH** | Search | Pill input in a full-width overlay. Shows recent searches and trending terms before typing; after 2 characters shows up to 6 product suggestions (thumbnail, name, price) and 4 category suggestions. Supports English and Bangla input. Enter opens the results page. |
| **DS-CMP-CRUMB** | Breadcrumb | `--type-body-sm`, secondary color, chevron separators, last item not a link; collapses to a single "Back" link on mobile. |
| **DS-CMP-MODAL** | Modal and drawer | Modal: centered, max 560px, `--radius-xl`, `--elev-3`, scrim 40% black. Drawer: 420px wide from right (full width on mobile). Both trap focus, close on Escape, return focus to the trigger. |
| **DS-CMP-TOAST** | Toast | Bottom center (mobile) or bottom left (desktop), `--color-bg-inverse`, auto-dismiss after 4s, has an undo action when reversible, announced via `aria-live="polite"`. |
| **DS-CMP-BANNER** | Inline message | Full-width strip with icon, text and optional action; variants info, success, warning, error using status tokens. |
| **DS-CMP-SKEL** | Skeleton, empty and error states | Skeleton blocks match the final layout and use `--color-bg-secondary` with a slow shimmer. Every list has an empty state (icon, one line, one action). Every failed load shows a retry button. |
| **DS-CMP-FOOTER** | Footer | `--color-bg-secondary`, 4 link columns (Shop, Company, Help, Policy) collapsing to accordions on mobile; newsletter input with one-line consent; payment and delivery partner logos in monochrome; copyright line in `--type-caption`. |

### 3.4 Commerce components

| ID | Component | Specification |
| --- | --- | --- |
| **DS-CMP-HERO** | Hero tile | Full-bleed image, text block on left (desktop) or below the image (mobile), headline `--type-display-xl`, one-line subhead, up to two buttons (one primary, one tertiary link). Carousel is optional: max 4 slides, no autoplay for users with reduced motion, pause on hover, dot indicators 44px hit area. |
| **DS-CMP-TRUST** | Trust strip | Single row of 5 items (icon 24px plus label): Authorized reseller, Official product, 0% EMI, Exchange, Secure payment. Horizontal scroll on mobile. No borders; `--color-bg-secondary` background. |
| **DS-CMP-CARD** | Product card | `--color-bg-secondary` surface, `--radius-lg`, padding `--space-5`. Order top to bottom: badge (optional), 1:1 image, product name (2 lines max, `--type-body` weight 500), key spec line (`--type-body-sm`, secondary), rating, price block, action row. Hover lifts by 4px and shows `--elev-2`. Entire card is one link; the Add to cart button is a separate control. Width: 4-up desktop, 3-up tablet, 2-up mobile. |
| **DS-CMP-PRICE** | Price block | Current price in `--type-price` primary text; old price struck through in secondary text; saving shown as "Save ৳ 5,000" in `--color-danger`. Format: ৳ with lakh grouping and no decimals. Out of stock replaces price with "Notify me". Pre-order shows "Pre-order" label. |
| **DS-CMP-BADGE** | Badge | 24px high, `--radius-sm`, `--type-caption` weight 600, uppercase off. Variants: neutral (New, Online only, Pre-order), accent (Exclusive), danger (Sale, with discount percent), success (In stock). **Max one badge per card.** |
| **DS-CMP-RATING** | Rating | Five 14px stars in `--color-text-primary`, numeric value and review count in secondary text; hidden when there are no reviews. |
| **DS-CMP-GALLERY** | Product gallery | Desktop: vertical thumbnail rail (left) and 1:1 main image with hover zoom. Mobile: swipeable full-width carousel with dot counter. Supports image, 360-degree view and video. Lightbox opens on tap. |
| **DS-CMP-VARIANT** | Variant selector | Ordered groups: Color (swatches), Storage or Size (segmented), Region or Connectivity (segmented). Unavailable combinations are shown disabled with a line-through, **never hidden**. Price, image and stock update immediately without page reload. |
| **DS-CMP-SHELF** | Product shelf | Section title `--type-h2` with "Show all" link at right, then a horizontal scroll-snap row of DS-CMP-CARD with arrows on desktop. |
| **DS-CMP-FILTER** | Filter panel | Desktop: left rail 280px; mobile: bottom-sheet drawer with sticky Apply button showing result count. Groups: Brand, Price range, Availability, Series, Compatible device, Specs. Active filters appear as removable chips above the grid. |
| **DS-CMP-MINICART** | Mini cart drawer | Opens from the header cart icon or after add-to-cart; lists items with thumbnail, name, variant, DS-CMP-QTY, remove; footer shows subtotal and primary button "Checkout". |
| **DS-CMP-EMI** | EMI calculator | Segmented control of bank, tenure (3, 6, 9, 12, 24 months), shows monthly amount in `--type-price-lg`, a note on 0% eligibility, and a link to terms. |
| **DS-CMP-STEPPER** | Checkout stepper | 3 steps (Details, Delivery and payment, Review) as numbered circles with connecting line; current step in accent, done steps with check icon. |
| **DS-CMP-ADDRESS** | Address form | Division, District, Area/Thana selects in cascading order, then address line and landmark; saved addresses shown as selectable cards. |
| **DS-CMP-PAY** | Payment option tile | Radio card with provider logo, name and short note (bKash, Nagad, cards, bank EMI, Cash on delivery); selected card gets a 2px accent border. |
| **DS-CMP-STORECARD** | Store card | Branch name, address, opening hours with open-now status, phone, Directions button, and distance when location is allowed. |
| **DS-CMP-COMPARE** | Compare bar and table | Sticky bar appears after 1 product is added (max 4), with thumbnails and a Compare button; table has sticky first column and highlights differing rows. |

---

## 4. Page and screen specifications

Each page lists its sections top to bottom, using only components from Section
3. Vertical rhythm between sections is `--space-9` on desktop, `--space-8` on
tablet and `--space-7` on mobile. Every page includes DS-CMP-NAV at the top and
DS-CMP-FOOTER at the bottom.

### 4.1 Page inventory

| ID | Page | URL pattern | Priority |
| --- | --- | --- | --- |
| DS-PG-HOME | Home | `/` | Must |
| DS-PG-CAT | Category and brand listing | `/category/{slug}`, `/brand/{slug}` | Must |
| DS-PG-SEARCH | Search results | `/search?q=` | Must |
| DS-PG-PDP | Product detail | `/product/{slug}` | Must |
| DS-PG-CART | Cart | `/cart` | Must |
| DS-PG-CHECKOUT | Checkout and order confirmation | `/checkout`, `/order/{id}` | Must |
| DS-PG-AUTH | Sign in, sign up, password reset | `/account/login` | Must |
| DS-PG-ACCOUNT | Account, orders, addresses, reward points, wishlist | `/account/*` | Must |
| DS-PG-OFFERS | Offers and campaigns | `/offers` | Should |
| DS-PG-STORES | Store locator | `/store-locator` | Should |
| DS-PG-BRAND | All brands index | `/brand` | Should |
| DS-PG-COMPARE | Compare | `/compare` | Should |
| DS-PG-REQUEST | Request an order (item not listed or out of stock) | `/request-order` | Should |
| DS-PG-TRACK | Order tracking | `/track-order` | Should |
| DS-PG-CONTENT | Help, policies, about, contact | `/pages/{slug}` | Must |
| DS-PG-ERR | 404, 500, offline | n/a | Must |

### 4.2 Home (DS-PG-HOME)

1. **Hero** (DS-CMP-HERO): flagship product of the moment, one message per slide.
2. **Trust strip** (DS-CMP-TRUST).
3. **Category tiles:** 6 to 8 large tiles (DS-CMP-CARD variant without price,
   4:3 image, category name and "Shop" link).
4. **Shelf:** Exclusive (DS-CMP-SHELF), then Top Selling, New Arrival in that
   order.
5. **Feature banner:** one full-width promo (brand or accessories campaign)
   using `--radius-xl`.
6. **Shelves by category:** Gaming, Audio, Cases and protectors, driven by admin
   configuration.
7. **Brand row** (monochrome logos, link to DS-PG-BRAND).
8. **Store and service band:** nearest store prompt, EMI and exchange explainer,
   reward points.
9. **Newsletter** inside the footer.

**Rules:** maximum 6 shelves above the footer; no more than one promotional
banner visible per viewport; section headings are always `--type-h2`.

### 4.3 Category and brand listing (DS-PG-CAT)

1. Breadcrumb (DS-CMP-CRUMB) and `--type-h1` title with product count.
2. Optional subcategory chips (DS-CMP-CHIP).
3. Toolbar: Filter button (mobile), active filter chips, sort select (Featured,
   Price low to high, Price high to low, Newest, Best selling).
4. Filter rail (DS-CMP-FILTER) at left on desktop.
5. Product grid of DS-CMP-CARD (4 / 3 / 2 columns), 24 items per page, "Load
   more" button (**not infinite scroll**) so the footer stays reachable.
6. Brand pages add a brand header with logo and a one-line description above the
   toolbar.
7. Empty result: message plus "Clear filters" and suggested categories.

**Filter state SHALL live in the URL** so results can be shared and the back
button works.

### 4.4 Product detail (DS-PG-PDP)

| Zone | Desktop layout | Mobile layout | Contents |
| --- | --- | --- | --- |
| Buy box | Left 7 columns gallery, right 5 columns sticky info | Gallery on top, info below | DS-CMP-GALLERY; title `--type-display-lg`; DS-CMP-RATING; DS-CMP-PRICE (`--type-price-lg`); DS-CMP-VARIANT groups; stock status; delivery estimate by area; primary "Add to cart" and secondary "Buy now"; wishlist and compare icon buttons |
| Mobile sticky bar | Not shown | Fixed bottom bar with price and Add to cart | Appears after the main button scrolls out of view |
| Offers and finance | Below buy box, full width | Same | Bank offers, DS-CMP-EMI, exchange estimate, reward points earned for this item (bank offers and exchange are shown only when enabled; they are Release 2 features, FR-PRM-05 and FR-PRM-07) |
| Highlights | Two-column, large type | Single column | 4 to 6 key features with short headline each, optional full-width lifestyle image |
| Specifications | DS-CMP-ACC groups | Same | Grouped spec table (Display, Chip, Camera, Battery, Connectivity, In the box) |
| Description | Rich text | Same | Max 680px line length |
| Reviews and Q&A | Summary bars left, list right | Stacked | Rating histogram, filter, write a review (verified purchasers), questions with store answers |
| Related | Shelves | Shelves | "Accessories for this device" first (cases, protectors, chargers), then "You may also like" |

**Rules:** the first viewport on desktop shows gallery, title, price and Add to
cart without scrolling; warranty and authenticity statement appears directly
under the buttons; out-of-stock products replace Add to cart with "Notify me".

### 4.5 Cart (DS-PG-CART)

- Left: line items (thumbnail, name, variant, DS-CMP-QTY, price, remove, move to
  wishlist). Right: order summary card (subtotal, discount, delivery estimate,
  total) with coupon field and primary "Checkout".
- Items with changed price or stock show a DS-CMP-BANNER warning on that line.
- Empty cart: illustration-free message, "Continue shopping" button and a shelf
  of top sellers.
- Mobile: summary becomes a sticky bottom bar with total and Checkout.

### 4.6 Checkout and confirmation (DS-PG-CHECKOUT)

1. DS-CMP-STEPPER at the top; header reduced to logo and a "Secure checkout"
   label (no mega menu, to avoid distraction).
2. **Step 1 Details:** phone number first, email optional, guest checkout
   allowed; sign-in is offered, not required.
3. **Step 2 Delivery and payment:** DS-CMP-ADDRESS; delivery method (home
   delivery, store pickup with DS-CMP-STORECARD selection); DS-CMP-PAY tiles
   including EMI and cash on delivery; reward points redemption switch.
4. **Step 3 Review:** itemized list, totals, terms checkbox, primary "Place
   order".
5. Persistent order summary at right on desktop, collapsible at top on mobile.
6. **Confirmation page:** large check icon, order number, summary, expected
   delivery, buttons "Track order" and "Continue shopping"; payment failures
   show an error banner with a retry button and keep the cart intact.

### 4.7 Account (DS-PG-AUTH, DS-PG-ACCOUNT)

- Sign in uses phone or email with one-time code as the primary path; password
  is optional. Single centered card, max 440px.
- Account area: left menu (Overview, Orders, Addresses, Reward points, Wishlist,
  Requests, Profile) and a content panel; on mobile the menu becomes a list
  screen with drill-down.
- Orders list shows status chips (Placed, Confirmed, Shipped, Delivered,
  Cancelled, Returned) using status tokens plus text, with a timeline on the
  order detail view.

### 4.8 Offers, brands and stores

- **DS-PG-OFFERS:** campaign banners at top, then product grid filtered by active
  offers, with countdown for time-limited deals in `--type-h3`.
- **DS-PG-BRAND:** alphabetical index with logo tiles and a sticky A to Z jump bar.
- **DS-PG-STORES:** list of DS-CMP-STORECARD at left and an interactive map at
  right (map above list on mobile); search by area; "Open now" filter.

### 4.9 Supporting pages

- **DS-PG-SEARCH:** same layout as DS-PG-CAT, with a "Showing results for" line
  and spelling suggestions.
- **DS-PG-COMPARE:** up to 4 products side by side using DS-CMP-COMPARE.
- **DS-PG-REQUEST:** short form (product name, link or photo, budget, phone);
  confirmation states a response time.
- **DS-PG-TRACK:** order number and phone, then a vertical timeline.
- **DS-PG-CONTENT:** single column, max 680px, `--type-body-lg`, table of
  contents on long policies.
- **DS-PG-ERR:** one headline, one sentence, one primary button back to home;
  search field on 404.

---

## 5. UX behavior, quality rules and acceptance

### 5.1 Core user flows (DS-UX-01)

| Flow | Steps | Target |
| --- | --- | --- |
| Discover to buy | Home or search, listing, product page, add to cart, mini cart, checkout, confirmation | Under 6 taps from home to Place order on mobile for a returning user |
| Quick re-order | Account, Orders, Reorder, cart | 2 taps to cart |
| Finance check | Product page, EMI calculator, choose plan, add to cart with plan carried to checkout | Plan stays selected through checkout |
| Out of stock | Product page, Notify me, phone entry, confirmation toast | One field only |
| Store pickup | Checkout, choose Store pickup, pick branch, review | Branch shows live stock |
| Compare | Compare icon on 2 to 4 cards, compare bar, compare page | Persists across pages in the session |

### 5.2 Interaction rules (DS-UX-02)

- Adding to cart opens DS-CMP-MINICART and never navigates away.
- Price, stock and image update in place when a variant changes; the URL updates
  with the variant parameter.
- Forms validate on blur and on submit; the first error receives focus and is
  read out.
- Destructive actions (remove address, cancel order) ask for confirmation in
  DS-CMP-MODAL; removing a cart item uses DS-CMP-TOAST with Undo instead.
- Page transitions SHALL feel instant: skeletons appear within 100ms, and scroll
  position is restored on back navigation.
- Sticky elements (header, mobile buy bar, compare bar) SHALL NOT overlap each
  other; priority is header, then buy bar, then compare bar.
- Language switch (English and Bangla) is always visible in the header menu,
  keeps the current page, and is remembered.

### 5.3 Responsive behavior (DS-UX-03)

| Element | Mobile (under 640px) | Tablet | Desktop (1024px and up) |
| --- | --- | --- | --- |
| Navigation | Hamburger drawer | Hamburger drawer | Inline links and mega menu |
| Product grid | 2 columns | 3 columns | 4 columns |
| Filters | Bottom sheet | Bottom sheet | Left rail |
| Product gallery | Swipe carousel | Swipe carousel | Thumbnail rail and zoom |
| Primary action | Sticky bottom bar | Inline | Inline |
| Checkout summary | Collapsible at top | Right column | Right column |

All pages SHALL work from 320px to 2560px wide without horizontal scrolling and
in portrait and landscape.

### 5.4 Accessibility (DS-A11Y)

- **DS-A11Y-01:** Conform to WCAG 2.2 level AA.
- **DS-A11Y-02:** Text contrast at least 4.5:1 (3:1 for 18px+ or bold 14px+); UI
  component and focus contrast at least 3:1.
- **DS-A11Y-03:** Everything usable by keyboard alone, in a logical tab order,
  with a visible focus ring (DS-FND-01 accent).
- **DS-A11Y-04:** Touch targets at least 44×44px with 8px spacing.
- **DS-A11Y-05:** Semantic HTML landmarks (header, nav, main, footer), one `h1`
  per page, and ARIA only where native elements fall short.
- **DS-A11Y-06:** Carousels, menus, tabs, accordions, modals follow the WAI-ARIA
  authoring patterns; dynamic updates (cart count, form errors, toasts) are
  announced through live regions.
- **DS-A11Y-07:** Text resizable to 200% and reflowing at 400% zoom without loss
  of content.
- **DS-A11Y-08:** Autoplaying motion can be paused; reduced-motion preference is
  honored (DS-FND-05b).
- **DS-A11Y-09:** Verified with automated checks in CI plus manual passes using a
  screen reader (NVDA and VoiceOver) before every release.

### 5.5 Performance budget (DS-PERF)

Measured on a mid-range Android phone over a throttled 4G connection.

| Metric | Target |
| --- | --- |
| Largest Contentful Paint | 2.5s or less |
| Interaction to Next Paint | 200ms or less |
| Cumulative Layout Shift | 0.1 or less |
| JavaScript per page (compressed) | 170KB or less on listing and product pages |
| Hero image (compressed) | 150KB or less on mobile |
| Fonts | Max 2 families, subset, `font-display: swap` |

### 5.6 Content voice and formatting (DS-CNT)

- **DS-CNT-01:** Tone is calm, confident and short. Headlines state the benefit in
  6 words or fewer; no exclamation marks, no all caps, no emoji in UI text.
- **DS-CNT-02:** Buttons start with a verb (Add to cart, Place order, Notify me).
- **DS-CNT-03:** Error messages say what happened and what to do next, without
  blame.
- **DS-CNT-04:** Prices always ৳ + lakh grouping; dates 04 Nov 2026; phone numbers
  in the Bangladesh national format (01XXX-XXXXXX); both English and Bangla
  strings are stored in translation files, never hard-coded.
- **DS-CNT-05:** Product names follow `Brand Model (Key spec)` and are never
  truncated to fewer than 2 lines.

### 5.7 Traceability to the Software SRS

| Design page | Software SRS modules |
| --- | --- |
| DS-PG-HOME | CMS (content), CAT (catalog), PRM (promotions) |
| DS-PG-CAT, DS-PG-SEARCH | CAT, SRC (search), INV (inventory) |
| DS-PG-PDP | CAT, INV, REV (reviews), EMI, LOY (loyalty), PRM |
| DS-PG-CART, DS-PG-CHECKOUT | CRT (cart), ORD (orders), PAY (payments), EMI, LOY, STO (stores) |
| DS-PG-AUTH, DS-PG-ACCOUNT, DS-PG-TRACK | USR (users), ORD, LOY, NTF (notifications) |
| DS-PG-STORES | STO |
| DS-PG-OFFERS | PRM, CAT |

### 5.8 Design deliverables and acceptance criteria

Design is complete and ready for development when all of these are true:

- Figma library contains every token in Section 2 as variables and every
  component in Section 3 with all states and light and dark values.
- Every page in Section 4.1 has mobile (390px), tablet (834px) and desktop
  (1440px) frames, built only from library components.
- A design lint check finds zero off-token colors, font sizes or spacing values.
- Clickable prototype covers the 6 flows in Section 5.1 and has been tested with
  at least 5 target users, with a task success rate of 90% or higher.
- Accessibility review against Section 5.4 passes with no critical issues.
- Bangla and English versions of the Home, Product and Checkout pages are
  reviewed for text overflow.
- Product owner signs off on the page inventory in Section 4.1.

### 5.9 Open questions

- Brand name, logo and final accent color: **the blue above is a placeholder.**
- Dark theme: required at launch or after launch?
- Is 360-degree and video media available for most products, or only flagship
  ones?
- Which payment partners and banks will be live at launch (affects DS-CMP-PAY and
  DS-CMP-EMI)?
