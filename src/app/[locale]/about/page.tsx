import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Check,
  FileText,
  Gamepad2,
  GraduationCap,
  Sparkle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getProfileStats } from "@/services/content/stats.service";
import { getSiteContent } from "@/services/content/site.service";
import { listAchievements } from "@/services/content/achievements.service";
import { listRecommendations } from "@/services/content/recommendations.service";
import { listEducation } from "@/services/content/education.service";
import { formatMonthYear } from "@/lib/date";
import { brand } from "@/config/brand";
import { buildPageMetadata } from "@/lib/seo";
import { CornerHandles } from "@/components/ui/CornerHandles";
import { TypingRole } from "@/components/sections/landing/TypingRole";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DragScroller } from "@/components/ui/DragScroller";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { RecommendationCard } from "@/components/ui/RecommendationCard";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutBuildAreas } from "@/components/sections/AboutBuildAreas";
import { AboutDocuments } from "@/components/sections/AboutDocuments";
import { ResumeBanner } from "@/components/sections/ResumeBanner";
import { StudioBanner } from "@/components/sections/StudioBanner";
import { AboutCurrentFocus } from "@/components/sections/AboutCurrentFocus";
import { SocialUniverseSection } from "@/components/sections/SocialUniverseButton";
import { AboutFaq, type FaqItem } from "@/components/sections/AboutFaq";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContactContent } from "@/services/content/contact.service";
import { PERSON_ID, WEBSITE_ID, absoluteUrl } from "@/lib/structured-data";
import type { Locale, WhatIBuildDomain } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  const site = getSiteContent(locale);
  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description", {
      years: site.experienceYears,
      studio: site.studio.name,
    }),
    siteName: site.hero.name,
    image: brand.aboutPhoto.src,
  });
}

/**
 * Answers one question ("who is Usef Farahmand") and hands visitors off
 * to Projects/Articles/Contact — it never restates content that already
 * has a dedicated, deeper home elsewhere (Experience, Skills, Projects,
 * Articles, Achievements). Styled after the homepage hero: a two-column
 * intro with the illustration in a "selected object" card, a live stats
 * strip, numbered sections and an orange call-to-action panel.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);
  const [
    t,
    tPage,
    tLanding,
    tWhatIBuild,
    tAchievements,
    tCategory,
    tRecommendations,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "aboutPage" }),
    getTranslations({ locale, namespace: "landing" }),
    getTranslations({ locale, namespace: "whatIBuild" }),
    getTranslations({ locale, namespace: "achievements" }),
    getTranslations({ locale, namespace: "achievementCategory" }),
    getTranslations({ locale, namespace: "recommendations" }),
  ]);

  const buildAreaLabels = site.aboutBuildAreas.reduce<
    Record<WhatIBuildDomain, string>
  >(
    (labels, domain) => {
      labels[domain] = tWhatIBuild(domain);
      return labels;
    },
    {} as Record<WhatIBuildDomain, string>
  );

  const achievements = listAchievements(locale);
  const recommendations = listRecommendations(locale);
  const education = listEducation(locale);
  const tResume = await getTranslations({ locale, namespace: "resume" });

  const faqParams = {
    name: site.hero.name,
    studio: site.studio.name,
    email: getContactContent(locale).email,
  };
  const faqItems: FaqItem[] = (
    [
      "who",
      "availability",
      "services",
      "stack",
      "design",
      "studio",
      "career",
      "portfolio",
      "contact",
    ] as const
  ).map((key) => ({
    question: tPage(`faq.items.${key}.q`, faqParams),
    answer: tPage(`faq.items.${key}.a`, faqParams),
  }));

  // ProfilePage marks this as the canonical page *about* the Person
  // defined site-wide in [locale]/layout.tsx; FAQPage mirrors the visible
  // FAQ section word for word.
  const aboutUrl = absoluteUrl(locale, "/about");
  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${aboutUrl}#profile`,
    url: aboutUrl,
    name: `${t("title")} — ${site.hero.name}`,
    inLanguage: locale,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${aboutUrl}#faq`,
    inLanguage: locale,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const number = new Intl.NumberFormat(locale);
  const counts = getProfileStats(locale);
  const stats = [
    {
      value: counts.experienceYears,
      plus: true,
      label: tLanding("stats.years"),
    },
    { value: counts.projects, plus: false, label: tLanding("stats.projects") },
    { value: counts.articles, plus: false, label: tLanding("stats.articles") },
  ];

  return (
    <div className="mx-auto max-w-5xl overflow-x-clip px-4 py-16 sm:px-6">
      <JsonLd data={profilePageLd} />
      <JsonLd data={faqLd} />
      {/* ---- Intro ---- */}
      <section className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="landing-rise flex flex-col gap-5">
          <p
            dir="ltr"
            className="text-accent inline-flex items-center gap-2 self-start font-mono text-xs font-medium tracking-wider"
          >
            <span aria-hidden="true" className="bg-accent h-2 w-2" />
            ~/about
          </p>
          <p className="text-accent text-sm font-semibold ltr:tracking-[0.2em] ltr:uppercase">
            {tPage("eyebrow")}
          </p>
          <h1 className="text-text-primary text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-bold ltr:tracking-tight">
            {site.hero.name}
          </h1>
          <p className="border-accent bg-accent/10 text-text-primary relative self-start border-2 px-4 py-2 text-sm font-bold sm:text-base ltr:tracking-[0.12em] ltr:uppercase">
            <span aria-hidden="true" className="text-accent me-2">
              &gt;
            </span>
            {/* Same cycling roles as the homepage hero. */}
            <TypingRole
              roles={site.hero.roles}
              srLabel={site.hero.roles.join(", ")}
            />
            <CornerHandles />
          </p>
          <p className="text-text-secondary max-w-xl text-base leading-relaxed sm:text-lg">
            {site.about.introduction}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/contact"
              className="bg-accent text-background hover:bg-accent-hover group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-[0_8px_30px_-8px_rgb(249_115_22/0.6)] transition-colors"
            >
              {t("cta.contact")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <a
              href="#resume"
              className="border-accent/60 text-text-primary hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-md border bg-black/30 px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {t("cta.resume")}
            </a>
            <Link
              href="/projects"
              className="border-border text-text-primary hover:border-accent hover:text-accent inline-flex items-center rounded-md border bg-black/30 px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              {t("cta.projects")}
            </Link>
          </div>
        </div>

        <figure
          className="landing-rise relative mx-auto w-full max-w-md"
          style={{ "--delay": "150ms" } as React.CSSProperties}
        >
          <div
            aria-hidden="true"
            className="landing-fill absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-2xl sm:translate-x-5 sm:translate-y-5 rtl:-translate-x-3 rtl:-rotate-3 sm:rtl:-translate-x-5"
          >
            <div className="landing-scanlines absolute inset-0 rounded-2xl" />
          </div>
          <div className="border-accent relative border-2 bg-black p-1.5">
            <Image
              src={brand.aboutPhoto.src}
              alt={tPage("photoAlt", { name: site.hero.name })}
              width={brand.aboutPhoto.width}
              height={brand.aboutPhoto.height}
              priority
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="h-auto w-full"
            />
            <CornerHandles />
          </div>
          <Gamepad2
            aria-hidden="true"
            className="landing-float text-accent absolute -start-2 -top-6 h-10 w-10 -rotate-12 sm:-start-6"
          />
          <Sparkle
            aria-hidden="true"
            className="landing-float absolute -end-2 top-1/3 h-7 w-7 fill-white text-white [animation-delay:-2s]"
          />
          <figcaption className="border-border bg-background/90 absolute start-6 -bottom-6 flex items-baseline gap-2 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md">
            <span className="text-text-primary text-2xl font-bold">
              {number.format(counts.experienceYears)}
              <span className="text-accent">+</span>
            </span>
            <span className="text-text-secondary text-xs">
              {tLanding("stats.years")}
            </span>
          </figcaption>
        </figure>
      </section>

      {/* ---- Stats strip ---- */}
      <dl className="border-border bg-surface/60 mt-20 grid grid-cols-3 divide-x divide-[var(--color-border)] rounded-xl border backdrop-blur-sm rtl:divide-x-reverse">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse items-center px-3 py-6 text-center sm:py-8"
          >
            <dt className="text-text-secondary mt-1 text-xs sm:text-sm">
              {stat.label}
            </dt>
            <dd className="text-text-primary text-3xl font-bold sm:text-4xl">
              {number.format(stat.value)}
              {stat.plus && <span className="text-accent">+</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-24 flex flex-col gap-24">
        {/* ---- 01 Story + highlights ---- */}
        <section>
          <SectionHeading index={1} title={t("sections.story")} />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <AboutStory paragraphs={site.about.story} />
            <aside className="border-border bg-surface/60 relative self-start rounded-xl border p-6">
              <h3 className="text-text-primary text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
                {t("sections.highlights")}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {site.aboutPreview.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="bg-accent/15 text-accent mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-text-secondary text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <blockquote className="border-accent text-text-primary mt-6 border-s-2 ps-4 text-sm leading-relaxed italic">
                {site.aboutPreview.philosophy}
              </blockquote>
            </aside>
          </div>
        </section>

        {/* ---- 02 Studio ---- */}
        <section>
          <SectionHeading index={2} title={tPage("studio")} />
          <StudioBanner
            name={site.studio.name}
            url={site.studio.url}
            logoSrc={site.studio.logoSrc}
            role={site.studioIntro.role}
            description={site.studioIntro.description}
            ctaLabel={tPage("visitStudio")}
            opensInNewTab={tPage("opensInNewTab")}
          />
        </section>

        {/* ---- 03 Education ---- */}
        {education.length > 0 && (
          <section id="education" className="scroll-mt-24">
            <SectionHeading index={3} title={t("sections.education")} />
            <ul className="grid gap-4 sm:grid-cols-2">
              {education.map((entry) => (
                <li
                  key={entry.id}
                  className="border-border bg-surface/60 flex gap-4 rounded-xl border p-6"
                >
                  <span className="bg-accent/15 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="text-text-primary font-bold">
                      {entry.degree}
                      {locale === "fa" ? "، " : ", "}
                      {entry.field}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {entry.institution}
                    </p>
                    <p className="text-text-secondary text-xs ltr:font-mono">
                      {formatMonthYear(entry.startDate, locale)} –{" "}
                      {entry.endDate
                        ? formatMonthYear(entry.endDate, locale)
                        : tResume("present")}
                    </p>
                    {entry.note && (
                      <p className="text-text-secondary mt-1 text-sm leading-relaxed">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- 04 What I build ---- */}
        <section>
          <SectionHeading index={4} title={t("sections.whatIBuild")} />
          <AboutBuildAreas
            domains={site.aboutBuildAreas}
            labels={buildAreaLabels}
          />
        </section>

        {/* ---- 05 Achievements (no page of its own) ---- */}
        {achievements.length > 0 && (
          <section id="achievements" className="scroll-mt-24">
            <SectionHeading index={5} title={tAchievements("title")} />
            <DragScroller
              label={tAchievements("title")}
              previousLabel={tPage("previous")}
              nextLabel={tPage("next")}
            >
              {achievements.map((entry) => (
                <AchievementCard
                  key={entry.id}
                  achievement={entry}
                  categoryLabel={tCategory(entry.category)}
                  locale={locale}
                />
              ))}
            </DragScroller>
          </section>
        )}

        {/* ---- 06 Recommendations ---- */}
        {recommendations.length > 0 && (
          <section id="recommendations" className="scroll-mt-24">
            <SectionHeading index={6} title={tRecommendations("title")} />
            <DragScroller
              label={tRecommendations("title")}
              previousLabel={tPage("previous")}
              nextLabel={tPage("next")}
            >
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  locale={locale}
                  labels={{
                    readMore: tRecommendations("readMore"),
                    linkedinProfile: tRecommendations("linkedinProfile"),
                    personalWebsite: tRecommendations("personalWebsite"),
                    opensInNewTab: tRecommendations("opensInNewTab"),
                  }}
                />
              ))}
            </DragScroller>
            <div className="mt-2">
              <ViewAllLink
                href="/recommendations"
                label={tRecommendations("viewAll")}
              />
            </div>
          </section>
        )}

        {/* ---- 07 Resume & documents ---- */}
        <section id="resume" className="scroll-mt-24">
          <SectionHeading index={7} title={t("sections.documents")} />
          <div className="flex flex-col gap-4">
            <ResumeBanner locale={locale} />
            <AboutDocuments locale={locale} />
          </div>
        </section>

        {/* ---- 08 Current focus ---- */}
        <section>
          <SectionHeading index={8} title={t("sections.currentFocus")} />
          <AboutCurrentFocus items={site.about.currentFocus} />
        </section>

        {/* ---- 09 Connect ---- */}
        <section>
          <SectionHeading
            index={9}
            title={t("sections.social")}
            id="about-social-heading"
          />
          <SocialUniverseSection
            locale={locale}
            headingId="about-social-heading"
            className="mx-auto max-w-2xl"
          />
        </section>

        {/* ---- 10 FAQ ---- */}
        <section id="faq" className="scroll-mt-24">
          <SectionHeading index={10} title={tPage("faq.title")} />
          <AboutFaq items={faqItems} />
        </section>
      </div>

      {/* ---- CTA panel ---- */}
      <section className="relative isolate mt-24 overflow-hidden rounded-2xl px-6 py-12 sm:px-12">
        <div aria-hidden="true" className="landing-fill absolute inset-0 -z-10">
          <div className="landing-scanlines absolute inset-0" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-background text-3xl font-bold sm:text-4xl ltr:tracking-tight">
              {tPage("ctaTitle")}
            </h2>
            <p className="text-background/80 mt-3 text-base font-medium">
              {tPage("ctaText")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-background text-text-primary hover:text-accent inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors"
            >
              {t("cta.contact")}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
