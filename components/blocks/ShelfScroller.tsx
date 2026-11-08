"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { ShelfHeader } from "./ShelfHeader";

/**
 * The scrolling track behind a product shelf (DS-CMP-SHELF).
 *
 * Scroll-snaps at every size, and adds previous/next buttons from desktop,
 * where there is room for them. The buttons appear only when the row actually
 * overflows, so a shelf of three products does not grow controls that do
 * nothing.
 */
export function ShelfScroller({
  title,
  href,
  id,
  description,
  children,
}: {
  title: string;
  href?: string;
  id?: string;
  description?: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    /* 1px of slack absorbs sub-pixel widths at odd zoom levels. */
    const scrollable = track.scrollWidth - track.clientWidth;
    setOverflows(scrollable > 1);
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= scrollable - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    track.addEventListener("scroll", measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  function page(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    /* Move by roughly a full view, so nothing is skipped. */
    track.scrollBy({
      left: direction * track.clientWidth * 0.9,
      behavior: "smooth",
    });
  }

  return (
    <>
      <ShelfHeader id={id} title={title} href={href} description={description}>
        {overflows ? (
          <div className="hidden items-center gap-2 lg:flex">
            <IconButton
              icon="chevron-left"
              label={`Scroll ${title} left`}
              styleVariant="outline"
              disabled={atStart}
              onClick={() => page(-1)}
              className="disabled:opacity-35"
            />
            <IconButton
              icon="chevron-right"
              label={`Scroll ${title} right`}
              styleVariant="outline"
              disabled={atEnd}
              onClick={() => page(1)}
              className="disabled:opacity-35"
            />
          </div>
        ) : null}
      </ShelfHeader>

      <ul
        ref={trackRef}
        aria-label={title}
        className={cn(
          /* Bleed to the page edges on mobile so cards run off-screen
             properly, then pull back in at desktop. */
          "scroll-shelf -mx-4 flex gap-4 px-4",
          "sm:-mx-8 sm:gap-6 sm:px-8",
          "lg:mx-0 lg:px-0",
        )}
      >
        {children}
      </ul>
    </>
  );
}
