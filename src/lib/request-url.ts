import { headers } from "next/headers";
import { siteDomains, siteUrl } from "@/config/site";

/**
 * Resolves the base URL to use for self-referencing metadata files
 * (sitemap.xml, robots.txt) from the incoming request's Host header,
 * matching it against the project's known production domains (see
 * `siteDomains` in config/site.ts).
 *
 * This is deliberately separate from `siteUrl` (a single fixed domain,
 * used for canonical tags and OG images so search engines consolidate
 * ranking signals onto one domain). A sitemap or robots.txt served from
 * useffarahmand.ir needs to list *its own* URLs — Search Console
 * rejects a sitemap whose URLs belong to a different host than the
 * property it's submitted under.
 *
 * Falls back to `siteUrl` for local dev, preview deployments, or any
 * host that isn't one of the two known production domains.
 */
export async function resolveRequestUrl(): Promise<URL> {
  const host = (await headers()).get("host");
  const known = Object.values(siteDomains).find(
    (domain) => new URL(domain).host === host
  );
  return known ? new URL(known) : siteUrl;
}
