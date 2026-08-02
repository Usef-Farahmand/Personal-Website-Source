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

/**
 * Elapsed length between two dates, e.g. "3 months" or "1 yr 4 mo" — a
 * project's Duration fact (Overview section) is a length of time, not a
 * date range, so this is deliberately a different computation from the
 * "{start} – {end}" range strings used elsewhere (TimelineItem, Hero).
 * `end: null` measures up to today, matching how an ongoing project's
 * duration keeps growing rather than freezing at start date.
 */
export function formatDuration(
  startDate: string,
  endDate: string | null,
  locale: Locale
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) totalMonths -= 1;
  totalMonths = Math.max(0, totalMonths);

  const years = Math.floor(totalMonths / 12);
  // A project spanning less than a full month still reads as "< 1 mo" of
  // duration, rather than a bare "0 mo" that could read like a data bug.
  const months = totalMonths === 0 ? 0 : totalMonths % 12;

  const yearUnit = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "year",
    unitDisplay: "short",
  });
  const monthUnit = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "month",
    unitDisplay: "short",
  });

  if (totalMonths === 0) {
    return `< ${monthUnit.format(1)}`;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(yearUnit.format(years));
  if (months > 0) parts.push(monthUnit.format(months));
  return parts.join(" ");
}
