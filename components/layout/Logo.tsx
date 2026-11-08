import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The Voltra wordmark. The accent carries the brand here and on primary CTAs —
 * the two places it is allowed to appear at this weight.
 */
export function Logo({
  /** `checkout` drops the link, because checkout has nowhere to navigate to. */
  asLink = true,
  className,
}: {
  asLink?: boolean;
  className?: string;
}) {
  const mark = (
    <span
      className={cn(
        "flex items-center gap-1.5 text-[24px] leading-none font-bold",
        "tracking-[-0.5px] text-accent",
        className,
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M12 2 4 13h6l-1.5 9L20 10h-6.5L15 2z" />
      </svg>
      Voltra
    </span>
  );

  if (!asLink) {
    return (
      <span className="inline-flex" aria-label="Voltra">
        {mark}
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Voltra — home"
      className="inline-flex rounded-xs focus-ring"
    >
      {mark}
    </Link>
  );
}
