import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/content/types";

/**
 * Locale-prefixed routing, per MULTILINGUAL_ARCHITECTURE.md.
 *
 * `localePrefix: "always"` means every route carries an explicit locale
 * segment (/en/..., /fa/...) regardless of which domain served the
 * request — this is what makes domain and locale fully independent.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
