import { getTranslations } from "next-intl/server";
import {
  listProjects,
  STATUS_PRIORITY,
} from "@/services/content/projects.service";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectTallCard } from "@/components/ui/ProjectTallCard";
import { ProjectFeatureCard } from "@/components/ui/ProjectFeatureCard";
import { AutoRotator } from "@/components/ui/AutoRotator";
import { ProjectNewsSignup } from "@/components/sections/ProjectNewsSignup";
import { storeKeysForProject } from "@/services/content/store-stats.service";
import { FilterableListSection } from "@/components/sections/FilterableListSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { deriveFacetOptions } from "@/lib/listFilters";
import { buildPageMetadata } from "@/lib/seo";
import { buildCollectionLd, absoluteUrl } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/services/content/site.service";
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
  const t = await getTranslations({ locale, namespace: "seo.projects" });
  return buildPageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

/** "STAFF PICKS | FEATURED" — the eyebrow runs vertically beside the
 *  heading in English, and sits above it in Persian. */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2 ltr:flex-row ltr:items-end ltr:gap-4">
      <span className="text-accent text-xs font-bold ltr:rotate-180 ltr:tracking-[0.2em] ltr:uppercase ltr:[writing-mode:vertical-rl]">
        {eyebrow}
      </span>
      <h2 className="text-text-primary text-4xl leading-none font-bold sm:text-5xl ltr:tracking-tight ltr:uppercase">
        {title}
      </h2>
    </div>
  );
}

type ProjectSort = "newest" | "oldest" | "featured" | "titleAsc" | "titleDesc";

const FACET_KEYS = [
  "technology",
  "category",
  "platform",
  "store",
  "status",
] as const;

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const projects = listProjects(locale);

  // The slideshow shows only released work picked as featured.
  const featured = projects.filter(
    (project) => project.featured && project.status === "shipped"
  );
  const [t, tCategory, tPlatform, tStatus, tToolbar, tDetail] =
    await Promise.all([
      getTranslations({ locale, namespace: "projectsIndex" }),
      getTranslations({ locale, namespace: "projectCategory" }),
      getTranslations({ locale, namespace: "projectPlatform" }),
      getTranslations({ locale, namespace: "projectStatus" }),
      getTranslations({ locale, namespace: "listToolbar" }),
      getTranslations({ locale, namespace: "projectDetail" }),
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
      options: deriveFacetOptions(projects, (p) => p.category).map((value) => ({
        value,
        label: tCategory(value),
      })),
    },
    {
      key: "platform",
      label: t("filters.platform"),
      options: deriveFacetOptions(projects, (p) => p.platforms).map(
        (value) => ({ value, label: tPlatform(value) })
      ),
    },
    {
      key: "store",
      label: t("filters.store"),
      options: deriveFacetOptions(projects, (p) => storeKeysForProject(p)).map(
        (value) => ({ value, label: tDetail(value) })
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
      store: storeKeysForProject(project),
      status: [project.status],
    },
    sortValues: {
      // Composite string, not a plain date: status takes priority
      // (active > shipped > paused > archived), then newest date within
      // the same status. Status priority is inverted (3 - priority) so
      // that "active" produces the highest leading digit — since
      // "newest" sorts descending (DESCENDING_SORT_KEYS below), a plain
      // ascending priority would put active LAST, not first. Encoded as
      // data since ListToolbar (a Client Component) can only receive
      // plain, serializable prop values, not a comparator function.
      newest: `${3 - STATUS_PRIORITY[project.status]}-${project.startDate}`,
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

  // Newest first is the most useful default for visitors browsing
  // without a specific query — same reasoning as the Articles index.
  // "newest"/"featured" sort descending (most recent / most-featured
  // first); title sorts are ascending/descending as their own labels
  // already say, so only "newest" and "featured" need to flip the
  // underlying string compare.
  const DESCENDING_SORT_KEYS = ["newest", "featured"] as const;

  const facetLabels: Record<string, string> = {};
  for (const facet of facets) {
    for (const option of facet.options) {
      facetLabels[`${facet.key}:${option.value}`] = option.label;
    }
  }

  const collectionLd = buildCollectionLd({
    locale,
    path: "/projects",
    name: t("title"),
    description: t("intro"),
    items: projects.map((p) => ({
      name: p.title,
      url: absoluteUrl(locale, `/projects/${p.slug}`),
      description: p.summary,
    })),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={collectionLd} />

      <PageHeader path="/projects" title={t("title")} intro={t("intro")} />

      {/* Staff picks: the featured projects as wide slides. */}
      {featured.length > 0 && (
        <section className="mb-20">
          <SectionTitle eyebrow={t("staffPicks")} title={t("featured")} />
          <AutoRotator
            label={t("featured")}
            slideLabel={t("slideOf", { index: "{index}", total: "{total}" })}
          >
            {featured.map((project) => (
              <ProjectFeatureCard
                key={project.id}
                project={project}
                locale={locale}
              />
            ))}
          </AutoRotator>
        </section>
      )}

      <SectionTitle eyebrow={t("explore")} title={t("allProjects")} />

      <FilterableListSection<ProjectSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="newest"
        descendingSortKeys={DESCENDING_SORT_KEYS}
        resultCountNamespace="projectsIndex"
        facetLabels={facetLabels}
        // Four rows per page: 3 cards a row, or 6 icons a row on desktop.
        pagination={{
          pageSize: { grid: 12, icons: 24 },
          // Phones: four cards (one column), or four rows of icons.
          mobilePageSize: { grid: 4, icons: 12 },
          previous: t("previousPage"),
          next: t("nextPage"),
          pageOf: t("pageOf", { page: "{page}", total: "{total}" }),
        }}
        views={{
          storageKey: "projects-view",
          default: "grid",
          label: t("views.label"),
          labels: {
            grid: t("views.grid"),
            icons: t("views.icons"),
          },
        }}
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
            {/* "Cards" view is the portrait card; the wide-row and icon
                views restyle ProjectCard (see FilterableGrid). */}
            <div className="group-data-[view=grid]/list:hidden">
              <ProjectCard project={project} locale={locale} />
            </div>
            <div className="hidden group-data-[view=grid]/list:block">
              <ProjectTallCard project={project} locale={locale} />
            </div>
          </div>
        ))}
      </FilterableListSection>

      {/* Find out about new games and apps: the Panda Radar bot. */}
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
