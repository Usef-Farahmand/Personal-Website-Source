"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { getParamList } from "@/lib/listFilters";

/**
 * Synchronizes listing-page UI state (search text, one or more
 * multi-value filter facets, and a sort key) with the URL's query
 * string, via next-intl's locale-preserving router so the locale/domain
 * segment is never disturbed by a filter change.
 *
 * Deliberately built directly on `URLSearchParams` + `router.push`
 * rather than a state-management library: the entire "library" here is
 * ~30 lines because Next's router + native URLSearchParams already do
 * the hard part (history entries, shareable URLs). Introducing Zustand/
 * Redux/nuqs for this would be the over-engineering the brief explicitly
 * warns against.
 *
 * Trade-off accepted: every change pushes a new history entry (so Back
 * steps through filter changes one at a time) rather than replacing the
 * current entry. This matches the spec's explicit ask ("use browser
 * Back/Forward") — a visitor can back out of a filter they just applied.
 */
export function useUrlListState(facetKeys: readonly string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const facets = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const key of facetKeys) {
      result[key] = getParamList(searchParams, key);
    }
    return result;
  }, [searchParams, facetKeys]);

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const setSearch = useCallback(
    (value: string) => {
      pushParams((params) => {
        if (value) params.set("search", value);
        else params.delete("search");
      });
    },
    [pushParams]
  );

  const setSort = useCallback(
    (value: string) => {
      pushParams((params) => {
        if (value) params.set("sort", value);
        else params.delete("sort");
      });
    },
    [pushParams]
  );

  const toggleFacetValue = useCallback(
    (key: string, value: string) => {
      pushParams((params) => {
        const current = getParamList(params, key);
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        params.delete(key);
        next.forEach((v) => params.append(key, v));
      });
    },
    [pushParams]
  );

  const removeFacetValue = useCallback(
    (key: string, value: string) => {
      pushParams((params) => {
        const next = getParamList(params, key).filter((v) => v !== value);
        params.delete(key);
        next.forEach((v) => params.append(key, v));
      });
    },
    [pushParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCount =
    (search ? 1 : 0) +
    Object.values(facets).reduce((sum, values) => sum + values.length, 0);

  return {
    search,
    sort,
    facets,
    setSearch,
    setSort,
    toggleFacetValue,
    removeFacetValue,
    clearAll,
    activeCount,
  };
}
