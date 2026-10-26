"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";
import { cn } from "@/lib/cn";
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
  /** Extra grid classes, e.g. a third column on wide screens. */
  className?: string;
  /** Opt-in slot layout: each grid cell holds either one of these "tall"
   *  items or two other items stacked. Without it, one card per cell. */
  tallKeys?: string[];
}

/**
 * Packs keys, in order, into slots: a tall key takes a slot of its own;
 * any other key fills the bottom of the last half-full slot, or opens a
 * new one. Gives "tall | two stacked | two stacked", "tall | two stacked |
 * tall", "tall | tall | tall"… whatever the mix and column count.
 */
function packSlots(keys: string[], tall: Set<string>): string[][] {
  const slots: string[][] = [];
  let open: string[] | null = null;
  for (const key of keys) {
    if (tall.has(key)) {
      slots.push([key]);
    } else if (open) {
      open.push(key);
      open = null;
    } else {
      open = [key];
      slots.push(open);
    }
  }
  return slots;
}

/**
 * Same visual grid as ProjectsGrid/ArticlesGrid (in fact reuses the same
 * entrance-animation behavior), but additionally hides non-matching
 * cards and reorders visible ones to match `visibleKeys` via the CSS
 * `order` property — sorting client-side without ever touching the
 * server-rendered card markup itself.
 */
export function FilterableGrid({
  children,
  visibleKeys,
  className,
  tallKeys,
}: FilterableGridProps) {
  const gridRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 60,
  });
  const gridClassName = cn("grid-cols-1 sm:grid-cols-2", className);

  if (tallKeys) {
    const byKey = new Map<string, ReactNode>();
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const key = (child.props as { "data-list-key"?: string })[
        "data-list-key"
      ];
      if (key) byKey.set(key, child);
    });
    const tall = new Set(tallKeys);
    const visible = new Set(visibleKeys);

    return (
      <>
        <Grid ref={gridRef} gap="md" className={gridClassName}>
          {packSlots(visibleKeys, tall).map((slot) => (
            <div
              key={slot[0]}
              className={cn("grid gap-6", !tall.has(slot[0]) && "grid-rows-2")}
            >
              {slot.map((key) => byKey.get(key))}
            </div>
          ))}
        </Grid>
        {/* Filtered-out cards stay mounted, as in the default layout. */}
        <div hidden>
          {[...byKey].map(([key, child]) => (visible.has(key) ? null : child))}
        </div>
      </>
    );
  }

  const visibleIndex = new Map(visibleKeys.map((key, index) => [key, index]));

  return (
    <Grid ref={gridRef} gap="md" className={gridClassName}>
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
