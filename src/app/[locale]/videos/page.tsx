import { getTranslations } from "next-intl/server";
import {
  getVideoPlatforms,
  listVideos,
  VIDEO_PLATFORMS,
} from "@/services/content/videos.service";
import { VideoCard } from "@/components/ui/VideoCard";
import { FilterableListSection } from "@/components/sections/FilterableListSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { SocialBanner } from "@/components/sections/SocialBanner";
import { deriveFacetOptions } from "@/lib/listFilters";
import { buildPageMetadata } from "@/lib/seo";
import { buildCollectionLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/services/content/site.service";
import type { ListToolbarItem } from "@/components/sections/ListToolbar";
import type { FilterFacet } from "@/components/ui/FilterPanel";
import type { Locale, VideoPlatform } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.videos" });
  return buildPageMetadata({
    locale,
    path: "/videos",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

type VideoSort = "newest" | "oldest" | "titleAsc" | "titleDesc";

const FACET_KEYS = ["platform", "format", "tag"] as const;

/** Newest first by default; only "newest" flips the string compare. */
const DESCENDING_SORT_KEYS = ["newest"] as const;

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const allVideos = listVideos(locale);
  const [t, tToolbar] = await Promise.all([
    getTranslations({ locale, namespace: "videos" }),
    getTranslations({ locale, namespace: "listToolbar" }),
  ]);

  const platformLabels = Object.fromEntries(
    VIDEO_PLATFORMS.map((platform) => [platform, t(`platform.${platform}`)])
  ) as Record<VideoPlatform, string>;
  const watchLabels = Object.fromEntries(
    VIDEO_PLATFORMS.map((platform) => [
      platform,
      t("watchOn", { platform: platformLabels[platform] }),
    ])
  ) as Record<VideoPlatform, string>;

  const facets: FilterFacet[] = [
    {
      key: "platform",
      label: t("filters.platform"),
      options: deriveFacetOptions(allVideos, getVideoPlatforms).map(
        (value) => ({ value, label: platformLabels[value as VideoPlatform] })
      ),
    },
    {
      key: "format",
      label: t("filters.format"),
      options: deriveFacetOptions(allVideos, (v) => v.format).map((value) => ({
        value,
        label: t(`format.${value}`),
      })),
    },
    {
      key: "tag",
      label: t("filters.tag"),
      options: deriveFacetOptions(allVideos, (v) => v.tags).map((value) => ({
        value,
        label: value,
      })),
    },
  ].filter((facet) => facet.options.length > 0);

  const items: ListToolbarItem[] = allVideos.map((video) => ({
    key: video.id,
    searchable: [
      video.title,
      ...video.tags,
      ...getVideoPlatforms(video).map((platform) => platformLabels[platform]),
    ],
    facetValues: {
      platform: getVideoPlatforms(video),
      format: [video.format],
      tag: video.tags,
    },
    sortValues: {
      newest: video.publishedDate,
      oldest: video.publishedDate,
      titleAsc: video.title,
      titleDesc: video.title,
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

  const collectionLd = buildCollectionLd({
    locale,
    path: "/videos",
    name: t("title"),
    description: t("intro"),
    items: allVideos.map((video) => ({
      name: video.title,
      url: video.links[getVideoPlatforms(video)[0]] ?? "",
    })),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <JsonLd data={collectionLd} />

      <PageHeader path="/videos" title={t("title")} intro={t("intro")} />

      <SocialBanner locale={locale} />

      <FilterableListSection<VideoSort>
        items={items}
        facets={facets}
        facetKeys={FACET_KEYS}
        sortOptions={sortOptions}
        defaultSort="newest"
        descendingSortKeys={DESCENDING_SORT_KEYS}
        resultCountNamespace="videos"
        facetLabels={facetLabels}
        gridClassName="lg:grid-cols-3"
        // Each cell holds one tall Short or two regular videos stacked.
        tallKeys={allVideos
          .filter((video) => video.format === "short")
          .map((video) => video.id)}
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
        {allVideos.map((video) => (
          <div key={video.id} data-list-key={video.id} className="h-full">
            <VideoCard
              video={video}
              locale={locale}
              formatLabel={t(`format.${video.format}`)}
              platformLabels={platformLabels}
              watchLabels={watchLabels}
              opensInNewTab={t("opensInNewTab")}
            />
          </div>
        ))}
      </FilterableListSection>
    </div>
  );
}
