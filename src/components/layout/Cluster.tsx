import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ClusterGap = "sm" | "md" | "lg";
type ClusterJustify = "start" | "center" | "end" | "between";
type ClusterAlign = "start" | "center" | "end";

interface ClusterProps {
  as?: ElementType;
  gap?: ClusterGap;
  justify?: ClusterJustify;
  align?: ClusterAlign;
  className?: string;
  children: ReactNode;
}

const gapClass: Record<ClusterGap, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const justifyClass: Record<ClusterJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const alignClass: Record<ClusterAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

/** Horizontal, wrapping flex layout with consistent gap. For groups that
 *  should flow and wrap naturally — tag lists, button groups, badges. */
export function Cluster({
  as: Component = "div",
  gap = "md",
  justify = "start",
  align = "center",
  className,
  children,
}: ClusterProps) {
  return (
    <Component
      className={cn(
        "flex flex-wrap",
        gapClass[gap],
        justifyClass[justify],
        alignClass[align],
        className
      )}
    >
      {children}
    </Component>
  );
}
