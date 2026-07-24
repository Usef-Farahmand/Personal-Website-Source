"use client";

import type { ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

export function RecommendationsGrid({ children }: { children: ReactNode }) {
  const gridRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 100,
  });

  return (
    <Grid ref={gridRef} gap="md" className="grid-cols-1 sm:grid-cols-2">
      {children}
    </Grid>
  );
}
