import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { ProjectNewsSignup } from "@/components/sections/ProjectNewsSignup";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { formatFullDate } from "@/lib/date";
import { buildCollectionLd, absoluteUrl } from "@/lib/structured-data";
import { getSiteContent } from "@/services/content/site.service";
import {
  blogCategories,
  listBlogPosts,
  popularTags,
  type BlogPost,
} from "@/services/content/blog.service";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  return buildPageMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

const PAGE_SIZE = 5;

/** Query string for a blog list URL, keeping only the values that are set. */
function blogHref(query: { category?: string; tag?: string; page?: number }) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.tag) params.set("tag", query.tag);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

/**
 * Articles, learning notes and videos in one newest-first list (see
 * blog.service.ts), in the reference blog layout: big post cards in the
 * main column and a sidebar with Categories and Popular tags that stays in
 * view while the list scrolls. Filtering and paging are plain links
 * (?category= / ?tag= / ?page=), so every view is shareable and works
 * without JavaScript.
 */
export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const query = await searchParams;
  const [t, tPlatform, tDetail] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
    getTranslations({ locale, namespace: "projectDetail" }),
  ]);

  const allPosts = listBlogPosts(locale);
  const categories = blogCategories(allPosts);
  const tags = popularTags(allPosts);
  const categoryLabel = (key: string) =>
    t.has(`category.${key}`) ? t(`category.${key}`) : key;

  const filtered = allPosts.filter(
    (post) =>
      (!query.category || post.category === query.category) &&
      (!query.tag || post.tags.includes(query.tag))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1)
  );
  const posts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const platformName = (post: BlogPost) =>
    post.kind === "video"
      ? post.platform === "instagram"
        ? "Instagram"
        : "YouTube"
      : post.platform
        ? tPlatform(post.platform)
        : "";

  const metaLine = (post: BlogPost) =>
    [
      formatFullDate(post.date, locale),
      post.readingMinutes
        ? new Intl.NumberFormat(locale, {
            style: "unit",
            unit: "minute",
            unitDisplay: "short",
          }).format(post.readingMinutes)
        : null,
      post.external ? platformName(post) : null,
    ]
      .filter(Boolean)
      .join(" · ");

  const actionLabel = (post: BlogPost) =>
    post.kind === "video"
      ? t("watchVideo")
      : post.external
        ? t("readOn", { platform: platformName(post) })
        : t("readMore");

  const activeFilter = query.category
    ? categoryLabel(query.category)
    : query.tag
      ? `#${query.tag}`
      : null;

  const collectionLd = buildCollectionLd({
    locale,
    path: "/blog",
    name: t("title"),
    description: t("intro"),
    items: allPosts.map((post) => ({
      name: post.title,
      url: post.external ? post.href : absoluteUrl(locale, post.href),
      description: post.excerpt,
    })),
  });

  const filters = (
    <>
      <section className="border-border bg-surface/60 rounded-2xl border p-6">
        <h2 className="text-text-primary mb-4 text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
          {t("categories")}
        </h2>
        <ul className="flex flex-col">
          <li>
            <Link
              href="/blog"
              className={cn(
                "flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                !query.category && !query.tag
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t("allPosts")}
              <span className="text-xs">{allPosts.length}</span>
            </Link>
          </li>
          {categories.map(({ key, count }) => (
            <li key={key}>
              <Link
                href={blogHref({ category: key })}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  query.category === key
                    ? "text-accent font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {categoryLabel(key)}
                <span className="text-xs">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {tags.length > 0 && (
        <section className="border-border bg-surface/60 rounded-2xl border p-6">
          <h2 className="text-text-primary mb-4 text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
            {t("popularTags")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={blogHref({ tag })}
                  className={cn(
                    "inline-block rounded-md border px-2.5 py-1 text-xs transition-colors",
                    query.tag === tag
                      ? "border-accent bg-accent/15 text-text-primary"
                      : "border-border text-text-secondary hover:border-accent/60 hover:text-text-primary"
                  )}
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={collectionLd} />
      <PageHeader path="/blog" title={t("title")} intro={t("intro")} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-14">
          {/* Phones: the same filters, folded, above everything else. */}
          <details className="group border-border bg-surface/60 -mb-6 rounded-2xl border lg:hidden">
            <summary className="text-text-primary flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t("filterPosts")}
              </span>
              <ChevronDown
                className="h-4 w-4 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="flex flex-col gap-4 px-3 pb-3">{filters}</div>
          </details>

          {activeFilter && (
            <div className="border-border bg-surface/60 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm">
              <span className="text-text-secondary">
                {t("showing")}:{" "}
                <strong className="text-text-primary">{activeFilter}</strong>
              </span>
              <Link
                href="/blog"
                className="text-accent hover:text-accent-hover inline-flex items-center gap-1 font-medium"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {t("clearFilter")}
              </Link>
            </div>
          )}

          {posts.length === 0 ? (
            <p className="text-text-secondary py-16 text-center">
              {t("emptyTitle")}
            </p>
          ) : (
            posts.map((post, index) => (
              <BlogPostCard
                key={post.id}
                post={post}
                categoryLabel={categoryLabel(post.category)}
                metaLine={metaLine(post)}
                actionLabel={actionLabel(post)}
                priority={index === 0}
              />
            ))
          )}

          {totalPages > 1 && (
            <nav
              aria-label={t("pageOf", { page, total: totalPages })}
              className="border-border flex items-center justify-between gap-4 border-t pt-8 text-sm"
            >
              {page > 1 ? (
                <Link
                  href={blogHref({ ...query, page: page - 1 })}
                  className="text-text-primary hover:text-accent inline-flex items-center gap-1.5 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
                  {t("previousPage")}
                </Link>
              ) : (
                <span />
              )}
              <span className="text-text-secondary">
                {t("pageOf", { page, total: totalPages })}
              </span>
              {page < totalPages ? (
                <Link
                  href={blogHref({ ...query, page: page + 1 })}
                  className="text-text-primary hover:text-accent inline-flex items-center gap-1.5 font-semibold"
                >
                  {t("nextPage")}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        {/* Sidebar: always in view while the posts scroll (desktop). */}
        <aside className="hidden flex-col gap-6 self-start lg:sticky lg:top-24 lg:flex">
          {filters}
        </aside>
      </div>

      {/* New posts first: the Panda Radar bot. */}
      <div className="mt-24">
        <ProjectNewsSignup
          title={t("newsTitle")}
          text={t("newsText")}
          buttonLabel={tDetail("newsButton")}
          botUrl={getSiteContent(locale).newsBot.url}
          imageAlt={tDetail("newsAlt")}
          opensInNewTab={tDetail("opensInNewTab")}
        />
      </div>
    </div>
  );
}
