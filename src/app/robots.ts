import type { MetadataRoute } from "next";
import { resolveRequestUrl } from "@/lib/request-url";

/**
 * AI search and answer-engine crawlers, named explicitly so the site's
 * stance is unambiguous: this is a public portfolio that *wants* to be
 * found and cited by ChatGPT, Claude, Perplexity, Gemini, Copilot and
 * the like (GEO/AEO), not just by classic search. The "*" group below
 * would already allow them; listing them documents the intent and keeps
 * them allowed even if the "*" group is tightened later.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "DuckAssistBot",
];

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
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: AI_CRAWLERS,
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: "/api/",
      },
    ],
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
