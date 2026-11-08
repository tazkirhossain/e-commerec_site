import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Skeleton, empty and error states (DS-CMP-SKEL).
 *
 * Every list has an empty state: an icon, one line of explanation and one
 * action. Every failed load shows a retry. Skeletons match the final layout
 * and shimmer slowly on the surface token.
 */

/** A shimmering block. Compose these to mirror the layout being loaded. */
export function Skeleton({
  className,
  rounded = "sm",
}: {
  className?: string;
  rounded?: "xs" | "sm" | "md" | "pill";
}) {
  const radius = {
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    pill: "rounded-pill",
  }[rounded];

  return (
    <div
      aria-hidden="true"
      className={cn("animate-shimmer", radius, className)}
    />
  );
}

/** Wraps a skeleton group so assistive tech hears "loading" once. */
export function SkeletonRegion({
  label = "Loading",
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={className}>
      {children}
    </div>
  );
}

export function EmptyState({
  icon = "package",
  title,
  body,
  action,
  className,
  children,
}: {
  icon?: IconName;
  title: string;
  /** One line (DS-CMP-SKEL). */
  body: string;
  action?: { label: string; href: string };
  className?: string;
  /** For the extra content an empty cart carries, e.g. a top-sellers shelf. */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg bg-surface px-6 py-12",
        "text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-pill bg-canvas text-secondary">
        <Icon name={icon} size={24} />
      </span>
      <h2 className="text-subtitle text-ink">{title}</h2>
      <p className="max-w-sm text-base text-secondary">{body}</p>
      {action ? (
        <ButtonLink href={action.href} className="mt-2">
          {action.label}
        </ButtonLink>
      ) : null}
      {children}
    </div>
  );
}

/**
 * A failed load. The retry is a client concern, so the caller supplies it;
 * where there is nothing to retry, `href` sends the customer somewhere useful.
 */
export function ErrorState({
  title = "Couldn't load products",
  body = "Check your connection and try again.",
  onRetry,
  action,
  className,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg bg-surface px-6 py-12",
        "text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-pill bg-canvas text-danger">
        <Icon name="alert-triangle" size={24} />
      </span>
      <h2 className="text-subtitle text-ink">{title}</h2>
      <p className="max-w-sm text-base text-secondary">{body}</p>

      {onRetry ? (
        <RetryButton onRetry={onRetry} />
      ) : action ? (
        <ButtonLink href={action.href} className="mt-2">
          {action.label}
        </ButtonLink>
      ) : null}
    </div>
  );
}

/* Split out so ErrorState itself stays usable from a Server Component. */
function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className={cn(
        "mt-2 inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-5",
        "text-base font-medium text-on-accent hover:bg-accent-hover focus-ring",
      )}
    >
      <Icon name="undo" size={18} />
      Retry
    </button>
  );
}
