import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type StackGap = "sm" | "md" | "lg";
type StackAlign = "start" | "center" | "end" | "stretch";

interface StackProps extends ComponentPropsWithoutRef<"div"> {
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
 *  Accepts arbitrary HTML attributes (aria-*, id, role...) via rest spread. */
export function Stack({
  as: Component = "div",
  gap = "md",
  align = "stretch",
  className,
  children,
  ...rest
}: StackProps) {
  return (
    <Component
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
