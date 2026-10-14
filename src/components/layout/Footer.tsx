import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/services/content/site.service";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Locale } from "@/types/content";

/** One slim row: copyright on one side, social icons on the other. Page
 *  navigation lives in the header only. */
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
