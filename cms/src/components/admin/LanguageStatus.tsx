import type { LanguageStatusEntry } from "@/lib/queries/shared";
import type { Locale } from "@/lib/validation/shared";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fa: "FA",
};

/**
 * Renders e.g. "EN ✓  FA —" so a glance at a list row shows which
 * translations still need work. Each mark carries its own `aria-label`
 * ("translated" / "not translated") rather than relying on the ✓/— glyph
 * alone for meaning.
 */
export default function LanguageStatus({
  languages,
}: {
  languages: LanguageStatusEntry[];
}) {
  return (
    <ul
      className="flex items-center gap-2.5 text-xs"
      aria-label="Translation status"
    >
      {languages.map(({ locale, present }) => (
        <li
          key={locale}
          className="flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-400"
        >
          <span className="uppercase">{LOCALE_LABELS[locale]}</span>
          {present ? (
            <span
              aria-label="translated"
              className="text-emerald-600 dark:text-emerald-400"
            >
              ✓
            </span>
          ) : (
            <span
              aria-label="not translated"
              className="text-neutral-400 dark:text-neutral-600"
            >
              —
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
