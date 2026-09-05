import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import {
  getProjectBySlug,
  getProjectsByIds,
  listProjects,
} from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import { formatDuration } from "@/lib/date";
import { buildAlternates } from "@/lib/seo";
import { siteUrl } from "@/config/site";
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
  return {
    title: { absolute: project.metaTitle },
    description: project.metaDescription,
    alternates: buildAlternates(locale, `/projects/${project.slug}`),
    // Per-project social preview — falls back to the site-wide default
    // (config/brand.ts, applied in [locale]/layout.tsx) only when a
    // project has no cover image of its own.
    ...(project.coverImageUrl && {
      openGraph: {
        title: project.metaTitle,
        description: project.metaDescription,
        images: [project.coverImageUrl],
      },
      twitter: {
        card: "summary_large_image" as const,
        title: project.metaTitle,
        description: project.metaDescription,
        images: [project.coverImageUrl],
      },
    }),
  };
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
  ] = await Promise.all([
    getTranslations({ locale, namespace: "projectsIndex" }),
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectDetail" }),
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
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
  // authored in the content model — no invented category, rating, or
  // organization data.
  const projectPath = `/${locale}/projects/${project.slug}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tProjects("title"),
        item: new URL(`/${locale}/projects`, siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.title,
        item: new URL(projectPath, siteUrl).toString(),
      },
    ],
  };
  const creativeWorkLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: new URL(projectPath, siteUrl).toString(),
    ...(project.coverImageUrl && {
      image: new URL(project.coverImageUrl, siteUrl).toString(),
    }),
    dateCreated: project.startDate,
    ...(project.endDate && { dateModified: project.endDate }),
    keywords: project.technologies.join(", "),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="bg-surface text-small text-text-secondary rounded-md px-2.5 py-1"
              >
                {tech}
              </li>
            ))}
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
