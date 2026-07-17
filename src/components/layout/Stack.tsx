import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type StackGap = "sm" | "md" | "lg";
type StackAlign = "start" | "center" | "end" | "stretch";

interface StackProps extends ComponentProps<"div"> {
  as?: ElementType;
  gap?: StackGap;
  align?: StackAlign;
  className?: string;
  children: ReactNode;
}

const gapClass: Record<StackGap, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const alignClass: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

/** Vertical flex layout with consistent gap. The generic building block for
 *  any stacked group of elements — form fields, card content, list items.
 *  Accepts arbitrary HTML attributes and ref (React 19: ref is a regular
 *  prop, no forwardRef needed) via rest spread. */
export function Stack({
  as: Component = "div",
  gap = "md",
  align = "stretch",
  className,
  children,
  ref,
  ...rest
}: StackProps) {
  return (
    <Component
      ref={ref}
      className={cn(
        "flex flex-col",
        gapClass[gap],
        alignClass[align],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
