import {
  Layout,
  Smartphone,
  Gamepad2,
  Sparkles,
  Cog,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { WhatIBuildDomain } from "@/types/content";

const ICON: Record<WhatIBuildDomain, LucideIcon> = {
  webApps: Layout,
  mobileApps: Smartphone,
  games: Gamepad2,
  aiTools: Sparkles,
  automation: Cog,
  websites: Globe,
};

/**
 * Deliberately just an icon + a title, per the explicit "no long
 * descriptions" requirement — a quieter, smaller sibling of
 * FeatureHighlightCard (which also carries a description) rather than a
 * reused instance of it with an empty description slot.
 */
export function BuildAreaCard({
  domain,
  label,
}: {
  domain: WhatIBuildDomain;
  label: string;
}) {
  const Icon = ICON[domain];
  return (
    <div
      data-animate
      className="border-border bg-surface flex flex-col items-center gap-3 rounded-lg border p-5 text-center"
    >
      <span className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-md">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-small text-text-primary font-semibold">{label}</h3>
    </div>
  );
}
