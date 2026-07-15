import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { RouteAnnouncer } from "@/components/layout/RouteAnnouncer";
import type { Locale } from "@/content/types";

/**
 * The shell every content page renders inside: skip link → header → main
 * landmark → footer, plus the route announcer for accessible client-side
 * navigation. This is the "Default Layout" in the layout architecture —
 * the only variant with a concrete consumer today.
 *
 * Future variants (Landing, Minimal, Error) follow the same pattern —
 * a component taking `{ locale, children }` and composing whichever
 * landmarks that context needs — but aren't built until a real page
 * needs one:
 *   - Landing: no header nav weight, hero-first, still needs Footer + a11y
 *   - Minimal: header + main only, no footer (e.g. a future embed view)
 *   - Error: main only, centered content, still wrapped in Header/Footer
 *     for wayfinding — likely the smallest delta from Default, arriving
 *     alongside the first custom not-found.tsx / error.tsx.
 */
export async function DefaultLayout({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "accessibility" });

  return (
    <>
      <SkipToContent label={t("skipToContent")} />
      <Header locale={locale} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer locale={locale} />
      <RouteAnnouncer />
    </>
  );
}
