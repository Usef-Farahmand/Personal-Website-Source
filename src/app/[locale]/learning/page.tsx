import { getTranslations } from "next-intl/server";
import { listLearning } from "@/services/content/learning.service";
import { LearningCard } from "@/components/ui/LearningCard";
import { FilterableListSection } from "@/components/sections/FilterableListSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { deriveFacetOptions } from "@/lib/listFilters";
import { buildAlternates } from "@/lib/seo";
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
    namespace: "learning",
  });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, "/learning"),
  };
}

type LearningSort = "newest" | "oldest" | "titleAsc" | "titleDesc";

const FACET_KEYS = ["tag"] as const;

// Newest first is the natural default for a dated learning log.
const DESCENDING_SORT_KEYS = ["newest"] as const;

export default async function LearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allEntries = listLearning(locale);
  const [t, tToolbar] = await Promise.all([
    getTranslations({ locale, namespace: "learning" }),
    getTranslations({ locale, namespace: "listToolbar" }),
  ]);

  const facets: FilterFacet[] = [
    {
      key: "tag",
      label: t("filters.tag"),
      options: deriveFacetOptions(allEntries, (e) => e.tags).map((value) => ({
        value,
        label: value,
      })),
    },
  ];

  const items: ListToolbarItem[] = allEntries.map((entry) => ({
    key: entry.id,
    searchable: [entry.title, entry.summary, ...entry.tags],
    facetValues: { tag: entry.tags },
    sortValues: {
      newest: entry.date,
      oldest: entry.date,
      titleAsc: entry.title,
      titleDesc: entry.title,
    },
  }));

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "titleAsc", label: t("sort.titleAsc") },
    { value: "titleDesc", label: t("sort.titleDesc") },
  ];

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

      <FilterableListSection<LearningSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="newest"
        descendingSortKeys={DESCENDING_SORT_KEYS}
        resultCountNamespace="learning"
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
        {allEntries.map((entry) => (
          <div key={entry.id} data-list-key={entry.id}>
            <LearningCard
              entry={entry}
              locale={locale}
              codeLabel={t("hasCode")}
            />
          </div>
        ))}
      </FilterableListSection>
    </div>
  );
}
