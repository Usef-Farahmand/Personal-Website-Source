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
import type { ResolvedProject } from "@/types/content";

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
  statusLabel: string;
  categoryLabel: string;
  platformLabel: string;
  logoAlt: string;
  /** Set for personal projects: shown as a badge beside the status. */
  personalLabel?: string;
  t: (key: string) => string;
}

/**
 * The project page's first screen: the cover art, and over its bottom
 * edge the logo and title on one side with every store/download link on
 * the other — nothing else, so it all fits without scrolling. On phones
 * the art sits on top at its own shape (a landscape cover cropped to a
 * tall screen loses most of the picture) with the title and links below.
 */
export function ProjectHero({
  project,
  statusLabel,
  categoryLabel,
  platformLabel,
  logoAlt,
  personalLabel,
  t,
}: ProjectHeroProps) {
  const availableCtas = CTA_PRIORITY.filter(({ key }) => project.links[key]);
  const [primaryCta, ...secondaryCtas] = availableCtas;

  return (
    <header className="relative isolate flex flex-col overflow-hidden sm:block sm:h-[calc(100svh-5rem)] sm:max-h-[56rem] sm:min-h-[30rem]">
      <div className="relative aspect-video w-full sm:absolute sm:inset-0 sm:aspect-auto">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-surface flex h-full w-full items-center justify-center">
            <BrandLogo size={80} className="opacity-20" />
          </div>
        )}
        {/* Only the bottom fades to the page, so the art stays clear. */}
        <div
          aria-hidden="true"
          className="from-background via-background/70 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent sm:h-1/2"
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-2 pb-8 sm:absolute sm:inset-x-0 sm:bottom-0 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-6 sm:pb-12">
        <div className="flex min-w-0 items-center gap-4">
          <span className="bg-accent/10 relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/10 sm:h-24 sm:w-24">
            {project.logoUrl ? (
              <Image
                src={project.logoUrl}
                alt={logoAlt}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <BrandLogo size={36} />
            )}
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} label={statusLabel} />
              {personalLabel && (
                <span className="border-accent/50 bg-background/60 text-accent rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
                  {personalLabel}
                </span>
              )}
              <span className="text-caption text-text-secondary">
                {[categoryLabel, platformLabel].filter(Boolean).join(" · ")}
              </span>
            </div>
            <h1 className="text-text-primary text-[clamp(1.875rem,6vw,4.5rem)] leading-[1.05] font-bold ltr:tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {primaryCta && (
          <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-md sm:justify-end sm:gap-3">
            <a
              href={project.links[primaryCta.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-background hover:bg-accent-hover text-small inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-semibold transition-colors"
            >
              <primaryCta.Icon className="h-4 w-4" aria-hidden="true" />
              {t(primaryCta.labelKey)}
            </a>
            {secondaryCtas.map((cta) => (
              <a
                key={cta.key}
                href={project.links[cta.key]}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-background/70 text-small text-text-primary hover:border-accent/50 inline-flex items-center gap-2 rounded-md border px-4 py-2.5 font-medium backdrop-blur-sm transition-colors"
              >
                <cta.Icon className="h-4 w-4" aria-hidden="true" />
                {t(cta.labelKey)}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
