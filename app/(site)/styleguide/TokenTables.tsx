import { formatDate, formatPhone, formatTaka } from "@/lib/format";
import { Group, Specimen } from "./Section";
import { cn } from "@/lib/cn";

/**
 * The token reference: colour, type, spacing, radius, elevation, motion and
 * layers, each swatch rendered through the utility it documents so the page
 * fails visibly if a token is renamed or removed.
 */

const colorGroups: { heading: string; tokens: { name: string; className: string; note?: string }[] }[] = [
  {
    heading: "Surfaces",
    tokens: [
      { name: "canvas", className: "bg-canvas border border-hairline", note: "Page floor" },
      { name: "surface", className: "bg-surface", note: "Cards, alternate bands" },
      { name: "surface-strong", className: "bg-surface-strong", note: "Icon buttons" },
      { name: "inverse", className: "bg-inverse", note: "Toasts, dark bands" },
    ],
  },
  {
    heading: "Text",
    tokens: [
      { name: "ink", className: "bg-ink", note: "Headlines, body, prices" },
      { name: "body", className: "bg-body", note: "Long-form running text" },
      { name: "secondary", className: "bg-secondary", note: "Supporting text" },
      { name: "disabled", className: "bg-disabled", note: "Disabled only" },
    ],
  },
  {
    heading: "Borders",
    tokens: [
      { name: "hairline", className: "bg-hairline", note: "Default 1px border" },
      { name: "hairline-soft", className: "bg-hairline-soft", note: "Long lists" },
      { name: "border-strong", className: "bg-border-strong", note: "Radio, switch" },
    ],
  },
  {
    heading: "Accent — the only brand voltage",
    tokens: [
      { name: "accent", className: "bg-accent", note: "Primary CTA, focus ring" },
      { name: "accent-hover", className: "bg-accent-hover", note: "Hover and press" },
      { name: "accent-disabled", className: "bg-accent-disabled", note: "Disabled CTA" },
    ],
  },
  {
    heading: "Status — always paired with an icon",
    tokens: [
      { name: "success", className: "bg-success", note: "In stock, confirmed" },
      { name: "warning", className: "bg-warning", note: "Low stock, pending" },
      { name: "danger", className: "bg-danger", note: "Errors, savings" },
      { name: "link-legal", className: "bg-link-legal", note: "Legal copy links" },
    ],
  },
];

const typeScale: { token: string; className: string; sample: string; spec: string }[] = [
  { token: "type-hero", className: "type-hero", sample: "Pro camera. All-day battery.", spec: "48 / 1.1 / 600 · 32 on mobile" },
  { token: "type-display", className: "type-display", sample: "Page title", spec: "28 / 1.25 / 700 · 24 on mobile" },
  { token: "text-title", className: "text-title", sample: "Shelf title", spec: "22 / 1.18 / 600" },
  { token: "text-subtitle", className: "text-subtitle", sample: "Modal title", spec: "20 / 1.2 / 600" },
  { token: "text-strong", className: "text-strong", sample: "Card group label", spec: "16 / 1.25 / 600" },
  { token: "text-base", className: "text-base", sample: "Default running text", spec: "16 / 1.5 / 400" },
  { token: "text-name", className: "text-name", sample: "Apple iPhone 17 Pro", spec: "15 / 1.3 / 600" },
  { token: "text-sm", className: "text-sm", sample: "Secondary text and labels", spec: "14 / 1.43 / 400" },
  { token: "text-caption", className: "text-caption", sample: "Legal and metadata", spec: "13 / 1.23 / 400" },
  { token: "text-badge", className: "text-badge", sample: "Exclusive", spec: "11 / 1.18 / 600" },
  { token: "text-micro", className: "text-micro uppercase", sample: "New", spec: "8 / 700 / uppercase" },
  { token: "text-price", className: "text-price tabular", sample: "৳ 32,999", spec: "16 / 1.5 / 600" },
  { token: "text-price-lg", className: "text-price-lg tabular", sample: "৳ 1,64,999", spec: "28 / 1.2 / 600" },
  { token: "text-rating", className: "text-rating tabular", sample: "4.9", spec: "64 / 1.1 / 700" },
];

const spacing = [
  { step: 1, value: "4px", use: "Icon to label" },
  { step: 2, value: "8px", use: "Tight groups" },
  { step: 3, value: "12px", use: "Input padding" },
  { step: 4, value: "16px", use: "Default gap, mobile margin" },
  { step: 5, value: "24px", use: "Card padding, grid gutter" },
  { step: 6, value: "32px", use: "Between related blocks" },
  { step: 8, value: "48px", use: "Between shelves, mobile" },
  { step: 12, value: "48px", use: "Section rhythm, mobile" },
  { step: 16, value: "64px", use: "Section rhythm, tablet" },
  { step: 24, value: "96px", use: "Section rhythm, desktop" },
];

const radii = [
  { token: "rounded-xs", use: "Chips in text, focus ring" },
  { token: "rounded-sm", use: "Buttons, inputs, banners" },
  { token: "rounded-md", use: "Product cards, images, tiles" },
  { token: "rounded-lg", use: "Trust strip, empty states" },
  { token: "rounded-xl", use: "Modals, hero tiles" },
  { token: "rounded-pill", use: "Search, chips, badges" },
];

export function TokenTables() {
  return (
    <>
      <Group
        id="tokens-color"
        title="Colour"
        note="Light theme. The accent appears on primary buttons, the search orb, the saved heart and focus rings — nowhere else. Status never rests on colour alone."
      >
        {colorGroups.map((group) => (
          <Specimen key={group.heading} label={group.heading}>
            {group.tokens.map((token) => (
              <div key={token.name} className="flex w-40 flex-col gap-2">
                <div
                  className={cn("h-16 w-full rounded-sm", token.className)}
                />
                <div>
                  <p className="text-caption font-medium text-ink">
                    --color-{token.name}
                  </p>
                  {token.note ? (
                    <p className="text-caption text-secondary">{token.note}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </Specimen>
        ))}
      </Group>

      <Group
        id="tokens-type"
        title="Typography"
        note="Inter for Latin, Hind Siliguri for Bangla. Weights 400, 500 and 600 only — plus 700 on the two display steps. Prices use tabular figures."
      >
        <Specimen label="Scale" column>
          <ul className="flex w-full flex-col divide-y divide-hairline">
            {typeScale.map((row) => (
              <li
                key={row.token}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <code className="w-40 shrink-0 text-caption text-secondary">
                  {row.token}
                </code>
                <span className={cn("min-w-0 flex-1 text-ink", row.className)}>
                  {row.sample}
                </span>
                <span className="shrink-0 text-caption text-secondary tabular">
                  {row.spec}
                </span>
              </li>
            ))}
          </ul>
        </Specimen>

        <Specimen
          label="Bangla"
          note="Line height increases for Bangla text, which the :lang(bn) rule applies."
          column
        >
          <p lang="bn" className="text-title text-ink">
            প্রিমিয়াম গ্যাজেট, অফিশিয়াল ওয়ারেন্টি
          </p>
          <p lang="bn" className="text-base text-body">
            ঢাকার ভিতরে ৫,০০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি।
          </p>
        </Specimen>

        <Specimen
          label="Formatting"
          note="Money, dates and phone numbers go through lib/format.ts — never formatted inline."
          column
        >
          <dl className="grid w-full grid-cols-[180px_1fr] gap-y-2 text-sm">
            <dt className="text-secondary">Money, lakh grouping</dt>
            <dd className="text-ink tabular">{formatTaka(164999)}</dd>
            <dt className="text-secondary">Large amount</dt>
            <dd className="text-ink tabular">{formatTaka(2749999)}</dd>
            <dt className="text-secondary">Small amount</dt>
            <dd className="text-ink tabular">{formatTaka(999)}</dd>
            <dt className="text-secondary">Date</dt>
            <dd className="text-ink">{formatDate("2026-11-04")}</dd>
            <dt className="text-secondary">Phone</dt>
            <dd className="text-ink tabular">{formatPhone("01712345678")}</dd>
          </dl>
        </Specimen>
      </Group>

      <Group
        id="tokens-layout"
        title="Spacing, radius and elevation"
        note="A 4px base unit. One shadow tier carries the system; a second exists only for overlays."
      >
        <Specimen label="Spacing scale" column>
          <ul className="flex w-full flex-col gap-2">
            {spacing.map((row) => (
              <li key={`${row.step}-${row.use}`} className="flex items-center gap-4 text-sm">
                <code className="w-14 shrink-0 text-caption text-secondary">
                  {row.step}
                </code>
                <span
                  className="h-4 shrink-0 rounded-xs bg-accent"
                  style={{ width: `calc(var(--spacing) * ${row.step})` }}
                  aria-hidden="true"
                />
                <span className="w-14 shrink-0 text-caption text-secondary tabular">
                  {row.value}
                </span>
                <span className="text-secondary">{row.use}</span>
              </li>
            ))}
          </ul>
        </Specimen>

        <Specimen label="Radius">
          {radii.map((row) => (
            <div key={row.token} className="flex w-40 flex-col gap-2">
              <div
                className={cn(
                  "h-16 w-full border border-hairline bg-canvas",
                  row.token,
                )}
              />
              <div>
                <p className="text-caption font-medium text-ink">{row.token}</p>
                <p className="text-caption text-secondary">{row.use}</p>
              </div>
            </div>
          ))}
        </Specimen>

        <Specimen label="Elevation">
          <div className="flex w-48 flex-col gap-2">
            <div className="h-20 w-full rounded-md bg-canvas" />
            <p className="text-caption font-medium text-ink">flat</p>
            <p className="text-caption text-secondary">
              Most surfaces. Cards separate by background, not borders.
            </p>
          </div>
          <div className="flex w-48 flex-col gap-2">
            <div className="h-20 w-full rounded-md bg-canvas shadow-(--shadow-1)" />
            <p className="text-caption font-medium text-ink">--shadow-1</p>
            <p className="text-caption text-secondary">
              Search bar, hovered cards, floating badges.
            </p>
          </div>
          <div className="flex w-48 flex-col gap-2">
            <div className="h-20 w-full rounded-md bg-canvas shadow-(--shadow-2)" />
            <p className="text-caption font-medium text-ink">--shadow-2</p>
            <p className="text-caption text-secondary">
              Overlays only: modal, drawer, mega menu.
            </p>
          </div>
        </Specimen>

        <Specimen label="Layers and motion" column>
          <dl className="grid w-full grid-cols-[180px_1fr] gap-y-2 text-sm">
            <dt className="text-secondary">z-base · z-sticky</dt>
            <dd className="text-ink tabular">0 · 100 — header, sticky bars</dd>
            <dt className="text-secondary">z-dropdown</dt>
            <dd className="text-ink tabular">200 — search suggestions</dd>
            <dt className="text-secondary">z-drawer · z-modal</dt>
            <dd className="text-ink tabular">300 · 400</dd>
            <dt className="text-secondary">z-toast</dt>
            <dd className="text-ink tabular">500 — always on top</dd>
            <dt className="text-secondary">--motion-fast</dt>
            <dd className="text-ink">150ms — hover, press, toggles</dd>
            <dt className="text-secondary">--motion-base</dt>
            <dd className="text-ink">250ms — menus, drawers, tabs</dd>
            <dt className="text-secondary">--motion-slow</dt>
            <dd className="text-ink">400ms — page and hero transitions</dd>
          </dl>
        </Specimen>
      </Group>
    </>
  );
}
