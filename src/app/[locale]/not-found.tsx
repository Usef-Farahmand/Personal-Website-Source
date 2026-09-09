import { getTranslations } from "next-intl/server";
import { NotFoundTerminal } from "@/components/sections/NotFoundTerminal";
import { getSiteContent } from "@/services/content/site.service";

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
 *
 * The heading/description below are unchanged from before and stay
 * fully localized — they're the accessible, no-JS-safe core of this
 * page. <NotFoundTerminal> is a client-side enhancement added on top of
 * that; its own "Go home" / "View projects" links (localized via
 * `tNav` below) are the page's only wayfinding buttons and, like the
 * heading, render unconditionally — not gated behind boot state — so
 * they still work without JavaScript. Its terminal content itself is
 * intentionally always English (see that component's doc comment for
 * why), which is also why its site content is fetched with the fixed
 * "en" locale below rather than the visited `locale`.
 */
export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  const site = getSiteContent("en");

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="text-accent text-small font-mono">404</p>
      <h1 className="text-h3 text-text-primary font-semibold">{t("title")}</h1>
      <p className="text-text-secondary text-body max-w-md">
        {t("description")}
      </p>

      <NotFoundTerminal
        professionalTitle={site.hero.professionalTitle}
        highlights={site.aboutPreview.highlights}
        goHomeLabel={tNav("home")}
        viewProjectsLabel={tNav("projects")}
      />
    </div>
  );
}
