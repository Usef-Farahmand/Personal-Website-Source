import { getContactContent } from "@/services/content/contact.service";
import { getSiteContent } from "@/services/content/site.service";
import { Section } from "@/components/layout/Section";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { ContactForm } from "@/components/ui/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Locale } from "@/types/content";

/**
 * Homepage-only for MVP, per CONTENT_STRATEGY.md §17 — a confirmed
 * decision, not an oversight. Copy is still written as standalone
 * ("Contact" as a title, full sentences) rather than homepage-relative
 * phrasing, so promoting this to /contact later needs no rewrite.
 *
 * Social links come from getSiteContent — the centralized Social data
 * source — rather than anything defined here, per the explicit
 * requirement not to duplicate social URLs inside Contact.
 */
export async function Contact({ locale }: { locale: Locale }) {
  const contact = getContactContent(locale);
  const site = getSiteContent(locale);

  return (
    <Section id="contact" as="section">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <h2 className="text-h2 text-text-primary font-semibold">
            {contact.title}
          </h2>
          <p className="text-body text-text-secondary mt-3 max-w-sm">
            {contact.subtitle}
          </p>

          <RevealGroup className="mt-6 flex flex-col gap-1.5">
            <p data-animate className="text-small text-text-secondary">
              {contact.email}
            </p>
            <p data-animate className="text-small text-text-secondary">
              {contact.location}
            </p>
            <p data-animate className="text-small text-text-secondary">
              {contact.responseTime}
            </p>
          </RevealGroup>

          <SocialLinks
            socialLinks={site.socialLinks}
            locale={locale}
            className="mt-6"
          />
        </div>

        <div>
          <ContactForm content={contact} />
          <p className="text-caption text-text-secondary mt-4 max-w-md">
            {contact.privacyNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
