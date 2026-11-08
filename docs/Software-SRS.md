# Software SRS — Premium Gadget E-commerce Platform

> Source of record: "Software SRS — Premium Gadget E-commerce Platform",
> 04 Nov 2026. This is the markdown transcription used by the codebase.
> Requirement IDs are unchanged, so `FR-*` / `NFR-*` / `IF-*` references in code
> comments point back here.
>
> **Scope note for this repository:** what is built here is the *storefront*
> front end only. There is no API, database, payment gateway or back office;
> the sample data in `data/` stands in for them, shaped to the entity model in
> §4.1 so that swapping in a real API is a change of source, not of shape.
> Requirements belonging to the back office (ADM) and to server-side concerns
> are transcribed for completeness and marked where the front end participates.

---

## 1. Introduction

This Software Requirements Specification (SRS) defines what the e-commerce
platform must do: its functions, data, integrations and quality targets. It is
written to be testable, so each requirement can later become a task and a test
case. The look and feel are defined separately in the Design SRS, which uses
the same module codes and terms.

### 1.1 Purpose and scope

- **Product:** a multi-brand online store for phones, laptops, tablets,
  wearables, audio, gaming, networking and accessories, with the same breadth of
  functionality as Gadget & Gear and a cleaner, Apple-style storefront.
- **In scope:** public storefront, customer accounts, catalog and search, cart
  and checkout, payments and EMI, orders and delivery tracking, reward points,
  promotions, reviews, store locator and store pickup, content management,
  notifications, and an admin back office.
- **Out of scope for the first release:** native mobile apps, marketplace with
  third-party sellers, point-of-sale terminals, accounting and ERP replacement,
  multi-currency and cross-border shipping.
- **Audience:** product owner, solution architect, developers, QA, and the
  operations team.

### 1.2 Definitions

These terms are used identically in the Design SRS.

| Term | Meaning |
| --- | --- |
| Product | A sellable model shown on one page (for example a phone model) |
| Variant | A specific configuration of a product (color, storage, region) |
| SKU | The unique stock-keeping unit of one variant; the unit that is stocked and ordered |
| Cart | The set of SKUs a customer intends to buy, before an order exists |
| Order | A confirmed purchase created at checkout, with a lifecycle of statuses |
| Pre-order | An order for a SKU not yet in stock, with an expected arrival date |
| Request order | A customer's request for an item that is not listed or is unavailable |
| EMI | Equated monthly installment payment through a partner bank or card issuer |
| Reward points | Loyalty credit earned on purchases and redeemable on later orders |
| Store | A physical retail outlet that can display stock and serve pickups |
| Back office | The internal admin application used by staff |

### 1.3 Conventions

- Requirement IDs: `FR-<MOD>-<NN>` for functions, `NFR-<CAT>-<NN>` for quality
  targets, `IF-<NN>` for external interfaces. Modules: CAT, SRC, INV, CRT, ORD,
  PAY, EMI, LOY, PRM, USR, STO, REV, CMS, NTF, ADM.
- Priority: **Must** = needed for launch, **Should** = important but can follow
  shortly after, **Could** = nice to have.
- Wording: the system SHALL for every Must and Should requirement.
- Release tags: R1 (launch), R2 (first improvement release), R3 (later).

### 1.4 Assumptions and dependencies

- The store sells in Bangladeshi taka only, to customers in Bangladesh, with
  nationwide delivery and pickup from physical stores.
- Product, price and stock data are managed in this platform; later integration
  with an existing inventory system is possible (IF-07).
- Payment gateways, banks and courier partners will be contracted by the
  business; their API documentation is a dependency for R1.
- Product photography and specifications are supplied by the business or brands.
- Legal pages (terms, privacy, warranty, return policy) are supplied by the
  business.

---

## 2. System overview

### 2.1 Architecture at a glance

Release 1 uses a **modular monolith**: one deployable API with clearly separated
modules, which is simpler to build and run than microservices yet can be split
later along the same module lines. The storefront and the back office are
separate front-end applications that call the same API.

Every request passes the CDN and firewall, reaches one of the two apps, and
then the same API; the API alone talks to data stores and partners.

### 2.2 User roles

| Role | Description | Key permissions |
| --- | --- | --- |
| Guest | Visitor who has not signed in | Browse, search, compare, cart, guest checkout, track order |
| Customer | Registered buyer | All guest actions plus saved addresses, wishlist, order history, reward points, reviews, requests |
| Catalog manager | Staff | Create and edit products, variants, prices, media, categories, brands |
| Order manager | Staff | View and process orders, update status, print invoices, handle returns |
| Content editor | Staff | Edit banners, home page sections, offers pages, help and policy pages |
| Support agent | Staff | Read customers and orders, add notes, issue refunds up to a set limit |
| Store staff | Staff at one branch | Manage stock and pickups for their own store only |
| Administrator | Senior staff | All permissions, user and role management, system settings, audit log |

### 2.3 Proposed technology (to be confirmed)

This is a recommendation to anchor estimates; the requirements in Section 3 do
not depend on it.

| Layer | Proposal | Reason |
| --- | --- | --- |
| Storefront | React with Next.js and TypeScript | Server rendering for SEO and fast first load |
| Back office | React with TypeScript | Shares design tokens and components with the storefront |
| API | Node.js (NestJS) or Laravel, REST with OpenAPI | Large talent pool locally; clear module structure |
| Database | PostgreSQL | Transactions for orders and stock |
| Cache and queues | Redis | Sessions, carts, background jobs, rate limiting |
| Search | Meilisearch or OpenSearch | Typo tolerance, filters, Bangla and English text |
| Files and media | S3-compatible storage behind a CDN | Image resizing and global caching |
| Hosting | Containers on a managed cloud in a nearby region | Low latency to Bangladesh and easy scaling |
| Quality | CI pipeline, automated tests, error tracking, uptime monitoring | Safe frequent releases |

### 2.4 Constraints

- Card details SHALL never be stored or processed on our servers; payment pages
  are hosted by the gateway.
- The site SHALL work on low-end Android phones over 3G and 4G connections.
- All customer-facing text SHALL exist in English and Bangla.
- Legal and tax rules (invoice format, VAT, consumer rights, data protection)
  must be confirmed with legal counsel before launch.

---

## 3. Functional requirements

### 3.1 Catalog (CAT)

Supports DS-PG-HOME, DS-PG-CAT, DS-PG-PDP, DS-PG-OFFERS, DS-PG-BRAND,
DS-PG-COMPARE.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-CAT-01 | The system SHALL organize products in categories up to 3 levels deep, each with a slug URL; the initial top level mirrors the reference store (Phones, Mac, Tablets, Watches, Headphones and speakers, Cases and protectors, Phone accessories, PC accessories, Camera, Gadgets, Networking, Gaming, Drone). | Must | R1 |
| FR-CAT-02 | A product SHALL have one or more variants (color, storage, region or connectivity); each variant is a SKU with its own price, stock, images and barcode. | Must | R1 |
| FR-CAT-03 | Each category SHALL define attribute groups (for example Display, Chip, Camera, Battery) that drive the specification table and the filters. | Must | R1 |
| FR-CAT-04 | The system SHALL manage brands with logo, description and a brand page listing its products. | Must | R1 |
| FR-CAT-05 | Listing pages SHALL offer filters (brand, price range, availability, series, compatible device, category attributes) and sorting (Featured, Price low to high, Price high to low, Newest, Best selling), 24 items per page, with filter state held in the URL. | Must | R1 |
| FR-CAT-06 | A SKU SHALL have a regular price and an optional sale price with start and end time; the system computes the saving amount and percent. | Must | R1 |
| FR-CAT-07 | The system SHALL support the badges New, Online only, Pre-order, Exclusive and Sale; New is applied automatically for 30 days after publishing, others are set by staff; at most one badge is shown per card. | Should | R1 |
| FR-CAT-08 | A product SHALL hold up to 10 images and one video; 360-degree media MAY be added later. | Must | R1 |
| FR-CAT-09 | Accessories SHALL be linkable to compatible devices so the product page can show "Accessories for this device" and listings can filter by compatible device. | Should | R1 |
| FR-CAT-10 | Customers SHALL be able to compare up to 4 products of one category; the selection persists for the session. | Should | R2 |
| FR-CAT-11 | Every product, category and brand page SHALL have a unique slug, meta title and description, canonical URL, breadcrumb and Product and Offer structured data; the system publishes an XML sitemap. | Must | R1 |
| FR-CAT-12 | Staff SHALL be able to import and export products, variants, prices and stock through CSV or XLSX, with a validation report before applying. | Must | R1 |
| FR-CAT-13 | A product SHALL have the status Draft, Published or Archived and MAY be scheduled to publish at a set time. | Must | R1 |

### 3.2 Search (SRC)

Supports DS-CMP-SEARCH and DS-PG-SEARCH.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-SRC-01 | Search SHALL match product name, brand, model, SKU, category and key specifications, and tolerate common typos. | Must | R1 |
| FR-SRC-02 | Search SHALL accept English and Bangla input. | Must | R1 |
| FR-SRC-03 | Bangla-to-English transliteration matching (for example a Bangla spelling of iPhone) SHOULD be supported through a managed synonym list. | Should | R2 |
| FR-SRC-04 | After 2 typed characters, search SHALL return up to 6 product suggestions (thumbnail, name, price) and up to 4 category suggestions. | Must | R1 |
| FR-SRC-05 | Before typing, the search overlay SHALL show the customer's recent searches (stored on the device) and a curated list of trending terms. | Should | R1 |
| FR-SRC-06 | The results page SHALL reuse the filters and sorting of FR-CAT-05, show "Showing results for" and offer a spelling suggestion when results are few. | Must | R1 |
| FR-SRC-07 | Changes to product, price or stock SHALL appear in search within 60 seconds. | Must | R1 |
| FR-SRC-08 | Staff SHALL be able to manage synonyms and pinned results and see a report of searches with zero results. | Should | R2 |

### 3.3 Inventory (INV)

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-INV-01 | Stock SHALL be tracked per SKU per location (central warehouse and each store). | Must | R1 |
| FR-INV-02 | Available to sell SHALL equal on-hand minus reserved. Stock is reserved when an order is placed and released when the order is cancelled or an unpaid online order expires (FR-PAY-04). | Must | R1 |
| FR-INV-03 | A SKU SHALL show one stock state: In stock, Low stock (threshold set per SKU or category), Out of stock, Pre-order, or Discontinued. | Must | R1 |
| FR-INV-04 | Staff SHALL be able to mark a SKU as Pre-order with an expected arrival date and a quantity cap; pre-order lines are flagged on the order. | Should | R1 |
| FR-INV-05 | A customer SHALL be able to leave a phone number or email on an out-of-stock SKU and be notified when it is back in stock (FR-NTF-01). | Should | R1 |
| FR-INV-06 | Every stock change SHALL record who, when, quantity and reason. | Must | R1 |
| FR-INV-07 | For phones and laptops, staff SHOULD record the serial number or IMEI at fulfilment so warranty can be looked up from the order. | Should | R2 |
| FR-INV-08 | The product page and checkout SHALL show which stores hold the item when store pickup is enabled. | Should | R1 |

### 3.4 Cart (CRT)

Supports DS-CMP-MINICART and DS-PG-CART.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-CRT-01 | Guests and customers SHALL have a cart; a guest cart persists for 30 days and merges into the customer cart on sign-in. | Must | R1 |
| FR-CRT-02 | Quantity SHALL be limited to available stock and to an optional per-SKU maximum. | Must | R1 |
| FR-CRT-03 | Each time the cart is viewed or checkout starts, the system SHALL re-check price and stock, flag changed lines, and block checkout for unavailable lines. | Must | R1 |
| FR-CRT-04 | One coupon code MAY be applied per order and is validated under FR-PRM-02. | Must | R1 |
| FR-CRT-05 | The cart SHALL show subtotal, discounts, estimated delivery fee by delivery area, tax where applicable, points redeemed and total. | Must | R1 |
| FR-CRT-06 | A customer SHALL be able to move a cart line to the wishlist. | Should | R1 |
| FR-CRT-07 | A cart with both in-stock and pre-order lines SHALL be allowed and shipped together when all lines are ready; split shipment is optional later. | Should | R2 |
| FR-CRT-08 | Customers who left items in a cart SHOULD receive a reminder after a configurable delay, only if they opted in. | Could | R2 |

### 3.5 Orders and fulfilment (ORD)

Supports DS-PG-CHECKOUT, DS-PG-TRACK, DS-PG-REQUEST, DS-PG-ACCOUNT.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-ORD-01 | Checkout SHALL have 3 steps (Details, Delivery and payment, Review); guest checkout requires a phone number and allows an optional email. | Must | R1 |
| FR-ORD-02 | The system SHALL verify the phone number by one-time code before accepting a cash-on-delivery order, with an adjustable amount threshold above which verification is always required. | Must | R1 |
| FR-ORD-03 | Addresses SHALL be chosen through cascading Division, District and Area or Thana lists maintained in the system, plus address line and landmark. | Must | R1 |
| FR-ORD-04 | Delivery methods SHALL be home delivery (fee by area, weight and order value rules) and store pickup (FR-STO-03). | Must | R1 |
| FR-ORD-05 | An order SHALL have one status: Placed, Confirmed, Shipped, Delivered, Cancelled or Returned. Payment state is separate (FR-PAY-03). | Must | R1 |
| FR-ORD-06 | Each order SHALL receive a unique, human-readable order number; the confirmation page, SMS and email show it. | Must | R1 |
| FR-ORD-07 | A customer SHALL be able to cancel an order while it is Placed or Confirmed; only staff can cancel after that. | Must | R1 |
| FR-ORD-08 | Staff SHALL be able to search and filter orders, change status, add internal notes, print invoice and packing slip, and run bulk actions. | Must | R1 |
| FR-ORD-09 | The system SHALL create courier consignments through at least one courier API (IF-04), store the tracking number and update status from courier callbacks. | Must | R1 |
| FR-ORD-10 | Guests SHALL be able to track an order with order number and phone; customers see a status timeline in their account. | Must | R1 |
| FR-ORD-11 | Customers SHALL be able to request a return within the policy window; staff approve or reject; approved returns trigger refund (FR-PAY-05) and points reversal (FR-LOY-05). | Should | R2 |
| FR-ORD-12 | The Request order form SHALL collect product name, link or photo, budget and phone; requests are queued for staff with the statuses New, Quoted, Converted and Closed. | Should | R1 |
| FR-ORD-13 | The system SHALL generate a downloadable PDF invoice per order with business and tax details. | Must | R1 |
| FR-ORD-14 | Order creation SHALL be idempotent so a double click or network retry never creates two orders. | Must | R1 |
| FR-ORD-15 | The system SHALL apply risk checks: limits per phone and per IP, a blocklist, and a flag for high-value cash-on-delivery orders needing a confirmation call. | Should | R1 |
| FR-ORD-16 | Staff SHOULD be able to edit address and lines of an order before it ships, with a full audit trail. | Should | R2 |

### 3.6 Payments (PAY)

Supports DS-CMP-PAY.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-PAY-01 | The system SHALL support cash on delivery, mobile wallets (bKash, Nagad), debit and credit cards, and bank EMI; each method can be enabled or disabled and given minimum and maximum order amounts. | Must | R1 |
| FR-PAY-02 | Online payments SHALL use gateway-hosted pages; card numbers are never stored or processed on our servers. | Must | R1 |
| FR-PAY-03 | Payment state SHALL be Unpaid, Pending, Paid, Failed, Refunded or Partially refunded, and is set only after server-side verification with the gateway, not from the browser redirect alone. | Must | R1 |
| FR-PAY-04 | An online order whose payment is Pending SHALL hold stock for a configurable period (default 15 minutes), allow retry, and release stock and cancel at expiry. | Must | R1 |
| FR-PAY-05 | Staff SHALL be able to refund full or partial amounts with a reason; the refund goes through the gateway where supported, otherwise it is recorded as a manual refund. | Should | R1 |
| FR-PAY-06 | All amounts SHALL be in BDT, rounded to whole taka under one documented rounding rule. | Must | R1 |
| FR-PAY-07 | A daily reconciliation report SHALL compare gateway settlements with orders. | Should | R2 |
| FR-PAY-08 | Pre-order deposits and balance-on-delivery payments MAY be supported. | Could | R2 |

### 3.7 EMI (EMI)

Supports DS-CMP-EMI.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-EMI-01 | Staff SHALL configure EMI plans: bank or issuer, tenure (initially 3, 6, 9, 12 and 24 months), interest rate or 0%, fee, minimum amount, eligible categories or products, and validity dates. | Must | R1 |
| FR-EMI-02 | The product page and cart SHALL show the monthly amount per eligible plan. | Must | R1 |
| FR-EMI-03 | At checkout the customer SHALL select a plan and continue to the bank or gateway flow; the chosen plan is stored on the order. | Must | R1 |
| FR-EMI-04 | Every EMI offer SHALL display total payable, interest, fees and a link to terms before payment. | Must | R1 |
| FR-EMI-05 | EMI orders SHOULD be reconciled against bank settlement reports. | Should | R2 |

### 3.8 Loyalty and reward points (LOY)

Supports reward points in DS-PG-PDP, DS-PG-CHECKOUT and DS-PG-ACCOUNT.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-LOY-01 | Customers SHALL earn reward points on Delivered orders at a rate configurable per category or product; points are credited when the order reaches Delivered. | Should | R1 |
| FR-LOY-02 | The system SHALL keep a points ledger (earned, redeemed, expired, adjusted) and show the balance and history in the account. | Should | R1 |
| FR-LOY-03 | Customers SHALL be able to redeem points at checkout for part of the order, within a configurable minimum, maximum share of the order and conversion rate. | Should | R1 |
| FR-LOY-04 | Points MAY expire after a configurable period, with a reminder before expiry. | Could | R2 |
| FR-LOY-05 | Points earned on an order SHALL be reversed, and redeemed points returned, when the order is cancelled or returned. | Should | R1 |
| FR-LOY-06 | Staff SHALL be able to adjust points manually with a reason, recorded in the audit log. | Should | R1 |
| FR-LOY-07 | Customer tiers and referral rewards MAY be added later. | Could | R3 |

### 3.9 Promotions (PRM)

Supports DS-PG-OFFERS, DS-CMP-PRICE and DS-CMP-BADGE.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-PRM-01 | Staff SHALL schedule campaigns that set sale prices for chosen SKUs between a start and end time; the storefront shows a countdown on timed deals. | Must | R1 |
| FR-PRM-02 | The system SHALL support coupon codes (percent or fixed amount) with minimum order, maximum discount, total and per-customer usage limits, validity dates, scope by category, brand or product, and a rule for combining with sale prices. | Must | R1 |
| FR-PRM-03 | The offers page SHALL list active campaigns and the products in each, built from rules or manual selection. | Must | R1 |
| FR-PRM-04 | Every discount applied to an order SHALL be stored on the order with the rule that produced it. | Must | R1 |
| FR-PRM-05 | Bank and payment-method offers SHOULD be defined per method or card issuer, shown on the product page and applied at payment. | Should | R2 |
| FR-PRM-06 | Free gifts and bundles SHOULD be added automatically when a stated condition is met. | Should | R2 |
| FR-PRM-07 | Customers SHOULD be able to submit an old device for an exchange estimate that staff answer with a quote. | Should | R2 |

### 3.10 Users and accounts (USR)

Supports DS-PG-AUTH and DS-PG-ACCOUNT.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-USR-01 | Customers SHALL register and sign in with a phone number or email using a one-time code; a password is optional. | Must | R1 |
| FR-USR-02 | The profile SHALL hold name, phone, email and preferred language (English or Bangla). | Must | R1 |
| FR-USR-03 | Customers SHALL manage up to 10 saved addresses with one default. | Must | R1 |
| FR-USR-04 | Customers SHALL have a wishlist; a guest wishlist kept on the device merges into the account on sign-in. | Should | R1 |
| FR-USR-05 | The account SHALL list orders with status and allow reordering the same items. | Must | R1 |
| FR-USR-06 | Staff accounts SHALL use role-based permissions (Section 2.2) and two-step verification. | Must | R1 |
| FR-USR-07 | Customers SHALL be able to request account deletion and a copy of their data; the business completes it within a documented period. | Should | R1 |
| FR-USR-08 | One-time code requests SHALL be rate limited per phone, email and IP address. | Must | R1 |
| FR-USR-09 | Staff sessions SHALL end after 30 minutes of inactivity; customer sessions MAY be remembered for 30 days on a trusted device. | Should | R1 |

### 3.11 Stores and pickup (STO)

Supports DS-PG-STORES and DS-CMP-STORECARD.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-STO-01 | Each store SHALL have a name, address, map location, phone, opening hours (including holidays), photos and services. | Must | R1 |
| FR-STO-02 | The store locator SHALL show a list and a map, search by area, an open-now filter, a directions link and distance when the visitor allows location access. | Must | R1 |
| FR-STO-03 | For store pickup the customer SHALL choose a store that has the items in stock; staff mark the order Ready for pickup, the customer is notified, and the order is held for a configurable period before being released. | Should | R1 |
| FR-STO-04 | Store staff SHALL see only the orders and stock of their own store. | Should | R1 |
| FR-STO-05 | Each store SHOULD have its own indexable page. | Should | R1 |

### 3.12 Reviews and questions (REV)

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-REV-01 | Customers who bought a product SHALL be able to leave one rating (1 to 5) with text and optional photos, marked as a verified purchase. | Should | R1 |
| FR-REV-02 | New reviews SHALL pass a moderation queue; staff can approve, reject or reply. | Should | R1 |
| FR-REV-03 | The system SHALL compute the average rating, review count and rating histogram for each product. | Should | R1 |
| FR-REV-04 | Visitors MAY ask questions on a product page that store staff answer publicly. | Could | R2 |
| FR-REV-05 | The system MAY ask for a review a set number of days after delivery. | Could | R2 |

### 3.13 Content management (CMS)

Supports DS-PG-HOME, DS-PG-CONTENT and DS-CMP-FOOTER.

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-CMS-01 | Staff SHALL build the home page from ordered sections (hero slides, category tiles, shelves, feature banner, brand row, store and service band) without code. | Must | R1 |
| FR-CMS-02 | A banner SHALL hold separate desktop and mobile images, alt text, link, language and a schedule. | Must | R1 |
| FR-CMS-03 | A shelf SHALL be defined by a rule (top selling, new arrival, category, brand, tag) or a hand-picked list. | Must | R1 |
| FR-CMS-04 | Static pages (about, contact, policies, FAQ) SHALL be edited in a rich-text editor with draft, publish and version history. | Must | R1 |
| FR-CMS-05 | Header categories, mega menu promo tiles and footer link groups SHALL be editable. | Must | R1 |
| FR-CMS-06 | All customer-facing content fields SHALL hold English and Bangla text, falling back to English when Bangla is empty. | Must | R1 |
| FR-CMS-07 | Staff SHOULD manage 301 redirects and SEO fields for any page. | Should | R1 |
| FR-CMS-08 | The media library SHALL require alt text, resize images automatically and serve AVIF or WebP. | Must | R1 |
| FR-CMS-09 | Newsletter sign-ups SHALL record consent and provide an unsubscribe link; staff can export subscribers. | Should | R1 |

### 3.14 Notifications (NTF)

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-NTF-01 | The system SHALL send SMS and email for: one-time code, order placed, confirmed, shipped (with tracking), delivered, cancelled, refund issued, pickup ready and back in stock. | Must | R1 |
| FR-NTF-02 | Templates SHOULD be editable by staff in both languages, with variables such as order number and amount. | Should | R1 |
| FR-NTF-03 | Each message SHALL be logged with its delivery status, retried on failure, and sent by email if SMS fails. | Should | R1 |
| FR-NTF-04 | Marketing messages SHALL be sent only to customers who opted in, with an opt-out in every message. | Must | R1 |
| FR-NTF-05 | Staff SHOULD be alerted to new orders, payment failures, low stock and new requests. | Should | R1 |
| FR-NTF-06 | Messaging-app updates (for example WhatsApp) MAY be added later. | Could | R3 |

### 3.15 Administration and reporting (ADM)

| ID | Requirement | Priority | Release |
| --- | --- | --- | --- |
| FR-ADM-01 | The back office SHALL enforce role permissions for every screen and action. | Must | R1 |
| FR-ADM-02 | The system SHALL keep an audit log of changes to prices, stock, orders, settings, roles and points (who, when, before, after) for at least 12 months. | Must | R1 |
| FR-ADM-03 | The dashboard SHOULD show today's orders and sales, pending actions, low stock, top products and payment-method split. | Should | R1 |
| FR-ADM-04 | Reports SHOULD cover sales by period, category, brand and payment method, stock valuation, customers and promotion results, each exportable to CSV or XLSX. | Should | R1 |
| FR-ADM-05 | Settings SHALL cover store details, tax, delivery fee rules, payment methods, verification and risk thresholds, points rules and languages. | Must | R1 |
| FR-ADM-06 | Staff SHALL be able to search customers, view their orders, add notes and block abusive accounts. | Must | R1 |
| FR-ADM-07 | The back office SHOULD reuse the design tokens of the Design SRS with denser table layouts. | Should | R1 |
| FR-ADM-08 | Long-running imports and exports SHALL run in the background with a visible job status. | Should | R1 |

---

## 4. Data model and interfaces

### 4.1 Core entities

| Entity | Key fields | Relationships | Module |
| --- | --- | --- | --- |
| Category | name (EN, BN), slug, parent, position | Has many Products; parent of Categories | CAT |
| Brand | name, slug, logo, description | Has many Products | CAT |
| Product | name (EN, BN), slug, description, status, SEO fields | Belongs to Category and Brand; has many Variants, Media, Reviews | CAT |
| Variant (SKU) | sku code, color, storage, region, regular price, sale price, sale window, barcode | Belongs to Product; has Stock Levels | CAT, INV |
| Attribute value | attribute, value | Belongs to Product or Variant; defined per Category | CAT |
| Compatibility link | accessory, device | Links two Products | CAT |
| Location | name, type (warehouse or store) | Has Stock Levels; Store extends Location | INV, STO |
| Stock level | on hand, reserved, low-stock threshold | One per Variant and Location | INV |
| Store | address, geo point, hours, services, photos | Is a Location | STO |
| Customer | name, phone, email, language, consent flags | Has Addresses, Carts, Orders, Wishlist, Points ledger | USR |
| Address | division, district, area, line, landmark, phone | Belongs to Customer; copied onto Orders | USR |
| Staff user and Role | name, email, role, permissions, store | Role has many Staff users | USR, ADM |
| Cart and Cart line | session or customer, variant, quantity | Cart has many lines; may become an Order | CRT |
| Order and Order line | number, status, totals, delivery method, price at purchase | Belongs to Customer or guest; has lines, Payments, Shipments | ORD |
| Payment | method, amount, gateway reference, state | Belongs to Order; has Refunds | PAY |
| Refund | amount, reason, method, state | Belongs to Payment | PAY |
| Shipment | courier, tracking number, status events | Belongs to Order | ORD |
| EMI plan | issuer, tenure, rate, fee, minimum amount, validity | Applies to Products or Categories; chosen on Orders | EMI |
| Points ledger entry | type, points, order reference, expiry | Belongs to Customer | LOY |
| Campaign and Coupon | rule, scope, limits, validity | Applies to Variants or Orders; recorded on Order | PRM |
| Return request | order lines, reason, status | Belongs to Order | ORD |
| Request order | product description, link, budget, phone, status | Optionally becomes an Order | ORD |
| Back-in-stock request | variant, contact | Belongs to Variant | INV |
| Review | rating, text, photos, status | Belongs to Product and Customer | REV |
| Banner, Page, Menu, Home section | content (EN, BN), schedule, status | Referenced by storefront | CMS |
| Notification | channel, template, status, attempts | Belongs to Customer or Order | NTF |
| Audit entry | actor, action, entity, before, after, time | References any entity | ADM |

### 4.2 Data rules

- Money SHALL be stored as whole numbers in the smallest unit (poisha) and
  displayed in whole taka; **no floating-point amounts**.
- Order lines SHALL store the price, discount and product name **as they were at
  purchase**, so later edits never change history.
- Customer-facing text fields SHALL have English and Bangla values.
- Personal data (phone, email, address) SHALL be encrypted at rest and excluded
  from logs.
- Order, payment and audit records SHALL be kept for at least the period
  required by tax law, to be confirmed with the business.

### 4.3 External interfaces

| ID | Interface | Purpose | Priority | Release |
| --- | --- | --- | --- | --- |
| IF-01 | Card and online payment gateway | Hosted card payments, status verification, refunds | Must | R1 |
| IF-02 | Mobile wallets (bKash, Nagad) | Wallet payments and refunds | Must | R1 |
| IF-03 | Partner banks for EMI | EMI eligibility, plan checkout, settlement files | Must | R1 |
| IF-04 | Courier services | Create consignment, tracking, delivery status callbacks | Must | R1 |
| IF-05 | SMS gateway | One-time codes and order messages | Must | R1 |
| IF-06 | Email service | Receipts, notices, newsletters | Must | R1 |
| IF-07 | Inventory or ERP system | Optional sync of stock, prices and orders | Could | R2 |
| IF-08 | Maps service | Store map, directions, address assist | Must | R1 |
| IF-09 | Analytics and tag manager | Traffic, conversion and ad measurement, consent-aware | Should | R1 |
| IF-10 | Object storage and CDN | Images, documents, static assets | Must | R1 |

Every interface SHALL be wrapped in an adapter inside the API so a provider can
be replaced without changing business logic; every outbound call SHALL have a
timeout, retry with back-off and an error log; every inbound webhook SHALL be
signature-checked and idempotent.

---

## 5. Non-functional requirements

Numeric targets marked (confirm) are proposals to be agreed with the business
before development starts. Front-end speed and accessibility targets are the
same as in the Design SRS (sections 5.4 and 5.5).

| ID | Category | Requirement | Priority |
| --- | --- | --- | --- |
| NFR-PERF-01 | Performance | On a mid-range Android phone over throttled 4G, Largest Contentful Paint SHALL be 2.5 s or less, Interaction to Next Paint 200 ms or less and Cumulative Layout Shift 0.1 or less on home, listing and product pages. | Must |
| NFR-PERF-02 | Performance | API read endpoints SHALL respond within 300 ms at the 95th percentile under normal load; search suggestions within 300 ms at the 95th percentile. | Must |
| NFR-PERF-03 | Performance | Checkout actions (place order, payment start) SHALL respond within 1 s at the 95th percentile, excluding time spent at the gateway. | Must |
| NFR-SCL-01 | Scalability | The system SHALL handle normal traffic of 500 concurrent visitors (confirm) and sustain 10 times that during launches and sales without failing orders; capacity SHALL be proven by a load test before launch. | Must |
| NFR-SCL-02 | Scalability | Stock reservation SHALL stay correct under concurrent orders: no SKU is oversold when 100 buyers target the last unit. | Must |
| NFR-AVL-01 | Availability | Monthly uptime of the storefront and checkout SHALL be at least 99.9% (confirm), excluding announced maintenance. | Must |
| NFR-AVL-02 | Availability | Backups SHALL run automatically with a recovery point of 15 minutes or less and a recovery time of 4 hours or less (confirm); a restore SHALL be tested every quarter. | Must |
| NFR-AVL-03 | Availability | If a partner service (SMS, courier, payment method) fails, the rest of the store SHALL keep working and the failure SHALL be shown to staff. | Must |
| NFR-SEC-01 | Security | The system SHALL follow OWASP ASVS level 2 and pass an independent penetration test with no open critical or high findings before launch. | Must |
| NFR-SEC-02 | Security | All traffic SHALL use HTTPS (TLS 1.2 or newer) with HSTS; secrets SHALL be kept in a secret manager, never in code. | Must |
| NFR-SEC-03 | Security | Staff authentication SHALL require two-step verification; passwords, where used, are stored with a modern slow hash (Argon2 or bcrypt). | Must |
| NFR-SEC-04 | Security | The system SHALL protect against injection, cross-site scripting, cross-site request forgery and brute force, and apply rate limits to sign-in, one-time code, search and checkout endpoints. | Must |
| NFR-SEC-05 | Security | Payment handling SHALL stay within PCI DSS SAQ A scope (gateway-hosted pages only). | Must |
| NFR-SEC-06 | Security | Dependencies SHALL be scanned automatically in CI; known critical vulnerabilities block release. | Should |
| NFR-PRV-01 | Privacy | Personal data SHALL be collected only as needed, with consent for marketing and non-essential cookies; the cookie banner offers Decline as easily as Accept. | Must |
| NFR-PRV-02 | Privacy | Customers SHALL be able to see, correct, export and delete their data (FR-USR-07); access to personal data by staff is logged. | Must |
| NFR-SEO-01 | SEO | Public pages SHALL be server-rendered with clean URLs, structured data (Product, Offer, Breadcrumb, Organization), XML sitemap, robots rules and canonical tags. | Must |
| NFR-SEO-02 | SEO | Filtered listing pages SHALL avoid duplicate-content traps through canonical rules and noindex on low-value combinations. | Should |
| NFR-A11Y-01 | Accessibility | Customer-facing pages SHALL meet WCAG 2.2 level AA (see DS-A11Y-01 to DS-A11Y-09). | Must |
| NFR-I18N-01 | Localization | The storefront SHALL be fully available in English and Bangla, with Bangla numerals optional, currency as ৳ with lakh grouping and dates as 04 Nov 2026. | Must |
| NFR-I18N-02 | Localization | Text SHALL be stored in translation files or content fields, never hard-coded, and the layout SHALL tolerate text growth of 30%. | Must |
| NFR-BRW-01 | Compatibility | The storefront SHALL work on the last two major versions of Chrome, Safari, Edge, Firefox and Samsung Internet, and on Android 9 and iOS 15 or newer. | Must |
| NFR-OPS-01 | Operations | The system SHALL provide centralized logs, error tracking, uptime checks and alerts to the on-call person for failed payments, order errors and slow responses. | Must |
| NFR-OPS-02 | Operations | Releases SHALL go through an automated pipeline (build, tests, staging, production) with one-step rollback; separate development, staging and production environments SHALL exist. | Must |
| NFR-MNT-01 | Maintainability | Code SHALL follow the module boundaries of Section 3, with automated tests covering at least 70% of business logic (confirm) and all checkout and payment paths. | Should |
| NFR-MNT-02 | Maintainability | The API SHALL be documented in OpenAPI and versioned; design tokens SHALL exist once and be shared by storefront and back office. | Should |

---

## 6. Release plan and acceptance

### 6.1 Release plan

Release 1 contains every Must requirement and the Should items tagged R1;
Release 2 and Release 3 add the items tagged so. Calendar dates are not set
here because they depend on team size and partner onboarding. Nothing in a
later phase starts until the gate before it is passed.

### 6.2 Acceptance criteria for Release 1

Release 1 can go live when all of these are true:

- Every requirement marked Must and R1 in Sections 3 and 5 has passed user
  acceptance testing, with no open critical or high defects.
- The performance, accessibility and security targets in Section 5 are met and
  evidenced.
- A load test has proven the capacity stated in NFR-SCL-01.
- A backup restore has been tested.
- Staff have been trained on the back office and the operational runbooks exist.
