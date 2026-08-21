import { localeSchema } from "@/lib/validation/shared";
import type { Locale } from "@/lib/validation/shared";

/**
 * Canonical display order for the locale columns in the Admin UI (EN
 * before FA), sourced from `localeSchema` (in turn generated from the
 * Prisma `Locale` enum — see validation/shared.ts) rather than
 * hardcoded here a second time. Adding a locale to the schema
 * automatically extends every language-status column in the Dashboard
 * without a matching edit in this file.
 */
export const SUPPORTED_LOCALES = localeSchema.options;

export type LanguageStatusEntry = { locale: Locale; present: boolean };

/**
 * Turns a content item's translation rows into a fixed-order presence
 * list (`[{ locale: "en", present: true }, { locale: "fa", present:
 * false }]`) for the `LanguageStatus` component — the CMS doesn't yet
 * track *why* a translation is missing, only whether the row exists.
 */
export function buildLanguageStatus(
  translations: { locale: Locale }[]
): LanguageStatusEntry[] {
  const present = new Set(
    translations.map((translation) => translation.locale)
  );
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    present: present.has(locale),
  }));
}

/**
 * Picks the title shown in list/overview screens: English first (the
 * CMS's primary authoring language), then whichever translation exists,
 * and finally the slug — so a Project/Article with no translations yet
 * still renders as an identifiable row instead of a blank cell.
 */
export function pickDisplayTitle(
  translations: { locale: Locale; title: string }[],
  fallback: string
): string {
  const english = translations.find(
    (translation) => translation.locale === "en"
  );
  if (english) return english.title;
  return translations[0]?.title ?? fallback;
}
