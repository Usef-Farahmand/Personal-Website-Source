"use client";

import { useEffect, useMemo, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { animate } from "animejs";
import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/ui/SearchInput";
import { SortSelect, type SortOption } from "@/components/ui/SortSelect";
import { FilterPanel, type FilterFacet } from "@/components/ui/FilterPanel";
import { ActiveFilters } from "@/components/ui/ActiveFilters";
import { Overlay } from "@/components/ui/Overlay";
import { useModal } from "@/hooks/useModal";
import { useUrlListState } from "@/hooks/useUrlListState";
import { matchesQuery } from "@/lib/listFilters";
import { cn } from "@/lib/cn";

export interface ListToolbarItem {
  /** Stable key matching the `data-list-key` the page put on each
   *  server-rendered card, so this component can compute visibility
   *  without ever touching card markup. */
  key: string;
  /** Every string field searched against. */
  searchable: string[];
  /** This item's value for each facet key (matches FilterFacet.key). */
  facetValues: Record<string, string[]>;
  /** Plain comparable value per sort option this item could be sorted
   *  by (e.g. { newest: project.startDate, titleAsc: project.title }).
   *  Deliberately plain string/number data, not a comparator function —
   *  ListToolbar is a Client Component and functions can't be passed to
   *  it as props from the Server Component page that builds `items`. */
  sortValues: Record<string, string | number>;
}

interface ListToolbarProps<TSort extends string> {
  items: ListToolbarItem[];
  facets: FilterFacet[];
  facetKeys: readonly string[];
  sortOptions: SortOption[];
  defaultSort: TSort;
  /** Sort keys whose comparison should be descending (numeric/date-like:
   *  newest-first, featured-first) rather than ascending (alphabetical).
   *  A plain string set, not a comparator function, for the same
   *  serialization reason as `sortValues` above. */
  descendingSortKeys: readonly string[];
  resultCountNamespace: string;
  labels: {
    searchLabel: string;
    searchPlaceholder: string;
    sortLabel: string;
    filtersLabel: string;
    openFilters: string;
    closeFilters: string;
    clearSearch: string;
    clearAll: string;
    applyFilters: string;
    emptyTitle: string;
    emptyAction: string;
  };
  /** Flat `"facetKey:value"` -> display label map, built server-side
   *  (already translated where needed) and passed as plain data —
   *  replaces a facetLabelFor callback, which (being a function) can't
   *  cross the Server->Client boundary as a prop. */
  facetLabels: Record<string, string>;
  /** Ordered list of item keys currently visible, in display order — the
   *  page applies this to its server-rendered cards. */
  onVisibleKeysChange: (keys: string[]) => void;
}

/**
 * Orchestrates search + facet filters + sort entirely from the URL query
 * string (via useUrlListState) and reports the resulting visible/ordered
 * item keys back to the page. Deliberately renders no cards itself —
 * ProjectCard/ArticleCard are async Server Components and can't live
 * inside a "use client" tree, so filtering must work by toggling
 * visibility of already-rendered server output instead of re-rendering
 * cards from client state.
 */
export function ListToolbar<TSort extends string>({
  items,
  facets,
  facetKeys,
  sortOptions,
  defaultSort,
  descendingSortKeys,
  resultCountNamespace,
  labels,
  facetLabels,
  onVisibleKeysChange,
}: ListToolbarProps<TSort>) {
  const urlState = useUrlListState(facetKeys);
  const mobilePanel = useModal();
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations(resultCountNamespace);

  const sort = (urlState.sort || defaultSort) as TSort;
  const isDescending = descendingSortKeys.includes(sort);

  const visibleKeys = useMemo(() => {
    const filtered = items.filter((item) => {
      if (!matchesQuery(item.searchable, urlState.search)) return false;
      for (const facetKey of facetKeys) {
        const active = urlState.facets[facetKey];
        if (!active || active.length === 0) continue;
        const itemValues = item.facetValues[facetKey] ?? [];
        if (!active.some((v) => itemValues.includes(v))) return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      const aVal = a.sortValues[sort];
      const bVal = b.sortValues[sort];
      const cmp =
        typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal ?? "").localeCompare(String(bVal ?? ""));
      return isDescending ? -cmp : cmp;
    });
    return filtered.map((item) => item.key);
  }, [items, urlState.search, urlState.facets, sort, isDescending, facetKeys]);

  useEffect(() => {
    onVisibleKeysChange(visibleKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKeys]);

  useEffect(() => {
    if (!mobilePanel.isOpen || !panelRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    animate(panelRef.current, {
      opacity: [0, 1],
      translateY: ["0.5rem", "0rem"],
      duration: 220,
      ease: "cubic-bezier(0, 0, 0.2, 1)",
    });
  }, [mobilePanel.isOpen]);

  const chips = useMemo(() => {
    const result: { id: string; label: string; onRemove: () => void }[] = [];
    if (urlState.search) {
      result.push({
        id: "search",
        label: `"${urlState.search}"`,
        onRemove: () => urlState.setSearch(""),
      });
    }
    for (const facetKey of facetKeys) {
      for (const value of urlState.facets[facetKey] ?? []) {
        result.push({
          id: `${facetKey}:${value}`,
          label: facetLabels[`${facetKey}:${value}`] ?? value,
          onRemove: () => urlState.removeFacetValue(facetKey, value),
        });
      }
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState.search, urlState.facets, facetKeys, facetLabels]);

  const hasFacetOptions = facets.some((f) => f.options.length > 0);

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={urlState.search}
          onChange={urlState.setSearch}
          label={labels.searchLabel}
          placeholder={labels.searchPlaceholder}
          clearLabel={labels.clearSearch}
          className="sm:flex-1"
        />

        <div className="flex gap-3">
          <SortSelect
            value={sort}
            onChange={(v) => urlState.setSort(v)}
            options={sortOptions}
            label={labels.sortLabel}
            className="flex-1 sm:w-48 sm:flex-none"
          />

          {hasFacetOptions && (
            // A single trigger + Overlay is used on every breakpoint
            // (not a separate desktop-only popover) — facet counts here
            // are small, so one code path keeps this understandable
            // without meaningfully hurting desktop UX.
            <button
              type="button"
              onClick={mobilePanel.open}
              className={cn(
                "border-border bg-surface text-text-primary hover:border-accent/50 relative inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"
              )}
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{labels.filtersLabel}</span>
              {urlState.activeCount > 0 && (
                <span className="bg-accent text-background absolute -end-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
                  {urlState.activeCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ActiveFilters
          chips={chips}
          onClearAll={urlState.clearAll}
          clearAllLabel={labels.clearAll}
        />
        <p className="text-caption text-text-secondary shrink-0">
          {t("resultCount", { count: visibleKeys.length })}
        </p>
      </div>

      {hasFacetOptions && (
        <Overlay
          isOpen={mobilePanel.isOpen}
          onClose={mobilePanel.close}
          title={labels.filtersLabel}
          contentClassName="max-w-sm w-full max-h-[85vh] overflow-y-auto p-6"
        >
          <div ref={panelRef} className="flex flex-col gap-6">
            <FilterPanel
              facets={facets}
              activeValues={urlState.facets}
              onToggle={urlState.toggleFacetValue}
            />
            <button
              type="button"
              onClick={mobilePanel.close}
              className="bg-accent text-background rounded-md px-4 py-2 text-sm font-medium"
            >
              {labels.applyFilters}
            </button>
          </div>
        </Overlay>
      )}

      {visibleKeys.length === 0 && (
        <div className="border-border bg-surface flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="text-text-secondary text-sm">{labels.emptyTitle}</p>
          <button
            type="button"
            onClick={urlState.clearAll}
            className="text-accent text-sm font-medium hover:underline"
          >
            {labels.emptyAction}
          </button>
        </div>
      )}
    </div>
  );
}
