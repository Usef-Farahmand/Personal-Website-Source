import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Renders inside [locale]/layout.tsx, so it inherits <html>/<body>,
 * theming, and Header/Footer for free — this is the "Error" layout
 * variant DefaultLayout's doc comment already anticipated ("main only,
 * centered content, still wrapped in Header/Footer for wayfinding").
 *
 * Required to exist at all: without it, Next.js falls back to the root
 * app directory's default not-found handling for any unmatched path
 * under a locale (e.g. /en/typo), which renders under the root layout
 * (src/app/layout.tsx) instead — that layout intentionally has no
 * <html>/<body> of its own (see its own doc comment), so that fallback
 * crashes with "Missing <html> and <body> tags in the root layout."
 * See also src/app/not-found.tsx, the root-level fallback for paths
 * that don't reach a locale segment at all.
 */
export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <p className="text-accent text-small font-mono">404</p>
      <h1 className="text-h3 text-text-primary font-semibold">{t("title")}</h1>
      <p className="text-text-secondary text-body">{t("description")}</p>
      <Link
        href="/"
        className="bg-accent text-background hover:bg-accent-hover text-small rounded-md px-5 py-2.5 font-medium transition-colors"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
