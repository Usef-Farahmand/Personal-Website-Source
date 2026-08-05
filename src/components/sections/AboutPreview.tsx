import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/services/content/site.service";
import { AboutPreviewContent } from "@/components/sections/AboutPreviewContent";
import type { Locale } from "@/types/content";

export async function AboutPreview({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "aboutPreview" });

  return (
    <AboutPreviewContent
      introduction={site.aboutPreview.introduction}
      professionalSummary={site.aboutPreview.professionalSummary}
      highlights={site.aboutPreview.highlights}
      philosophy={site.aboutPreview.philosophy}
      ctaLabel={t("cta")}
    />
  );
}
