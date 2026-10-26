import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentType, SVGProps } from "react";
import { InstagramIcon, YouTubeIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { getDirection } from "@/lib/locale";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale, SocialPlatform } from "@/types/content";

interface PlatformCard {
  platform: Extract<SocialPlatform, "instagram" | "youtube">;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** 3:2 landscape artwork in public/videos/. */
  image: string;
  /** Platform accent: the CTA and the card's hover glow. */
  buttonClass: string;
  glowClass: string;
}

/** Instagram first (left on wide screens, first when stacked). */
const CARDS: PlatformCard[] = [
  {
    platform: "instagram",
    Icon: InstagramIcon,
    image: "/videos/social-instagram.webp",
    buttonClass:
      "bg-[linear-gradient(90deg,#8a2be2_0%,#d6249f_45%,#fd5949_75%,#fdb045_100%)]",
    glowClass: "hover:shadow-[0_12px_40px_-12px_rgb(214_36_159/0.55)]",
  },
  {
    platform: "youtube",
    Icon: YouTubeIcon,
    image: "/videos/social-youtube.webp",
    buttonClass: "bg-[linear-gradient(180deg,#ff3b30_0%,#e00000_100%)]",
    glowClass: "hover:shadow-[0_12px_40px_-12px_rgb(255_0_0/0.5)]",
  },
];

const IMAGE = { width: 1200, height: 800 } as const;

/**
 * Two promotional cards above the videos grid — Instagram, then YouTube —
 * each with its own artwork, a one-line pitch and a real link styled as
 * the platform's CTA. Side by side from 640px, stacked below.
 *
 * URLs come from the site's one social-links list (site.data.ts); a
 * platform without an enabled link there gets no card rather than a dead
 * button.
 */
export async function SocialBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "socialBanner" });
  const links = getSiteContent(locale).socialLinks;
  const cards = CARDS.flatMap((card) => {
    const link = links.find((l) => l.platform === card.platform && l.enabled);
    return link ? [{ ...card, url: link.url }] : [];
  });

  if (cards.length === 0) return null;
  const dir = getDirection(locale);

  return (
    // dir="ltr" keeps Instagram on the left in Persian too; each card
    // switches back to the page's own direction for its text.
    <section
      aria-label={t("label")}
      dir="ltr"
      className="mb-14 grid grid-cols-1 gap-5 sm:mb-16 sm:grid-cols-2 lg:gap-6"
    >
      {cards.map(({ platform, Icon, image, buttonClass, glowClass, url }) => (
        <article
          key={platform}
          dir={dir}
          className={cn(
            "border-border bg-surface flex flex-col overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-shadow duration-300 motion-reduce:transition-none",
            glowClass
          )}
        >
          {/* Decorative: the platform name and link carry the meaning. */}
          <Image
            src={image}
            width={IMAGE.width}
            height={IMAGE.height}
            alt=""
            priority
            sizes="(min-width: 1152px) 552px, (min-width: 640px) 50vw, 100vw"
            draggable={false}
            className="aspect-[3/2] h-auto w-full object-cover select-none"
          />
          <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
            <div className="min-w-0">
              {/* Not a heading: this sits above the page's h1. */}
              <p className="text-text-primary flex items-center gap-2 text-base font-semibold">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t(`platform.${platform}`)}
              </p>
              <p className="text-text-secondary mt-1 text-sm">
                {t(`tagline.${platform}`)}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-auto flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold tracking-wide whitespace-nowrap text-white uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_6px_18px_-6px_rgb(0_0_0/0.6)] transition-[transform,filter] duration-150 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white active:scale-[0.97] motion-reduce:transition-none sm:w-auto sm:self-start",
                buttonClass
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t(`cta.${platform}`)}</span>
              <span className="sr-only"> {t("opensInNewTab")}</span>
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
