/**
 * Generic search/filter/sort helpers shared by the Projects and Articles
 * listing pages (see components/sections/ListToolbar.tsx and
 * hooks/useListFilters.ts).
 *
 * Deliberately NOT a single generic "ListFilterEngine" class or a config
 * object that tries to describe every possible field type — Projects and
 * Articles differ enough (Projects has multi-value array filters like
 * `technologies`/`platforms`; Articles has fewer facets) that a fully
 * generic abstraction would need escape hatches almost immediately. What
 * *is* genuinely identical between them — normalizing text for a substring
 * search, deriving the sorted set of distinct values for a facet, and
 * reading/writing URL query state — lives here once. The actual filter
 * predicate and field selection stay in each page's own hook, in plain
 * readable code.
 */

/** Case/diacritic-insensitive substring match. Lightweight on purpose —
 *  see SKILL.md-equivalent reasoning in the feature spec: no search
 *  library, this runs client-side over a small in-memory list. */
export function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function matchesQuery(haystacks: string[], query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return haystacks.some((h) => normalize(h).includes(q));
}

/** Derives the sorted, deduplicated set of values actually present in the
 *  content for a given facet — this is what keeps filter options
 *  data-driven instead of hardcoded. Pass a value or array of values per
 *  item; `undefined`/empty entries are dropped. */
export function deriveFacetOptions<T>(
  items: T[],
  getValues: (item: T) => string | string[] | undefined
): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const values = getValues(item);
    if (!values) continue;
    if (Array.isArray(values)) {
      values.forEach((v) => v && set.add(v));
    } else {
      set.add(values);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/** Reads a repeatable query param (?technology=a&technology=b) as a
 *  string array, or a single param as a one-item array. Empty when
 *  absent — callers treat an empty array as "no filter applied". */
export function getParamList(
  params: URLSearchParams,
  key: string
): string[] {
  return params.getAll(key).filter(Boolean);
}
