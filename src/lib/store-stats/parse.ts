/**
 * Pure parsers that read public numbers from an app store listing's HTML.
 * No store offers a public API for install counts, so these read what the
 * listing page itself shows. Kept dependency-free (no imports) so the
 * daily snapshot script (scripts/snapshot-store-stats.ts) can run this
 * file directly with Node's type stripping, and the site can import it.
 *
 * Install counts are ranges on every store ("1M+", "کمتر از ۱۰۰"), so a
 * reading carries the range's lower bound plus, for "less than N"
 * ranges, the upper bound.
 */

export interface StoreReading {
  /** Lower bound of the install range. */
  installs: number | null;
  /** Upper bound, only for "less than N" ranges. */
  installsBelow?: number;
  rating: number | null;
  ratingCount: number | null;
}

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function toLatinDigits(text: string): string {
  return text.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = PERSIAN_DIGITS.indexOf(d);
    return String(i >= 0 ? i : ARABIC_DIGITS.indexOf(d));
  });
}

/** "1M+", "500K+", "10,000+", "+۱۰ هزار", "کمتر از ۱۰۰", "<۱۰۰". */
export function parseInstallRange(
  raw: string
): Pick<StoreReading, "installs" | "installsBelow"> {
  const text = toLatinDigits(raw).replace(/[,٬،]/g, "").trim();
  const match = text.match(/(\d+(?:\.\d+)?)\s*([KMB]|هزار|میلیون|میلیارد)?/i);
  if (!match) return { installs: null };
  const unit = (match[2] ?? "").toLowerCase();
  const scale =
    unit === "k" || unit === "هزار"
      ? 1e3
      : unit === "m" || unit === "میلیون"
        ? 1e6
        : unit === "b" || unit === "میلیارد"
          ? 1e9
          : 1;
  const value = Math.round(parseFloat(match[1]) * scale);
  if (/کمتر|less|</i.test(text)) return { installs: 0, installsBelow: value };
  return { installs: value };
}

function jsonLdRating(
  html: string
): Pick<StoreReading, "rating" | "ratingCount"> {
  const match = html.match(/"aggregateRating"\s*:\s*\{([^}]*)\}/);
  if (!match) return { rating: null, ratingCount: null };
  const value = match[1].match(/"ratingValue"\s*:\s*"?([\d.]+)/);
  const count = match[1].match(/"ratingCount"\s*:\s*"?(\d+)/);
  return {
    rating: value ? Number(value[1]) : null,
    ratingCount: count ? Number(count[1]) : null,
  };
}

/**
 * Cafe Bazaar renders with Nuxt: the install range lives in the
 * __NUXT_DATA__ payload (a flat, index-referenced array), the rating in
 * the page's schema.org JSON-LD.
 */
export function parseBazaar(html: string): StoreReading {
  let range: string | null = null;
  const data = html.match(
    /<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (data) {
    try {
      const arr = JSON.parse(data[1]) as unknown[];
      const at = (i: unknown) => (typeof i === "number" ? arr[i] : i);
      for (const entry of arr) {
        if (entry && typeof entry === "object" && "installCount" in entry) {
          const install = at((entry as Record<string, unknown>).installCount);
          const value =
            install && typeof install === "object"
              ? at((install as Record<string, unknown>).range)
              : null;
          if (typeof value === "string") range = value;
          break;
        }
      }
    } catch {
      // Payload format changed — fall through to "unknown".
    }
  }
  return {
    ...(range ? parseInstallRange(range) : { installs: null }),
    ...jsonLdRating(html),
  };
}

/** Google Play (fetched with hl=en): "1M+" sits right before "Downloads". */
export function parseGooglePlay(html: string): StoreReading {
  const downloads = html.match(
    />\s*([\d.,]+\s*[KMB]?\+)\s*<\/div>\s*<div[^>]*>\s*Downloads/i
  );
  return {
    ...(downloads ? parseInstallRange(downloads[1]) : { installs: null }),
    ...jsonLdRating(html),
  };
}
