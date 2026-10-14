import { getContactContent } from "@/services/content/contact.service";
import { getSiteContent } from "@/services/content/site.service";
import { Section } from "@/components/layout/Section";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { ContactForm } from "@/components/ui/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Locale } from "@/types/content";

/**
 * Rendered by the /contact page (it was the homepage's last section until
 * the homepage became a single-screen landing hero). Copy is written as
 * standalone ("Contact" as a title, full sentences), so the move needed
 * no rewrite. The page renders the title and subtitle in its PageHeader;
 * this section is the details column and the form.
 *
 * Social links come from getSiteContent — the centralized Social data
 * source — rather than anything defined here, per the explicit
 * requirement not to duplicate social URLs inside Contact.
 */
export async function Contact({ locale }: { locale: Locale }) {
  const contact = getContactContent(locale);
  const site = getSiteContent(locale);

  return (
    <Section id="contact" as="section" spacing="none" containerSize="none">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <RevealGroup className="flex flex-col gap-1.5">
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
