import Link from "next/link";
import {
  MEDIA_TYPE_FILTER_OPTIONS,
  type MediaTypeFilter,
} from "@/lib/validation/media.schema";
import { MEDIA_TYPE_LABELS } from "@/lib/validation/shared";

export default function MediaToolbar({
  search,
  type,
}: {
  search: string;
  type: MediaTypeFilter;
}) {
  const hasActiveFilters = search.length > 0 || type !== "ALL";

  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
    >
      <div className="min-w-[12rem] flex-1">
        <label
          htmlFor="search"
          className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >
          Search
        </label>
        <input
          id="search"
          name="search"
          type="search"
          defaultValue={search}
          placeholder="Title or file name…"
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={type}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {MEDIA_TYPE_FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All types" : MEDIA_TYPE_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        Apply
      </button>

      {hasActiveFilters ? (
        <Link
          href="/admin/media"
          className="text-sm font-medium text-neutral-500 hover:underline dark:text-neutral-400"
        >
          Reset
        </Link>
      ) : null}
    </form>
  );
}
