"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Inline message (DS-CMP-BANNER).
 *
 * Full-width strip with an icon, text and an optional action, in the four
 * status tones. The icon is always present, so the tone is never the only
 * signal (DS-FND-01a). Error and warning banners announce themselves, because
 * they usually appear in response to something the customer just did.
 */

export type BannerTone = "info" | "success" | "warning" | "error";

const tones: Record<BannerTone, { className: string; icon: IconName }> = {
  info: { className: "bg-surface text-ink", icon: "info" },
  success: {
    className: "bg-success-surface text-success",
    icon: "check-circle",
  },
  warning: {
    className: "bg-warning-surface text-warning-ink",
    icon: "alert-triangle",
  },
  error: {
    className: "bg-danger-surface text-danger",
    icon: "alert-circle",
  },
};

export function Banner({
  tone = "info",
  message,
  action,
  className,
}: {
  tone?: BannerTone;
  message: React.ReactNode;
  action?: { label: string; onAction: () => void } | { label: string; href: string };
  className?: string;
}) {
  const { className: toneClass, icon } = tones[tone];
  const assertive = tone === "error" || tone === "warning";

  return (
    <div
      role={assertive ? "alert" : "status"}
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-sm px-4 py-3 text-sm",
        toneClass,
        className,
      )}
    >
      <Icon name={icon} size={18} strokeWidth={1.75} />
      <p className="min-w-0 flex-1">{message}</p>

      {action ? (
        "href" in action ? (
          <a
            href={action.href}
            className="shrink-0 font-medium underline underline-offset-4 focus-ring"
          >
            {action.label}
          </a>
        ) : (
          <button
            type="button"
            onClick={action.onAction}
            className="shrink-0 font-medium underline underline-offset-4 focus-ring"
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}
