import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The product image plate.
 *
 * Renders the product photo when there is one. Photography is supplied by the
 * business (Software SRS §1.4) and some products do not have it yet; for
 * those, a device silhouette is drawn on the surface token instead of a broken
 * image or a grey box, tinted with the variant's own colour.
 *
 * Adding photography to a product is a data change, not a code change.
 */

export type GlyphShape =
  | "phone"
  | "laptop"
  | "tablet"
  | "watch"
  | "earbuds"
  | "headphones"
  | "console"
  | "router"
  | "camera"
  | "drone"
  | "accessory";

/** Maps a category to the silhouette that reads as that kind of product. */
const shapeForCategory: Record<string, GlyphShape> = {
  phones: "phone",
  laptops: "laptop",
  tablets: "tablet",
  watches: "watch",
  audio: "headphones",
  gaming: "console",
  networking: "router",
  cameras: "camera",
  drones: "drone",
  accessories: "accessory",
};

export function glyphFor(category: string, slug?: string): GlyphShape {
  /* A couple of products sit in a category whose default shape is wrong. */
  if (slug?.includes("airpods") || slug?.includes("buds")) return "earbuds";
  if (slug?.includes("pencil") || slug?.includes("cable")) return "accessory";
  return shapeForCategory[category] ?? "accessory";
}

export interface ProductImageProps {
  /** Real photography, once it exists. */
  src?: string;
  /** Meaningful alt text (DS-FND-07a). */
  alt: string;
  shape?: GlyphShape;
  /** The variant colour used to tint the silhouette. Defaults to the
   * neutral placeholder token when the subject has no colour of its own. */
  tint?: string;
  /** Hero and above-the-fold images are not lazy (DS-FND-07b). */
  priority?: boolean;
  /** 1:1 for cards and galleries, 4:3 for category tiles (DS-FND-07). */
  ratio?: "square" | "four-three";
  sizes?: string;
  className?: string;
  /** Dims the plate, for an out-of-stock card. */
  muted?: boolean;
}

export function ProductImage({
  src,
  alt,
  shape = "accessory",
  tint = "var(--color-placeholder)",
  priority = false,
  ratio = "square",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className,
  muted = false,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-surface",
        ratio === "square" ? "aspect-square" : "aspect-[4/3]",
        muted && "opacity-60",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          /* `priority` is deprecated in Next 16; an above-the-fold image is
             eager and high priority instead (DS-FND-07b). */
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          /* Supplied photos sit on white. Contain keeps the whole product in
             frame, and multiply lets that white take on the plate colour, so
             every card reads as one surface rather than a white square on
             grey (DS-FND-01b). */
          className="object-contain p-[6%] mix-blend-multiply"
        />
      ) : (
        /* Decorative: the alt text is carried by the figure around it. */
        <DeviceGlyph shape={shape} tint={tint} />
      )}
    </div>
  );
}

/** A flat, abstract device drawn from the product's colour. */
function DeviceGlyph({ shape, tint }: { shape: GlyphShape; tint: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* `style` rather than the `fill` attribute, so a `var()` resolves. */}
      <g style={{ fill: tint }}>{shapes[shape]}</g>
    </svg>
  );
}

const shapes: Record<GlyphShape, React.ReactNode> = {
  phone: (
    <>
      <rect x="68" y="34" width="64" height="132" rx="14" />
      <rect x="74" y="42" width="52" height="116" rx="9" fillOpacity="0.28" />
      <circle cx="116" cy="56" r="5" fillOpacity="0.5" />
    </>
  ),
  laptop: (
    <>
      <rect x="44" y="56" width="112" height="70" rx="6" />
      <rect x="50" y="62" width="100" height="58" rx="3" fillOpacity="0.28" />
      <path d="M30 132h140l10 14H20z" />
    </>
  ),
  tablet: (
    <>
      <rect x="50" y="38" width="100" height="124" rx="11" />
      <rect x="57" y="45" width="86" height="110" rx="7" fillOpacity="0.28" />
    </>
  ),
  watch: (
    <>
      <rect x="76" y="22" width="48" height="36" rx="12" fillOpacity="0.55" />
      <rect x="76" y="142" width="48" height="36" rx="12" fillOpacity="0.55" />
      <rect x="62" y="56" width="76" height="88" rx="22" />
      <rect x="70" y="64" width="60" height="72" rx="17" fillOpacity="0.28" />
    </>
  ),
  earbuds: (
    <>
      <circle cx="74" cy="84" r="22" />
      <rect x="64" y="96" width="20" height="50" rx="10" />
      <circle cx="126" cy="84" r="22" />
      <rect x="116" y="96" width="20" height="50" rx="10" />
    </>
  ),
  headphones: (
    <>
      <path d="M44 112V96a56 56 0 0 1 112 0v16h-14V96a42 42 0 0 0-84 0v16z" />
      <rect x="34" y="106" width="28" height="56" rx="13" />
      <rect x="138" y="106" width="28" height="56" rx="13" />
    </>
  ),
  console: (
    <>
      <rect x="36" y="74" width="128" height="52" rx="14" />
      <rect x="52" y="86" width="96" height="28" rx="6" fillOpacity="0.28" />
      <circle cx="60" cy="140" r="12" fillOpacity="0.55" />
      <circle cx="140" cy="140" r="12" fillOpacity="0.55" />
    </>
  ),
  router: (
    <>
      <rect x="44" y="110" width="112" height="34" rx="10" />
      <rect x="60" y="56" width="8" height="54" rx="4" fillOpacity="0.55" />
      <rect x="96" y="44" width="8" height="66" rx="4" fillOpacity="0.55" />
      <rect x="132" y="56" width="8" height="54" rx="4" fillOpacity="0.55" />
      <circle cx="60" cy="127" r="4" fillOpacity="0.3" />
      <circle cx="76" cy="127" r="4" fillOpacity="0.3" />
    </>
  ),
  camera: (
    <>
      <rect x="34" y="66" width="132" height="76" rx="12" />
      <rect x="74" y="52" width="40" height="16" rx="5" />
      <circle cx="100" cy="104" r="28" fillOpacity="0.3" />
      <circle cx="100" cy="104" r="16" fillOpacity="0.5" />
    </>
  ),
  drone: (
    <>
      <rect x="78" y="86" width="44" height="30" rx="8" />
      <circle cx="52" cy="70" r="16" fillOpacity="0.45" />
      <circle cx="148" cy="70" r="16" fillOpacity="0.45" />
      <circle cx="52" cy="132" r="16" fillOpacity="0.45" />
      <circle cx="148" cy="132" r="16" fillOpacity="0.45" />
      <path d="M64 78l20 12-20 12zM136 78l-20 12 20 12z" fillOpacity="0.6" />
    </>
  ),
  accessory: (
    <>
      <rect x="58" y="78" width="84" height="44" rx="12" />
      <rect x="70" y="88" width="60" height="24" rx="7" fillOpacity="0.28" />
      <rect x="92" y="122" width="16" height="30" rx="6" fillOpacity="0.55" />
    </>
  ),
};
