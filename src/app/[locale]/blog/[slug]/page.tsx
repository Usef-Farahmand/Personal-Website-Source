import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, Code } from "lucide-react";
import {
  getLearningBySlug,
  listLearning,
} from "@/services/content/learning.service";
import { getProjectsByIds } from "@/services/content/projects.service";
import { getArticlesByIds } from "@/services/content/articles.service";
import {
  listBlogPosts,
  NOTE_CATEGORY,
  type BlogPost,
} from "@/services/content/blog.service";
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
    path: `/blog/${entry.slug}`,
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

  const [t, tArticles, tArticlePlatform, tBreadcrumb, tBlog] =
    await Promise.all([
      getTranslations({ locale, namespace: "learning" }),
      getTranslations({ locale, namespace: "articles" }),
      getTranslations({ locale, namespace: "articleSourcePlatform" }),
      getTranslations({ locale, namespace: "breadcrumb" }),
      getTranslations({ locale, namespace: "blog" }),
    ]);

  const relatedProjects = getProjectsByIds(entry.relatedProjectIds, locale);
  const relatedArticles = getArticlesByIds(entry.relatedArticleIds, locale);
  const snippets = entry.codeSnippets ?? [];
  const hasCodeSection = snippets.length > 0 || Boolean(entry.sourceCodeUrl);

  // TechArticle rather than a bare CreativeWork: these are first-party
  // write-ups hosted on this site (unlike Articles, which link out), so
  // answer engines can cite them as authored articles by the Person.
  const entryUrl = absoluteUrl(locale, `/blog/${entry.slug}`);
  const breadcrumbLd = buildBreadcrumbLd(locale, tBreadcrumb("home"), [
    { name: tBlog("title"), path: "/blog" },
    { name: entry.title, path: `/blog/${entry.slug}` },
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

  // Previous/next follow the blog's own newest-first order, across every
  // kind of post.
  const blogPosts = listBlogPosts(locale);
  const position = blogPosts.findIndex((post) => post.id === entry.id);
  const olderPost = position >= 0 ? blogPosts[position + 1] : undefined;
  const newerPost = position > 0 ? blogPosts[position - 1] : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={articleLd} />
      <Breadcrumb
        locale={locale}
        items={[
          { label: tBlog("title"), href: "/blog" },
          { label: entry.title },
        ]}
      />

      {/* Header: category and date, then the big title. */}
      <header className="mb-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={"/blog?category=" + NOTE_CATEGORY}
            className="bg-accent text-background rounded-full px-3 py-1 text-xs font-bold ltr:tracking-wider ltr:uppercase"
          >
            {tBlog("category." + NOTE_CATEGORY)}
          </Link>
          <time
            dateTime={entry.date}
            className="text-text-secondary text-xs font-medium ltr:tracking-wider ltr:uppercase"
          >
            {formatFullDate(entry.date, locale)}
          </time>
        </div>
        <h1 className="text-text-primary mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-bold ltr:tracking-tight">
          {entry.title}
        </h1>
        <p className="text-text-secondary mt-5 text-lg leading-relaxed">
          {entry.summary}
        </p>
      </header>

      {/* Full-width image, then the text in a narrower reading column. */}
      <div className="bg-surface border-border relative mb-14 aspect-[16/8] overflow-hidden rounded-2xl border">
        {entry.imageUrl ? (
          <Image
            src={toPublicSrc(entry.imageUrl)}
            alt={entry.title}
            fill
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BrandLogo size={64} className="opacity-30" />
          </div>
        )}
      </div>

      <article className="mx-auto flex max-w-3xl flex-col gap-14">
        <LearningContent blocks={entry.content} />

        {hasCodeSection && (
          <section>
            <h2 className="text-h4 text-text-primary mb-4 font-semibold">
              {t("sourceCode")}
            </h2>
            <div className="flex flex-col gap-4">
              {snippets.map((snippet, index) => (
                <CodeBlock
                  key={(snippet.filename ?? snippet.language) + index}
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

        {/* Tags, each opening the blog filtered by it. */}
        {entry.tags.length > 0 && (
          <div className="border-border flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-text-primary me-1 text-sm font-semibold">
              {tBlog("tags")}:
            </span>
            {entry.tags.map((tag) => (
              <Link
                key={tag}
                href={"/blog?tag=" + encodeURIComponent(tag)}
                className="border-border text-text-secondary hover:border-accent/60 hover:text-text-primary rounded-md border px-2.5 py-1 text-xs transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Previous / next post */}
        {(olderPost || newerPost) && (
          <nav className="grid gap-4 sm:grid-cols-2">
            {[
              { post: olderPost, label: tBlog("previousPost"), end: false },
              { post: newerPost, label: tBlog("nextPost"), end: true },
            ].map(({ post, label, end }) =>
              post ? (
                <PostNavLink key={label} post={post} label={label} end={end} />
              ) : (
                <span key={label} />
              )
            )}
          </nav>
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

      <div className="border-border mx-auto mt-14 max-w-3xl border-t pt-8">
        <Link
          href="/blog"
          className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {tBlog("backToBlog")}
        </Link>
      </div>
    </div>
  );
}

/** Previous/next card: notes open here, articles and videos on their site. */
function PostNavLink({
  post,
  label,
  end,
}: {
  post: BlogPost;
  label: string;
  end: boolean;
}) {
  const className =
    "border-border bg-surface/60 hover:border-accent/60 group flex flex-col gap-2 rounded-xl border p-5 transition-colors" +
    (end ? " sm:items-end sm:text-end" : "");
  const content = (
    <>
      <span className="text-accent inline-flex items-center gap-1 text-xs font-bold ltr:tracking-[0.15em] ltr:uppercase">
        {!end && <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" />}
        {label}
        {end && <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />}
      </span>
      <span className="text-text-primary group-hover:text-accent line-clamp-2 font-semibold transition-colors">
        {post.title}
      </span>
    </>
  );
  return post.external ? (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link href={post.href} className={className}>
      {content}
    </Link>
  );
}
