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
          className="border-border text-text-secondary text-small rounded-full border px-3 py-1.5"
        >
          {item}
        </span>
      ))}
    </Cluster>
  );
}
