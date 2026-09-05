import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/services/content/site.service";
import { brand } from "@/config/brand";
import { buildAlternates } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutBuildAreas } from "@/components/sections/AboutBuildAreas";
import { AboutDocuments } from "@/components/sections/AboutDocuments";
import { AboutCurrentFocus } from "@/components/sections/AboutCurrentFocus";
import { AboutSocialLinks } from "@/components/sections/AboutSocialLinks";
import { AboutCta } from "@/components/sections/AboutCta";
import type { Locale, SocialPlatform, WhatIBuildDomain } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const site = getSiteContent(locale);
  return {
    title: t("title"),
    description: site.about.introduction,
    alternates: buildAlternates(locale, "/about"),
  };
}

/**
 * Intentionally minimal — see doc/CONTENT_STRATEGY.md §11 and
 * doc/WIREFRAME_ARCHITECTURE.md §2, both updated alongside this page.
 * This page answers one question ("who is Usef Farahmand") and hands
 * visitors off to Projects/Articles/Contact — it never restates content
 * that already has a dedicated, deeper home elsewhere (Experience,
 * Skills, Projects, Articles, Achievements).
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const site = getSiteContent(locale);
  const [t, tWhatIBuild, tSocialLinks] = await Promise.all([
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "whatIBuild" }),
    getTranslations({ locale, namespace: "socialLinks" }),
  ]);

  const buildAreaLabels = site.aboutBuildAreas.reduce<
    Record<WhatIBuildDomain, string>
  >((labels, domain) => {
    labels[domain] = tWhatIBuild(domain);
    return labels;
  }, {} as Record<WhatIBuildDomain, string>);

  const socialCaptions: Partial<Record<SocialPlatform, string>> = {
    youtube: tSocialLinks("captions.youtube"),
    telegram: tSocialLinks("captions.telegram"),
    instagram: tSocialLinks("captions.instagram"),
    linkedin: tSocialLinks("captions.linkedin"),
    github: tSocialLinks("captions.github"),
    medium: tSocialLinks("captions.medium"),
  };

  const ctaLinks = [
    { href: "/projects", label: t("cta.projects") },
    { href: "/articles", label: t("cta.articles") },
    { href: "/#contact", label: t("cta.contact") },
  ];

  return (
    <div className="container-narrow px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <div className="flex flex-col gap-16 sm:gap-20">
        <AboutIntro
          photoSrc={brand.profile.src}
          name={site.hero.name}
          professionalTitle={site.hero.professionalTitle}
          introduction={site.about.introduction}
        />

        <section>
          <h2 className="text-h4 text-text-primary mb-4 font-semibold">
            {t("sections.story")}
          </h2>
          <AboutStory paragraphs={site.about.story} />
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-4 font-semibold">
            {t("sections.whatIBuild")}
          </h2>
          <AboutBuildAreas
            domains={site.aboutBuildAreas}
            labels={buildAreaLabels}
          />
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-4 font-semibold">
            {t("sections.documents")}
          </h2>
          <AboutDocuments locale={locale} />
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-4 font-semibold">
            {t("sections.currentFocus")}
          </h2>
          <AboutCurrentFocus items={site.about.currentFocus} />
        </section>

        <section>
          <h2
            id="about-social-heading"
            className="text-h4 text-text-primary mb-4 font-semibold"
          >
            {t("sections.social")}
          </h2>
          <AboutSocialLinks
            socialLinks={site.socialLinks}
            captions={socialCaptions}
            headingId="about-social-heading"
          />
        </section>
      </div>

      <div className="border-border mt-16 border-t pt-10">
        <AboutCta links={ctaLinks} />
      </div>
    </div>
  );
}
