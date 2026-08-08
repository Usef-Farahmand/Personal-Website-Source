import { getTranslations } from "next-intl/server";
import { listProjects } from "@/services/content/projects.service";
import { ProjectCard } from "@/components/ui/ProjectCard";
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
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "projectsIndex" });
  return { title: t("title") };
}

type ProjectSort = "newest" | "oldest" | "featured" | "titleAsc" | "titleDesc";

const FACET_KEYS = ["technology", "category", "platform", "status"] as const;

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const projects = listProjects(locale);

  const [t, tCategory, tPlatform, tStatus, tToolbar] = await Promise.all([
    getTranslations({ locale, namespace: "projectsIndex" }),
    getTranslations({ locale, namespace: "projectCategory" }),
    getTranslations({ locale, namespace: "projectPlatform" }),
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "listToolbar" }),
  ]);

  // Data-driven: every filter option below is derived from what's
  // actually present in `projects`, never hardcoded. A technology/
  // category/platform/status that no project currently has simply
  // won't produce a checkbox.
  const facets: FilterFacet[] = [
    {
      key: "technology",
      label: t("filters.technology"),
      options: deriveFacetOptions(projects, (p) => p.technologies).map(
        (value) => ({ value, label: value })
      ),
    },
    {
      key: "category",
      label: t("filters.category"),
      options: deriveFacetOptions(projects, (p) => p.category).map(
        (value) => ({ value, label: tCategory(value) })
      ),
    },
    {
      key: "platform",
      label: t("filters.platform"),
      options: deriveFacetOptions(projects, (p) => p.platforms).map(
        (value) => ({ value, label: tPlatform(value) })
      ),
    },
    {
      key: "status",
      label: t("filters.status"),
      options: deriveFacetOptions(projects, (p) => p.status).map((value) => ({
        value,
        label: tStatus(value),
      })),
    },
  ];

  const items: ListToolbarItem[] = projects.map((project) => ({
    key: project.id,
    searchable: [
      project.title,
      project.summary,
      ...project.technologies,
      tCategory(project.category),
    ],
    facetValues: {
      technology: project.technologies,
      category: [project.category],
      platform: project.platforms,
      status: [project.status],
    },
    sortValues: {
      newest: project.startDate,
      oldest: project.startDate,
      titleAsc: project.title,
      titleDesc: project.title,
      // Composite, zero-padded string so plain string comparison sorts
      // featured projects first, then by authored `order` within each
      // group — encoded as data here since ListToolbar (a Client
      // Component) can only receive plain, serializable prop values,
      // not a comparator function.
      featured: `${project.featured ? 0 : 1}-${String(project.order).padStart(6, "0")}`,
    },
  }));

  const sortOptions = [
    { value: "newest", label: t("sort.newest") },
    { value: "oldest", label: t("sort.oldest") },
    { value: "featured", label: t("sort.featured") },
    { value: "titleAsc", label: t("sort.titleAsc") },
    { value: "titleDesc", label: t("sort.titleDesc") },
  ];

  // "Featured" is the most useful default for visitors browsing without
  // a specific query — it surfaces the strongest work first, same intent
  // as the homepage's Featured Work section. "newest"/"featured" sort
  // descending (most recent / most-featured first); title sorts are
  // ascending/descending as their own labels already say, so only
  // "newest" and "featured" need to flip the underlying string compare.
  const DESCENDING_SORT_KEYS = ["newest", "featured"] as const;

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

      <FilterableListSection<ProjectSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="featured"
        descendingSortKeys={DESCENDING_SORT_KEYS}
        resultCountNamespace="projectsIndex"
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
        {projects.map((project) => (
          <div key={project.id} data-list-key={project.id}>
            <ProjectCard project={project} locale={locale} />
          </div>
        ))}
      </FilterableListSection>
    </div>
  );
}
