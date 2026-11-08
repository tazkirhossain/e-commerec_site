"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getTopCategories, headerCategories } from "@/data/catalog";
import { Icon } from "@/components/ui/Icon";
import { IconButton, IconButtonLink } from "@/components/ui/IconButton";
import { useStore } from "@/lib/store";
import { useScrolledPast } from "@/lib/client-store";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * Global header (DS-CMP-NAV).
 *
 * Sticky, 64px on mobile and 80px on desktop, canvas at 80% opacity with a
 * 20px backdrop blur, and the hairline shadow once the page has scrolled.
 *
 * Desktop: logo left, category links centre, search, account and the cart
 * count badge right, with Offers / Store locator / Track order in a slim 36px
 * utility bar above. Mobile: logo, search icon, cart, hamburger — the utility
 * links move into the drawer.
 *
 * The mega menu opens on hover or keyboard focus after a 200ms intent delay,
 * and closes on Escape or an outside click (DS-CMP-MEGA).
 */

const INTENT_DELAY = 200;

export function Header() {
  const pathname = usePathname();
  const { cartCount, openMiniCart, compare, hydrated } = useStore();

  /* The elevation appears only once content has moved under the header. */
  const scrolled = useScrolledPast(4);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const intentTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const categories = getTopCategories().filter((c) =>
    (headerCategories as readonly string[]).includes(c.slug),
  );

  /* Any navigation closes whatever was open. Adjusting during render rather
     than in an effect means the menus are already closed in the first render
     of the new route, with no flash of the old open state. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenCategory(null);
    setNavOpen(false);
    setMobileSearchOpen(false);
  }

  useEffect(() => {
    if (!openCategory) return;

    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenCategory(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenCategory(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openCategory]);

  useEffect(
    () => () => window.clearTimeout(intentTimer.current),
    [],
  );

  function openAfterIntent(slug: string) {
    window.clearTimeout(intentTimer.current);
    intentTimer.current = window.setTimeout(
      () => setOpenCategory(slug),
      INTENT_DELAY,
    );
  }

  function cancelIntent() {
    window.clearTimeout(intentTimer.current);
  }

  const active = categories.find((c) => c.slug === openCategory);

  return (
    <>
      <a
        href="#main"
        className={cn(
          "sr-only-focusable fixed top-2 left-2 z-toast inline-flex h-11",
          "items-center rounded-sm bg-ink px-4 text-sm font-medium",
          "text-on-inverse",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "sticky top-0 z-sticky bg-canvas/80 backdrop-blur-[20px]",
          "transition-shadow duration-[--motion-fast] ease-[--ease-standard]",
          scrolled ? "shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "shadow-none",
        )}
      >
        {/* Utility bar — desktop only; these links live in the drawer on mobile. */}
        <div className="hidden border-b border-hairline-soft lg:block">
          <div className="container-content flex h-9 items-center justify-between text-caption text-secondary">
            <p>Free delivery inside Dhaka on orders over ৳ 5,000</p>
            <nav aria-label="Utility">
              <ul className="flex items-center gap-6">
                <li>
                  <UtilityLink href="/offers">Offers</UtilityLink>
                </li>
                <li>
                  <UtilityLink href="/store-locator">Store locator</UtilityLink>
                </li>
                <li>
                  <UtilityLink href="/track-order">Track order</UtilityLink>
                </li>
                <li>
                  <UtilityLink href="/request-order">
                    Request an order
                  </UtilityLink>
                </li>
                <li>
                  <LanguageSwitch className="text-caption" />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <nav
          ref={navRef}
          aria-label="Main"
          onMouseLeave={() => {
            cancelIntent();
            setOpenCategory(null);
          }}
        >
          <div
            className={cn(
              "container-content flex items-center gap-4",
              "h-16 lg:h-20 lg:gap-8",
            )}
          >
            <Logo />

            {/* Category links, centre on desktop. */}
            <ul className="hidden flex-1 items-center gap-6 xl:flex">
              {categories.map((category) => {
                const isOpen = openCategory === category.slug;
                const isCurrent = pathname === `/category/${category.slug}`;
                return (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      aria-expanded={isOpen}
                      aria-current={isCurrent ? "page" : undefined}
                      onMouseEnter={() => openAfterIntent(category.slug)}
                      onFocus={() => setOpenCategory(category.slug)}
                      className={cn(
                        "flex h-20 items-center rounded-xs text-sm font-medium",
                        "whitespace-nowrap focus-ring",
                        "border-b-2 transition-colors duration-[--motion-fast]",
                        isOpen || isCurrent
                          ? "border-ink text-ink"
                          : "border-transparent text-ink hover:text-body",
                      )}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Search: inline from tablet up, an overlay on mobile. */}
            <div className="hidden flex-1 sm:flex xl:max-w-sm">
              <SearchBar />
            </div>

            <div className="ml-auto flex items-center gap-1 sm:ml-0">
              <IconButton
                icon="search"
                label="Search products"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-expanded={mobileSearchOpen}
                className="sm:hidden"
              />

              {hydrated && compare.length > 0 ? (
                <IconButtonLink
                  href="/compare"
                  icon="scale"
                  label={`Compare ${compare.length} products`}
                  count={compare.length}
                  className="hidden sm:inline-flex"
                />
              ) : null}

              <IconButtonLink
                href="/account"
                icon="user"
                label="Account"
                className="hidden sm:inline-flex"
              />

              <IconButton
                icon="bag"
                label={
                  cartCount > 0
                    ? `Cart, ${cartCount} items`
                    : "Cart, empty"
                }
                count={hydrated ? cartCount : undefined}
                onClick={openMiniCart}
              />

              <IconButton
                icon="menu"
                label="Menu"
                onClick={() => setNavOpen(true)}
                aria-expanded={navOpen}
                className="xl:hidden"
              />
            </div>
          </div>

          {/* Mobile search row, revealed under the bar. */}
          {mobileSearchOpen ? (
            <div className="container-content pb-3 sm:hidden">
              <SearchBar
                size="full"
                autoFocus
                onNavigate={() => setMobileSearchOpen(false)}
              />
            </div>
          ) : null}

          {/* Mega menu panel. */}
          {active ? (
            <div
              className="absolute inset-x-0 top-full hidden shadow-(--shadow-2) xl:block"
              onMouseEnter={cancelIntent}
            >
              <MegaMenuPanel
                category={active}
                onNavigate={() => setOpenCategory(null)}
              />
            </div>
          ) : null}
        </nav>
      </header>

      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}

function UtilityLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-xs hover:text-ink hover:underline focus-ring"
    >
      {children}
    </Link>
  );
}

/**
 * Checkout header (DS-PG-CHECKOUT item 1): the logo and a "Secure checkout"
 * label, with no navigation to distract from finishing the order.
 */
export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-sticky border-b border-hairline bg-canvas/80 backdrop-blur-[20px]">
      <div className="container-content flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />
        <p className="flex items-center gap-2 text-sm font-medium text-secondary">
          <Icon name="shield-check" size={18} className="text-success" />
          Secure checkout
        </p>
      </div>
    </header>
  );
}
