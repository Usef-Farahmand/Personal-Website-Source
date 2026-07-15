import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "wide" | "narrow";

interface ContainerProps {
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
 */
export function Container({
  size = "wide",
  as: Component = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Component className={cn(sizeClass[size], className)}>{children}</Component>
  );
}
