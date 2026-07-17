import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "wide" | "narrow";

interface ContainerProps extends ComponentProps<"div"> {
  size?: ContainerSize;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const sizeClass: Record<ContainerSize, string> = {
  wide: "container-wide",
  narrow: "container-narrow",
};

/**
 * Responsive, configurable-width container. Wraps the container-wide /
 * container-narrow utilities (styles/utilities.css) in a typed component so
 * pages express intent ("wide" section vs. "narrow" reading content)
 * instead of repeating mx-auto max-w-* px-* chains.
 * Accepts arbitrary HTML attributes and ref (React 19: ref is a regular
 * prop, no forwardRef needed) via rest spread.
 */
export function Container({
  size = "wide",
  as: Component = "div",
  className,
  children,
  ref,
  ...rest
}: ContainerProps) {
  return (
    <Component ref={ref} className={cn(sizeClass[size], className)} {...rest}>
      {children}
    </Component>
  );
}
