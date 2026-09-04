import { achievements } from "@/content/achievements";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedAchievement } from "@/types/content";

export function listAchievements(
  locale: Locale,
  options?: ListOptions
): ResolvedAchievement[] {
  // `date` is authored as free text ("December 2018"), not an ISO
  // string like Project.startDate/Article.publishedDate, so it can't be
  // compared with a plain string sort (e.g. "April 2020" would sort
  // before "December 2019" alphabetically even though it's later) —
  // parse both sides into real Date values first.
  const all = [...achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((entry) => resolveTranslation(entry, locale) as ResolvedAchievement);
  return options?.limit ? all.slice(0, options.limit) : all;
}
