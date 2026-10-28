import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import {
  getProjectBySlug,
  getProjectsByIds,
  isPersonalProject,
  listProjects,
} from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import {
  listSkills,
  resolveSkillIdForTechnology,
} from "@/services/content/skills.service";
import {
  articleIdsForProject,
  relatedProjectIdsForProject,
  skillIdsForProject,
} from "@/services/content/relations.service";
import { formatDuration, formatMonthYear } from "@/lib/date";
import { formatInstalls, formatRating } from "@/lib/store-stats/format";
import { getProjectStoreStats } from "@/services/content/store-stats.service";
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
import { ProjectTallCard } from "@/components/ui/ProjectTallCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StoreChartsDialog } from "@/components/sections/StoreChartsDialog";
import { ProjectNewsSignup } from "@/components/sections/ProjectNewsSignup";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ProjectShareButton } from "@/components/ui/ProjectShareButton";
import { shareTemplateFor } from "@/lib/projectShare";
import { siteUrl } from "@/config/site";
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
    tAlt,
    tShare,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "projectsIndex" }),
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectDetail" }),
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
    getTranslations({ locale, namespace: "breadcrumb" }),
    getTranslations({ locale, namespace: "imageAlt" }),
    getTranslations({ locale, namespace: "projectShare" }),
  ]);

  // Two-way relations (see relations.service.ts), not just the ids
  // authored on this project.
  const relatedProjects = getProjectsByIds(
    relatedProjectIdsForProject(project.id),
    locale
  ).slice(0, 3);
  const relatedArticles = getArticlesByIds(
    articleIdsForProject(project.id),
    locale
  ).slice(0, 3);
  const projectSkillIds = new Set(skillIdsForProject(project.id));
  const relatedSkills = listSkills(locale).filter((skill) =>
    projectSkillIds.has(skill.id)
  );
  const otherTechnologies = project.technologies.filter((tech) => {
    const skillId = resolveSkillIdForTechnology(tech);
    return !skillId || !projectSkillIds.has(skillId);
  });

  // Gallery items often reuse the project's own name as their title, so
  // a title-only alt would repeat the same words for every screenshot —
  // number those instead, and add the project name to the rest.
  const gallery = project.gallery.map((item, index) => ({
    ...item,
    alt:
      item.alt ??
      (!item.title || item.title === project.title
        ? tAlt("galleryImageNumbered", {
            project: project.title,
            index: index + 1,
            total: project.gallery.length,
          })
        : tAlt("galleryImage", { title: item.title, project: project.title })),
  }));

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

  const kind =
    project.category === "game" || project.category === "playable-ad"
      ? "Game"
      : "App";
  const site = getSiteContent(locale);
  const stats = await getProjectStoreStats(project);
  const players = stats
    ? formatInstalls(stats.installs, stats.installsBelow, locale)
    : null;
  const rating = stats ? formatRating(stats.rating, locale) : null;
  const today = new Date().toISOString().slice(0, 10);

  const isPersonal = isPersonalProject(project);

  const details: { label: string; value: React.ReactNode }[] = [
    {
      label: tDetail("releaseDate"),
      value: formatMonthYear(project.startDate, locale),
    },
    {
      label: tDetail("status"),
      value: (
        <StatusBadge status={project.status} label={tStatus(project.status)} />
      ),
    },
    { label: tDetail("genre"), value: tCategory(project.category) },
    ...(isPersonal
      ? [{ label: tDetail("projectType"), value: tDetail("personalProject") }]
      : []),
    { label: tDetail("platforms"), value: platformLabel },
    ...(players ? [{ label: tDetail("players"), value: players }] : []),
    ...(rating
      ? [
          {
            label: tDetail("rating"),
            value: (
              <span className="inline-flex items-center gap-1.5">
                <Star
                  className="text-accent h-4 w-4 fill-current"
                  aria-hidden="true"
                />
                {rating}
                {stats?.ratingCount ? (
                  <span className="text-text-secondary text-xs">
                    ({tDetail("ratingCount", { count: stats.ratingCount })})
                  </span>
                ) : null}
              </span>
            ),
          },
        ]
      : []),
    ...overviewFacts.map((fact) => ({ label: fact.label, value: fact.value })),
  ];

  const shareButton = (
    <ProjectShareButton
      label={tShare("button")}
      project={{
        title: project.title,
        url: projectUrl,
        domain: new URL(siteUrl).hostname.replace(/^www\./, ""),
        imageUrl: project.coverImageUrl,
        message: tShare(`templates.${shareTemplateFor(project.category)}`, {
          title: project.title,
        }),
      }}
      labels={{
        title: tShare("title"),
        close: tShare("close"),
        messageLabel: tShare("messageLabel"),
        messageHint: tShare("messageHint"),
        copyLink: tShare("copyLink"),
        copied: tShare("copied"),
        copyFailed: tShare("copyFailed"),
        // Placeholder filled in on the client, per platform.
        shareOn: tShare("shareOn", { platform: "{platform}" }),
        opensInNewTab: tShare("opensInNewTab"),
      }}
    />
  );

  const detailsCard = (
    <div className="border-border bg-surface/80 rounded-2xl border p-6 backdrop-blur-sm">
      <h2 className="text-text-primary mb-4 text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
        {tDetail(kind === "Game" ? "detailsGame" : "detailsApp")}
      </h2>
      <dl className="divide-border flex flex-col divide-y">
        {details.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 py-3">
            <dt className="text-text-secondary text-xs font-medium">
              {row.label}
            </dt>
            <dd className="text-text-primary text-start text-sm">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {stats && stats.stores.length > 0 && (
        <div className="border-border mt-2 flex flex-col gap-3 border-t pt-4">
          <StoreChartsDialog
            series={stats.stores.map((s) => ({
              store: s.store,
              label: tDetail(s.store),
              points: s.history,
            }))}
            today={today}
            locale={locale}
            labels={{
              button: tDetail("viewCharts"),
              title: tDetail("chartsTitle", { title: project.title }),
              allStores: tDetail("allStores"),
              installs: tDetail("metricInstalls"),
              ratings: tDetail("metricRatings"),
              rating: tDetail("metricRating"),
              showTable: tDetail("showTable"),
              hideTable: tDetail("hideTable"),
              date: tDetail("tableDate"),
              start: tDetail("chartStart", { date: "{date}" }),
              noData: tDetail("chartNoData"),
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={creativeWorkLd} />

      <ProjectHero
        project={project}
        statusLabel={tStatus(project.status)}
        categoryLabel={tCategory(project.category)}
        platformLabel={platformLabel}
        logoAlt={tAlt("logo", { name: project.title })}
        personalLabel={isPersonal ? tDetail("personalProject") : undefined}
        share={{ node: shareButton, label: tShare("button") }}
        t={(key) => tDetail(key)}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumb
          locale={locale}
          items={[
            { label: tProjects("title"), href: "/projects" },
            { label: project.title },
          ]}
        />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="flex min-w-0 flex-col gap-14">
            {/* About: the problem and the answer. */}
            <section>
              <h2 className="text-text-primary mb-6 text-3xl font-bold ltr:tracking-tight">
                {tDetail(kind === "Game" ? "aboutGame" : "aboutApp")}
              </h2>
              <p className="text-text-primary/90 mb-8 text-lg leading-relaxed">
                {project.summary}
              </p>
              <div className="border-border bg-surface/60 relative overflow-hidden rounded-2xl border p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="landing-fill absolute inset-y-0 start-0 w-1.5"
                />
                <h3 className="text-accent text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
                  {tDetail("problem")}
                </h3>
                <p className="text-text-secondary mt-2 leading-relaxed">
                  {project.problem}
                </p>
              </div>
              <h3 className="text-text-primary mt-8 mb-2 text-xl font-semibold">
                {tDetail("solution")}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {project.solution}
              </p>
            </section>

            <div className="lg:hidden">{detailsCard}</div>

            {/* Feature Highlights */}
            {project.featureHighlights &&
              project.featureHighlights.length > 0 && (
                <section>
                  <h2 className="text-text-primary mb-6 text-2xl font-bold">
                    {tDetail("featureHighlights")}
                  </h2>
                  <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {project.featureHighlights.map((highlight, index) => (
                      <FeatureHighlightCard
                        key={highlight.title + index}
                        highlight={highlight}
                      />
                    ))}
                  </RevealGroup>
                </section>
              )}

            {/* Team */}
            <ProjectTeamSection
              team={project.team}
              labels={{
                team: tDetail("team"),
                teamOf: tDetail("teamOf", {
                  count: project.team?.length ?? 0,
                }),
                viewTeam: tDetail("team"),
                opensInNewTab: tDetail("opensInNewTab"),
              }}
            />

            {/* Technologies & skills in one list: every skill the project
                demonstrates (linked to the Skills page), then the
                technologies that aren't already covered by one of them. */}
            {(relatedSkills.length > 0 || otherTechnologies.length > 0) && (
              <section>
                <h2 className="text-text-primary mb-3 text-2xl font-bold">
                  {tDetail("techAndSkills")}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {relatedSkills.map((skill) => (
                    <li key={skill.id}>
                      <Link
                        href={"/skills?skill=" + skill.id}
                        className="border-border bg-surface text-small text-text-primary hover:border-accent hover:text-accent focus-visible:ring-accent inline-block rounded-md border px-2.5 py-1 transition-colors outline-none focus-visible:ring-2"
                      >
                        {skill.name}
                      </Link>
                    </li>
                  ))}
                  {otherTechnologies.map((tech) => (
                    <li
                      key={tech}
                      className="border-border bg-surface text-small text-text-primary inline-block rounded-md border px-2.5 py-1"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Optional process narrative */}
            {PROCESS_SECTIONS.map((key) => {
              const content = project[key];
              if (!content) return null;
              return (
                <section key={key}>
                  <h2 className="text-text-primary mb-2 text-2xl font-bold">
                    {tDetail(key)}
                  </h2>
                  <p className="text-body text-text-secondary">{content}</p>
                </section>
              );
            })}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <section>
                <h2 className="text-text-primary mb-4 text-2xl font-bold">
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
              <h2 className="text-text-primary mb-2 text-2xl font-bold">
                {tDetail("lessonsLearned")}
              </h2>
              <p className="text-body text-text-secondary">
                {project.lessonsLearned}
              </p>
            </section>

            {/* External Links */}
            {project.externalLinks && project.externalLinks.length > 0 && (
              <section>
                <h2 className="text-text-primary mb-4 text-2xl font-bold">
                  {tDetail("externalLinks")}
                </h2>
                <RevealGroup>
                  <ExternalLinksList links={project.externalLinks} />
                </RevealGroup>
              </section>
            )}
          </article>

          {/* Details card: stays in view while the story scrolls. On
              phones it sits right after the About section instead. */}
          <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
            {detailsCard}
          </aside>
        </div>

        {/* Images & videos */}
        {project.gallery.length > 0 && (
          <section className="mt-20">
            <h2 className="text-text-primary mb-6 text-3xl font-bold ltr:tracking-tight">
              {tDetail("media")}
            </h2>
            <ProjectGallery
              items={gallery}
              previousLabel={tDetail("galleryPrevious")}
              nextLabel={tDetail("galleryNext")}
            />
          </section>
        )}

        {/* You may also like */}
        {relatedProjects.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-text-primary text-3xl font-bold ltr:tracking-tight">
                {tDetail("youMayAlsoLike")}
              </h2>
              <Link
                href="/projects"
                className="border-accent/60 text-text-primary hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
              >
                {tDetail("viewAll")}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((related) => (
                <ProjectTallCard
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
          <section className="mt-20">
            <h2 className="text-text-primary mb-6 text-3xl font-bold ltr:tracking-tight">
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

        {/* Find out about new games/apps: the Panda Radar Telegram bot. */}
        <div className="mt-20">
          <ProjectNewsSignup
            title={tDetail(kind === "Game" ? "newsGame" : "newsApp")}
            text={tDetail("newsText")}
            buttonLabel={tDetail("newsButton")}
            botUrl={site.newsBot.url}
            imageAlt={tDetail("newsAlt")}
            opensInNewTab={tDetail("opensInNewTab")}
          />
        </div>

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
    </div>
  );
}
