"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

interface FilterableGridProps {
  /** Server-rendered cards, each expected to carry a `data-list-key`
   *  attribute matching a ListToolbarItem.key. */
  children: ReactNode;
  /** Ordered list of currently-visible keys, as computed by
   *  ListToolbar. Cards whose key isn't in this list are hidden (not
   *  unmounted — they stay in the DOM with `hidden`, so no server
   *  round-trip or re-render is ever needed to show them again). */
  visibleKeys: string[];
}

/**
 * Same visual grid as ProjectsGrid/ArticlesGrid (in fact reuses the same
 * entrance-animation behavior), but additionally hides non-matching
 * cards and reorders visible ones to match `visibleKeys` via the CSS
 * `order` property — sorting client-side without ever touching the
 * server-rendered card markup itself.
 */
export function FilterableGrid({ children, visibleKeys }: FilterableGridProps) {
  const gridRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 60,
  });

  const visibleIndex = new Map(visibleKeys.map((key, index) => [key, index]));

  return (
    <Grid ref={gridRef} gap="md" className="grid-cols-1 sm:grid-cols-2">
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const key = (child.props as { "data-list-key"?: string })[
          "data-list-key"
        ];
        if (!key) return child;

        const orderIndex = visibleIndex.get(key);
        const isVisible = orderIndex !== undefined;

        return (
          <div
            hidden={!isVisible}
            style={isVisible ? { order: orderIndex } : undefined}
          >
            {child}
          </div>
        );
      })}
    </Grid>
  );
}
