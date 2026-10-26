import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { formatFullDate } from "@/lib/date";
import {
  getVideoCover,
  getVideoPlatforms,
} from "@/services/content/videos.service";
import type { Locale, ResolvedVideo, VideoPlatform } from "@/types/content";

const PLATFORM_ICON: Record<
  VideoPlatform,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
};

interface VideoCardProps {
  video: ResolvedVideo;
  locale: Locale;
  formatLabel: string;
  platformLabels: Record<VideoPlatform, string>;
  /** "Watch on {platform}" per platform, already resolved. */
  watchLabels: Record<VideoPlatform, string>;
  opensInNewTab: string;
}

/**
 * A video introduced on the site but never played here: the cover and
 * title link to the video on its main platform (YouTube when present),
 * and each platform it's published on gets its own button. The title link
 * is stretched over the whole card; the platform buttons sit above it.
 *
 * Shorts/Reels get a tall card (a 2:3 cover filling a whole grid cell —
 * see tallKeys on the videos page); regular videos a wide 16:9 one, two
 * to a cell. A Short without an authored cover uses YouTube's thumbnail,
 * which pillarboxes the vertical frame inside 4:3 — it's zoomed just
 * enough to crop the bars.
 */
export function VideoCard({
  video,
  locale,
  formatLabel,
  platformLabels,
  watchLabels,
  opensInNewTab,
}: VideoCardProps) {
  const platforms = getVideoPlatforms(video);
  const primary = platforms[0];
  const primaryUrl = primary ? video.links[primary] : undefined;
  const cover = getVideoCover(video);
  const isShort = video.format === "short";
  const letterboxed = isShort && !video.coverImageUrl;

  return (
    <article
      data-animate
      data-format={video.format}
      className="group border-border bg-surface hover:border-accent/50 card-lift relative flex h-full flex-col overflow-hidden rounded-lg border"
    >
      <div
        className={cn(
          "bg-background relative overflow-hidden",
          // A tall card grows with its two grid rows when they're taller.
          isShort ? "aspect-[2/3] flex-1" : "aspect-video"
        )}
      >
        {cover ? (
          <Image
            src={cover}
            alt={video.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-(--motion-ease-smooth)",
              letterboxed
                ? "scale-[1.19] group-hover:scale-125"
                : "group-hover:scale-105"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={48} className="opacity-30" />
          </div>
        )}

        <span className="bg-background/90 text-text-secondary text-caption absolute end-2 top-2 rounded-full px-2.5 py-0.5 font-medium">
          {formatLabel}
        </span>
      </div>

      <div className={cn("flex flex-col gap-3 p-5", !isShort && "flex-1")}>
        <p className="text-caption text-text-secondary">
          <time dateTime={video.publishedDate}>
            {formatFullDate(video.publishedDate, locale)}
          </time>
        </p>

        <h3 className="text-h4 text-text-primary group-hover:text-accent font-semibold transition-colors duration-300">
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none before:absolute before:inset-0 before:content-[''] focus-visible:before:outline-2 focus-visible:before:outline-offset-2 focus-visible:before:outline-(--color-accent)"
          >
            {video.title}
            <span className="sr-only"> {opensInNewTab}</span>
          </a>
        </h3>

        <ul className="relative z-10 mt-auto flex flex-wrap gap-2 pt-1">
          {platforms.map((platform) => {
            const Icon = PLATFORM_ICON[platform];
            return (
              <li key={platform}>
                <a
                  href={video.links[platform]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-text-secondary hover:border-accent hover:text-accent text-caption inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span aria-hidden="true">{platformLabels[platform]}</span>
                  <span className="sr-only">
                    {watchLabels[platform]} {opensInNewTab}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
