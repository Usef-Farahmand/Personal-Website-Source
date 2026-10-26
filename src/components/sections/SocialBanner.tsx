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
  /** Where the CTA pill sits over the artwork, in % of the image
   *  (physical sides: the art doesn't mirror in RTL). */
  buttonPosition: string;
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
    // Bottom-right corner, on the desk below the phone.
    buttonPosition: "right-[3%] bottom-[3%]",
  },
  {
    platform: "youtube",
    Icon: YouTubeIcon,
    image: "/videos/social-youtube.webp",
    buttonClass: "bg-[linear-gradient(180deg,#ff3b30_0%,#e00000_100%)]",
    glowClass: "hover:shadow-[0_12px_40px_-12px_rgb(255_0_0/0.5)]",
    // Under his open hand, below the YouTube logo.
    buttonPosition: "left-[73%] top-[76%] -translate-x-1/2 -translate-y-1/2",
  },
];

const IMAGE = { width: 1200, height: 800 } as const;

/**
 * Two promotional cards above the videos grid — Instagram, then YouTube.
 * Each card is one link to the platform: its artwork with the platform's
 * CTA pill drawn over it. Side by side from 640px, stacked below.
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
    // switches back to the page's own direction for its label.
    <section
      aria-label={t("label")}
      dir="ltr"
      className="mb-14 grid grid-cols-1 gap-5 sm:mb-16 sm:grid-cols-2 lg:gap-6"
    >
      {cards.map(
        ({
          platform,
          Icon,
          image,
          buttonClass,
          glowClass,
          buttonPosition,
          url,
        }) => (
          // The whole card is the link; the CTA pill is part of it, drawn
          // over the artwork where the art leaves room for it.
          <a
            key={platform}
            dir={dir}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(`cta.${platform}`)} — ${t(`platform.${platform}`)} ${t("opensInNewTab")}`}
            className={cn(
              "group border-border [container-type:inline-size] relative block overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-[box-shadow,transform] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-accent) active:scale-[0.99] motion-reduce:transition-none",
              glowClass
            )}
          >
            {/* Image and CTA zoom together on hover, as one picture. */}
            <div className="relative transition-transform duration-500 ease-(--motion-ease-smooth) group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
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
              <span
                aria-hidden="true"
                className={cn(
                  "absolute flex items-center justify-center gap-[0.5em] rounded-full px-[1.15em] py-[0.7em] text-[clamp(0.62rem,3cqi,0.9rem)] font-extrabold tracking-wide whitespace-nowrap text-white uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_20px_-6px_rgb(0_0_0/0.7)] transition-[filter] duration-150 group-hover:brightness-110 motion-reduce:transition-none",
                  buttonClass,
                  buttonPosition
                )}
              >
                <Icon className="h-[1.3em] w-[1.3em] shrink-0" />
                {t(`cta.${platform}`)}
              </span>
            </div>
          </a>
        )
      )}
    </section>
  );
}
