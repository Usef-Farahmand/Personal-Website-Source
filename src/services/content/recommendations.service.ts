import { recommendations } from "@/content/recommendations";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedRecommendation } from "@/types/content";

export function listRecommendations(
  locale: Locale,
  options?: ListOptions
): ResolvedRecommendation[] {
  const published = [...recommendations]
    .filter((recommendation) => recommendation.published)
    .sort((a, b) => a.order - b.order)
    .map(
      (recommendation) =>
        resolveTranslation(recommendation, locale) as ResolvedRecommendation
    );
  return options?.limit ? published.slice(0, options.limit) : published;
}
