"use client";

import Link from "next/link";
import { useState } from "react";
import { getSubcategories, getTopCategories } from "@/data/catalog";
import { Icon } from "@/components/ui/Icon";
import { Drawer } from "@/components/feedback/Overlay";
import { LanguageSwitch } from "./LanguageSwitch";
import { cn } from "@/lib/cn";

/**
 * Mobile navigation drawer (DS-CMP-MEGA, mobile form).
 *
 * A full-height drawer with drill-down lists and a back button, rather than a
 * mega menu. The utility links that sit in the slim bar on desktop live in here
 * on mobile (DS-CMP-NAV).
 */

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  /* The category being drilled into, or null at the top level. */
  const [drilled, setDrilled] = useState<string | null>(null);

  const categories = getTopCategories();
  const current = drilled
    ? categories.find((c) => c.slug === drilled)
    : undefined;
  const subcategories = current ? getSubcategories(current.slug) : [];

  function close() {
    onClose();
    /* Reset to the top level, so reopening does not resume mid-drill. */
    setDrilled(null);
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      title={current ? current.name : "Menu"}
      hideTitle={!current}
    >
      {current ? (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setDrilled(null)}
            className={cn(
              "flex min-h-12 items-center gap-2 rounded-xs text-base",
              "font-medium text-ink focus-ring",
            )}
          >
            <Icon name="chevron-left" size={18} />
            All categories
          </button>

          <NavRow
            href={`/category/${current.slug}`}
            onNavigate={close}
            strong
          >
            All {current.name.toLowerCase()}
          </NavRow>

          {subcategories.map((sub) => (
            <NavRow
              key={sub.slug}
              href={`/category/${sub.slug}`}
              onNavigate={close}
            >
              {sub.name}
            </NavRow>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          <ul className="flex flex-col">
            {categories.slice(0, 8).map((category) => {
              const hasChildren = getSubcategories(category.slug).length > 0;
              return (
                <li key={category.slug} className="border-b border-hairline-soft">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => setDrilled(category.slug)}
                      aria-expanded={false}
                      className={cn(
                        "flex min-h-12 w-full items-center justify-between",
                        "gap-3 rounded-xs text-left text-base font-medium",
                        "text-ink focus-ring",
                      )}
                    >
                      {category.name}
                      <Icon name="chevron-right" size={18} />
                    </button>
                  ) : (
                    <NavRow
                      href={`/category/${category.slug}`}
                      onNavigate={close}
                    >
                      {category.name}
                    </NavRow>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-1 border-t border-hairline pt-5">
            <NavRow href="/offers" onNavigate={close} icon="percent">
              Offers
            </NavRow>
            <NavRow href="/store-locator" onNavigate={close} icon="map-pin">
              Store locator
            </NavRow>
            <NavRow href="/track-order" onNavigate={close} icon="truck">
              Track order
            </NavRow>
            <NavRow href="/request-order" onNavigate={close} icon="mail">
              Request an order
            </NavRow>
            <NavRow href="/compare" onNavigate={close} icon="scale">
              Compare
            </NavRow>
            <NavRow href="/account" onNavigate={close} icon="user">
              Account
            </NavRow>
          </div>

          <div className="mt-6 border-t border-hairline pt-5">
            <LanguageSwitch />
          </div>
        </div>
      )}
    </Drawer>
  );
}

function NavRow({
  href,
  children,
  onNavigate,
  icon,
  strong = false,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
  icon?: React.ComponentProps<typeof Icon>["name"];
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-xs text-base focus-ring",
        strong ? "font-semibold text-ink" : "text-body",
      )}
    >
      {icon ? <Icon name={icon} size={18} className="text-secondary" /> : null}
      {children}
    </Link>
  );
}
