import type { Locale } from "@/content/types";

const rtlLocales: readonly Locale[] = ["fa"] as const;

/** Single source of truth for writing direction. Adding a future RTL
 *  language (e.g. Arabic) means adding it here — nothing else changes. */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
