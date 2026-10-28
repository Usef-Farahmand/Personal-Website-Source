import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/services/content/site.service";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SUPPORT_IMAGES } from "@/config/support";
import type { Locale } from "@/types/content";

/** A compact Support callout, then one slim row: copyright on one side,
 *  social icons on the other. Page navigation lives in the header only. */
export async function Footer({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const [t, tSocial] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "socialLinks" }),
  ]);

  return (
    <footer className="border-border relative shrink-0 border-t">
      <div
        aria-hidden="true"
        className="via-accent absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />
      {/* Support callout: small character, one line of copy, one link. */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-10">
        <div className="border-border bg-surface/50 flex items-center gap-3 rounded-xl border px-3 py-2 sm:gap-4 sm:px-4">
          <Image
            src={SUPPORT_IMAGES.character.src}
            width={SUPPORT_IMAGES.character.width}
            height={SUPPORT_IMAGES.character.height}
            alt={t("support.imageAlt")}
            sizes="6rem"
            className="h-14 w-auto shrink-0 object-contain sm:h-16"
          />
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-sm font-semibold">
              {t("support.title")}
            </p>
            <p className="text-text-secondary hidden text-xs sm:block">
              {t("support.text")}
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#f6b40e]/50 px-3 py-2 text-xs font-semibold text-[#f6b40e] transition-colors hover:bg-[#f6b40e]/10 sm:text-sm"
          >
            {t("support.link")}
            <ArrowRight
              className="h-3.5 w-3.5 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <p className="text-text-secondary flex min-w-0 items-center gap-2 text-xs">
          <BrandLogo size={18} className="hidden sm:block" />
          <span className="truncate">
            &copy; {new Date().getFullYear()} {site.hero.name}.
            <span className="hidden sm:inline"> {t("rights")}</span>
          </span>
        </p>
        <nav
          aria-label={tSocial("groupLabel")}
          className="flex shrink-0 items-center gap-0.5 sm:gap-1.5"
        >
          {site.socialLinks
            .filter((link) => link.enabled)
            .map(({ id, platform, url }) => {
              const Icon = SOCIAL_LINK_ICON[platform];
              const isEmail = platform === "email";
              return (
                <a
                  key={id}
                  href={url}
                  target={isEmail ? undefined : "_blank"}
                  rel={isEmail ? undefined : "noopener noreferrer"}
                  aria-label={SOCIAL_PLATFORM_NAME[platform]}
                  title={SOCIAL_PLATFORM_NAME[platform]}
                  className="text-text-secondary hover:bg-accent/10 hover:text-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors sm:h-8 sm:w-8"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
        </nav>
      </div>
    </footer>
  );
}
