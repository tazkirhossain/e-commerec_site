"use client";

import { useState } from "react";
import { Accordion, SpecRows } from "@/components/ui/Accordion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, ChoiceGroup, Radio, Switch } from "@/components/ui/Choice";
import { Chip, ChipLink } from "@/components/ui/Chip";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Quantity } from "@/components/ui/Quantity";
import {
  SegmentGroup,
  SegmentedControl,
  SwatchGroup,
} from "@/components/ui/Swatch";
import { Tabs } from "@/components/ui/Tabs";

import { Badge, NewTag, ProductBadge } from "@/components/commerce/Badge";
import { CartLineItem } from "@/components/commerce/CartLineItem";
import { Price } from "@/components/commerce/Price";
import {
  ProductCard,
  ProductCardSkeleton,
  ProductGrid,
} from "@/components/commerce/ProductCard";
import { Rating, RatingHistogram } from "@/components/commerce/Rating";
import { OrderStatus, StockStatus } from "@/components/commerce/Status";
import { BrandRow, BrandTile, CategoryTile } from "@/components/commerce/Tiles";

import { Banner } from "@/components/feedback/Banner";
import { Drawer, Modal } from "@/components/feedback/Overlay";
import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/feedback/States";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SearchBar } from "@/components/layout/SearchBar";

import { CheckoutStepper } from "@/components/blocks/CheckoutStepper";
import { EmiCalculator } from "@/components/blocks/EmiCalculator";
import { OrderSummary } from "@/components/blocks/OrderSummary";
import { ProductShelf, ShelfHeader } from "@/components/blocks/ProductShelf";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { AddressCard, PaymentTile, StoreCard } from "@/components/blocks/Tiles";
import { paymentMethods } from "@/data/payments";

import { addresses } from "@/data/account";
import { brands, getBrandsForCategory, getCategory } from "@/data/catalog";
import { getProduct, getProducts, shelves } from "@/data/products";
import { stores } from "@/data/stores";
import { useStore } from "@/lib/store";

import { Group, Sample, Specimen } from "./Section";

/** Every component, with every variant and state. */
export function StyleguideBody() {
  return (
    <>
      <CoreControls />
      <CommerceDisplay />
      <FeedbackAndOverlays />
      <Navigation />
      <CommerceBlocks />
    </>
  );
}

/* ====================================================== L1 Core controls */

/* The iPhone's own colours, with one marked unavailable to show that state. */
const swatchOptions = [
  ...new Map(
    getProduct("apple-iphone-17-pro")!.variants.map((v) => [
      v.color,
      { value: v.color, label: v.color, hex: v.colorHex, available: true },
    ]),
  ).values(),
  { value: "white", label: "White", hex: "var(--color-surface-strong)", available: false },
];

function CoreControls() {
  const [qty, setQty] = useState(1);
  const [qtyMax, setQtyMax] = useState(3);
  const [chip, setChip] = useState("all");
  const [color, setColor] = useState(swatchOptions[0].value);
  const [storage, setStorage] = useState("256");
  const [segment, setSegment] = useState("phone");
  const [email, setEmail] = useState("rafiq@mail");

  return (
    <Group
      id="l1"
      title="L1 — Core controls"
      note="Buttons, inputs and selection controls. Every control has a visible focus ring and a hit area of at least 44×44px."
    >
      <Specimen label="Button — variants">
        <Sample label="Primary">
          <Button>Add to cart</Button>
        </Sample>
        <Sample label="Secondary">
          <Button variant="secondary">Buy now</Button>
        </Sample>
        <Sample label="Tertiary">
          <Button variant="tertiary" iconTrailing="chevron-right">
            Show more
          </Button>
        </Sample>
        <Sample label="Danger">
          <Button variant="danger">Delete address</Button>
        </Sample>
        <Sample label="Pill">
          <Button variant="pill">Become a seller</Button>
        </Sample>
      </Specimen>

      <Specimen label="Button — states">
        <Sample label="Default">
          <Button>Add to cart</Button>
        </Sample>
        <Sample label="Disabled">
          <Button disabled>Add to cart</Button>
        </Sample>
        <Sample label="Loading">
          <Button loading className="w-40">
            Add to cart
          </Button>
        </Sample>
        <Sample label="Secondary disabled">
          <Button variant="secondary" disabled>
            Buy now
          </Button>
        </Sample>
        <Sample label="Danger disabled">
          <Button variant="danger" disabled>
            Delete address
          </Button>
        </Sample>
      </Specimen>

      <Specimen label="Button — sizes and icons">
        <Sample label="sm · 32px">
          <Button size="sm">Add to cart</Button>
        </Sample>
        <Sample label="md · 40px">
          <Button size="md">Add to cart</Button>
        </Sample>
        <Sample label="lg · 48px">
          <Button size="lg">Add to cart</Button>
        </Sample>
        <Sample label="Leading icon">
          <Button iconLeading="bag">Add to cart</Button>
        </Sample>
        <Sample label="As a link">
          <ButtonLink href="/styleguide" variant="secondary">
            View cart
          </ButtonLink>
        </Sample>
      </Specimen>

      <Specimen label="Icon button">
        <Sample label="Ghost · 44px">
          <IconButton icon="heart" label="Save" />
        </Sample>
        <Sample label="Outline · 40px">
          <IconButton icon="chevron-right" label="Next" styleVariant="outline" />
        </Sample>
        <Sample label="Filled · 32px">
          <IconButton icon="x" label="Close" styleVariant="filled" />
        </Sample>
        <Sample label="On photo">
          <IconButton icon="heart" label="Save" styleVariant="on-photo" />
        </Sample>
        <Sample label="Saved">
          <IconButton icon="heart" label="Remove from wishlist" styleVariant="saved" />
        </Sample>
        <Sample label="Search orb · 48px">
          <IconButton icon="search" label="Search" styleVariant="orb" />
        </Sample>
        <Sample label="With count">
          <IconButton icon="bag" label="Cart, 2 items" count={2} />
        </Sample>
      </Specimen>

      <Specimen label="Input, select, textarea" narrow column>
        <Input label="Full name" placeholder="Enter your name" className="w-full" />
        <Input
          label="Phone number"
          type="tel"
          defaultValue="01712-345678"
          className="w-full"
        />
        <Input
          label="Email"
          defaultValue="rafiq@mail.com"
          helper="We send receipts here"
          className="w-full"
        />
        <Input
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
              ? undefined
              : "Enter a full email, like name@mail.com"
          }
          className="w-full"
        />
        <Input label="Country" defaultValue="Bangladesh" disabled className="w-full" />
        <Select
          label="District"
          options={["Dhaka", "Chattogram", "Khulna"]}
          className="w-full"
        />
        <Textarea
          label="Landmark"
          optional
          placeholder="Near Dhanmondi Lake, opposite the school"
          className="w-full"
        />
      </Specimen>

      <Specimen label="Quantity stepper">
        <Sample label="Default · max 12">
          <Quantity value={qty} onChange={setQty} max={12} />
        </Sample>
        <Sample label="At max · shows the reason">
          <Quantity value={qtyMax} onChange={setQtyMax} max={3} />
        </Sample>
      </Specimen>

      <Specimen label="Checkbox, radio, switch" narrow column>
        <ChoiceGroup legend="Brand" className="w-full">
          <Checkbox name="brand" defaultChecked label="Apple" description="24 products" />
          <Checkbox name="brand" label="Xiaomi" description="11 products" />
          <Checkbox name="brand" label="Pixel" disabled description="Out of stock" />
        </ChoiceGroup>

        <ChoiceGroup legend="Delivery method" className="w-full">
          <Radio name="sg-delivery" defaultChecked label="Home delivery" />
          <Radio name="sg-delivery" label="Store pickup" />
        </ChoiceGroup>

        <div className="w-full">
          <Switch
            label="Redeem reward points"
            description="1,650 points available"
            defaultChecked
          />
          <Switch label="Save this address" />
        </div>
      </Specimen>

      <Specimen label="Chip">
        <Chip
          variant={chip === "all" ? "selected" : "default"}
          onClick={() => setChip("all")}
        >
          All
        </Chip>
        <Chip
          variant={chip === "iphone" ? "selected" : "default"}
          onClick={() => setChip("iphone")}
        >
          iPhone
        </Chip>
        <Chip variant="removable" onRemove={() => undefined}>
          Samsung
        </Chip>
        <Chip variant="dropdown">Sort: Featured</Chip>
        <ChipLink href="/styleguide">As a link</ChipLink>
      </Specimen>

      <Specimen label="Swatch and segment" column>
        <SwatchGroup
          legend="Color"
          value={color}
          onChange={setColor}
          /* Real variant colours, so the specimen cannot drift from the data. */
          options={swatchOptions}
        />
        <SegmentGroup
          legend="Storage"
          value={storage}
          onChange={setStorage}
          options={[
            { value: "256", label: "256GB", available: true },
            { value: "512", label: "512GB", note: "+ ৳ 25,000", available: true },
            { value: "1024", label: "1TB", note: "+ ৳ 55,000", available: false },
          ]}
        />
        <div className="w-full max-w-sm">
          <SegmentedControl
            label="Sign in with"
            value={segment}
            onChange={setSegment}
            options={[
              { value: "phone", label: "Phone" },
              { value: "email", label: "Email" },
            ]}
          />
        </div>
      </Specimen>

      <Specimen label="Tabs and accordion" column>
        <div className="w-full max-w-2xl">
          <Tabs
            label="Product information"
            items={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <p className="text-base text-body">
                    Arrow keys move between tabs; only the selected tab is in the
                    tab order.
                  </p>
                ),
              },
              {
                id: "specs",
                label: "Specifications",
                content: (
                  <SpecRows
                    rows={[
                      { label: "Size", value: "6.3-inch Super Retina XDR" },
                      { label: "Refresh", value: "ProMotion 120Hz" },
                    ]}
                  />
                ),
              },
              {
                id: "reviews",
                label: "Reviews",
                content: (
                  <p className="text-base text-body">212 verified reviews.</p>
                ),
              },
            ]}
          />
        </div>

        <div className="w-full max-w-2xl">
          <Accordion
            single
            defaultOpen={["display"]}
            items={[
              {
                id: "display",
                title: "Display",
                content: (
                  <SpecRows
                    rows={[
                      { label: "Size", value: "6.3-inch Super Retina XDR" },
                      { label: "Refresh", value: "ProMotion 120Hz" },
                    ]}
                  />
                ),
              },
              { id: "battery", title: "Battery", content: <SpecRows rows={[{ label: "Video", value: "Up to 31 hours" }]} /> },
              { id: "box", title: "In the box", content: <SpecRows rows={[{ label: "Cable", value: "USB-C, 1m woven" }]} /> },
            ]}
          />
        </div>
      </Specimen>
    </Group>
  );
}

/* =================================================== L2 Commerce display */

function CommerceDisplay() {
  const iphone = getProduct("apple-iphone-17-pro")!;
  const airpods = getProduct("apple-airpods-pro-3")!;
  const soldOut = getProduct("apple-iphone-17-pro-max")!;
  const preOrder = getProduct("samsung-galaxy-s26-ultra")!;
  const watch = getProduct("samsung-galaxy-watch8-44mm")!;
  const phones = getCategory("phones")!;

  return (
    <Group
      id="l2"
      title="L2 — Commerce display"
      note="Badges, status, rating, price and the cards that carry them. These reuse the L1 controls rather than restyling them."
    >
      <Specimen label="Badge">
        <Badge>Online only</Badge>
        <Badge tone="accent">Exclusive</Badge>
        <Badge tone="sale">−12%</Badge>
        <Badge tone="success">In stock</Badge>
        <Badge>Pre-order</Badge>
        <NewTag />
        <ProductBadge kind="new" />
        <ProductBadge discountPercent={6} />
      </Specimen>

      <Specimen label="Order status" note="Six statuses, each with its own icon.">
        <OrderStatus status="placed" />
        <OrderStatus status="confirmed" />
        <OrderStatus status="shipped" />
        <OrderStatus status="delivered" />
        <OrderStatus status="cancelled" />
        <OrderStatus status="returned" />
      </Specimen>

      <Specimen label="Stock status" column>
        <StockStatus state="in-stock" note="Delivery by 08 Nov in Dhanmondi" />
        <StockStatus state="low-stock" available={2} />
        <StockStatus state="out-of-stock" />
        <StockStatus state="pre-order" note="Ships 28 Nov 2026" />
        <StockStatus state="discontinued" />
      </Specimen>

      <Specimen label="Rating">
        <Sample label="Compact — cards">
          <Rating value={4.9} count={212} />
        </Sample>
        <Sample label="Full — buy box">
          <Rating value={4.9} count={212} size="full" />
        </Sample>
        <Sample label="Display — review summary">
          <Rating value={4.9} count={212} size="display" />
        </Sample>
        <Sample label="Histogram">
          <RatingHistogram breakdown={[178, 24, 6, 2, 2]} total={212} />
        </Sample>
      </Specimen>

      <Specimen label="Price">
        <Sample label="Regular">
          <Price price={32999} />
        </Sample>
        <Sample label="Sale">
          <Price price={174999} salePrice={164999} />
        </Sample>
        <Sample label="Out of stock">
          <Price price={194999} outOfStock />
        </Sample>
        <Sample label="Pre-order">
          <Price price={179999} preOrder />
        </Sample>
        <Sample label="Large, with EMI">
          <Price price={174999} salePrice={164999} size="large" emiMonths={12} />
        </Sample>
      </Specimen>

      <Specimen label="Product card — states" column>
        <ProductGrid className="w-full">
          <ProductCard product={airpods} />
          <ProductCard product={iphone} showCompare />
          <ProductCard product={preOrder} />
          <ProductCard product={soldOut} />
        </ProductGrid>
        <div className="grid w-full grid-cols-2 gap-4 sm:w-1/2">
          <ProductCard product={watch} />
          <ProductCardSkeleton />
        </div>
      </Specimen>

      <Specimen label="Tiles and rows" column>
        <div className="grid w-full gap-6 sm:grid-cols-3">
          <CategoryTile category={phones} />
          <BrandTile brand={brands[0]} />
          <BrandTile brand={brands[1]} withDescription />
        </div>
        <BrandRow brands={getBrandsForCategory("phones").slice(0, 8)} />
      </Specimen>

      <Specimen label="Cart line item" column>
        <ul className="w-full max-w-2xl">
          <CartLineItem
            product={iphone}
            variant={iphone.variants[0]}
            quantity={1}
          />
        </ul>
        <ul className="w-full max-w-md">
          <CartLineItem
            product={airpods}
            variant={airpods.variants[0]}
            quantity={2}
            compact
          />
        </ul>
      </Specimen>
    </Group>
  );
}

/* ================================================ L3 Feedback and overlays */

function FeedbackAndOverlays() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { showToast } = useStore();

  return (
    <Group
      id="l3"
      title="L3 — Feedback and overlays"
      note="Modal and drawer trap focus, close on Escape and return focus to the trigger. Toasts announce through a polite live region and carry Undo when the action is reversible."
    >
      <Specimen label="Inline banner" column>
        <Banner
          tone="info"
          message="Free delivery inside Dhaka on orders over ৳ 5,000."
          className="w-full"
        />
        <Banner tone="success" message="Address saved." className="w-full" />
        <Banner
          tone="warning"
          message="Only 2 left. Price may change at checkout."
          className="w-full"
        />
        <Banner
          tone="error"
          message="Payment didn't go through. Try again."
          className="w-full"
        />
        <Banner
          tone="error"
          message="Payment didn't go through."
          action={{ label: "Try again", onAction: () => undefined }}
          className="w-full"
        />
      </Specimen>

      <Specimen label="Toast" note="Triggers the real toast region at the bottom of the viewport.">
        <Button
          variant="secondary"
          onClick={() =>
            showToast("Removed from cart", {
              label: "Undo",
              onAction: () => undefined,
            })
          }
        >
          Toast with Undo
        </Button>
        <Button variant="secondary" onClick={() => showToast("Added to wishlist")}>
          Toast without action
        </Button>
      </Specimen>

      <Specimen label="Skeleton">
        <div className="flex w-48 flex-col gap-2">
          <Skeleton className="h-32 w-full" rounded="md" />
          <Skeleton className="h-4 w-4/5" rounded="xs" />
          <Skeleton className="h-3 w-2/5" rounded="xs" />
        </div>
        <div className="w-40">
          <ProductCardSkeleton />
        </div>
      </Specimen>

      <Specimen label="Empty and error states" column>
        <EmptyState
          icon="bag"
          title="Your cart is empty"
          body="Find something you love in today's top sellers."
          action={{ label: "Continue shopping", href: "/" }}
          className="w-full"
        />
        <ErrorState action={{ label: "Back to home", href: "/" }} className="w-full" />
      </Specimen>

      <Specimen label="Modal and drawer">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Open confirm modal
        </Button>
        <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Remove address?"
          description={`"Office" will be removed from your saved addresses. You can add it again later.`}
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>
                Remove
              </Button>
            </div>
          }
        >
          <span />
        </Modal>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Filters"
          footer={
            <Button fullWidth onClick={() => setDrawerOpen(false)}>
              Show 24 results
            </Button>
          }
        >
          <ChoiceGroup legend="Availability">
            <Checkbox name="sg-avail" label="In stock" defaultChecked />
            <Checkbox name="sg-avail" label="Pre-order" />
          </ChoiceGroup>
        </Drawer>
      </Specimen>
    </Group>
  );
}

/* ========================================================= L4 Navigation */

function Navigation() {
  return (
    <Group
      id="l4"
      title="L4 — Navigation"
      note="The header, footer and mega menu are live at the top and bottom of this page. Shown here: the search combobox and the breadcrumb."
    >
      <Specimen label="Search bar" note="Type two characters for product and category suggestions." column>
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
        <div className="w-full max-w-xl">
          <SearchBar size="full" />
        </div>
      </Specimen>

      <Specimen label="Breadcrumb" note="Collapses to a single Back link below 640px." column>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Phones", href: "/category/phones" },
            { label: "iPhone 17 Pro" },
          ]}
        />
      </Specimen>
    </Group>
  );
}

/* ===================================================== L5 Commerce blocks */

function CommerceBlocks() {
  const [payment, setPayment] = useState("emi");
  const [address, setAddress] = useState(addresses[0].id);
  const [store, setStore] = useState(stores[0].slug);

  return (
    <Group
      id="l5"
      title="L5 — Commerce blocks"
      note="Composed sections. Each reuses the layers above; none introduces a new design value."
    >
      <Specimen label="Trust strip" column>
        <TrustStrip className="w-full" />
      </Specimen>

      <Specimen label="Shelf header and product shelf" column>
        <ShelfHeader title="Top selling" href="/category/phones" className="w-full" />
        <ProductShelf
          title="New arrival"
          products={getProducts(shelves.newArrival).slice(0, 4)}
          href="/offers"
          className="w-full"
        />
      </Specimen>

      <Specimen label="Payment tiles" column>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => (
            <PaymentTile
              key={method.id}
              method={method}
              selected={payment === method.id}
              onSelect={() => setPayment(method.id)}
              name="sg-payment"
            />
          ))}
        </div>
      </Specimen>

      <Specimen label="Address cards" column>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {addresses.map((item) => (
            <AddressCard
              key={item.id}
              address={item}
              selected={address === item.id}
              onSelect={() => setAddress(item.id)}
              name="sg-address"
            />
          ))}
        </div>
        <AddressCard
          address={addresses[0]}
          onEdit={() => undefined}
          onRemove={() => undefined}
        />
      </Specimen>

      <Specimen label="Store cards" column>
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <StoreCard store={stores[0]} />
          <StoreCard store={stores[5]} />
        </div>
        <div className="grid w-full gap-3 lg:grid-cols-2">
          {stores.slice(0, 2).map((item) => (
            <StoreCard
              key={item.slug}
              store={item}
              selected={store === item.slug}
              onSelect={() => setStore(item.slug)}
              name="sg-store"
              stockNote="Both items in stock"
            />
          ))}
        </div>
      </Specimen>

      <Specimen label="Checkout stepper" column>
        <CheckoutStepper current={1} />
        <CheckoutStepper current={2} />
        <CheckoutStepper current={3} />
      </Specimen>

      <Specimen label="EMI calculator and order summary" column>
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <EmiCalculator amount={164999} />
          <OrderSummary
            totals={{
              itemCount: 3,
              subtotal: 203497,
              discount: 10000,
              deliveryFee: 0,
              total: 193497,
            }}
            action={<Button fullWidth>Checkout</Button>}
          />
        </div>
      </Specimen>

      <Specimen
        label="Sticky bars"
        note="The compare bar and the mobile buy bar are fixed to the viewport, so they are shown in place rather than here. Add a product to compare from any card to see the compare bar; the buy bar appears on a product page below 1024px."
      >
        <ButtonLink href="/product/apple-iphone-17-pro" variant="secondary">
          Open a product page
        </ButtonLink>
        <ButtonLink href="/compare" variant="secondary">
          Open compare
        </ButtonLink>
      </Specimen>

      <Specimen label="Iconography" note="One line set, 1.5px stroke, currentColor.">
        {(
          [
            "bag",
            "heart",
            "search",
            "user",
            "menu",
            "map-pin",
            "truck",
            "shield-check",
            "credit-card",
            "repeat",
            "percent",
            "scale",
            "star",
            "package",
            "bell",
            "gift",
            "navigation",
            "phone",
            "award",
            "undo",
          ] as const
        ).map((name) => (
          <div key={name} className="flex w-20 flex-col items-center gap-1.5">
            <Icon name={name} size={24} className="text-ink" />
            <span className="text-center text-caption text-secondary">
              {name}
            </span>
          </div>
        ))}
      </Specimen>
    </Group>
  );
}
