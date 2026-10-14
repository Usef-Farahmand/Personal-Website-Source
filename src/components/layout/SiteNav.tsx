import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { getSiteContent } from "@/services/content/site.service";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileNav } from "@/components/layout/MobileNav";
import type { Locale } from "@/types/content";

/** Pages in the top bar, in order. The footer lists every page. */
const PRIMARY_NAV = [
  "about",
  "projects",
  "experience",
  "skills",
  "articles",
] as const;

/**
 * The one top bar for the whole site — the homepage hero and every other
 * page render this same component, so navigation looks and behaves the
 * same everywhere.
 *
 * `landing`: transparent, sits inside the hero; the end-side controls sit
 * over the orange photo panel, so the language switcher gets a dark pill
 * and the CTA stays dark.
 * `page`: the sticky, blurred bar above every other page, where the CTA
 * is the orange primary button.
 */
export async function SiteNav({
  locale,
  variant,
}: {
  locale: Locale;
  variant: "landing" | "page";
}) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "siteNav" });

  const links = PRIMARY_NAV.map((key) => ({
    href: `/${key}`,
    label: t(`nav.${key}`),
  }));

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10",
        variant === "landing" ? "py-4 lg:py-6" : "py-3.5"
      )}
    >
      <Link
        href="/"
        className="text-text-primary hover:text-accent flex items-center gap-2 text-base font-semibold transition-colors"
      >
        <BrandLogo size={32} priority />
        <span>{site.hero.name}</span>
      </Link>

      <NavLinks
        links={links}
        label={t("navLabel")}
        className="ms-10 hidden lg:flex xl:ms-14"
      />

      <div className="ms-auto flex items-center gap-3">
        <div
          className={cn(
            "hidden rounded-md lg:block",
            variant === "landing" && "bg-background/70 backdrop-blur-sm"
          )}
        >
          <LanguageSwitcher locale={locale} />
        </div>
        <Link
          href="/contact"
          className={cn(
            "hidden rounded-md px-5 py-2.5 text-sm font-semibold transition-colors sm:inline-flex",
            variant === "landing"
              ? "border-border bg-background text-text-primary hover:border-accent hover:text-accent border lg:border-transparent"
              : "bg-accent text-background hover:bg-accent-hover"
          )}
        >
          {t("letsTalk")}
        </Link>
        <MobileNav
          links={links}
          ctaHref="/contact"
          ctaLabel={t("letsTalk")}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          navLabel={t("navLabel")}
          languageSwitcher={<LanguageSwitcher locale={locale} />}
        />
      </div>
    </header>
  );
}
