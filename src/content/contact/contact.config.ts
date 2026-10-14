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
   * EmailJS's public key is designed to be exposed client-side — unlike
   * a typical API secret, EmailJS's own security model restricts abuse
   * via the allowed-origins list configured in the EmailJS dashboard,
   * not by keeping this key secret. That's why these are NEXT_PUBLIC_
   * env vars (bundled into client JS) rather than server-only ones like
   * the previous Resend integration's RESEND_API_KEY needed to be.
   */
  emailProvider: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    templates: {
      /** Delivers the visitor's message to the site owner. Its "To Email"
       *  is fixed in the EmailJS dashboard, never sent from here — so the
       *  public key can't be used to point this template at anyone else.
       *  Markup: src/content/contact/email-templates/notification.html.
       *  Falls back to the old single-template variable name so an
       *  existing deployment keeps working until it's renamed. */
      notification:
        process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID ??
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ??
        "",
      /** Confirmation sent back to the visitor ("To Email" = {{email}}).
       *  Optional: when unset, only the notification is sent.
       *  Markup: src/content/contact/email-templates/auto-reply.html. */
      autoReply: process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID ?? "",
    },
  },

  /** Before sending, ask public DNS whether the email's domain can
   *  receive mail at all (services/contact/email-verification.ts). Fails
   *  open when DNS can't be reached, so it never blocks a real visitor. */
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

  /**
   * True client-side rate limiting isn't meaningfully enforceable — a
   * motivated caller can invoke sendContactMessage directly, bypassing
   * any UI-level throttle. What *is* real and worth keeping: the submit
   * button stays disabled for the whole request (ContactForm's own
   * status state), which already prevents accidental duplicate
   * submissions from a real visitor double-clicking. Robust rate
   * limiting is a server-side concern that belongs to a future
   * backend-API provider, not something worth faking here — noting that
   * honestly rather than shipping a client-side counter that only looks
   * like protection.
   */
} as const;
