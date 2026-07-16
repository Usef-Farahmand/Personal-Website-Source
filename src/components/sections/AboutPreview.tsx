import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import { AboutPreviewContent } from "@/components/sections/AboutPreviewContent";
import type { Locale } from "@/content/types";

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
