import Link from "next/link";
import { PROJECT_SORT_OPTIONS, type ProjectSort } from "@/lib/queries/projects";
import type { ContentStatus } from "@/lib/validation/shared";

const STATUS_FILTER_OPTIONS: { value: ContentStatus | "ALL"; label: string }[] =
  [
    { value: "ALL", label: "All statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ARCHIVED", label: "Archived" },
  ];

export default function ProjectsToolbar({
  search,
  status,
  sort,
}: {
  search: string;
  status: ContentStatus | "ALL";
  sort: ProjectSort;
}) {
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
          placeholder="Title or slug…"
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="sort"
          className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >
          Sort
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {PROJECT_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
      {search || status !== "ALL" || sort !== "updated-desc" ? (
        <Link
          href="/admin/projects"
          className="text-sm font-medium text-neutral-500 hover:underline dark:text-neutral-400"
        >
          Reset
        </Link>
      ) : null}
    </form>
  );
}
