# CLAUDE.md — Voltra storefront

Working rules for this repository. These apply to **every** change, in every session.

## 1. What this project is

Voltra is the customer-facing storefront for a multi-brand premium gadget store in
Bangladesh (phones, laptops, tablets, wearables, audio, gaming, networking,
accessories). Next.js App Router + TypeScript + Tailwind CSS v4.

Three source documents govern the work. When they disagree, resolve in this order:

| Source | Authority |
| --- | --- |
| [`docs/DESIGN-airbnb.md`](docs/DESIGN-airbnb.md) | **Visual style** — palette, type scale, radii, shadow, density |
| [`docs/Design-SRS.md`](docs/Design-SRS.md) | **Page structure, components, behavior, a11y** (`DS-*` IDs) |
| [`docs/Software-SRS.md`](docs/Software-SRS.md) | **Functional scope and data model** (`FR-*`, `NFR-*` IDs) |

`docs/wireframes/` holds the Figma-exported HTML frames (`C1`–`C5` components,
`W01`–`W18` screens). They are the rendered truth for layout and sizing — when the
Design SRS describes a section in prose and a wireframe shows it, build the wireframe.

Deliberate deviations from the Design SRS, and why:

- **Accent is Rausch `#ff385c`**, not the SRS's `#0071E3`. The SRS itself calls its blue
  a placeholder (§5.9 Open questions); the visual style comes from DESIGN-airbnb.
- **Neutrals and type scale follow DESIGN-airbnb**, not the SRS's Apple-derived values.
  Typography is visual style. Token *names* still follow the SRS convention.
- **Fonts are Inter + Hind Siliguri**, which is what the SRS specifies (§2.2); Airbnb
  Cereal is not licensed for use here.

## 2. Tokens are the only styling vocabulary

All design values live once, in [`app/globals.css`](app/globals.css), as CSS custom
properties inside `@theme`, which makes them Tailwind utilities at the same time.

**Never write a raw hex, rgb, px font size, or px spacing value in a component.**
Use the token utility (`bg-accent`, `text-secondary`, `rounded-md`, `p-5`,
`text-title`) or `var(--token)`. One-off values are a bug, not a shortcut.

- Need a value that does not exist? Add a token first, then use it.
- `/styleguide` renders every token and every component. A new component or variant
  is not done until it appears there.
- Status is never carried by color alone — always pair with an icon or text
  (`DS-FND-01a`).

## 3. Layout and responsive rules

- **Mobile first.** Write the mobile case, then add `sm:` / `lg:` for wider screens.
- Breakpoints: mobile `< 640`, tablet `640–1023` (`sm:`), desktop `1024+` (`lg:`).
- Content caps at **1280px**; use `<Container>`. Hero imagery may run full-bleed.
- Page margins: 16px mobile, 32px tablet, 40px desktop.
- Product grids: 2 columns mobile, 3 tablet, 4 desktop. Reduce columns at each
  breakpoint — never reflow rows.
- Must work from 320px to 2560px with no horizontal scrolling.
- Sticky elements never overlap. Priority: header, then mobile buy bar, then compare
  bar. Use the `--z-*` tokens; no other z-index values.

## 4. Formatting

Use the helpers in [`lib/format.ts`](lib/format.ts) — never format inline.

- **Money:** `formatTaka(164999)` → `৳ 1,64,999`. Taka sign, lakh grouping (2-2-3),
  no decimals. Always render in a `.tabular` / `font-variant-numeric: tabular-nums`
  context so digits line up in columns.
- **Dates:** `formatDate(...)` → `04 Nov 2026`.
- **Phones:** `formatPhone(...)` → `01712-345678`.
- Amounts are held as whole taka integers. No floating-point money.

## 5. Components

- `components/ui/` — L1 core controls (Button, Input, Chip, Tabs, …)
- `components/commerce/` — L2 commerce display (Price, ProductCard, Badge, …)
- `components/feedback/` — L3 banners, toasts, modal, drawer, skeletons
- `components/layout/` — L4 Header, Footer, MegaMenu, SearchBar, Breadcrumb
- `components/blocks/` — L5 composed sections (Hero, ProductShelf, OrderSummary, …)

Rules:

- A component is **never restyled per page**. If a page needs a variation, add the
  variant to the component and to `/styleguide` first.
- Higher layers compose lower ones. `ProductCard` uses `Price` and `Button`; it does
  not re-implement them.
- Every variant and state shown in the `C1`–`C5` wireframes gets a prop.
- Default to Server Components. Add `"use client"` only for actual interactivity, and
  push it to the smallest leaf that needs it.

## 6. Interaction and accessibility (WCAG 2.2 AA, non-negotiable)

- **One primary button per view.**
- Touch targets **≥ 44×44px** with 8px spacing. A 24px control gets a 44px hit area.
- Visible focus ring on every focusable element: 2px accent outline, 2px offset.
  Never remove it. Use the `.focus-ring` utility.
- Buttons start with a verb ("Add to cart", "Place order", "Notify me").
- Semantic landmarks, exactly one `<h1>` per page, ARIA only where native HTML falls short.
- Modals and drawers trap focus, close on Escape, and return focus to the trigger.
- Toasts announce via `aria-live="polite"`; they carry Undo when the action is reversible.
- Adding to cart opens the mini-cart drawer and never navigates away.
- Variant changes update price, image and stock in place, and update the URL.
- Forms validate on blur and on submit; the first error receives focus.
- Destructive actions confirm in a modal — except removing a cart line, which uses a
  toast with Undo.
- Honor `prefers-reduced-motion`: no parallax, autoplay or scroll-linked animation.
- Images need `alt`, explicit dimensions, and lazy loading below the fold.

## 7. Content voice

Calm, confident, short. Headlines state a benefit in 6 words or fewer. No exclamation
marks, no all caps, no emoji in UI text. Error messages say what happened and what to
do next, without blame.

## 8. Before you call it done

```bash
npm run lint && npx tsc --noEmit && npm run build
```

- No raw hex / px design values outside `app/globals.css`.
- New components appear on `/styleguide` with all their states.
- Checked at 390px, 834px and 1440px.
- Keyboard-only pass: tab order is logical, focus is always visible.
