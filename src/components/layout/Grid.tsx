import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GridGap = "sm" | "md" | "lg";

interface GridProps extends ComponentProps<"div"> {
  as?: ElementType;
  gap?: GridGap;
  className?: string;
  children: ReactNode;
}

const gapClass: Record<GridGap, string> = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

/**
 * Grid foundation. The grid system itself is Tailwind's native grid-cols-*
 * utilities, passed via `className` (e.g. "grid-cols-1 sm:grid-cols-2") —
 * this component only standardizes which gap a grid uses, so every grid in
 * the project picks from three consistent options instead of arbitrary
 * values per instance. Mirrors the reasoning in styles/tokens/grid.css.
 * Accepts arbitrary HTML attributes (aria-*, id, role...) and ref (React 19:
 * ref is a regular prop, no forwardRef needed) via rest spread.
 */
export function Grid({
  as: Component = "div",
  gap = "md",
  className,
  children,
  ref,
  ...rest
}: GridProps) {
  return (
    <Component
      ref={ref}
      className={cn("grid", gapClass[gap], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
