import { ArrowUpRight } from "lucide-react";
import type { ResolvedArticle, ResolvedExploringEntry } from "@/types/content";

interface ExploringCardProps {
  entry: ResolvedExploringEntry;
  relatedArticle: ResolvedArticle | null;
  relatedArticleLabel: string;
}

/**
 * Deliberately quieter than ProjectCard/ArticleCard — Exploring is a
 * low-CTA, low-interaction section per CONTENT_STRATEGY.md §15. The card
 * itself is never a link; only the optional related-article reference is,
 * since that's the one action the section actually invites.
 */
export function ExploringCard({
  entry,
  relatedArticle,
  relatedArticleLabel,
}: ExploringCardProps) {
  return (
    <article
      data-animate
      className="border-border bg-surface flex h-full flex-col gap-2 rounded-lg border p-6"
    >
      <h3 className="text-h4 text-text-primary font-semibold">{entry.title}</h3>
      <p className="text-small text-text-secondary">{entry.description}</p>

      {relatedArticle && (
        <a
          href={relatedArticle.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption text-text-secondary hover:text-accent mt-auto inline-flex items-center gap-1 pt-2 font-medium transition-colors"
        >
          {relatedArticleLabel}
          <ArrowUpRight
            className="h-3.5 w-3.5 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </a>
      )}
    </article>
  );
}
