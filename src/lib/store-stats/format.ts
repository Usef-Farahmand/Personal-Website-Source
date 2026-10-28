import type { Locale } from "@/types/content";

/** "1M+" / "۱ میلیون+", or "< 100" for "less than N" ranges. */
export function formatInstalls(
  installs: number | null,
  installsBelow: number | undefined,
  locale: Locale
): string | null {
  const compact = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  if (installsBelow) return `< ${compact.format(installsBelow)}`;
  if (installs === null) return null;
  return `${compact.format(installs)}+`;
}

export function formatRating(rating: number | null, locale: Locale) {
  if (rating === null) return null;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
    rating
  );
}
