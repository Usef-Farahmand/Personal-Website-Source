import { getTranslations } from "next-intl/server";
import { loaderConfig } from "@/config/loader";
import type { Locale } from "@/types/content";
import { InlineScript } from "./InlineScript";
import { LoaderCharacters } from "./LoaderCharacters";
import { LoaderRoom } from "./LoaderRoom";
import { SiteLoaderController } from "./SiteLoaderController";

/**
 * Runs during HTML parsing, right after the overlay markup and before the
 * first paint. The overlay renders as data-state="pending" (hidden), so
 * without JavaScript it never appears. This script turns it on ("boot")
 * once per browser session, or off ("skip") for repeat loads in the same
 * session and for crawlers.
 */
const bootScript = `(function(){var e=document.getElementById(${JSON.stringify(
  loaderConfig.elementId
)});if(!e)return;var s="boot";try{if(/bot|crawl|spider|slurp/i.test(navigator.userAgent)||sessionStorage.getItem(${JSON.stringify(
  loaderConfig.sessionKey
)}))s="skip";else sessionStorage.setItem(${JSON.stringify(
  loaderConfig.sessionKey
)},"1")}catch(_){}e.setAttribute("data-state",s)})()`;

/**
 * The first-load loading screen: a dark game-dev room (layer 1), the
 * animated characters (layer 2) and the name, role and progress bar
 * (layer 3). Decorative only — it's aria-hidden and the page underneath is
 * already in the accessibility tree. Shown for 10s on the first load of a
 * session. Lifecycle: SiteLoaderController.
 */
export async function SiteLoader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "loader" });

  return (
    <>
      <SiteLoaderController>
        <div className="site-loader__scene">
          <LoaderRoom />
          <div className="site-loader__characters">
            <div className="site-loader__characters-inner">
              <LoaderCharacters />
            </div>
          </div>
          <div className="site-loader__ui">
            <div className="site-loader__ui-inner">
              <p className="site-loader__name">{t("name")}</p>
              <p className="site-loader__role">{t("role")}</p>
              <div className="site-loader__status">
                <p className="site-loader__message">{t("message")}</p>
                <div className="site-loader__bar" />
              </div>
            </div>
          </div>
        </div>
      </SiteLoaderController>
      <InlineScript html={bootScript} />
    </>
  );
}
