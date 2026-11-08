"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/**
 * Countdown for a time-limited deal (DS-PG-OFFERS, FR-PRM-01).
 *
 * The remaining time is request-time data, so it resolves after mount rather
 * than during render — otherwise the server HTML and the first client render
 * would disagree, and the page could not be prerendered.
 */
export function Countdown({
  endsAt,
  className,
}: {
  endsAt: string;
  className?: string;
}) {
  const [remaining, setRemaining] = useState<string>();

  useEffect(() => {
    function tick() {
      const ms = new Date(endsAt).getTime() - Date.now();

      if (ms <= 0) {
        setRemaining("Ended");
        return;
      }

      const days = Math.floor(ms / 86_400_000);
      const hours = Math.floor((ms % 86_400_000) / 3_600_000);
      const minutes = Math.floor((ms % 3_600_000) / 60_000);

      setRemaining(
        days > 0
          ? `${days}d ${hours}h left`
          : hours > 0
            ? `${hours}h ${minutes}m left`
            : `${minutes}m left`,
      );
    }

    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  /* Reserve the line's height so nothing shifts when the value arrives. */
  return (
    <p
      className={cn(
        "flex min-h-7 items-center gap-1.5 text-subtitle tabular",
        className,
      )}
      aria-live="off"
    >
      {remaining ? (
        <>
          <Icon name="clock" size={18} />
          {remaining}
        </>
      ) : null}
    </p>
  );
}
