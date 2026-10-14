import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { brand } from "@/config/brand";
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
    // Fixed height (see .viewport-page in utilities.css): the
    // illustration and message on one side, the fixed-size console on
    // the other, centered in the screen.
    <div className="viewport-page">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:content-center lg:items-center lg:gap-14 lg:py-10">
        <div className="landing-rise flex shrink-0 items-center gap-4 lg:flex-col lg:items-start lg:gap-0">
          <Image
            src={brand.notFoundPhoto.src}
            alt={t("photoAlt", { name: site.hero.name })}
            width={brand.notFoundPhoto.width}
            height={brand.notFoundPhoto.height}
            priority
            sizes="(min-width: 1024px) 26rem, 7rem"
            className="h-24 w-auto shrink-0 drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)] sm:h-32 lg:h-auto lg:max-h-[42vh] lg:w-full lg:max-w-md lg:object-contain [@media(max-height:700px)]:h-16"
          />
          <div className="min-w-0 lg:mt-6">
            <p
              dir="ltr"
              className="text-accent inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider"
            >
              <span aria-hidden="true" className="bg-accent h-2 w-2" />
              ~/404
            </p>
            <h1 className="text-text-primary mt-2 text-2xl font-bold sm:text-4xl ltr:tracking-tight">
              {t("title")}
            </h1>
            <div
              aria-hidden="true"
              className="bg-accent mt-4 hidden h-1 w-14 sm:block"
            />
            <p className="text-text-secondary mt-2 max-w-md text-sm sm:mt-4 sm:text-base">
              {t("description")}
            </p>
          </div>
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
