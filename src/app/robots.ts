import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

/**
 * No admin/auth/private routes exist in this project (confirmed against
 * src/app's route tree) — the only non-page route is /api/*, which is
 * server-side plumbing (e.g. the contact form) with nothing indexable to
 * crawl, so it's the only disallow needed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
