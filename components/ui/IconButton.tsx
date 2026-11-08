import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Icon-only button (DS-CMP-BTN "icon" variant).
 *
 * Every instance needs a `label`: it becomes the accessible name, because the
 * icon carries the whole meaning (DS-FND-06, DS-A11Y-05). Smaller styles get a
 * 44×44px hit area from `hit-area` even though they look 32px (DS-A11Y-04).
 *
 * The root is `position: relative`, for the count badge and the hit area. To
 * place one over something, wrap it in a positioned element rather than
 * passing `absolute` through `className` — utilities are ordered by the
 * stylesheet, not by the class attribute, so the base `relative` would win.
 * Likewise use `size` rather than overriding the width with a utility.
 */

export type IconButtonStyle =
  | "ghost"
  | "outline"
  | "filled"
  | "on-photo"
  | "saved"
  | "orb";

const styleClasses: Record<IconButtonStyle, string> = {
  ghost: "size-11 text-ink hover:bg-surface",
  outline: "size-10 text-ink border border-hairline hover:bg-surface",
  filled: "size-8 text-ink bg-surface-strong hover:bg-hairline",
  "on-photo": "size-8 text-ink bg-canvas shadow-(--shadow-1) hover:bg-surface",
  saved: "size-8 text-accent bg-canvas shadow-(--shadow-1) hover:bg-surface",
  orb: "size-12 bg-accent text-on-accent hover:bg-accent-hover",
};

const iconSizes: Record<IconButtonStyle, 16 | 18 | 20 | 24> = {
  ghost: 20,
  outline: 18,
  filled: 16,
  "on-photo": 16,
  saved: 16,
  orb: 20,
};

interface CommonProps {
  icon: IconName;
  /** The accessible name. Required — never render a nameless icon control. */
  label: string;
  styleVariant?: IconButtonStyle;
  /** Count badge on the top-right, as on the cart icon. Hidden when 0. */
  count?: number;
  /** Overrides the style's own diameter, e.g. a 48px control beside a CTA. */
  size?: 32 | 40 | 44 | 48;
  className?: string;
}

export interface IconButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  href?: never;
}

export interface IconButtonLinkProps extends CommonProps {
  href: string;
}

const sizeClasses: Record<NonNullable<CommonProps["size"]>, string> = {
  32: "size-8",
  40: "size-10",
  44: "size-11",
  48: "size-12",
};

function classes(
  styleVariant: IconButtonStyle,
  size: CommonProps["size"],
  className?: string,
) {
  return cn(
    "relative inline-flex items-center justify-center rounded-pill",
    "transition-colors duration-[--motion-fast] ease-[--ease-standard]",
    "focus-ring disabled:pointer-events-none disabled:text-disabled",
    /* The style carries a diameter; an explicit `size` replaces it. */
    size ? styleClasses[styleVariant].replace(/size-\d+/, "") : styleClasses[styleVariant],
    size && sizeClasses[size],
    /* Visually small controls still need a full-size target. */
    (styleVariant === "filled" ||
      styleVariant === "on-photo" ||
      styleVariant === "saved") &&
      "hit-area",
    className,
  );
}

function Inner({
  icon,
  styleVariant,
  count,
  filled,
}: {
  icon: IconName;
  styleVariant: IconButtonStyle;
  count?: number;
  filled: boolean;
}) {
  return (
    <>
      <Icon
        name={icon}
        size={iconSizes[styleVariant]}
        strokeWidth={styleVariant === "orb" ? 2.5 : 1.5}
        filled={filled}
      />
      {count !== undefined && count > 0 ? (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 inline-flex h-[18px] min-w-[18px]",
            "items-center justify-center rounded-pill border-2 border-canvas",
            "bg-accent px-1 text-badge font-semibold text-on-accent tabular",
          )}
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );
}

export function IconButton({
  icon,
  label,
  styleVariant = "ghost",
  count,
  size,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={classes(styleVariant, size, className)}
      {...rest}
    >
      <Inner
        icon={icon}
        styleVariant={styleVariant}
        count={count}
        filled={styleVariant === "saved"}
      />
    </button>
  );
}

export function IconButtonLink({
  icon,
  label,
  styleVariant = "ghost",
  count,
  size,
  className,
  href,
}: IconButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={classes(styleVariant, size, className)}
    >
      <Inner
        icon={icon}
        styleVariant={styleVariant}
        count={count}
        filled={styleVariant === "saved"}
      />
    </Link>
  );
}
