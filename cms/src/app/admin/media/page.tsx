import { listMediaLibrary } from "@/lib/queries/media";
import {
  MEDIA_TYPE_FILTER_OPTIONS,
  type MediaTypeFilter,
} from "@/lib/validation/media.schema";
import MediaCard from "@/components/admin/media/MediaCard";
import MediaLibraryUploadPanel from "@/components/admin/media/MediaLibraryUploadPanel";
import MediaToolbar from "@/components/admin/media/MediaToolbar";

export const metadata = { title: "Media Library" };

function parseTypeFilter(value: string | undefined): MediaTypeFilter {
  return (MEDIA_TYPE_FILTER_OPTIONS as readonly string[]).includes(value ?? "")
    ? (value as MediaTypeFilter)
    : "ALL";
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; success?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const type = parseTypeFilter(params.type);

  const items = await listMediaLibrary({ search, type });
  const hasActiveFilters = search.length > 0 || type !== "ALL";

  return (
    <div className="space-y-6">
      {params.success === "deleted" ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          Media deleted.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Media Library
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {items.length} {items.length === 1 ? "item" : "items"}
            {hasActiveFilters ? " matching your filters" : " stored locally"}.
          </p>
        </div>
        <MediaLibraryUploadPanel />
      </div>

      <MediaToolbar search={search} type={type} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {hasActiveFilters
            ? "No media matches your filters."
            : "No media uploaded yet. Use “Upload media” to add an image, video, or PDF."}
        </p>
      )}
    </div>
  );
}
