import {
  Zap,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Users,
  SlidersHorizontal,
  WifiOff,
  Cog,
  Accessibility,
  Plug,
  type LucideIcon,
} from "lucide-react";
import type {
  FeatureHighlightIcon,
  ProjectFeatureHighlight,
} from "@/types/content";

const ICON: Record<FeatureHighlightIcon, LucideIcon> = {
  performance: Zap,
  security: ShieldCheck,
  ai: Sparkles,
  sync: RefreshCw,
  collaboration: Users,
  customization: SlidersHorizontal,
  offline: WifiOff,
  automation: Cog,
  accessibility: Accessibility,
  integration: Plug,
};

export function FeatureHighlightCard({
  highlight,
}: {
  highlight: ProjectFeatureHighlight;
}) {
  const Icon = ICON[highlight.icon];
  return (
    <div
      data-animate
      className="border-border bg-surface flex flex-col gap-3 rounded-lg border p-5"
    >
      <span className="bg-accent/10 text-accent flex h-9 w-9 items-center justify-center rounded-md">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-body text-text-primary font-semibold">
        {highlight.title}
      </h3>
      <p className="text-small text-text-secondary">{highlight.description}</p>
    </div>
  );
}
