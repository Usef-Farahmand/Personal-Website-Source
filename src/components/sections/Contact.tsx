import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Clock, Mail, MapPin } from "lucide-react";
import { getContactContent } from "@/services/content/contact.service";
import { getSiteContent } from "@/services/content/site.service";
import { brand } from "@/config/brand";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { ContactForm } from "@/components/ui/ContactForm";
import { LinkedInIcon } from "@/components/ui/icons";
import type { Locale } from "@/types/content";

/**
 * The /contact page body: three columns with equal side widths, so the
 * form sits exactly in the middle of the page — title and contact
 * details on one side, the illustration on the other. Below lg it's just
 * the title (with a small copy of the illustration) and the form, so the
 * fixed-height page still fits a phone screen.
 *
 * No social icon row here: the only alternative channel offered is a
 * LinkedIn message, linked from the line under the form.
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
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const linkedin = site.socialLinks.find(
    (link) => link.enabled && link.platform === "linkedin"
  );
  const photoAlt = t("photoAlt", { name: site.hero.name });

  const details = [
    { icon: Mail, text: contact.email },
    { icon: MapPin, text: contact.location },
    { icon: Clock, text: contact.responseTime },
  ];

  return (
    <section
      id="contact"
      className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 content-center items-center gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-10 [@media(max-height:700px)]:gap-3 [@media(max-height:700px)]:py-2"
    >
      {/* Start column: title + details */}
      <div className="flex items-center justify-between gap-4 lg:block">
        <div>
          {header}
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
        </div>
        <Image
          src={brand.contactPhoto.src}
          alt=""
          width={brand.contactPhoto.width}
          height={brand.contactPhoto.height}
          sizes="6rem"
          className="h-24 w-auto shrink-0 lg:hidden [@media(max-height:700px)]:h-16"
        />
      </div>

      {/* Center column: the form */}
      <div className="landing-rise w-full">
        <div className="border-border bg-surface/80 relative rounded-xl border p-4 shadow-lg backdrop-blur-sm sm:p-6">
          <span
            aria-hidden="true"
            className="landing-fill absolute inset-x-6 -top-px h-0.5 rounded-full"
          />
          <ContactForm content={contact} />
          <p className="text-caption text-text-secondary mt-3 text-center [@media(max-height:740px)]:hidden">
            {contact.privacyNote}
          </p>
        </div>

        {linkedin && (
          <p className="text-small text-text-secondary mt-4 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center [@media(max-height:700px)]:mt-2.5">
            <LinkedInIcon className="text-accent h-4 w-4" aria-hidden="true" />
            {t("linkedinPrompt")}
            <a
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
            >
              {t("linkedinLink")}
              <ArrowRight
                className="h-3.5 w-3.5 rtl:-scale-x-100"
                aria-hidden="true"
              />
              <span className="sr-only">{t("opensInNewTab")}</span>
            </a>
          </p>
        )}
      </div>

      {/* End column: illustration */}
      <div className="hidden justify-center lg:flex">
        <Image
          src={brand.contactPhoto.src}
          alt={photoAlt}
          width={brand.contactPhoto.width}
          height={brand.contactPhoto.height}
          priority
          sizes="(min-width: 1024px) 22rem, 0px"
          className="h-auto max-h-[60vh] w-full max-w-sm object-contain drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
        />
      </div>
    </section>
  );
}
