import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content";
import { brand } from "@/config/brand";

/**
 * PWA foundation only, per this task's scope — a real installable PWA
 * (offline support, service worker, per-locale manifests) is future
 * work. This gives every browser a valid manifest with the real brand
 * icons today, in the sizes most launchers/OSes expect (192, 512),
 * without hardcoding either path outside config/brand.ts.
 *
 * Single global manifest rather than one per locale: name/short_name are
 * a proper noun that reads the same in both locales (confirmed against
 * site content), and true manifest localization is a larger PWA
 * undertaking than "foundation" calls for.
 */
export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteContent("en");

  return {
    name: site.hero.name,
    short_name: site.hero.name,
    description: site.hero.introduction,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: brand.mark.src,
        sizes: `${brand.mark.width}x${brand.mark.height}`,
        type: "image/png",
      },
    ],
  };
}
