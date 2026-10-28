import Image from "next/image";
import { Globe, Play } from "lucide-react";
import type { ComponentType } from "react";
import {
  AndroidIcon,
  AppStoreIcon,
  BazaarIcon,
  GitHubIcon,
  GooglePlayIcon,
  LinuxIcon,
  MyketIcon,
  SibStoreIcon,
  WindowsIcon,
} from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatMonthYear } from "@/lib/date";
import type { Locale, ResolvedProject } from "@/types/content";

type LinkKey = keyof ResolvedProject["links"];
type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Display-priority order for the Hero's CTAs — "Display only buttons that
 * are available for the project" (spec) plus a sensible default ordering
 * among whichever ones exist: a live product outranks its source code as
 * the thing worth leading with, then direct downloads (Windows, Linux,
 * Android APK), then the stores (Android: Google Play, Cafe Bazaar, Myket;
 * iOS: App Store, Sib Store). The first present one becomes the Primary
 * CTA and every other present one renders as a Secondary CTA.
 */
const CTA_PRIORITY: {
  key: LinkKey;
  labelKey:
    | "viewWebsite"
    | "playGame"
    | "downloadWindows"
    | "downloadLinux"
    | "downloadAndroid"
    | "googlePlay"
    | "bazaar"
    | "myket"
    | "appStore"
    | "sibStore"
    | "viewRepository";
  Icon: IconComponent;
}[] = [
  { key: "website", labelKey: "viewWebsite", Icon: Globe },
  { key: "playable", labelKey: "playGame", Icon: Play },
  { key: "downloadWindows", labelKey: "downloadWindows", Icon: WindowsIcon },
  { key: "downloadLinux", labelKey: "downloadLinux", Icon: LinuxIcon },
  { key: "downloadAndroid", labelKey: "downloadAndroid", Icon: AndroidIcon },
  { key: "googlePlay", labelKey: "googlePlay", Icon: GooglePlayIcon },
  { key: "bazaar", labelKey: "bazaar", Icon: BazaarIcon },
  { key: "myket", labelKey: "myket", Icon: MyketIcon },
  { key: "appStore", labelKey: "appStore", Icon: AppStoreIcon },
  { key: "sibStore", labelKey: "sibStore", Icon: SibStoreIcon },
  { key: "repository", labelKey: "viewRepository", Icon: GitHubIcon },
];

interface ProjectHeroProps {
  project: ResolvedProject;
  locale: Locale;
  statusLabel: string;
  categoryLabel: string;
  platformLabel: string;
  presentLabel: string;
  logoAlt: string;
  availableAtLabel: string;
  t: (key: string) => string;
}

export function ProjectHero({
  project,
  locale,
  statusLabel,
  categoryLabel,
  platformLabel,
  presentLabel,
  logoAlt,
  availableAtLabel,
  t,
}: ProjectHeroProps) {
  const availableCtas = CTA_PRIORITY.filter(({ key }) => project.links[key]);
  const [primaryCta, ...secondaryCtas] = availableCtas;

  const completionLabel = project.endDate
    ? formatMonthYear(project.endDate, locale)
    : presentLabel;

  return (
    // Sits on the project page's cover-art header: big title, summary,
    // dates, then every available store/download link.
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="bg-accent/10 relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/10 sm:h-20 sm:w-20">
          {project.logoUrl ? (
            <Image
              src={project.logoUrl}
              alt={logoAlt}
              fill
              className="object-cover"
            />
          ) : (
            <BrandLogo size={30} />
          )}
        </span>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} label={statusLabel} />
            <span className="text-caption text-text-secondary">
              {[categoryLabel, platformLabel].filter(Boolean).join(" · ")}
            </span>
          </div>
          <h1 className="text-text-primary text-[clamp(2.5rem,7vw,5rem)] leading-[1] font-bold ltr:tracking-tight">
            {project.title}
          </h1>
        </div>
      </div>

      <p className="text-body-lg text-text-primary/85 max-w-2xl">
        {project.summary}
      </p>

      <p className="text-caption text-text-secondary">
        {formatMonthYear(project.startDate, locale)} – {completionLabel}
      </p>

      {primaryCta && (
        <div className="flex flex-col gap-3">
          <h2 className="text-text-secondary text-xs font-semibold ltr:tracking-[0.15em] ltr:uppercase">
            {availableAtLabel}
          </h2>
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
            {secondaryCtas.map((cta) => (
              <a
                key={cta.key}
                href={project.links[cta.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-background/60 text-small text-text-primary hover:border-accent/50 inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-medium backdrop-blur-sm transition-colors"
              >
                <cta.Icon className="h-4 w-4" aria-hidden="true" />
                {t(cta.labelKey)}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
