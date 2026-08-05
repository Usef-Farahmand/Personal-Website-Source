import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/services/content/site.service";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/ui/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Locale } from "@/types/content";

/**
 * Homepage-only for MVP, per CONTENT_STRATEGY.md §17 — a confirmed
 * decision, not an oversight. Copy is still written as standalone
 * ("Contact" as a title, full sentences) rather than homepage-relative
 * phrasing, so promoting this to /contact later needs no rewrite.
 */
export async function Contact({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <Section id="contact" as="section">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <h2 className="text-h2 text-text-primary font-semibold">
            {t("title")}
          </h2>
          <p className="text-body text-text-secondary mt-3 max-w-sm">
            {t("intro")}
          </p>

          <p className="text-small text-text-secondary mt-6">
            {site.contact.availabilityNote}
          </p>

          <SocialLinks
            socialLinks={site.socialLinks}
            locale={locale}
            className="mt-6"
          />
        </div>

        <div>
          <ContactForm />
          <p className="text-caption text-text-secondary mt-4 max-w-md">
            {site.contact.privacyNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
