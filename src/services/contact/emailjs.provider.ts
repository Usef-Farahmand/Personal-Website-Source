import { contactConfig } from "@/content/contact/contact.config";
import { getContactContent } from "@/services/content/contact.service";
import {
  detectMessageLocale,
  renderConfirmationEmail,
  renderNotificationEmail,
  type RenderedEmail,
} from "./email-html";
import type { EmailProvider } from "@/types/contact";

/**
 * EmailJS implementation of EmailProvider. This is the only file in the
 * project that imports @emailjs/browser — the Contact Service depends
 * only on the EmailProvider interface (types/contact.ts), never on this
 * module directly, so a future backend-API provider is a new file that
 * implements the same interface plus a one-line swap in
 * contact.service.ts, not a change anywhere else.
 *
 * Each submission sends two emails through the same EmailJS template:
 *   1. the message, to the site owner;
 *   2. a confirmation, to the visitor — in Persian if they wrote in
 *      Persian, otherwise in English.
 * The template is an empty shell (doc/EMAILJS_SETUP.md): recipient,
 * subject, reply-to and the whole HTML body arrive as variables rendered
 * by email-html.ts. The owner's email is the one that matters: if it
 * fails, the send fails. If only the confirmation fails, the message
 * still arrived, so the send succeeds with `confirmationSent: false`.
 *
 * @emailjs/browser is imported dynamically inside `send`, not at module
 * top level — it only enters the client bundle once a visitor actually
 * submits the form, not on initial page load ("Load EmailJS only when
 * required").
 */
export const emailJsProvider: EmailProvider = {
  async send(data) {
    const { serviceId, publicKey, templateId } = contactConfig.emailProvider;

    if (!serviceId || !publicKey || !templateId) {
      // Fails loudly in the console (visible in deployment checks)
      // rather than silently pretending to succeed.
      console.error(
        "Contact: EmailJS is not configured — set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, and NEXT_PUBLIC_EMAILJS_TEMPLATE_ID."
      );
      return { success: false, errorCode: "not_configured" };
    }

    const fields = {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };
    const messageLocale = detectMessageLocale(
      `${fields.subject}\n${fields.message}`
    );
    const content = getContactContent(messageLocale);
    const ownerEmail = content.email;

    const notification = renderNotificationEmail(fields, {
      messageLocale,
      sentAt: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Tehran",
      }),
      pageUrl: window.location.href,
    });
    const confirmation = renderConfirmationEmail(
      fields,
      messageLocale,
      content.confirmationEmail
    );

    const emailjs = await import("@emailjs/browser");

    function sendEmail(
      email: RenderedEmail,
      envelope: { to: string; replyTo: string; fromName: string },
      throttleId: string
    ) {
      return emailjs.send(
        serviceId,
        templateId,
        {
          to_email: envelope.to,
          reply_to: envelope.replyTo,
          from_name: envelope.fromName,
          email_subject: email.subject,
          html: email.html,
        },
        {
          publicKey,
          blockHeadless: true,
          // Per id, so the two sends of one submission don't throttle
          // each other — only a second submission within 10s is refused.
          limitRate: { id: throttleId, throttle: 10_000 },
        }
      );
    }

    try {
      await sendEmail(
        notification,
        { to: ownerEmail, replyTo: fields.email, fromName: fields.name },
        "contact-form"
      );
    } catch (error) {
      console.error("EmailJS notification send failed:", error);
      return { success: false, errorCode: "send_failed" };
    }

    try {
      await sendEmail(
        confirmation,
        {
          to: fields.email,
          replyTo: ownerEmail,
          fromName: content.confirmationEmail.signature,
        },
        "contact-form-reply"
      );
      return { success: true, confirmationSent: true };
    } catch (error) {
      console.error("EmailJS confirmation send failed:", error);
      return { success: true, confirmationSent: false };
    }
  },
};
