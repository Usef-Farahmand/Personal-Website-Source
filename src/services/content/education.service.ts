import { education } from "@/content/education";
import { resolveTranslation } from "./shared";
import type { Locale, ResolvedEducation } from "@/types/content";

export function listEducation(locale: Locale): ResolvedEducation[] {
  return [...education]
    .sort((a, b) => a.order - b.order)
    .map((entry) => resolveTranslation(entry, locale) as ResolvedEducation);
}
