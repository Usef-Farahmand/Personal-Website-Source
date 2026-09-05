import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/types/content";

/**
 * Builds the `alternates` block (canonical + hreflang) for a page.
 *
 * `path` is the locale-agnostic part of the route (e.g. "" for the
 * homepage, "/projects", "/projects/prj-simulix") — every locale segment
 * is prefixed here so callers never have to repeat `/${locale}` at each
 * call site. Values are relative; Next resolves them against
 * `metadataBase` (siteUrl in config/site.ts), so this keeps working
 * whichever of the two mirrored domains (see MULTILINGUAL_ARCHITECTURE.md)
 * actually served the request.
 *
 * `x-default` points at the default locale (en) — the standard fallback
 * for a user agent/language Google can't otherwise match to one of the
 * declared alternates.
 */
export function buildAlternates(
  locale: Locale,
  path: string = ""
): Metadata["alternates"] {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `/${l}${path}`])
  ) as Record<Locale, string>;

  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...languages,
      "x-default": `/${defaultLocale}${path}`,
    },
  };
}
