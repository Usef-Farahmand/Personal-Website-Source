import { exploringEntries } from "@/content/exploring";
import { resolveTranslation, type ListOptions } from "./shared";
import type { Locale, ResolvedExploringEntry } from "@/types/content";

export function listExploring(
  locale: Locale,
  options?: ListOptions
): ResolvedExploringEntry[] {
  const all = [...exploringEntries]
    .sort((a, b) => a.order - b.order)
    .map(
      (entry) => resolveTranslation(entry, locale) as ResolvedExploringEntry
    );
  return options?.limit ? all.slice(0, options.limit) : all;
}
