import { contactConfig } from "@/content/contact/contact.config";
import type { EmailProvider } from "@/types/contact";

/**
 * EmailJS implementation of EmailProvider. This is the only file in the
 * project that imports @emailjs/browser — the Contact Service depends
 * only on the EmailProvider interface (types/contact.ts), never on this
 * module directly, so a future backend-API provider is a new file that
 * implements the same interface plus a one-line swap in
 * contact.service.ts, not a change anywhere else.
 *
 * @emailjs/browser is imported dynamically inside `send`, not at module
 * top level — it only enters the client bundle once a visitor actually
 * submits the form, not on initial page load ("Load EmailJS only when
 * required").
 */
export const emailJsProvider: EmailProvider = {
  async send(data) {
    const { serviceId, templateId, publicKey } = contactConfig.emailProvider;

    if (!serviceId || !templateId || !publicKey) {
      // Fails loudly in the console (visible in deployment checks)
      // rather than silently pretending to succeed — matches the
      // previous Resend integration's same reasoning for its
      // not_configured path.
      console.error(
        "Contact: EmailJS is not configured — set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
      );
      return { success: false, errorCode: "not_configured" };
    }

    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        { publicKey }
      );
      return { success: true };
    } catch (error) {
      console.error("EmailJS send failed:", error);
      return { success: false, errorCode: "send_failed" };
    }
  },
};
