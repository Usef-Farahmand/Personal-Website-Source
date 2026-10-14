import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Code } from "lucide-react";
import {
  getLearningBySlug,
  listLearning,
} from "@/services/content/learning.service";
import { getProjectsByIds } from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import { formatFullDate } from "@/lib/date";
import { toPublicSrc } from "@/lib/publicPath";
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
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { LearningContent } from "@/components/ui/LearningContent";
import { ExternalLinksList } from "@/components/ui/ExternalLinksList";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { RevealGroup } from "@/components/ui/RevealGroup";
import type { Locale } from "@/types/content";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  return listLearning(locale).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const entry = getLearningBySlug(slug, locale);
  if (!entry) return {};
  const site = getSiteContent(locale);
  return buildPageMetadata({
    locale,
    path: `/learning/${entry.slug}`,
    title: entry.title,
    description: entry.summary,
    siteName: site.hero.name,
    image: entry.imageUrl ? toPublicSrc(entry.imageUrl) : undefined,
    article: {
      publishedTime: entry.date,
      authors: [site.hero.name],
      tags: entry.tags,
    },
  });
}

export default async function LearningDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const entry = getLearningBySlug(slug, locale);

  if (!entry) {
    notFound();
  }

  const [t, tArticles, tArticlePlatform, tBreadcrumb] = await Promise.all([
    getTranslations({ locale, namespace: "learning" }),
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
    getTranslations({ locale, namespace: "breadcrumb" }),
  ]);

  const relatedProjects = getProjectsByIds(entry.relatedProjectIds, locale);
  const relatedArticles = getArticlesByIds(entry.relatedArticleIds, locale);
  const snippets = entry.codeSnippets ?? [];
  const hasCodeSection = snippets.length > 0 || Boolean(entry.sourceCodeUrl);

  // TechArticle rather than a bare CreativeWork: these are first-party
  // write-ups hosted on this site (unlike Articles, which link out), so
  // answer engines can cite them as authored articles by the Person.
  const entryUrl = absoluteUrl(locale, `/learning/${entry.slug}`);
  const breadcrumbLd = buildBreadcrumbLd(locale, tBreadcrumb("home"), [
    { name: t("title"), path: "/learning" },
    { name: entry.title, path: `/learning/${entry.slug}` },
  ]);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${entryUrl}#article`,
    headline: entry.title,
    description: entry.summary,
    url: entryUrl,
    mainEntityOfPage: entryUrl,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    author: personRef,
    publisher: personRef,
    datePublished: entry.date,
    ...(entry.imageUrl && {
      image: absoluteAsset(toPublicSrc(entry.imageUrl)),
    }),
    keywords: entry.tags.join(", "),
    ...(entry.sourceCodeUrl && {
      isBasedOn: entry.sourceCodeUrl,
    }),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={articleLd} />
      <Breadcrumb
        locale={locale}
        items={[
          { label: t("title"), href: "/learning" },
          { label: entry.title },
        ]}
      />

      <header className="mb-8">
        <p className="text-small text-text-secondary">
          <time dateTime={entry.date}>
            {formatFullDate(entry.date, locale)}
          </time>
        </p>
        <h1 className="text-h1 text-text-primary mt-2 font-semibold">
          {entry.title}
        </h1>
        <p className="text-body text-text-secondary mt-3">{entry.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <li
              key={tag}
              className="bg-surface text-caption text-text-secondary rounded-md px-2 py-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <div className="bg-surface border-border relative mb-10 aspect-video overflow-hidden rounded-lg border">
        {entry.imageUrl ? (
          <Image
            src={toPublicSrc(entry.imageUrl)}
            alt={entry.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={64} className="opacity-30" />
          </div>
        )}
      </div>

      <article className="flex flex-col gap-14">
        <LearningContent blocks={entry.content} />

        {hasCodeSection && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {t("sourceCode")}
            </h2>
            <div className="flex flex-col gap-4">
              {snippets.map((snippet, index) => (
                <CodeBlock
                  key={`${snippet.filename ?? snippet.language}-${index}`}
                  snippet={snippet}
                  copyLabel={t("copyCode")}
                  copiedLabel={t("copied")}
                />
              ))}
              {entry.sourceCodeUrl && (
                <a
                  href={entry.sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-surface text-small text-text-primary hover:border-accent/50 hover:text-accent inline-flex w-fit items-center gap-2 rounded-md border px-4 py-2 font-medium transition-colors"
                >
                  <Code className="h-4 w-4" aria-hidden="true" />
                  {t("viewSource")}
                  <span className="sr-only">{t("opensInNewTab")}</span>
                </a>
              )}
            </div>
          </section>
        )}

        {entry.externalLinks && entry.externalLinks.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {t("externalLinks")}
            </h2>
            <RevealGroup>
              <ExternalLinksList links={entry.externalLinks} />
            </RevealGroup>
          </section>
        )}

        {relatedProjects.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {t("relatedProjects")}
            </h2>
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                />
              ))}
            </RevealGroup>
          </section>
        )}

        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {t("relatedArticles")}
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
          href="/learning"
          className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {t("backToLearning")}
        </Link>
      </div>
    </div>
  );
}
