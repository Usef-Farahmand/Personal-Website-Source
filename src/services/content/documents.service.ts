import { aboutDocuments } from "@/content/documents";
import { resolveTranslation } from "./shared";
import type { Locale, ResolvedAboutDocument } from "@/types/content";

/**
 * Serves the About page's Documents section only. Kept as its own
 * service (rather than folded into site.service.ts) because this is a
 * real collection with independent identity per item — the same
 * reasoning that gives achievements/projects/articles their own
 * services — not a singleton content record like hero/aboutPreview/about.
 */
export function listAboutDocuments(locale: Locale): ResolvedAboutDocument[] {
  return [...aboutDocuments]
    .sort((a, b) => a.order - b.order)
    .map((doc) => resolveTranslation(doc, locale) as ResolvedAboutDocument);
}
