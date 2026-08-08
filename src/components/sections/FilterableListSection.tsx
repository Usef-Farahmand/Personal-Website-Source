"use client";

import { Suspense, useState, type ReactNode } from "react";
import { ListToolbar, type ListToolbarItem } from "@/components/sections/ListToolbar";
import { FilterableGrid } from "@/components/sections/FilterableGrid";
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
}

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
}: FilterableListSectionProps<TSort>) {
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
      />
      <FilterableGrid visibleKeys={visibleKeys}>{children}</FilterableGrid>
    </Suspense>
  );
}
