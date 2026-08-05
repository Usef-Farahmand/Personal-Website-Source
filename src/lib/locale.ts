import type { Locale } from "@/types/content";

const rtlLocales: readonly Locale[] = ["fa"] as const;

/** Single source of truth for writing direction. Adding a future RTL
 *  language (e.g. Arabic) means adding it here — nothing else changes. */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** Open Graph's og:locale expects language_TERRITORY form (e.g. en_US),
 *  not a bare locale code. Centralized here so metadata code doesn't
 *  hardcode the mapping inline. */
const ogLocaleMap: Record<Locale, string> = {
  en: "en_US",
  fa: "fa_IR",
};

export function getOgLocale(locale: Locale): string {
  return ogLocaleMap[locale];
}
