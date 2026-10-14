"use client";

import { Cluster } from "@/components/layout/Cluster";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

/**
 * Deliberately the lightest-weight section on the page — small pill
 * badges rather than cards, per the "keep this section lightweight"
 * requirement. No icons, no links: just a quiet, scannable snapshot.
 */
export function AboutCurrentFocus({ items }: { items: string[] }) {
  const ref = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 60,
  });

  return (
    <Cluster ref={ref} gap="sm">
      {items.map((item) => (
        <span
          key={item}
          data-animate
          className="border-border bg-surface/60 text-text-primary text-small hover:border-accent/50 inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors"
        >
          <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
          {item}
        </span>
      ))}
    </Cluster>
  );
}
