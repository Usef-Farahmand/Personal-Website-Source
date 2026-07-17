import type { Locale } from "@/content/types";

/**
 * Formats an ISO date string as a localized "Month Year" label.
 *
 * Deliberately uses the runtime's Intl support directly rather than a date
 * library: verified that Intl.DateTimeFormat("fa", ...) renders the Jalali
 * calendar with Persian numerals by default (e.g. "خرداد ۱۴۰۳"), which is
 * what a Persian-speaking visitor actually expects — not a Gregorian date
 * translated word-for-word. Locale-driven date formatting is an explicit
 * requirement in MULTILINGUAL_ARCHITECTURE.md; this satisfies it with zero
 * added dependencies.
 */
export function formatMonthYear(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  }).format(date);
}
