/**
 * Configurable technical behavior for the Contact feature — distinct
 * from contact.data.ts, which holds only what's displayed on screen.
 * "How the contact system behaves" lives here; "what it says" lives
 * there. A CMS swap only ever touches the data file; this file changes
 * when the *provider* or its rules change, which is a deploy-time
 * decision, not a content-editing one — the same content-vs-config
 * boundary config/site.ts already draws for deployment facts.
 */
export const contactConfig = {
  /**
   * Email is sent server-side, by app/api/contact/route.ts through the
   * EmailJS REST API. The EmailJS keys are server-only env vars
   * (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY,
   * EMAILJS_PRIVATE_KEY), read in services/contact/contact.server.ts —
   * never here, since this file is also bundled into the browser.
   * Dashboard setup: doc/EMAILJS_SETUP.md.
   */
  rateLimit: {
    /** Per visitor IP, per server instance — best effort on serverless,
     *  where each instance keeps its own count. */
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  },

  /** Before sending, the server asks public DNS whether the email's
   *  domain can receive mail at all (services/contact/
   *  email-verification.ts). Fails open when DNS can't be reached, so it
   *  never blocks a real visitor. */
  verifyEmailDomain: true,

  validation: {
    name: { maxLength: 100 },
    email: { maxLength: 200 },
    subject: { maxLength: 150 },
    message: { minLength: 10, maxLength: 2000 },
  },

  spamProtection: {
    /** Name of the honeypot form field. A real visitor never sees or
     *  fills it; the Contact Service treats any non-empty value as a
     *  bot submission and short-circuits before a provider is ever
     *  called. Configurable here rather than hardcoded in the form
     *  component, so the field name (and therefore the UI markup that
     *  renders it) is driven by config the same way everything else in
     *  this feature is. */
    honeypotFieldName: "company",
  },
} as const;
