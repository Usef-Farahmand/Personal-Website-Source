/**
 * Appends today's public store numbers (installs range, rating, rating
 * count) for every project that links to a readable store to
 * src/content/generated/store-history.json — the history behind the
 * growth charts on project pages. Run daily by
 * .github/workflows/store-stats.yml; safe to run by hand:
 *
 *   node --experimental-strip-types scripts/snapshot-store-stats.mjs
 *
 * A new entry is added only when a number changed (at most one per day);
 * charts hold the last value flat up to today. A failed fetch is skipped,
 * never written as zeros.
 * Keep the store list in step with src/lib/store-stats/stores.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { parseBazaar, parseGooglePlay } = await import(
  pathToFileURL(path.join(root, "src/lib/store-stats/parse.ts")).href
);

const STORES = [
  {
    key: "googlePlay",
    parse: parseGooglePlay,
    fetchUrl: (url) => {
      const u = new URL(url);
      u.searchParams.set("hl", "en");
      u.searchParams.set("gl", "US");
      return u.toString();
    },
  },
  { key: "bazaar", parse: parseBazaar, fetchUrl: (url) => url },
];

const projectsFile = path.join(root, "src/content/generated/projects.json");
const historyFile = path.join(root, "src/content/generated/store-history.json");
const projects = JSON.parse(fs.readFileSync(projectsFile, "utf8"));
const history = fs.existsSync(historyFile)
  ? JSON.parse(fs.readFileSync(historyFile, "utf8"))
  : {};
const today = new Date().toISOString().slice(0, 10);

for (const project of projects) {
  for (const store of STORES) {
    const url = project.links?.[store.key];
    if (!url) continue;
    try {
      const res = await fetch(store.fetchUrl(url), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; store-stats)" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reading = store.parse(await res.text());
      if (reading.installs === null && reading.rating === null) {
        throw new Error("no numbers found on the page");
      }
      const list = ((history[project.id] ??= {})[store.key] ??= []);
      const entry = { date: today, ...reading };
      const last = list.at(-1);
      const sameAsLast =
        last &&
        JSON.stringify({ ...last, date: today }) === JSON.stringify(entry);
      if (sameAsLast) {
        // Unchanged since the last snapshot: the chart holds the value
        // flat until today, so there's no need for a new entry (or a
        // commit and redeploy).
      } else if (last?.date === today) list[list.length - 1] = entry;
      else list.push(entry);
      console.log(`${project.id} ${store.key}:`, reading);
    } catch (error) {
      console.warn(`${project.id} ${store.key}: skipped (${error.message})`);
    }
  }
}

fs.writeFileSync(historyFile, JSON.stringify(history, null, 2) + "\n");
