import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Gamepad2, Plus, Sparkle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { brand } from "@/config/brand";
import { getSiteContent } from "@/services/content/site.service";
import { listProjects } from "@/services/content/projects.service";
import { listArticles } from "@/services/content/articles.service";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { TechIcon } from "@/components/ui/TechIcon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LandingMenu } from "@/components/sections/landing/LandingMenu";
import { TypingRole } from "@/components/sections/landing/TypingRole";
import type { TechIconSlug } from "@/lib/techIconPaths";
import type { Locale } from "@/types/content";

const NAV_KEYS = [
  "about",
  "projects",
  "experience",
  "skills",
  "articles",
] as const;

const STACK: readonly TechIconSlug[] = [
  "unity",
  "godotengine",
  "cocos",
  "figma",
];

/** Inline entrance delay for one `.landing-rise` element. */
const rise = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * The whole homepage: a single, non-scrolling screen (`h-dvh` +
 * `overflow-hidden`) with its own navigation to every section page,
 * since the site header/footer are hidden here (see SiteChrome).
 *
 * Text column on the start side, the photo over a warm slanted panel on
 * the end side; below `lg` the photo takes whatever height the text
 * leaves, so the page still fits one screen on phones. Lower-priority
 * blocks (intro, stats) drop out on short viewports instead of
 * overflowing.
 */
export async function LandingHero({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const [t, tSocial] = await Promise.all([
    getTranslations({ locale, namespace: "landing" }),
    getTranslations({ locale, namespace: "socialLinks" }),
  ]);

  const number = new Intl.NumberFormat(locale);
  const stats = [
    { value: site.experienceYears, label: t("stats.years") },
    { value: listProjects(locale).length, label: t("stats.projects") },
    { value: listArticles(locale).length, label: t("stats.articles") },
  ];

  const navLinks = NAV_KEYS.map((key) => ({
    href: `/${key}`,
    label: t(`nav.${key}`),
  }));

  const socialLinks = site.socialLinks.filter((link) => link.enabled);

  return (
    <section className="relative isolate flex h-dvh flex-col overflow-hidden">
      {/* ---- Backdrop ---- */}
      <div aria-hidden="true" className="landing-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="bg-accent/15 absolute -start-48 -bottom-48 -z-10 h-[36rem] w-[36rem] rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="landing-panel absolute inset-y-0 end-0 -z-10 hidden w-[38%] lg:block"
      >
        <div className="landing-scanlines absolute inset-0" />
      </div>

      {/* ---- Top bar ---- */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
        <Link
          href="/"
          className="text-text-primary hover:text-accent flex items-center gap-2 text-base font-semibold transition-colors"
        >
          <BrandLogo size={32} priority />
          <span>{site.hero.name}</span>
        </Link>

        <nav
          aria-label={t("navLabel")}
          className="ms-10 hidden items-center gap-7 lg:flex xl:ms-14"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-primary/80 hover:text-accent after:bg-accent relative py-1 text-sm font-medium uppercase transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100 ltr:tracking-wider rtl:after:origin-right"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-3">
          <div className="bg-background/70 hidden rounded-md backdrop-blur-sm lg:block">
            <LanguageSwitcher locale={locale} />
          </div>
          <Link
            href="/contact"
            className="border-border bg-background text-text-primary hover:border-accent hover:text-accent hidden rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors sm:inline-flex lg:border-transparent"
          >
            {t("letsTalk")}
          </Link>
          <LandingMenu
            links={navLinks}
            ctaHref="/contact"
            ctaLabel={t("letsTalk")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            navLabel={t("navLabel")}
            languageSwitcher={<LanguageSwitcher locale={locale} />}
          />
        </div>
      </header>

      {/* ---- Body ---- */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-10">
        {/* Text column */}
        <div className="relative z-10 flex flex-col gap-4 pt-2 pb-4 sm:gap-5 lg:justify-center lg:gap-6 lg:py-8">
          <p
            className="landing-rise text-text-secondary flex items-center gap-2 text-xs sm:text-sm"
            style={rise(0)}
          >
            <span className="relative flex h-2 w-2">
              {site.availability.isAvailable && (
                <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  site.availability.isAvailable ? "bg-success" : "bg-disabled"
                }`}
              />
            </span>
            {site.hero.availabilityStatus}
          </p>

          <div className="landing-rise" style={rise(100)}>
            <p className="text-accent text-sm font-semibold sm:text-base ltr:tracking-[0.2em] ltr:uppercase">
              {site.hero.greeting}
            </p>
            <h1 className="text-text-primary mt-1 text-[clamp(2.25rem,6.5vw,5.25rem)] leading-[1.02] font-bold ltr:tracking-tight">
              {site.hero.name}
            </h1>
          </div>

          {/* Role badge: a selected "game object" with corner handles. */}
          <div className="landing-rise self-start" style={rise(220)}>
            <p className="border-accent bg-accent/10 text-text-primary relative border-2 px-4 py-2 text-base font-bold sm:px-5 sm:text-xl lg:text-2xl ltr:tracking-[0.15em] ltr:uppercase">
              <span aria-hidden="true" className="text-accent me-2">
                &gt;
              </span>
              <TypingRole
                roles={site.hero.roles}
                srLabel={site.hero.roles.join(", ")}
              />
              {(
                [
                  "-top-1.5 -start-1.5",
                  "-top-1.5 -end-1.5",
                  "-bottom-1.5 -start-1.5",
                  "-bottom-1.5 -end-1.5",
                ] as const
              ).map((corner) => (
                <span
                  key={corner}
                  aria-hidden="true"
                  className={`bg-accent absolute h-2.5 w-2.5 ${corner}`}
                />
              ))}
            </p>
          </div>

          <div
            className="landing-rise hidden max-w-xl lg:[@media(min-height:680px)]:block [@media(min-height:860px)]:block"
            style={rise(320)}
          >
            <p className="text-text-secondary line-clamp-3 text-sm leading-relaxed sm:text-base">
              {site.hero.introduction}
            </p>
          </div>

          <div
            className="landing-rise flex flex-wrap items-center gap-3"
            style={rise(420)}
          >
            <Link
              href="/contact"
              className="bg-accent text-background hover:bg-accent-hover group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-[0_8px_30px_-8px_rgb(249_115_22/0.6)] transition-colors"
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href="/projects"
              className="border-border text-text-primary hover:border-accent hover:text-accent inline-flex items-center rounded-md border bg-black/30 px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          <nav
            aria-label={tSocial("groupLabel")}
            className="landing-rise flex flex-wrap items-center gap-2"
            style={rise(520)}
          >
            {socialLinks.map(({ id, platform, url }) => {
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
                  className="border-border text-text-secondary hover:border-accent hover:bg-accent/10 hover:text-accent flex h-9 w-9 items-center justify-center rounded-md border bg-black/30 transition-colors sm:h-10 sm:w-10"
                >
                  <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                </a>
              );
            })}
          </nav>

          <dl
            className="landing-rise mt-1 hidden gap-8 sm:gap-12 lg:mt-4 [@media(min-height:740px)]:flex"
            style={rise(620)}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-text-primary text-2xl font-bold sm:text-4xl">
                  {number.format(stat.value)}
                  <span className="text-accent">+</span>
                </dd>
                <dd
                  aria-hidden="true"
                  className="text-text-secondary mt-1 text-xs sm:text-sm"
                >
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Photo column */}
        <div className="relative min-h-0 flex-1 lg:h-full">
          <div
            aria-hidden="true"
            className="landing-panel absolute inset-x-0 top-[18%] bottom-0 rounded-t-2xl lg:hidden"
          >
            <div className="landing-scanlines absolute inset-0" />
          </div>

          <div
            className="landing-rise absolute inset-x-0 top-0 bottom-0 lg:top-[4%]"
            style={rise(150)}
          >
            <Image
              src={brand.heroPhoto.src}
              alt={t("photoAlt", { name: site.hero.name })}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-contain object-bottom drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
            />
          </div>

          {/* Decorations */}
          <Gamepad2
            aria-hidden="true"
            className="landing-float text-accent absolute start-[4%] top-[22%] hidden h-10 w-10 -rotate-12 lg:block"
          />
          <Sparkle
            aria-hidden="true"
            className="landing-float absolute end-[14%] top-[30%] h-6 w-6 fill-white text-white [animation-delay:-2s] lg:h-8 lg:w-8"
          />
          <Plus
            aria-hidden="true"
            className="landing-float text-background absolute start-[16%] bottom-[12%] hidden h-7 w-7 [animation-delay:-4s] lg:block"
            strokeWidth={4}
          />

          {/* Stack rail */}
          <div className="absolute end-0 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:-end-4">
            <span className="text-background flex items-center gap-3 text-xs font-bold [writing-mode:vertical-rl] ltr:tracking-[0.3em] ltr:uppercase">
              {t("stack")}
              <span className="bg-background h-10 w-0.5" />
            </span>
            {STACK.map((slug) => (
              <span
                key={slug}
                className="bg-background text-accent flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
              >
                <TechIcon slug={slug} className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
