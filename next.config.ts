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
  },
};

export default withNextIntl(nextConfig);
