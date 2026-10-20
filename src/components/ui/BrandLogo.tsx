import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { brand } from "@/config/brand";
import { getSiteContent } from "@/services/content/site.service";
import type { Locale } from "@/types/content";

interface BrandLogoProps {
  /** Overrides the default alt text ("<site owner's name> logo", from
   *  the localized site content — see brand.ts for why the name isn't
   *  stored there). Every instance gets a real alt by default so no
   *  image on the site ships with an empty one (SEO audit). */
  alt?: string;
  size?: number;
  className?: string;
  /** Set true only for the one above-the-fold instance (Header) that's
   *  effectively always in the initial viewport — everywhere else stays
   *  lazy by default, per the Performance requirement. */
  priority?: boolean;
}

export function BrandLogo({
  alt,
  size = 32,
  className,
  priority = false,
}: BrandLogoProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("imageAlt");
  const resolvedAlt =
    alt ?? t("logo", { name: getSiteContent(locale).hero.name });

  return (
    <Image
      src={brand.mark.src}
      alt={resolvedAlt}
      width={brand.mark.width}
      height={brand.mark.height}
      style={{ width: size, height: size }}
      className={className}
      priority={priority}
    />
  );
}
