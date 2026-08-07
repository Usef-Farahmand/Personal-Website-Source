"use client";

import { Grid } from "@/components/layout/Grid";
import { BuildAreaCard } from "@/components/ui/BuildAreaCard";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import type { WhatIBuildDomain } from "@/types/content";

interface AboutBuildAreasProps {
  domains: WhatIBuildDomain[];
  labels: Record<WhatIBuildDomain, string>;
}

export function AboutBuildAreas({ domains, labels }: AboutBuildAreasProps) {
  const gridRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 70,
  });

  return (
    <Grid
      ref={gridRef}
      gap="sm"
      className="grid-cols-2 sm:grid-cols-3"
    >
      {domains.map((domain) => (
        <BuildAreaCard key={domain} domain={domain} label={labels[domain]} />
      ))}
    </Grid>
  );
}
