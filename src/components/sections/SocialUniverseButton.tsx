import { getTranslations } from "next-intl/server";
import { SocialUniverseTrigger } from "@/components/ui/SocialUniverseTrigger";
import { SocialUniverseOrbit } from "@/components/ui/SocialUniverseOrbit";
import { getSocialUniverseProfiles } from "@/config/socialUniverse";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";

async function getSocialUniverseProps(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "socialUniverse" });
  return {
    profiles: getSocialUniverseProfiles(getSiteContent(locale).socialLinks),
    labels: {
      title: t("title"),
      close: t("close"),
      characterAlt: t("characterAlt"),
      // Placeholders are filled in on the client, per platform.
      openProfile: t("openProfile", { name: "{name}" }),
      unavailable: t("unavailable", { name: "{name}" }),
    },
  };
}

/**
 * Server wrapper for the "Find me around the web" trigger (under the
 * Contact form): resolves the profile URLs from the site's social links
 * and the localized labels.
 */
export async function SocialUniverseButton({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const { profiles, labels } = await getSocialUniverseProps(locale);
  return (
    <SocialUniverseTrigger
      profiles={profiles}
      labels={labels}
      className={className}
    />
  );
}

/** The same scene shown inline (About → Connect), labelled by a heading. */
export async function SocialUniverseSection({
  locale,
  headingId,
  className,
}: {
  locale: Locale;
  headingId: string;
  className?: string;
}) {
  const { profiles, labels } = await getSocialUniverseProps(locale);
  return (
    <nav aria-labelledby={headingId} className={className}>
      <SocialUniverseOrbit profiles={profiles} labels={labels} />
    </nav>
  );
}
