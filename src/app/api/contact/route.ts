import { contactConfig } from "@/content/contact/contact.config";
import { handleContactSubmission } from "@/services/contact/contact.server";
import type { ContactSendResult } from "@/types/contact";

/**
 * POST /api/contact — the contact form's only way to send email. The
 * form posts here (services/contact/api.provider.ts); everything that
 * decides what gets sent, and to whom, runs in contact.server.ts.
 *
 * Guards before any email work starts:
 * - same-origin only: a browser on another site can't post here (a
 *   script outside a browser can fake the header, which is why the
 *   next two guards exist);
 * - a per-IP rate limit (contactConfig.rateLimit);
 * - every field must be a string — anything else is a malformed request.
 */

export const runtime = "nodejs";

const STATUS_BY_ERROR: Record<string, number> = {
  invalid_body: 400,
  forbidden: 403,
  invalid_input: 422,
  invalid_email: 422,
  rate_limited: 429,
  not_configured: 500,
  send_failed: 502,
};

function reply(result: ContactSendResult): Response {
  const status = result.success
    ? 200
    : (STATUS_BY_ERROR[result.errorCode] ?? 500);
  return Response.json(result, { status });
}

function fail(errorCode: string): Response {
  return reply({ success: false, errorCode });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Requests per IP inside the current window. Kept in memory, so on
// Vercel each server instance counts separately — it stops one visitor
// (or script) from flooding the form, not a distributed attack.
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const { maxRequests, windowMs } = contactConfig.rateLimit;
  const now = Date.now();
  const timestamps = (recentRequests.get(ip) ?? []).filter(
    (time) => now - time < windowMs
  );
  timestamps.push(now);
  recentRequests.set(ip, timestamps);

  // Drop idle IPs now and then so the map can't grow without bound.
  if (recentRequests.size > 1000) {
    for (const [key, times] of recentRequests) {
      if (times.every((time) => now - time >= windowMs)) {
        recentRequests.delete(key);
      }
    }
  }

  return timestamps.length > maxRequests;
}

function sameSiteReferer(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return url.host === new URL(request.url).host ? url.toString() : null;
  } catch {
    return null;
  }
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return fail("forbidden");
  }
  if (isRateLimited(clientIp(request))) {
    return fail("rate_limited");
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_body");
  }

  const { name, email, subject, message, honeypot } = body ?? {};
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    (honeypot !== undefined && typeof honeypot !== "string")
  ) {
    return fail("invalid_body");
  }

  // Only used as a link in the owner's email, so a missing or odd
  // Referer just falls back to the site's own contact page.
  const pageUrl =
    sameSiteReferer(request) ?? new URL("/contact", request.url).toString();

  const result = await handleContactSubmission(
    { name, email, subject, message, honeypot },
    { pageUrl }
  );
  return reply(result);
}
