"use client";

import type { ReactNode } from "react";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

/**
 * Wraps any [data-animate]-marked children (cards, list items, meta
 * facts) with a staggered scroll-triggered reveal. Generic over layout —
 * pass a flex or grid className — rather than section-specific clones
 * like ExploringGrid, since the Project detail page needs this same
 * "reveal on scroll" treatment for several unrelated section shapes
 * (fact grid, card grid, link list).
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 100,
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
