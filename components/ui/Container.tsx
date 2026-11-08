import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The content column: full width up to 1280px, centred, with page margins of
 * 16 / 32 / 40px (DS-FND-03a). Hero imagery runs full-bleed outside it.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("container-content", className)}>{children}</Tag>
  );
}

/**
 * Vertical rhythm between page sections: 48px mobile, 64px tablet, 96px
 * desktop (Design SRS §4 preamble).
 */
export function Section({
  as: Tag = "section",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  id?: string;
}) {
  return (
    <Tag className={cn("mt-12 sm:mt-16 lg:mt-24", className)} {...rest}>
      {children}
    </Tag>
  );
}
