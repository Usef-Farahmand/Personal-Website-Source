"use client";

import { Suspense, useRef, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Grid3x3, LayoutGrid } from "lucide-react";
import {
  ListToolbar,
  type ListToolbarItem,
} from "@/components/sections/ListToolbar";
import {
  FilterableGrid,
  type ListView,
} from "@/components/sections/FilterableGrid";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { useStoredChoice } from "@/hooks/useStoredChoice";
import type { FilterFacet } from "@/components/ui/FilterPanel";
import type { SortOption } from "@/components/ui/SortSelect";

interface FilterableListSectionProps<TSort extends string> {
  items: ListToolbarItem[];
  facets: FilterFacet[];
  facetKeys: readonly string[];
  sortOptions: SortOption[];
  defaultSort: TSort;
  descendingSortKeys: readonly string[];
  resultCountNamespace: string;
  facetLabels: Record<string, string>;
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
  /** Server-rendered cards (already resolved for the current locale),
   *  each wrapped by the page in a `<div data-list-key={item.key}>`. */
  children: ReactNode;
  /** Passed to FilterableGrid. */
  gridClassName?: string;
  /** Passed to FilterableGrid (opt-in slot layout). */
  tallKeys?: string[];
  /** Opt-in view switcher (wide rows / cards / icons). The choice is
   *  remembered per visitor under `storageKey`. */
  views?: {
    storageKey: string;
    /** View before the visitor picks one (cards when omitted). */
    default?: ListView;
    label: string;
    labels: Record<ListView, string>;
  };
  /** Opt-in paging: cards per page for each view (e.g. four rows), with
   *  the pager's labels; "{page}"/"{total}" are filled in here. */
  pagination?: {
    pageSize: Record<ListView, number>;
    previous: string;
    next: string;
    pageOf: string;
  };
}

const VIEWS: readonly ListView[] = ["grid", "icons"];
const VIEW_ICON = { grid: LayoutGrid, icons: Grid3x3 } as const;

/**
 * Bridges ListToolbar (computes which item keys match search/filter/sort)
 * and FilterableGrid (applies that to already-rendered server cards).
 * Kept as one small client component, wrapped in Suspense here because
 * useUrlListState reads useSearchParams, which Next requires a Suspense
 * boundary for during static rendering.
 */
export function FilterableListSection<TSort extends string>({
  items,
  facets,
  facetKeys,
  sortOptions,
  defaultSort,
  descendingSortKeys,
  resultCountNamespace,
  facetLabels,
  labels,
  children,
  gridClassName,
  tallKeys,
  views,
  pagination,
}: FilterableListSectionProps<TSort>) {
  const [view, setView] = useStoredChoice<ListView>(
    views?.storageKey ?? "list-view",
    views?.default ?? "grid",
    VIEWS
  );
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    items.map((item) => item.key)
  );
  const topRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // The page belongs to one result set and view: any new search, filter,
  // sort or view starts again at page 1 (derived, not reset in an effect).
  const resultSignature = `${view}|${visibleKeys.join(",")}`;
  const [pageState, setPageState] = useState({ page: 1, signature: "" });
  const pageSize = pagination?.pageSize[view];
  const totalPages = pageSize
    ? Math.max(1, Math.ceil(visibleKeys.length / pageSize))
    : 1;
  const page =
    pageState.signature === resultSignature
      ? Math.min(pageState.page, totalPages)
      : 1;
  const pagedKeys = pageSize
    ? visibleKeys.slice((page - 1) * pageSize, page * pageSize)
    : visibleKeys;
  const goToPage = (next: number) => {
    setPageState({ page: next, signature: resultSignature });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Suspense fallback={null}>
      <div ref={topRef} className="scroll-mt-24" />
      <ListToolbar
        items={items}
        facets={facets}
        facetKeys={facetKeys}
        sortOptions={sortOptions}
        defaultSort={defaultSort}
        descendingSortKeys={descendingSortKeys}
        resultCountNamespace={resultCountNamespace}
        facetLabels={facetLabels}
        labels={labels}
        onVisibleKeysChange={setVisibleKeys}
        trailing={
          views && (
            <ViewToggle
              value={view}
              onChange={setView}
              label={views.label}
              options={VIEWS.map((value) => ({
                value,
                label: views.labels[value],
                Icon: VIEW_ICON[value],
              }))}
            />
          )
        }
      />
      <FilterableGrid
        visibleKeys={pagedKeys}
        className={gridClassName}
        tallKeys={tallKeys}
        view={views ? view : undefined}
      >
        {children}
      </FilterableGrid>
      {pagination && totalPages > 1 && (
        <nav
          aria-label={pagination.pageOf
            .replace("{page}", String(page))
            .replace("{total}", String(totalPages))}
          className="border-border mt-10 flex items-center justify-between gap-4 border-t pt-6 text-sm"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="text-text-primary hover:text-accent inline-flex items-center gap-1.5 font-semibold disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
            {pagination.previous}
          </button>
          <ol className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <button
                  type="button"
                  aria-current={n === page ? "page" : undefined}
                  onClick={() => goToPage(n)}
                  className={
                    n === page
                      ? "bg-accent text-background h-8 w-8 rounded-md font-semibold"
                      : "text-text-secondary hover:text-text-primary border-border h-8 w-8 rounded-md border"
                  }
                >
                  {new Intl.NumberFormat(locale).format(n)}
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="text-text-primary hover:text-accent inline-flex items-center gap-1.5 font-semibold disabled:pointer-events-none disabled:opacity-30"
          >
            {pagination.next}
            <ArrowRight
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </button>
        </nav>
      )}
    </Suspense>
  );
}
