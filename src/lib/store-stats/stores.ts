import {
  parseBazaar,
  parseGooglePlay,
  type StoreReading,
} from "@/lib/store-stats/parse";

/**
 * The stores whose public listing we can read. `key` matches the store's
 * field in Project.links, so a project gets stats for every store it
 * links to. Myket and the iOS stores aren't readable yet; adding one is a
 * parser in parse.ts plus an entry here (and in the snapshot script).
 */
export const STORES = [
  {
    key: "googlePlay",
    parse: parseGooglePlay,
    // English page, so the "Downloads" label the parser looks for matches.
    fetchUrl: (url: string) => {
      const u = new URL(url);
      u.searchParams.set("hl", "en");
      u.searchParams.set("gl", "US");
      return u.toString();
    },
  },
  {
    key: "bazaar",
    parse: parseBazaar,
    fetchUrl: (url: string) => url,
  },
] as const;

export type StoreKey = (typeof STORES)[number]["key"];

export const STORE_KEYS: readonly StoreKey[] = STORES.map((s) => s.key);

/** One dated reading, as stored in generated/store-history.json. */
export type StoreSnapshot = StoreReading & { date: string };

/** projectId -> store -> snapshots, oldest first. */
export type StoreHistory = Record<
  string,
  Partial<Record<StoreKey, StoreSnapshot[]>>
>;
