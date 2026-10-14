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
    // Fixed height (see .viewport-page in utilities.css): the message on
    // one side, the console filling the rest of the screen on the other.
    <div className="viewport-page">
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:py-10">
        <div className="landing-rise flex shrink-0 flex-col justify-center lg:w-[38%]">
          <p
            dir="ltr"
            className="text-accent inline-flex items-center gap-2 self-start font-mono text-xs font-medium tracking-wider"
          >
            <span aria-hidden="true" className="bg-accent h-2 w-2" />
            ~/404
          </p>
          <p
            aria-hidden="true"
            className="text-accent mt-3 hidden font-mono text-[clamp(4.5rem,11vw,8.5rem)] leading-none font-bold sm:block"
          >
            404
          </p>
          <h1 className="text-text-primary mt-2 text-3xl font-bold sm:mt-4 sm:text-4xl ltr:tracking-tight">
            {t("title")}
          </h1>
          <div aria-hidden="true" className="bg-accent mt-4 h-1 w-14" />
          <p className="text-text-secondary mt-4 max-w-md text-sm sm:text-base">
            {t("description")}
          </p>
        </div>

        <NotFoundTerminal
          professionalTitle={site.hero.professionalTitle}
          highlights={site.aboutPreview.highlights}
          goHomeLabel={tNav("home")}
          viewProjectsLabel={tNav("projects")}
        />
      </div>
    </div>
  );
}
