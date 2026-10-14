import type { ReactNode } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
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
export async function Contact({
  locale,
  header,
}: {
  locale: Locale;
  /** The page's title block, placed at the top of the details column. */
  header: ReactNode;
}) {
  const contact = getContactContent(locale);
  const site = getSiteContent(locale);

  const details = [
    { icon: Mail, text: contact.email },
    { icon: MapPin, text: contact.location },
    { icon: Clock, text: contact.responseTime },
  ];

  return (
    <Section id="contact" as="section" spacing="none" containerSize="none">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16">
        <div>
          {header}

          {/* Below lg the page must fit one screen with the form, so the
              details (also reachable via the footer icons) are desktop
              only. */}
          <RevealGroup className="hidden flex-col gap-3 lg:flex">
            {details.map(({ icon: Icon, text }) => (
              <p
                key={text}
                data-animate
                className="text-small text-text-secondary flex items-center gap-3"
              >
                <span className="bg-accent/10 text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </p>
            ))}
          </RevealGroup>

          <SocialLinks
            socialLinks={site.socialLinks}
            locale={locale}
            className="mt-6 hidden lg:flex"
          />
        </div>

        <div className="border-border bg-surface/60 rounded-xl border p-4 backdrop-blur-sm sm:p-6">
          <ContactForm content={contact} />
          <p className="text-caption text-text-secondary mt-3 [@media(max-height:740px)]:hidden">
            {contact.privacyNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
