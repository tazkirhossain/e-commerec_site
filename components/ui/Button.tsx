import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Button (DS-CMP-BTN).
 *
 * Variants: primary, secondary, tertiary, danger, pill.
 * Sizes: sm 32px, md 40px, lg 48px.
 * States: default, hover, pressed, focus-visible, disabled, loading.
 *
 * Only one primary button per view (DS-CMP-BTN). Labels start with a verb
 * (DS-CNT-02). Renders an `<a>` when given `href`, so navigation stays a link.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "pill";

export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent text-on-accent",
    "hover:bg-accent-hover active:bg-accent-hover active:scale-[0.98]",
    "disabled:bg-accent-disabled disabled:text-on-accent",
  ),
  secondary: cn(
    "bg-canvas text-ink border border-ink",
    "hover:bg-surface active:bg-surface active:scale-[0.98]",
    "disabled:text-disabled disabled:border-hairline disabled:bg-canvas",
  ),
  tertiary: cn(
    "bg-transparent text-ink underline underline-offset-4 px-0",
    "hover:text-body active:scale-[0.98]",
    "disabled:text-disabled disabled:no-underline",
  ),
  danger: cn(
    "bg-danger text-on-accent",
    "hover:bg-danger-hover active:bg-danger-hover active:scale-[0.98]",
    "disabled:opacity-40",
  ),
  pill: cn(
    "bg-accent text-on-accent rounded-pill",
    "hover:bg-accent-hover active:bg-accent-hover active:scale-[0.98]",
    "disabled:bg-accent-disabled",
  ),
};

/* Heights are 32 / 40 / 48, and every size clears the 44px touch target in its
   own right or sits inside a larger row (DS-A11Y-04). */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-5 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the width of its container — mobile CTAs, drawer footers. */
  fullWidth?: boolean;
  /** Icon before the label. */
  iconLeading?: IconName;
  /** Icon after the label. A tertiary button defaults to a chevron. */
  iconTrailing?: IconName;
  children?: ReactNode;
  className?: string;
}

export interface ButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  /** Swaps the label for a spinner and blocks the click; width is unchanged. */
  loading?: boolean;
  href?: never;
}

export interface ButtonLinkProps extends CommonProps {
  href: string;
  /** Opens in a new tab, with the matching rel. */
  external?: boolean;
  /** For side effects alongside navigation, e.g. closing a drawer. */
  onClick?: () => void;
  "aria-label"?: string;
  "aria-current"?: "page" | "step" | "true" | undefined;
  "aria-disabled"?: boolean;
  loading?: never;
  disabled?: never;
}

function baseClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[background-color,color,transform] duration-[--motion-fast] ease-[--ease-standard]",
    "focus-ring disabled:pointer-events-none",
    variant === "pill" ? "rounded-pill" : "rounded-sm",
    variant !== "tertiary" && sizeClasses[size],
    variant === "tertiary" && (size === "lg" ? "h-12" : "h-10"),
    fullWidth && "w-full",
    variantClasses[variant],
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  loading = false,
  iconLeading,
  iconTrailing,
  children,
  className,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const iconSize = size === "lg" ? 18 : 16;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      className={cn(baseClasses(variant, size, fullWidth), className)}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          {/* Keeps the announced name while the label is hidden. */}
          <span className="sr-only">{children}</span>
        </>
      ) : (
        <>
          {iconLeading ? <Icon name={iconLeading} size={iconSize} /> : null}
          {children ? <span>{children}</span> : null}
          {iconTrailing ? <Icon name={iconTrailing} size={iconSize} /> : null}
        </>
      )}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  iconLeading,
  iconTrailing,
  children,
  className,
  href,
  external = false,
  ...rest
}: ButtonLinkProps) {
  const iconSize = size === "lg" ? 18 : 16;
  const trailing =
    iconTrailing ?? (variant === "tertiary" ? "chevron-right" : undefined);

  const content = (
    <>
      {iconLeading ? <Icon name={iconLeading} size={iconSize} /> : null}
      {children ? <span>{children}</span> : null}
      {trailing ? <Icon name={trailing} size={iconSize} /> : null}
    </>
  );

  const classes = cn(baseClasses(variant, size, fullWidth), className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/** 16px spinner that replaces a label while an action is in flight. */
function Spinner() {
  return (
    <span
      className="size-[18px] animate-spin rounded-pill border-2 border-current/30 border-t-current"
      aria-hidden="true"
    />
  );
}
