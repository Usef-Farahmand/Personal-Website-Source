import Image from "next/image";
import { Code } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatFullDate } from "@/lib/date";
import { toPublicSrc } from "@/lib/publicPath";
import type { Locale, ResolvedLearningEntry } from "@/types/content";

interface LearningCardProps {
  entry: ResolvedLearningEntry;
  locale: Locale;
  /** Shown as a badge when the entry ships code (snippets or a repo). */
  codeLabel: string;
}

export function LearningCard({ entry, locale, codeLabel }: LearningCardProps) {
  const hasCode = Boolean(entry.codeSnippets?.length || entry.sourceCodeUrl);

  return (
    <Link
      href={`/learning/${entry.slug}`}
      data-animate
      className="group border-border bg-surface hover:border-accent/50 flex h-full flex-col gap-4 rounded-lg border p-6 transition-colors"
    >
      <div className="bg-background relative aspect-video overflow-hidden rounded-md">
        {entry.imageUrl ? (
          <Image
            src={toPublicSrc(entry.imageUrl)}
            alt={entry.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={48} className="opacity-30" />
          </div>
        )}

        {hasCode && (
          <span className="bg-background/90 text-text-secondary text-caption absolute end-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium">
            <Code className="h-3 w-3" aria-hidden="true" />
            {codeLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-h4 text-text-primary group-hover:text-accent font-semibold">
          {entry.title}
        </h3>

        <p className="text-small text-text-secondary">{entry.summary}</p>

        <ul className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <li
              key={tag}
              className="bg-background text-caption text-text-secondary rounded-md px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>

        <p className="text-caption text-text-secondary mt-auto pt-1">
          <time dateTime={entry.date}>{formatFullDate(entry.date, locale)}</time>
        </p>
      </div>
    </Link>
  );
}
