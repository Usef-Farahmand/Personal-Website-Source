import { defaultLocale, type Locale } from "@/types/content";

/**
 * Internal to services/content/ — not a public service itself. Every
 * per-domain service (projects, skills, articles, ...) needs the exact
 * same "resolve this item's translations map for a locale, falling back
 * to the default locale" behavior, so it lives here once rather than
 * being reimplemented per service. This is the single place
 * fallback-translation logic lives, per CONTENT_MODEL.md.
 */
export function resolveTranslation<TShared, TTranslation extends object>(
  item: TShared & { translations: Partial<Record<Locale, TTranslation>> },
  locale: Locale
): TShared &
  TTranslation & { isFallbackTranslation: boolean; fallbackLocale?: Locale } {
  const { translations, ...shared } = item;

  const requested = translations[locale];
  if (requested) {
    return {
      ...shared,
      ...requested,
      isFallbackTranslation: false,
    } as TShared & TTranslation & { isFallbackTranslation: boolean };
  }

  const fallback = translations[defaultLocale];
  if (!fallback) {
    throw new Error(
      `Content item has no translation for "${locale}" and no fallback "${defaultLocale}" translation exists.`
    );
  }

  return {
    ...shared,
    ...fallback,
    isFallbackTranslation: true,
    fallbackLocale: defaultLocale,
  } as TShared &
    TTranslation & { isFallbackTranslation: boolean; fallbackLocale: Locale };
}

/** Caps the number of returned items — the mechanism behind every
 *  "homepage preview shows N, dedicated page shows all" section. Applied
 *  at the service level (not sliced in components) so that swapping the
 *  underlying data source for a real CMS/API later means the preview
 *  simply requests a limited query instead of over-fetching and slicing
 *  client-side. */
export interface ListOptions {
  limit?: number;
}
