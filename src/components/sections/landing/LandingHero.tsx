import type { CSSProperties } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BrainCircuit,
  Gamepad2,
  Plus,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { brand } from "@/config/brand";
import { getSiteContent } from "@/services/content/site.service";
import { getProfileStats } from "@/services/content/stats.service";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import { TechIcon } from "@/components/ui/TechIcon";
import { CornerHandles } from "@/components/ui/CornerHandles";
import { SiteNav } from "@/components/layout/SiteNav";
import { TypingRole } from "@/components/sections/landing/TypingRole";
import type { TechIconSlug } from "@/lib/techIconPaths";
import type { Locale } from "@/types/content";

/** The "My Stack" rail: a brand mark where one exists, otherwise a
 *  generic lucide icon (AI has no single brand). */
const STACK: readonly (
  { name: string; slug: TechIconSlug } | { name: string; icon: LucideIcon }
)[] = [
  { name: "Unity", slug: "unity" },
  { name: "Adobe Photoshop", slug: "adobephotoshop" },
  { name: "Figma", slug: "figma" },
  { name: "AI", icon: BrainCircuit },
];

/** Inline entrance delay for one `.landing-rise` element. */
const rise = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * The whole homepage: a single, non-scrolling screen (`h-dvh` +
 * `overflow-hidden`). It renders the shared SiteNav itself, inside the
 * hero, since the sticky site header/footer are hidden here (see
 * SiteChrome).
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
  // Projects/articles are exact, live counts (see getProfileStats); only
  // the years figure is a "6+" style lower bound.
  const counts = getProfileStats(locale);
  const stats = [
    { value: counts.experienceYears, plus: true, label: t("stats.years") },
    { value: counts.projects, plus: false, label: t("stats.projects") },
    { value: counts.articles, plus: false, label: t("stats.articles") },
  ];

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

      {/* Same height as the sticky header on other pages, including its
          1px bottom border (transparent here), so the bar doesn't jump
          when navigating between the hero and a page. */}
      <div className="shrink-0 border-b border-transparent">
        <SiteNav locale={locale} variant="landing" />
      </div>

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
              <CornerHandles />
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
                  {stat.plus && <span className="text-accent">+</span>}
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
          {/* Label, divider and icons are separate flex items stacked top to
              bottom, so the divider always sits between the label and the
              icons. (Inside one vertical-writing-mode span, RTL reverses
              the inline order and puts the divider above the label.) */}
          <div className="absolute end-0 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:-end-4">
            <span className="text-background text-xs font-bold [writing-mode:vertical-rl] ltr:tracking-[0.3em] ltr:uppercase">
              {t("stack")}
            </span>
            <span aria-hidden="true" className="bg-background h-10 w-0.5" />
            <ul className="flex flex-col items-center gap-3">
              {STACK.map((item) => (
                <li
                  key={item.name}
                  title={item.name}
                  className="bg-background text-accent flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
                >
                  {"slug" in item ? (
                    <TechIcon slug={item.slug} className="h-5 w-5" />
                  ) : (
                    <>
                      <item.icon aria-hidden="true" className="h-5 w-5" />
                      <span className="sr-only">{item.name}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
