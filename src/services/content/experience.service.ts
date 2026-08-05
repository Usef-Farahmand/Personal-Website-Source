import { experience } from "@/content/experience";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedExperience } from "@/types/content";

export function listExperience(
  locale: Locale,
  options?: ListOptions
): ResolvedExperience[] {
  const all = [...experience]
    .sort((a, b) => a.order - b.order)
    .map((entry) => resolveTranslation(entry, locale) as ResolvedExperience);
  return options?.limit ? all.slice(0, options.limit) : all;
}
