import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import {
  getProjectBySlug,
  getProjectsByIds,
  listProjects,
} from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import { resolveSkillIdForTechnology } from "@/services/content/skills.service";
import { formatDuration } from "@/lib/date";
import { buildPageMetadata } from "@/lib/seo";
import {
  absoluteAsset,
  absoluteUrl,
  buildBreadcrumbLd,
  personRef,
  WEBSITE_ID,
} from "@/lib/structured-data";
import { getSiteContent } from "@/services/content/site.service";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProjectHero } from "@/components/sections/ProjectHero";
import { FeatureHighlightCard } from "@/components/ui/FeatureHighlightCard";
import { ChallengeCard } from "@/components/ui/ChallengeCard";
import { ExternalLinksList } from "@/components/ui/ExternalLinksList";
import { ProjectTeamSection } from "@/components/sections/ProjectTeamSection";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Locale } from "@/types/content";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  return listProjects(locale).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  // Per-project social preview — falls back to the site-wide default
  // (config/brand.ts) only when a project has no cover image of its own.
  return buildPageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: project.metaTitle,
    description: project.metaDescription,
    siteName: getSiteContent(locale).hero.name,
    image: project.coverImageUrl,
    absoluteTitle: true,
  });
}

/** Narrative process sections — an optional log of how the work actually
 *  unfolded, distinct from the structured Overview facts and the
 *  structured Challenges list. */
const PROCESS_SECTIONS = [
  "research",
  "design",
  "architecture",
  "implementation",
] as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const [
    tProjects,
    tStatus,
    tCategory,
    tPlatform,
    tDetail,
    tArticles,
    tArticlePlatform,
    tBreadcrumb,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "projectsIndex" }),
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectDetail" }),
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
    getTranslations({ locale, namespace: "breadcrumb" }),
  ]);

  const relatedProjects = getProjectsByIds(
    project.relatedProjectIds,
    locale
  ).slice(0, 3);
  const relatedArticles = getArticlesByIds(
    project.relatedArticleIds,
    locale
  ).slice(0, 3);

  const platformLabel = project.platforms
    .map((platform) => tPlatform(platform))
    .join(" · ");

  const overviewFacts: { label: string; value: string }[] = [
    project.goals ? { label: tDetail("goals"), value: project.goals } : null,
    project.targetAudience
      ? { label: tDetail("targetAudience"), value: project.targetAudience }
      : null,
    project.myRole ? { label: tDetail("myRole"), value: project.myRole } : null,
    {
      label: tDetail("duration"),
      value: formatDuration(project.startDate, project.endDate, locale),
    },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  // Structured data: BreadcrumbList mirrors the visual Breadcrumb above,
  // CreativeWork describes the project itself using only fields already
  // authored in the content model — no invented rating, price or
  // organization data. `author` points at the site-wide Person (see
  // lib/structured-data.ts) and `sameAs` lists where the work itself
  // lives (store pages, playable build, repository).
  const projectUrl = absoluteUrl(locale, `/projects/${project.slug}`);
  const breadcrumbLd = buildBreadcrumbLd(locale, tBreadcrumb("home"), [
    { name: tProjects("title"), path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);
  const projectSameAs = [
    ...Object.values(project.links),
    ...(project.externalLinks ?? []).map((link) => link.url),
  ].filter((url): url is string => Boolean(url));
  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#work`,
    name: project.title,
    headline: project.metaTitle,
    description: project.summary,
    abstract: project.problem,
    url: projectUrl,
    mainEntityOfPage: projectUrl,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    author: personRef,
    creator: personRef,
    genre: tCategory(project.category),
    ...(project.coverImageUrl && {
      image: absoluteAsset(project.coverImageUrl),
    }),
    dateCreated: project.startDate,
    ...(project.endDate && { dateModified: project.endDate }),
    keywords: project.technologies.join(", "),
    ...(projectSameAs.length > 0 && { sameAs: projectSameAs }),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={creativeWorkLd} />
      <Breadcrumb
        locale={locale}
        items={[
          { label: tProjects("title"), href: "/projects" },
          { label: project.title },
        ]}
      />

      <ProjectHero
        project={project}
        locale={locale}
        statusLabel={tStatus(project.status)}
        categoryLabel={tCategory(project.category)}
        platformLabel={platformLabel}
        presentLabel={tDetail("present")}
        t={(key) => tDetail(key)}
      />

      <article className="flex flex-col gap-14">
        {/* Overview: full description + goals/audience/role/team/duration facts */}
        <section>
          <h2 className="text-h4 text-text-primary mb-4 font-semibold">
            {tDetail("overview")}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-caption text-text-secondary font-semibold tracking-wide uppercase">
                {tDetail("problem")}
              </h3>
              <p className="text-body text-text-secondary mt-1">
                {project.problem}
              </p>
            </div>
            <div>
              <h3 className="text-caption text-text-secondary font-semibold tracking-wide uppercase">
                {tDetail("solution")}
              </h3>
              <p className="text-body text-text-secondary mt-1">
                {project.solution}
              </p>
            </div>
          </div>

          {overviewFacts.length > 0 && (
            <RevealGroup className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {overviewFacts.map((fact) => (
                <div key={fact.label} data-animate>
                  <dt className="text-caption text-text-secondary font-medium">
                    {fact.label}
                  </dt>
                  <dd className="text-small text-text-primary mt-0.5">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </RevealGroup>
          )}
        </section>

        {/* Team */}
        <ProjectTeamSection
          team={project.team}
          labels={{
            team: tDetail("team"),
            solo: tDetail("soloProject"),
            teamOf: tDetail("teamOf", { count: project.team?.length ?? 0 }),
            viewTeam: tDetail("team"),
            opensInNewTab: tDetail("opensInNewTab"),
          }}
        />

        {/* Technologies */}
        <section>
          <h2 className="text-h4 text-text-primary mb-3 font-semibold">
            {tDetail("technologies")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => {
              const skillId = resolveSkillIdForTechnology(tech);

              // No matching Skill: keep the original plain, non-interactive
              // tag exactly as before (requirement: never link a
              // technology with no corresponding Skill).
              if (!skillId) {
                return (
                  <li
                    key={tech}
                    className="bg-surface text-small text-text-secondary rounded-md px-2.5 py-1"
                  >
                    {tech}
                  </li>
                );
              }

              // Matching Skill: same tag styling, plus link affordances
              // (hover underline/accent color, focus ring) so it clearly
              // reads as clickable without changing the tag's shape or
              // the surrounding card/grid layout.
              return (
                <li key={tech}>
                  <Link
                    href={`/skills?skill=${skillId}`}
                    className="bg-surface text-small text-text-secondary hover:text-accent focus-visible:ring-accent inline-block rounded-md px-2.5 py-1 underline-offset-2 transition-colors outline-none hover:underline focus-visible:ring-2"
                  >
                    {tech}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Feature Highlights */}
        {project.featureHighlights && project.featureHighlights.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("featureHighlights")}
            </h2>
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.featureHighlights.map((highlight) => (
                <FeatureHighlightCard
                  key={highlight.title}
                  highlight={highlight}
                />
              ))}
            </RevealGroup>
          </section>
        )}

        {/* Media Gallery + Lightbox */}
        {project.gallery.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("mediaGallery")}
            </h2>
            <ProjectGallery
              items={project.gallery}
              previousLabel={tDetail("galleryPrevious")}
              nextLabel={tDetail("galleryNext")}
            />
          </section>
        )}

        {/* Optional process narrative */}
        {PROCESS_SECTIONS.map((key) => {
          const content = project[key];
          if (!content) return null;
          return (
            <section key={key}>
              <h2 className="text-h4 text-text-primary mb-2 font-semibold">
                {tDetail(key)}
              </h2>
              <p className="text-body text-text-secondary">{content}</p>
            </section>
          );
        })}

        {/* Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("challenges")}
            </h2>
            <RevealGroup className="flex flex-col gap-4">
              {project.challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.problem}
                  challenge={challenge}
                  labels={{
                    problem: tDetail("problem"),
                    solution: tDetail("solution"),
                    outcome: tDetail("outcome"),
                  }}
                />
              ))}
            </RevealGroup>
          </section>
        )}

        {/* Lessons Learned */}
        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {tDetail("lessonsLearned")}
          </h2>
          <p className="text-body text-text-secondary">
            {project.lessonsLearned}
          </p>
        </section>

        {/* External Links */}
        {project.externalLinks && project.externalLinks.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("externalLinks")}
            </h2>
            <RevealGroup>
              <ExternalLinksList links={project.externalLinks} />
            </RevealGroup>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("relatedProjects")}
            </h2>
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedProjects.map((related) => (
                <ProjectCard
                  key={related.id}
                  project={related}
                  locale={locale}
                />
              ))}
            </RevealGroup>
          </section>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {tDetail("relatedArticles")}
            </h2>
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedArticles.map((article) => {
                const platformLabel = tArticlePlatform(article.sourcePlatform);
                return (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    locale={locale}
                    platformLabel={platformLabel}
                    readMoreLabel={tArticles("readMore", {
                      platform: platformLabel,
                    })}
                    readingTimeLabel={tArticles("readingTime", {
                      minutes: article.readingTimeMinutes,
                    })}
                  />
                );
              })}
            </RevealGroup>
          </section>
        )}
      </article>

      <div className="border-border mt-14 border-t pt-8">
        <Link
          href="/projects"
          className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {tDetail("backToProjects")}
        </Link>
      </div>
    </div>
  );
}
