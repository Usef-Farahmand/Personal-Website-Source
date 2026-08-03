import Image from "next/image";
import { brand } from "@/config/brand";

interface BrandLogoProps {
  /** Real alt text when the logo is the only cue identifying the brand
   *  in its context (e.g. standing alone without adjacent site-name
   *  text). Omit — or pass "" — when it's purely decorative next to
   *  text that already says the same thing, so screen readers don't
   *  announce it twice. */
  alt?: string;
  size?: number;
  className?: string;
  /** Set true only for the one above-the-fold instance (Header) that's
   *  effectively always in the initial viewport — everywhere else stays
   *  lazy by default, per the Performance requirement. */
  priority?: boolean;
}

export function BrandLogo({
  alt = "",
  size = 32,
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={brand.mark.src}
      alt={alt}
      width={brand.mark.width}
      height={brand.mark.height}
      style={{ width: size, height: size }}
      className={className}
      priority={priority}
    />
  );
}
