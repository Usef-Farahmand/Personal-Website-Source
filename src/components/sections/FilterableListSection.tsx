"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Grid3x3, LayoutGrid, Rows3 } from "lucide-react";
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
   *  remembered per visitor under `storageKey`; wide rows by default. */
  views?: {
    storageKey: string;
    label: string;
    labels: Record<ListView, string>;
  };
}

const VIEWS: readonly ListView[] = ["list", "grid", "icons"];
const VIEW_ICON = { list: Rows3, grid: LayoutGrid, icons: Grid3x3 } as const;

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
}: FilterableListSectionProps<TSort>) {
  const [view, setView] = useStoredChoice<ListView>(
    views?.storageKey ?? "list-view",
    "list",
    VIEWS
  );
  const [visibleKeys, setVisibleKeys] = useState<string[]>(() =>
    items.map((item) => item.key)
  );

  return (
    <Suspense fallback={null}>
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
        visibleKeys={visibleKeys}
        className={gridClassName}
        tallKeys={tallKeys}
        view={views ? view : undefined}
      >
        {children}
      </FilterableGrid>
    </Suspense>
  );
}
