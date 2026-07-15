import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/layout/Container";

type SectionSpacing = "default" | "tight" | "none";
type SectionBackground = "default" | "surface";
type SectionContainerSize = "wide" | "narrow" | "none";

interface SectionProps {
  id?: string;
  as?: ElementType;
  spacing?: SectionSpacing;
  background?: SectionBackground;
  containerSize?: SectionContainerSize;
  className?: string;
  children: ReactNode;
}

const spacingClass: Record<SectionSpacing, string> = {
  default: "py-16 sm:py-20",
  tight: "py-8 sm:py-10",
  none: "",
};

const backgroundClass: Record<SectionBackground, string> = {
  default: "",
  surface: "bg-surface",
};

/**
 * Standard section wrapper. Renders a semantic <section> by default (or a
 * different element via `as`, e.g. "article" for standalone reading
 * content). Applies standard vertical rhythm and an optional background,
 * and integrates Container so callers don't compose the two separately.
 *
 * scroll-margin-top accounts for the sticky header, so `id`-based anchor
 * navigation (nav → homepage section, per the hybrid nav model) lands the
 * section below the header rather than underneath it.
 *
 * Deliberately unopinionated about content styling — this task establishes
 * structure only, per Task 03 scope ("do not style individual sections
 * yet").
 */
export function Section({
  id,
  as: Component = "section",
  spacing = "default",
  background = "default",
  containerSize = "wide",
  className,
  children,
}: SectionProps) {
  const content =
    containerSize === "none" ? (
      children
    ) : (
      <Container size={containerSize}>{children}</Container>
    );

  return (
    <Component
      id={id}
      className={cn(
        "scroll-mt-[var(--layout-header-height)]",
        spacingClass[spacing],
        backgroundClass[background],
        className
      )}
    >
      {content}
    </Component>
  );
}
