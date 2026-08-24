"use client";

import { useId, useMemo, useState } from "react";
import type { MediaOption } from "@/lib/queries/projects";
import { MEDIA_TYPE_LABELS, type MediaType } from "@/lib/validation/shared";

/**
 * Task 06.3, sections 1-2: the shared search/filter list used everywhere
 * the CMS lets a person pick from existing Media — Project Logo, Project
 * Cover, Project Gallery, and Article Header Image. One component
 * instead of a picker per content type (section 2: "Do not create a
 * separate picker for every content type").
 *
 * Search matches title or original filename (section 1) — a single,
 * case-insensitive `contains` check, same "simple, not an advanced
 * search engine" spirit as the Media Library's own search
 * (queries/media.ts). Matching happens client-side against the options
 * already passed in: this CMS's Media Library is small (single-author,
 * local), so there's no separate server round trip per keystroke, and
 * results are capped (see MAX_RESULTS) so a very large library still
 * renders a short, scannable list rather than everything at once
 * (section 18: performant without an advanced search engine).
 */

const MAX_RESULTS = 40;

function matchesSearch(option: MediaOption, query: string): boolean {
  if (!query) return true;
  const haystack =
    `${option.title ?? ""} ${option.originalFilename ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

export default function MediaPickerBrowser({
  options,
  allowedTypes,
  excludeIds = [],
  onSelect,
  emptyMessage = "No media found.",
  autoFocus = false,
}: {
  options: MediaOption[];
  allowedTypes: MediaType[];
  /** Ids to hide from results — used by GalleryEditor so an already-added
   *  item isn't offered again. */
  excludeIds?: string[];
  onSelect: (media: MediaOption) => void;
  emptyMessage?: string;
  autoFocus?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "ALL">("ALL");
  const searchId = useId();
  const typeId = useId();

  const excludeSet = useMemo(() => new Set(excludeIds), [excludeIds]);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    return options.filter(
      (option) =>
        allowedTypes.includes(option.type) &&
        !excludeSet.has(option.id) &&
        (typeFilter === "ALL" || option.type === typeFilter) &&
        matchesSearch(option, query)
    );
  }, [options, allowedTypes, excludeSet, typeFilter, search]);

  const visible = results.slice(0, MAX_RESULTS);
  const truncated = results.length > visible.length;

  return (
    <div className="rounded-md border border-neutral-200 p-2.5 dark:border-neutral-800">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[10rem] flex-1">
          <label htmlFor={searchId} className="sr-only">
            Search media
          </label>
          <input
            id={searchId}
            type="search"
            autoFocus={autoFocus}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or filename…"
            className="w-full rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        {allowedTypes.length > 1 ? (
          <div>
            <label htmlFor={typeId} className="sr-only">
              Filter by type
            </label>
            <select
              id={typeId}
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as MediaType | "ALL")
              }
              className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <option value="ALL">All types</option>
              {allowedTypes.map((type) => (
                <option key={type} value={type}>
                  {MEDIA_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-2 max-h-56 divide-y divide-neutral-100 overflow-y-auto rounded-md border border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
          {visible.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onSelect(option)}
                className="flex w-full items-center gap-2.5 px-2 py-1.5 text-left hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-neutral-900"
              >
                {option.thumbnail || option.source ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={option.thumbnail || option.source}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
                  />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded bg-neutral-100 dark:bg-neutral-800" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {option.title || option.originalFilename || option.source}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {MEDIA_TYPE_LABELS[option.type]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {emptyMessage}
        </p>
      )}

      {truncated ? (
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          Showing the first {MAX_RESULTS} of {results.length} matches — refine
          your search to narrow the list.
        </p>
      ) : null}
    </div>
  );
}
