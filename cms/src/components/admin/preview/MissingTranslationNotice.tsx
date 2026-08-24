import Link from "next/link";
import type { Locale } from "@/lib/validation/shared";

/**
 * Task 07, section 7: "Do not silently publish English content as
 * Persian or vice versa. The behavior must be explicit." — this is
 * that explicit behavior. Rather than rendering the other locale's
 * content mislabeled, Preview stops and says so, and offers a direct
 * link to whichever locale *does* have a translation.
 */
const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fa: "Persian",
};

export default function MissingTranslationNotice({
  locale,
  availableLocales,
  previewBasePath,
}: {
  locale: Locale;
  availableLocales: Locale[];
  previewBasePath: string;
}) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
        No {LOCALE_LABELS[locale]} translation is available for this item.
      </p>
      {availableLocales.length > 0 ? (
        <p className="mt-1.5 text-sm text-amber-800 dark:text-amber-300">
          {availableLocales.length === 1 ? "It's" : "They're"} only translated
          into{" "}
          {availableLocales
            .map((available) => LOCALE_LABELS[available])
            .join(" and ")}
          .{" "}
          <Link
            href={`${previewBasePath}?locale=${availableLocales[0]}`}
            className="font-medium underline"
          >
            Preview in {LOCALE_LABELS[availableLocales[0]]} instead
          </Link>
        </p>
      ) : (
        <p className="mt-1.5 text-sm text-amber-800 dark:text-amber-300">
          This item has no translations at all yet.
        </p>
      )}
    </div>
  );
}
