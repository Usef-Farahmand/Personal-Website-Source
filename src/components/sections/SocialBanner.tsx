import { getTranslations } from "next-intl/server";
import { InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale, SocialPlatform } from "@/types/content";

/** Banner artwork (alpha WebP, the head rises above the frame). The mobile
 *  version is the centre of the same art: Instagram phone, character,
 *  YouTube logo. */
const ART = {
  desktop: { src: "/videos/social-banner.webp", width: 1940, height: 372 },
  mobile: {
    src: "/videos/social-banner-mobile.webp",
    width: 1060,
    height: 372,
  },
} as const;

const CTAS = [
  {
    platform: "instagram",
    Icon: InstagramIcon,
    // Instagram's brand gradient, as in the supplied button art. Physical
    // left/right (not start/end): the artwork doesn't mirror in RTL.
    className:
      "bg-[linear-gradient(90deg,#8a2be2_0%,#d6249f_45%,#fd5949_75%,#fdb045_100%)] lg:left-[15%]",
  },
  {
    platform: "youtube",
    Icon: YouTubeIcon,
    className:
      "bg-[linear-gradient(180deg,#ff3b30_0%,#e00000_100%)] lg:right-[14%]",
  },
] as const satisfies readonly {
  platform: SocialPlatform;
  Icon: unknown;
  className: string;
}[];

/**
 * Promotes the YouTube channel and Instagram page above the videos grid.
 * The artwork is one image; on laptops and up the two CTAs are real links
 * laid over its bottom edge — under the Instagram phone (left) and the
 * YouTube logo (right), clear of the character's hoodie in the middle.
 * Below that they sit under the art, side by side (stacked when there's
 * no room); phones get the centre of the art on its own.
 *
 * URLs come from the site's one social-links list (site.data.ts); a
 * platform without an enabled link there gets no button rather than a
 * dead one.
 */
export async function SocialBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "socialBanner" });
  const links = getSiteContent(locale).socialLinks;
  const ctas = CTAS.flatMap((cta) => {
    const link = links.find((l) => l.platform === cta.platform && l.enabled);
    return link ? [{ ...cta, url: link.url }] : [];
  });

  return (
    <section aria-label={t("label")} className="mb-14 sm:mb-16">
      <div className="relative">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={ART.mobile.src}
            width={ART.mobile.width}
            height={ART.mobile.height}
          />
          {/* Decorative: the links below carry the meaning. */}
          <img
            src={ART.desktop.src}
            width={ART.desktop.width}
            height={ART.desktop.height}
            alt=""
            fetchPriority="high"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </picture>

        <ul className="mt-4 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:mx-auto sm:max-w-xl lg:contents">
          {ctas.map(({ platform, Icon, className, url }) => (
            <li key={platform} className="flex lg:contents">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex min-h-11 w-full items-center justify-center gap-2.5 rounded-full px-4 py-2.5 text-center text-xs font-extrabold tracking-wide text-white uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_6px_18px_-6px_rgb(0_0_0/0.6)] transition-[transform,filter] duration-150 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white active:scale-[0.97] motion-reduce:transition-none lg:absolute lg:bottom-0 lg:w-[22%] lg:translate-y-1/2 lg:text-[clamp(0.7rem,0.3rem+0.45vw,0.9rem)] xl:px-5",
                  className
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{t(`cta.${platform}`)}</span>
                <span className="sr-only"> {t("opensInNewTab")}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
