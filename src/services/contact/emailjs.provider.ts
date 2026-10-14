import { contactConfig } from "@/content/contact/contact.config";
import { getContactContent } from "@/services/content/contact.service";
import type { EmailProvider } from "@/types/contact";

/**
 * EmailJS implementation of EmailProvider. This is the only file in the
 * project that imports @emailjs/browser — the Contact Service depends
 * only on the EmailProvider interface (types/contact.ts), never on this
 * module directly, so a future backend-API provider is a new file that
 * implements the same interface plus a one-line swap in
 * contact.service.ts, not a change anywhere else.
 *
 * Each submission sends up to two emails through the same service:
 *   1. the notification template — the message, to the site owner;
 *   2. the auto-reply template — a confirmation, to the visitor.
 * Both templates receive the same variables (listed in
 * content/contact/email-templates/README.md). The notification is the
 * one that matters: if it fails, the send fails. If only the
 * confirmation fails, the message still arrived, so the send succeeds
 * with `confirmationSent: false`.
 *
 * @emailjs/browser is imported dynamically inside `send`, not at module
 * top level — it only enters the client bundle once a visitor actually
 * submits the form, not on initial page load ("Load EmailJS only when
 * required").
 */
export const emailJsProvider: EmailProvider = {
  async send(data) {
    const { serviceId, publicKey, templates } = contactConfig.emailProvider;

    if (!serviceId || !publicKey || !templates.notification) {
      // Fails loudly in the console (visible in deployment checks)
      // rather than silently pretending to succeed.
      console.error(
        "Contact: EmailJS is not configured — set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, and NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID (plus NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID for the confirmation email)."
      );
      return { success: false, errorCode: "not_configured" };
    }

    const content = getContactContent(data.locale);
    const copy = content.confirmationEmail;
    const isRtl = data.locale === "fa";
    const name = data.name.trim();
    const email = data.email.trim();
    const subject = data.subject.trim();

    const params: Record<string, string> = {
      name,
      email,
      subject: subject || copy.noSubject,
      message: data.message.trim(),
      locale: data.locale,
      time: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Tehran",
      }),
      page_url: window.location.href,
      owner_email: content.email,
      // Aliases for EmailJS's stock "Contact Us" template and the
      // "Reply To" field, so a default template still renders.
      from_name: name,
      from_email: email,
      reply_to: email,
      title: subject || copy.noSubject,
      // Auto-reply copy and layout direction.
      dir: isRtl ? "rtl" : "ltr",
      align: isRtl ? "right" : "left",
      reply_subject: copy.subject,
      reply_greeting: copy.greeting.replace("{name}", name),
      reply_intro: copy.intro,
      reply_summary_heading: copy.summaryHeading,
      reply_subject_label: copy.subjectLabel,
      reply_message_label: copy.messageLabel,
      reply_closing: copy.closing,
      reply_signature: copy.signature,
      reply_footer: copy.footer,
    };

    const emailjs = await import("@emailjs/browser");
    const options = {
      publicKey,
      blockHeadless: true,
      limitRate: { id: "contact-form", throttle: 10_000 },
    };

    try {
      await emailjs.send(serviceId, templates.notification, params, options);
    } catch (error) {
      console.error("EmailJS notification send failed:", error);
      return { success: false, errorCode: "send_failed" };
    }

    if (!templates.autoReply) {
      return { success: true, confirmationSent: false };
    }

    try {
      // The throttle above is per id, so the confirmation gets its own.
      await emailjs.send(serviceId, templates.autoReply, params, {
        ...options,
        limitRate: { id: "contact-form-reply", throttle: 10_000 },
      });
      return { success: true, confirmationSent: true };
    } catch (error) {
      console.error("EmailJS confirmation send failed:", error);
      return { success: true, confirmationSent: false };
    }
  },
};
