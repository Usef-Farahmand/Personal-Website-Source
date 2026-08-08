import { getTranslations } from "next-intl/server";
import { listArticles } from "@/services/content/articles.service";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { FilterableListSection } from "@/components/sections/FilterableListSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { deriveFacetOptions } from "@/lib/listFilters";
import type { ListToolbarItem } from "@/components/sections/ListToolbar";
import type { FilterFacet } from "@/components/ui/FilterPanel";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "articles",
  });
  return { title: t("title") };
}

type ArticleSort = "newest" | "oldest" | "titleAsc" | "titleDesc";

const FACET_KEYS = ["category", "tag"] as const;

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allArticles = listArticles(locale);
  const [t, tPlatform, tToolbar] = await Promise.all([
    getTranslations({ locale, namespace: "articles" }),
    getTranslations({ locale, namespace: "articleSourcePlatform" }),
    getTranslations({ locale, namespace: "listToolbar" }),
  ]);

  const CATEGORY_LABEL: Record<string, string> = {
    "software-engineering": "Software Engineering",
    ai: "AI",
    "web-development": "Web Development",
    mobile: "Mobile",
    "game-development": "Game Development",
    "product-development": "Product Development",
    design: "Design",
    "personal-journey": "Personal Journey",
  };

  const facets: FilterFacet[] = [
    {
      key: "category",
      label: t("filters.category"),
      options: deriveFacetOptions(allArticles, (a) => a.category).map(
        (value) => ({ value, label: CATEGORY_LABEL[value] ?? value })
      ),
    },
    {
      key: "tag",
      label: t("filters.tag"),
      options: deriveFacetOptions(allArticles, (a) => a.tags).map(
        (value) => ({ value, label: value })
      ),
    },
  ];

  const items: ListToolbarItem[] = allArticles.map((article) => ({
    key: article.id,
    searchable: [
      article.title,
      article.summary,
      ...article.tags,
      CATEGORY_LABEL[article.category] ?? article.category,
    ],
    facetValues: {
      category: [article.category],
      tag: article.tags,
    },
    sortValues: {
      newest: article.publishedDate,
      oldest: article.publishedDate,
      titleAsc: article.title,
      titleDesc: article.title,
    },
  }));

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "titleAsc", label: t("sort.titleAsc") },
    { value: "titleDesc", label: t("sort.titleDesc") },
  ];

  // Newest first is the most useful default for an articles feed — same
  // reasoning as any blog/publication index. Only "newest" needs to flip
  // the underlying string compare to descending; the title sorts are
  // already ascending/descending per their own labels.
  const DESCENDING_SORT_KEYS = ["newest"] as const;

  const facetLabels: Record<string, string> = {};
  for (const facet of facets) {
    for (const option of facet.options) {
      facetLabels[`${facet.key}:${option.value}`] = option.label;
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

      <FilterableListSection<ArticleSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="newest"
        descendingSortKeys={DESCENDING_SORT_KEYS}
        resultCountNamespace="articles"
        facetLabels={facetLabels}
        labels={{
          searchLabel: t("searchLabel"),
          searchPlaceholder: t("searchPlaceholder"),
          sortLabel: t("sortLabel"),
          filtersLabel: tToolbar("filtersLabel"),
          openFilters: tToolbar("openFilters"),
          closeFilters: tToolbar("closeFilters"),
          clearSearch: tToolbar("clearSearch"),
          clearAll: tToolbar("clearAll"),
          applyFilters: tToolbar("applyFilters"),
          emptyTitle: t("emptyTitle"),
          emptyAction: t("emptyAction"),
        }}
      >
        {allArticles.map((article) => {
          const platformLabel = tPlatform(article.sourcePlatform);
          return (
            <div key={article.id} data-list-key={article.id}>
              <ArticleCard
                article={article}
                locale={locale}
                platformLabel={platformLabel}
                readMoreLabel={t("readMore", { platform: platformLabel })}
                readingTimeLabel={t("readingTime", {
                  minutes: article.readingTimeMinutes,
                })}
              />
            </div>
          );
        })}
      </FilterableListSection>
    </div>
  );
}
