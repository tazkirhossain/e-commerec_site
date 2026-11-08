"use client";

import { cn } from "@/lib/cn";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * The sticky A–Z jump bar on the brand index (DS-PG-BRAND).
 *
 * Letters with no brands are present but disabled, so the bar keeps a stable
 * shape. Each active letter is a real in-page link, which means it works
 * without JavaScript and is reachable by keyboard.
 */
export function AlphabetJump({ available }: { available: string[] }) {
  return (
    <nav
      aria-label="Jump to letter"
      className={cn(
        "sticky top-16 z-sticky -mx-4 border-y border-hairline bg-canvas/90",
        "px-4 py-2 backdrop-blur-[20px] lg:top-[116px] lg:mx-0 lg:rounded-sm",
        "lg:border lg:px-3",
      )}
    >
      <ul className="scroll-shelf flex gap-0.5">
        {ALPHABET.map((letter) => {
          const active = available.includes(letter);
          return (
            <li key={letter}>
              {active ? (
                <a
                  href={`#letter-${letter}`}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-pill",
                    "text-sm font-medium text-ink hover:bg-surface focus-ring",
                  )}
                >
                  {letter}
                </a>
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex size-9 items-center justify-center",
                    "text-sm text-disabled",
                  )}
                >
                  {letter}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
