import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Current project/certificate assets are local SVGs. Next.js blocks
    // SVG through its image optimizer by default (SVGs can embed script);
    // this is Next's own documented safe opt-in — sandboxed CSP and
    // forced download disposition rather than inline rendering as HTML.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Mr. Bean Solitaire: Adventure (prj-mr-bean-solitaire) is a shipped
    // Google Play title with no local screenshot source in any provided
    // content-migration source — the previous site itself hotlinked these
    // same official Play Store CDN images rather than hosting copies.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
      // Task 08: YouTube gallery items' thumbnails are never downloaded
      // locally (CMS Task 06.3's YouTube Video Model — an external
      // reference only) and are always this exact host, derived
      // directly from the video id (see the CMS's
      // lib/media/youtube.ts getYoutubeThumbnailUrl).
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
