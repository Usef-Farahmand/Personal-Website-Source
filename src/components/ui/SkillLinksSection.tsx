"use client";

import { ArrowUpRight } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { Overlay } from "@/components/ui/Overlay";
import { ExternalLinksList } from "@/components/ui/ExternalLinksList";
import { Link } from "@/i18n/navigation";
import type {
  ExternalLink,
  ResolvedArticle,
  ResolvedProject,
} from "@/types/content";

/** Combined across Related Projects + Related Articles + External Links
 *  — a card shows at most this many links *in total*, not per section,
 *  so a skill with e.g. 2 related projects and 2 external links (4
 *  links total) collapses just as a skill with 4 external links alone
 *  would. Keeps every SkillCard's footer the same rough height
 *  regardless of how a given skill's links are distributed across the
 *  three kinds. */
const MAX_VISIBLE_LINKS = 3;

/** One entry in the combined, orderable link list — a thin wrapper
 *  around whichever of the three link kinds it represents, tagged so
 *  the render side can put each back in its own styled section. */
type LinkEntry =
  | { kind: "project"; project: ResolvedProject }
  | { kind: "article"; article: ResolvedArticle }
  | { kind: "externalLink"; link: ExternalLink };

function ProjectLinksList({ projects }: { projects: ResolvedProject[] }) {
  if (projects.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.slug}`}
            className="text-small text-text-primary hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
          >
            {project.title}
            <ArrowUpRight
              className="h-3.5 w-3.5 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ArticleLinksList({ articles }: { articles: ResolvedArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small text-text-primary hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
          >
            {article.title}
            <ArrowUpRight
              className="h-3.5 w-3.5 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

interface SkillLinksSectionProps {
  skillName: string;
  skillDescription: string;
  relatedProjects: ResolvedProject[];
  relatedArticles: ResolvedArticle[];
  externalLinks: ExternalLink[];
  labels: {
    relatedProjects: string;
    relatedArticles: string;
    externalLinks: string;
    readMore: string;
  };
}

/**
 * SkillCard's link-bearing footer: Related Projects, Related Articles,
 * and External Links, treated as one combined, capped list rather than
 * three independently-capped ones — a skill with 2 related projects and
 * 2 external links (4 links total) collapses exactly like a skill with
 * 4 external links alone would.
 *
 * Order is Projects, then Articles, then External Links (the same
 * top-to-bottom order the card always rendered them in) — the combined
 * list is truncated at MAX_VISIBLE_LINKS, then split back into three
 * type-specific groups for rendering so each keeps its own existing
 * heading and visual style. The whole block flows immediately after
 * whatever content precedes it (Technologies, or the header/description
 * if a skill has none) rather than being pushed down to the card's
 * bottom edge — cards size to their own content and sit at their
 * natural height in the grid (SkillsGrid uses `items-start`), instead
 * of every card in a row being stretched to match the tallest one with
 * a forced gap above the links.
 * When there's overflow, a single "Read More" opens one popup with the
 * skill's name, full description, and every
 * link across all three sections — never a separate button per section.
 *
 * The only interactive piece of the otherwise server-rendered SkillCard
 * — isolated into its own small Client Component (state: the popup's
 * open/closed) rather than making the whole card, or the Skills page,
 * a Client Component.
 */
export function SkillLinksSection({
  skillName,
  skillDescription,
  relatedProjects,
  relatedArticles,
  externalLinks,
  labels,
}: SkillLinksSectionProps) {
  const modal = useModal();

  const allEntries: LinkEntry[] = [
    ...relatedProjects.map((project): LinkEntry => ({ kind: "project", project })),
    ...relatedArticles.map((article): LinkEntry => ({ kind: "article", article })),
    ...externalLinks.map((link): LinkEntry => ({ kind: "externalLink", link })),
  ];

  if (allEntries.length === 0) return null;

  const hasOverflow = allEntries.length > MAX_VISIBLE_LINKS;
  const visibleEntries = hasOverflow
    ? allEntries.slice(0, MAX_VISIBLE_LINKS)
    : allEntries;

  const visibleProjects = visibleEntries
    .filter(
      (entry): entry is Extract<LinkEntry, { kind: "project" }> =>
        entry.kind === "project"
    )
    .map((entry) => entry.project);
  const visibleArticles = visibleEntries
    .filter(
      (entry): entry is Extract<LinkEntry, { kind: "article" }> =>
        entry.kind === "article"
    )
    .map((entry) => entry.article);
  const visibleExternalLinks = visibleEntries
    .filter(
      (entry): entry is Extract<LinkEntry, { kind: "externalLink" }> =>
        entry.kind === "externalLink"
    )
    .map((entry) => entry.link);

  return (
    <div className="flex flex-col gap-3 pt-1">
      {visibleProjects.length > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.relatedProjects}
          </h4>
          <ProjectLinksList projects={visibleProjects} />
        </div>
      )}

      {visibleArticles.length > 0 && (
        <div>
          <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
            {labels.relatedArticles}
          </h4>
          <ArticleLinksList articles={visibleArticles} />
        </div>
      )}

      {visibleExternalLinks.length > 0 && (
        <div>
          <ExternalLinksList links={visibleExternalLinks} />
        </div>
      )}

      {hasOverflow && (
        <>
          <button
            type="button"
            onClick={modal.open}
            className="text-small text-accent hover:text-accent-hover inline-flex w-fit items-center font-medium transition-colors"
          >
            {labels.readMore}
          </button>

          <Overlay
            isOpen={modal.isOpen}
            onClose={modal.close}
            title={skillName}
            visuallyHiddenTitle={false}
          >
            <p className="text-small text-text-secondary">
              {skillDescription}
            </p>

            <div className="mt-5 flex flex-col gap-4">
              {relatedProjects.length > 0 && (
                <div>
                  <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
                    {labels.relatedProjects}
                  </h4>
                  <ProjectLinksList projects={relatedProjects} />
                </div>
              )}

              {relatedArticles.length > 0 && (
                <div>
                  <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
                    {labels.relatedArticles}
                  </h4>
                  <ArticleLinksList articles={relatedArticles} />
                </div>
              )}

              {externalLinks.length > 0 && (
                <div>
                  <h4 className="text-caption text-text-secondary mb-1.5 font-medium">
                    {labels.externalLinks}
                  </h4>
                  <ExternalLinksList links={externalLinks} />
                </div>
              )}
            </div>
          </Overlay>
        </>
      )}
    </div>
  );
}
