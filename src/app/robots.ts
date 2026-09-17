import type { MetadataRoute } from "next";
import { resolveRequestUrl } from "@/lib/request-url";

/**
 * No admin/auth/private routes exist in this project (confirmed against
 * src/app's route tree) — the only non-page route is /api/*, which is
 * server-side plumbing (e.g. the contact form) with nothing indexable to
 * crawl, so it's the only disallow needed.
 *
 * The sitemap URL is self-referencing (see resolveRequestUrl): robots.txt
 * served from useffarahmand.ir points at useffarahmand.ir/sitemap.xml,
 * not the other domain's.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await resolveRequestUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
