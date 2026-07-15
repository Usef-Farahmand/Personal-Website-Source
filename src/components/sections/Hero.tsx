import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { HeroContent } from "@/components/sections/HeroContent";
import type { Locale } from "@/content/types";

export async function Hero({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <HeroContent
      greeting={site.hero.greeting}
      name={site.hero.name}
      professionalTitle={site.hero.professionalTitle}
      introduction={site.hero.introduction}
      availabilityStatus={site.hero.availabilityStatus}
      isAvailable={site.availability.isAvailable}
      ctaPrimaryLabel={t("ctaPrimary")}
      ctaSecondaryLabel={t("ctaSecondary")}
      scrollIndicatorLabel={t("scrollIndicator")}
      socialLinks={
        <SocialLinks socialLinks={site.socialLinks} locale={locale} />
      }
    />
  );
}
