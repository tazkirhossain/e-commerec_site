import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * One line-icon set for the whole site (DS-FND-06): 24px grid, 1.5px stroke,
 * round caps and joins, `currentColor` fill. Sizes 16, 20 and 24 only.
 *
 * Icons are decorative by default (`aria-hidden`). When an icon carries the
 * whole meaning of a control, give the control an accessible name instead —
 * see IconButton.
 */

const paths = {
  "alert-circle": ["M12 8v4M12 16h.01"],
  "alert-triangle": [
    "m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3",
    "M12 9v4M12 17h.01",
  ],
  "arrow-left": ["M19 12H5", "m12 19-7-7 7-7"],
  "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
  award: ["M15.5 14.5 17 22l-5-3-5 3 1.5-7.5"],
  bell: [
    "M10.3 21a1.9 1.9 0 0 0 3.4 0",
    "M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9",
  ],
  bag: [
    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
    "M3 6h18",
    "M16 10a4 4 0 0 1-8 0",
  ],
  calendar: [
    "M8 2v4M16 2v4",
    "M3 10h18",
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  ],
  check: ["M20 6 9 17l-5-5"],
  "check-circle": ["m9 12 2 2 4-4"],
  "chevron-down": ["m6 9 6 6 6-6"],
  "chevron-left": ["m15 18-6-6 6-6"],
  "chevron-right": ["m9 18 6-6-6-6"],
  "chevron-up": ["m18 15-6-6-6 6"],
  clock: ["M12 6v6l4 2"],
  copy: [
    "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
    "M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z",
  ],
  "credit-card": [
    "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z",
    "M2 10h20",
  ],
  gift: [
    "M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8",
    "M2 8h20v4H2zM12 8v13",
    "M12 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm0 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z",
  ],
  heart: [
    "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z",
  ],
  home: ["m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  image: [
    "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    "m21 15-5-5L5 21",
  ],
  info: ["M12 16v-4M12 8h.01"],
  list: ["M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"],
  "log-out": [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "m16 17 5-5-5-5M21 12H9",
  ],
  mail: [
    "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z",
    "m2 8 10 6 10-6",
  ],
  "map-pin": ["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"],
  menu: ["M3 6h18M3 12h18M3 18h18"],
  minus: ["M5 12h14"],
  navigation: ["m3 11 19-9-9 19-2-8-8-2Z"],
  package: [
    "m21 8-9-5-9 5v8l9 5 9-5z",
    "m3 8 9 5 9-5M12 13v10",
    "m7.5 5.5 9 5",
  ],
  percent: ["M19 5 5 19", "M6.5 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"],
  phone: [
    "M15.5 21A13.5 13.5 0 0 1 3 8.5 3 3 0 0 1 6 5.5h2a1 1 0 0 1 1 .9l.6 2.8a1 1 0 0 1-.5 1l-1.3.8a10 10 0 0 0 4.2 4.2l.8-1.3a1 1 0 0 1 1-.5l2.8.6a1 1 0 0 1 .9 1v2a3 3 0 0 1-2.8 3Z",
  ],
  play: ["m6 3 14 9-14 9V3Z"],
  plus: ["M5 12h14M12 5v14"],
  repeat: ["m17 2 4 4-4 4", "M3 11V9a4 4 0 0 1 4-4h14", "m7 22-4-4 4-4", "M21 13v2a4 4 0 0 1-4 4H3"],
  scale: ["M12 3v18", "M5 7h14", "m5 7-3 7h6zM19 7l-3 7h6z", "M8 21h8"],
  search: ["M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z", "m20 20-3.5-3.5"],
  settings: [
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  ],
  share: [
    "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
    "m16 6-4-4-4 4M12 2v13",
  ],
  shield: ["M20 12c0 5-8 10-8 10s-8-5-8-10V5l8-3 8 3z", "m9 12 2 2 4-4"],
  "shield-check": ["M20 12c0 5-8 10-8 10s-8-5-8-10V5l8-3 8 3z", "m9 12 2 2 4-4"],
  sliders: [
    "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3",
    "M1 14h6M9 8h6M17 16h6",
  ],
  star: [
    "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1Z",
  ],
  trash: [
    "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2",
    "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
    "M10 11v6M14 11v6",
  ],
  truck: [
    "M1 5h12a1 1 0 0 1 1 1v10H1z",
    "M14 9h4l4 4v3h-8z",
    "M6.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21.5 19.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  ],
  undo: ["M3 7v6h6", "M3.5 13a9 9 0 1 0 2.1-9.4L3 7"],
  user: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  ],
  wifi: [
    "M5 12.5a10 10 0 0 1 14 0",
    "M8.5 16a5 5 0 0 1 7 0",
    "M2 9a15 15 0 0 1 20 0",
    "M12 20h.01",
  ],
  x: ["M18 6 6 18M6 6l12 12"],
  "zoom-in": [
    "M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
    "m20 20-3.5-3.5M11 8v6M8 11h6",
  ],
} as const;

/** Icons drawn with a circle plus inner strokes. */
const circled: Partial<Record<IconName, { cx: number; cy: number; r: number }>> =
  {
    "alert-circle": { cx: 12, cy: 12, r: 10 },
    "check-circle": { cx: 12, cy: 12, r: 10 },
    clock: { cx: 12, cy: 12, r: 10 },
    info: { cx: 12, cy: 12, r: 10 },
    "map-pin": { cx: 12, cy: 10, r: 3 },
    percent: { cx: 17.5, cy: 17.5, r: 2.5 },
  };

export type IconName = keyof typeof paths;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /**
   * 16, 20 and 24 are the system sizes (DS-FND-06). 14 is allowed because the
   * rating component specifies 14px stars (DS-CMP-RATING); 18 bridges the two
   * button sizes, and 28/32 are for empty-state and nav glyphs.
   */
  size?: 14 | 16 | 18 | 20 | 24 | 28 | 32;
  /** Heavier stroke for filled-circle contexts such as the search orb. */
  strokeWidth?: number;
  /** Fills the shape — used for the saved heart and rating stars. */
  filled?: boolean;
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  filled = false,
  className,
  ...rest
}: IconProps) {
  const circle = circled[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {circle ? (
        <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill="none" />
      ) : null}
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
