import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Locale } from "@/content/types";

export async function Footer({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="border-border border-t">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-text-secondary">
          &copy; {new Date().getFullYear()} {site.hero.name}. {t("rights")}
        </p>

        <SocialLinks socialLinks={site.socialLinks} locale={locale} size="sm" />
      </Container>
    </footer>
  );
}
