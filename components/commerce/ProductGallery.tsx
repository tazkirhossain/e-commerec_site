"use client";

import { useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/feedback/Overlay";
import { cn } from "@/lib/cn";
import { ProductImage, type GlyphShape } from "./ProductImage";

/**
 * Product gallery (DS-CMP-GALLERY).
 *
 * Desktop: a vertical thumbnail rail at the left and a 1:1 main image.
 * Mobile: a swipeable full-width carousel with a dot counter.
 * Both open a lightbox on tap.
 *
 * Until real photography exists there is one plate per variant colour, so
 * changing colour changes the gallery — the behaviour the real gallery has.
 */

export function ProductGallery({
  productName,
  shape,
  /** One entry per view; the tint stands in for a different photograph. */
  views,
  className,
}: {
  productName: string;
  shape: GlyphShape;
  views: { id: string; tint: string; label: string }[];
  className?: string;
}) {
  /* A new colour resets this component to its first view. The parent gives
     the gallery a `key` per colour, so that reset is a remount rather than
     an effect that re-synchronises state after the fact. */
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const current = views[Math.min(index, views.length - 1)] ?? views[0];

  /* Mobile: follow the scroll position so the dot counter stays honest. */
  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(next);
  }

  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row", className)}>
      {/* Thumbnail rail — desktop only. */}
      <ul className="hidden shrink-0 flex-col gap-3 lg:flex">
        {views.map((view, i) => (
          <li key={view.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${view.label}`}
              aria-current={i === index}
              className={cn(
                "block w-16 overflow-hidden rounded-sm border-2 focus-ring",
                i === index ? "border-ink" : "border-transparent hover:border-hairline",
              )}
            >
              <ProductImage
                alt=""
                shape={shape}
                tint={view.tint}
                sizes="64px"
                className="rounded-xs"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-w-0 flex-1">
        {/* Mobile: a snapping carousel. */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          aria-label={`${productName} images`}
          className="scroll-shelf flex lg:hidden"
        >
          {views.map((view) => (
            <div key={view.id} className="w-full shrink-0">
              <ProductImage
                alt={`${productName} — ${view.label}`}
                shape={shape}
                tint={view.tint}
                priority
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Desktop: the selected view, which opens the lightbox. */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="hidden w-full cursor-zoom-in rounded-md focus-ring lg:block"
          aria-label={`Open ${productName} image full size`}
        >
          <ProductImage
            alt={`${productName} — ${current.label}`}
            shape={shape}
            tint={current.tint}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </button>

        {/* Dot counter — mobile only. */}
        {views.length > 1 ? (
          <p
            className={cn(
              "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-pill",
              "bg-inverse/70 px-2.5 py-1 text-caption text-on-inverse tabular",
              "lg:hidden",
            )}
          >
            <span aria-hidden="true">
              {index + 1} / {views.length}
            </span>
            <span className="sr-only">
              Image {index + 1} of {views.length}
            </span>
          </p>
        ) : null}

        {/* Positioning goes on a wrapper: IconButton is `relative` for its
            badge and hit area, and an `absolute` passed via className would
            lose to it in the stylesheet regardless of class order. */}
        <span className="absolute top-3 right-3 lg:hidden">
          <IconButton
            icon="zoom-in"
            label="Open image full size"
            styleVariant="on-photo"
            onClick={() => setLightbox(true)}
          />
        </span>
      </div>

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        title={productName}
        hideTitle
        className="max-w-[720px]"
      >
        <ProductImage
          alt={`${productName} — ${current.label}`}
          shape={shape}
          tint={current.tint}
          sizes="720px"
        />
        <p className="mt-3 text-center text-sm text-secondary">
          {current.label}
        </p>
      </Modal>
    </div>
  );
}
