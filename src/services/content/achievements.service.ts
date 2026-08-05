import { achievements } from "@/content/achievements";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedAchievement } from "@/types/content";

export function listAchievements(
  locale: Locale,
  options?: ListOptions
): ResolvedAchievement[] {
  const all = [...achievements]
    .sort((a, b) => a.order - b.order)
    .map((entry) => resolveTranslation(entry, locale) as ResolvedAchievement);
  return options?.limit ? all.slice(0, options.limit) : all;
}
