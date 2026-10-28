import storeHistory from "@/content/generated/store-history.json";
import {
  STORES,
  type StoreHistory,
  type StoreKey,
  type StoreSnapshot,
} from "@/lib/store-stats/stores";
import type { StoreReading } from "@/lib/store-stats/parse";
import type { Project } from "@/types/content";

/**
 * Store numbers for a project page: a live reading of every store the
 * project links to (cached for 12 hours, so pages don't hit the stores on
 * every visit), falling back to the latest daily snapshot when a store
 * can't be reached, plus that snapshot history for the growth charts.
 *
 * Combined numbers follow the site's rule: players = installs summed
 * across stores, rating = average weighted by each store's rating count.
 */

const history = storeHistory as StoreHistory;
const LIVE_CACHE_SECONDS = 60 * 60 * 12;

export interface StoreStat {
  store: StoreKey;
  url: string;
  reading: StoreReading | null;
  /** False when `reading` came from the snapshot history instead. */
  live: boolean;
  history: StoreSnapshot[];
}

export interface ProjectStoreStats {
  stores: StoreStat[];
  installs: number | null;
  installsBelow?: number;
  rating: number | null;
  ratingCount: number | null;
}

/** Stores a project links to — cheap and synchronous, for list filters. */
export function storeKeysForProject(project: Pick<Project, "links">) {
  return STORES.filter((store) => project.links[store.key]).map((s) => s.key);
}

async function readLive(
  store: (typeof STORES)[number],
  url: string
): Promise<StoreReading | null> {
  try {
    const res = await fetch(store.fetchUrl(url), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; store-stats)" },
      next: { revalidate: LIVE_CACHE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const reading = store.parse(await res.text());
    return reading.installs === null && reading.rating === null
      ? null
      : reading;
  } catch {
    return null;
  }
}

export async function getProjectStoreStats(
  project: Pick<Project, "id" | "links">
): Promise<ProjectStoreStats | null> {
  const linked = STORES.filter((store) => project.links[store.key]);
  if (linked.length === 0) return null;

  const stores = await Promise.all(
    linked.map(async (store): Promise<StoreStat> => {
      const url = project.links[store.key] as string;
      const past = history[project.id]?.[store.key] ?? [];
      const live = await readLive(store, url);
      const latest = past.at(-1);
      const fallback: StoreReading | null = latest
        ? {
            installs: latest.installs,
            installsBelow: latest.installsBelow,
            rating: latest.rating,
            ratingCount: latest.ratingCount,
          }
        : null;
      return {
        store: store.key,
        url,
        reading: live ?? fallback,
        live: Boolean(live),
        history: past,
      };
    })
  );

  const readings = stores
    .map((s) => s.reading)
    .filter((r): r is StoreReading => Boolean(r));
  if (readings.length === 0) {
    return { stores, installs: null, rating: null, ratingCount: null };
  }

  const withInstalls = readings.filter((r) => r.installs !== null);
  const installs = withInstalls.length
    ? withInstalls.reduce((sum, r) => sum + (r.installs ?? 0), 0)
    : null;
  // Every store says "less than N": the honest total is "less than ΣN".
  const allBelow =
    withInstalls.length > 0 &&
    withInstalls.every((r) => r.installs === 0 && r.installsBelow);
  const installsBelow = allBelow
    ? withInstalls.reduce((sum, r) => sum + (r.installsBelow ?? 0), 0)
    : undefined;

  const rated = readings.filter((r) => r.rating !== null);
  const counted = rated.filter((r) => (r.ratingCount ?? 0) > 0);
  const ratingCount = counted.length
    ? counted.reduce((sum, r) => sum + (r.ratingCount ?? 0), 0)
    : null;
  const rating = counted.length
    ? counted.reduce(
        (sum, r) => sum + (r.rating ?? 0) * (r.ratingCount ?? 0),
        0
      ) / (ratingCount ?? 1)
    : rated.length
      ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
      : null;

  return { stores, installs, installsBelow, rating, ratingCount };
}
