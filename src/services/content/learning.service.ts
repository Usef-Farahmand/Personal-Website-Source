import { learningEntries } from "@/content/learning";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedLearningEntry } from "@/types/content";

/** Newest first — `date` is the single ordering key for this section. */
export function listLearning(
  locale: Locale,
  options?: ListOptions
): ResolvedLearningEntry[] {
  const all = [...learningEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((entry) => resolveTranslation(entry, locale) as ResolvedLearningEntry);
  return options?.limit ? all.slice(0, options.limit) : all;
}

export function getLearningBySlug(
  slug: string,
  locale: Locale
): ResolvedLearningEntry | null {
  const entry = learningEntries.find((e) => e.slug === slug);
  return entry
    ? (resolveTranslation(entry, locale) as ResolvedLearningEntry)
    : null;
}
