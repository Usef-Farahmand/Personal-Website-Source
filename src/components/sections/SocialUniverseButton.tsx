import { getTranslations } from "next-intl/server";
import { SocialUniverseTrigger } from "@/components/ui/SocialUniverseTrigger";
import { getSocialUniverseProfiles } from "@/config/socialUniverse";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";

/**
 * Server wrapper for the "Find me around the web" trigger: resolves the
 * profile URLs from the site's social links and the localized labels, so
 * About and Contact each place it with one line.
 */
export async function SocialUniverseButton({
  locale,
  variant,
  className,
}: {
  locale: Locale;
  variant?: "card" | "link";
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "socialUniverse" });
  const site = getSiteContent(locale);

  return (
    <SocialUniverseTrigger
      profiles={getSocialUniverseProfiles(site.socialLinks)}
      variant={variant}
      className={className}
      labels={{
        title: t("title"),
        close: t("close"),
        characterAlt: t("characterAlt"),
        // Placeholders are filled in on the client, per platform.
        openProfile: t("openProfile", { name: "{name}" }),
        unavailable: t("unavailable", { name: "{name}" }),
      }}
    />
  );
}
