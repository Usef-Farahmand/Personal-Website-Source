import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteContent } from "@/services/content/site.service";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Locale } from "@/types/content";

/** Every page, so the footer doubles as a sitemap for the pages that
 *  don't fit in the top bar. */
const FOOTER_NAV = [
  "about",
  "projects",
  "experience",
  "skills",
  "articles",
  "learning",
  "recommendations",
  "contact",
] as const;

export async function Footer({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const [t, tNav, tSocial] = await Promise.all([
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "siteNav" }),
    getTranslations({ locale, namespace: "socialLinks" }),
  ]);

  return (
    <footer className="border-border relative mt-16 overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="via-accent absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Link
            href="/"
            className="text-text-primary hover:text-accent flex items-center gap-2 font-semibold transition-colors"
          >
            <BrandLogo size={28} />
            {site.hero.name}
          </Link>

          <nav
            aria-label={tNav("footerNavLabel")}
            className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 lg:grid-cols-5"
          >
            {FOOTER_NAV.map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="text-text-secondary hover:text-accent text-sm transition-colors"
              >
                {tNav(`nav.${key}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-border flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-secondary text-xs">
            &copy; {new Date().getFullYear()} {site.hero.name}. {t("rights")}
          </p>
          <nav
            aria-label={tSocial("groupLabel")}
            className="flex flex-wrap items-center gap-2"
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
                    className="border-border text-text-secondary hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
