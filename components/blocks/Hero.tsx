import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/commerce/Badge";
import { ProductImage, type GlyphShape } from "@/components/commerce/ProductImage";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Hero tile (DS-CMP-HERO).
 *
 * One message per slide. Full-bleed image with the text block at the left on
 * desktop and below the image on mobile, a headline of six words or fewer
 * (DS-CNT-01), one primary button and one tertiary link.
 *
 * Rendered as a single static tile rather than a carousel: the spec makes the
 * carousel optional, and one message with no autoplay is the better default for
 * both performance (DS-PERF) and reduced-motion users (DS-FND-05b).
 */

export interface HeroProps {
  eyebrow?: string;
  /** Six words or fewer. */
  headline: string;
  subhead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** The silhouette used while real hero photography is pending. */
  shape?: GlyphShape;
  /** The featured product's colour. Omitted falls back to the token. */
  tint?: string;
  badge?: string;
  className?: string;
}

export function Hero({
  eyebrow,
  headline,
  subhead,
  primary,
  secondary,
  shape = "phone",
  tint,
  badge,
  className,
}: HeroProps) {
  return (
    <section
      aria-label="Featured"
      className={cn("bg-surface", className)}
    >
      <Container>
        <div
          className={cn(
            "flex flex-col-reverse items-center gap-8 py-10",
            "lg:min-h-[480px] lg:flex-row lg:gap-16 lg:py-16",
          )}
        >
          <div className="flex w-full flex-col items-start gap-5 lg:w-[45%]">
            {eyebrow || badge ? (
              <div className="flex items-center gap-2">
                {badge ? <Badge tone="neutral">{badge}</Badge> : null}
                {eyebrow ? (
                  <span className="text-sm font-medium text-secondary">
                    {eyebrow}
                  </span>
                ) : null}
              </div>
            ) : null}

            {/* The page's h1 lives here on the home page. */}
            <h1 className="type-hero text-balance text-ink">{headline}</h1>

            <p className="text-lg text-body tabular">{subhead}</p>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              {secondary ? (
                <ButtonLink href={secondary.href} variant="tertiary">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="w-full lg:w-[55%]">
            <ProductImage
              alt=""
              shape={shape}
              tint={tint}
              priority
              ratio="four-three"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="bg-canvas lg:aspect-[21/9]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
