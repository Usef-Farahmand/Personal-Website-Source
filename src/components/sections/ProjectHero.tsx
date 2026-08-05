import Image from "next/image";
import { Globe, Play, Download, Smartphone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { GitHubIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMonthYear } from "@/lib/date";
import type { Locale, ResolvedProject } from "@/types/content";

type LinkKey = keyof ResolvedProject["links"];
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Display-priority order for the Hero's CTAs — "Display only buttons that
 * are available for the project" (spec) plus a sensible default ordering
 * among whichever ones exist: a live product outranks its source code as
 * the thing worth leading with. The first two present become
 * Primary/Secondary; there's no dedicated tertiary slot in the Hero — a
 * project with more than two live links surfaces the rest in the
 * External Links section instead.
 */
const CTA_PRIORITY: {
  key: LinkKey;
  labelKey:
    | "viewWebsite"
    | "playGame"
    | "download"
    | "appStore"
    | "googlePlay"
    | "viewRepository";
  Icon: IconComponent;
}[] = [
  { key: "website", labelKey: "viewWebsite", Icon: Globe },
  { key: "playable", labelKey: "playGame", Icon: Play },
  { key: "download", labelKey: "download", Icon: Download },
  { key: "appStore", labelKey: "appStore", Icon: Smartphone },
  { key: "googlePlay", labelKey: "googlePlay", Icon: Smartphone },
  { key: "repository", labelKey: "viewRepository", Icon: GitHubIcon },
];

interface ProjectHeroProps {
  project: ResolvedProject;
  locale: Locale;
  statusLabel: string;
  categoryLabel: string;
  platformLabel: string;
  presentLabel: string;
  t: (key: string) => string;
}

export function ProjectHero({
  project,
  locale,
  statusLabel,
  categoryLabel,
  platformLabel,
  presentLabel,
  t,
}: ProjectHeroProps) {
  const availableCtas = CTA_PRIORITY.filter(({ key }) => project.links[key]);
  const [primaryCta, secondaryCta] = availableCtas;

  const completionLabel = project.endDate
    ? formatMonthYear(project.endDate, locale)
    : presentLabel;

  return (
    <header className="mb-14 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {project.logoUrl && (
          <span className="bg-accent/10 relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image src={project.logoUrl} alt="" fill className="object-cover" />
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} label={statusLabel} />
            <span className="text-caption text-text-secondary">
              {[categoryLabel, platformLabel].filter(Boolean).join(" · ")}
            </span>
          </div>
          <h1 className="text-h1 text-text-primary font-semibold">
            {project.title}
          </h1>
        </div>
      </div>

      <p className="text-body-lg text-text-secondary max-w-2xl">
        {project.summary}
      </p>

      <p className="text-caption text-text-secondary">
        {formatMonthYear(project.startDate, locale)} – {completionLabel}
      </p>

      {(primaryCta || secondaryCta) && (
        <div className="flex flex-wrap gap-3">
          {primaryCta && (
            <a
              href={project.links[primaryCta.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-background hover:bg-accent-hover text-small inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-semibold transition-colors"
            >
              <primaryCta.Icon className="h-4 w-4" aria-hidden="true" />
              {t(primaryCta.labelKey)}
            </a>
          )}
          {secondaryCta && (
            <a
              href={project.links[secondaryCta.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-small text-text-primary hover:border-accent/50 inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-medium transition-colors"
            >
              <secondaryCta.Icon className="h-4 w-4" aria-hidden="true" />
              {t(secondaryCta.labelKey)}
            </a>
          )}
        </div>
      )}
    </header>
  );
}
