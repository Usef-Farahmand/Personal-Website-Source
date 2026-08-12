import Image from "next/image";
import { ExternalLink, Newspaper } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { LinkedInIcon } from "@/components/ui/icons";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatMonthYear } from "@/lib/date";
import type {
  ArticleSourcePlatform,
  Locale,
  ResolvedArticle,
} from "@/types/content";

interface ArticleCardProps {
  article: ResolvedArticle;
  platformLabel: string;
  readMoreLabel: string;
  readingTimeLabel: string;
  locale: Locale;
}

/**
 * Medium has no verifiable brand-mark path data available in this
 * environment (same caution applied to Telegram in Task 04) — Newspaper
 * is a deliberate, honest generic stand-in, not a guessed brand logo.
 * LinkedIn reuses the real custom icon already built in Task 04.
 * Adding a future platform is one new entry here, nothing else.
 */
const PLATFORM_ICON: Record<
  ArticleSourcePlatform,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  medium: Newspaper,
  linkedin: LinkedInIcon,
};

export function ArticleCard({
  article,
  platformLabel,
  readMoreLabel,
  readingTimeLabel,
  locale,
}: ArticleCardProps) {
  const PlatformIcon = PLATFORM_ICON[article.sourcePlatform];

  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-animate
      className="group border-border bg-surface hover:border-accent/50 flex flex-col gap-4 rounded-lg border p-6 transition-colors"
    >
      <div className="bg-background relative aspect-video overflow-hidden rounded-md">
        {article.headerImageUrl ? (
          <Image
            src={article.headerImageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={48} className="opacity-30" />
          </div>
        )}

        <span className="bg-background/90 text-text-secondary text-caption absolute end-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium">
          <PlatformIcon className="h-3 w-3" aria-hidden="true" />
          {platformLabel}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h4 text-text-primary group-hover:text-accent inline-flex items-start gap-1.5 font-semibold">
          {article.title}
          <ExternalLink
            className="mt-1.5 h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
        </h3>

        <p className="text-small text-text-secondary">{article.summary}</p>

        <ul className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="bg-background text-caption text-text-secondary rounded-md px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="text-caption text-text-secondary mt-auto pt-1">
          {formatMonthYear(article.publishedDate, locale)} · {readingTimeLabel}{" "}
          · {readMoreLabel}
        </p>
      </div>
    </a>
  );
}
