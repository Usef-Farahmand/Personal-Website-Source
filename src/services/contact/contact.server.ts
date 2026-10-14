import "server-only";
import { contactContent } from "@/content/contact";
import { contactConfig } from "@/content/contact/contact.config";
import { getContactContent } from "@/services/content/contact.service";
import { validateContactForm } from "./validation";
import {
  detectMessageLocale,
  renderConfirmationEmail,
  renderNotificationEmail,
  type RenderedEmail,
} from "./email-html";
import { verifyEmailDomain } from "./email-verification";
import type { ContactFormData, ContactSendResult } from "@/types/contact";

/**
 * Server side of the contact form — called only by
 * app/api/contact/route.ts. `server-only` makes the build fail if this
 * module (and so the EmailJS private key) is ever imported into
 * browser code.
 *
 * Each submission sends two emails through the same EmailJS template
 * (an empty `{{{html}}}` shell — doc/EMAILJS_SETUP.md):
 *   1. the message, to the site owner;
 *   2. a confirmation, to the visitor — in Persian if they wrote in
 *      Persian, otherwise in English.
 * Both recipients are decided here, never taken from the request: the
 * owner address comes from contact.data.ts, and the only other address
 * that can ever receive mail is the one the visitor typed — after it
 * passed validation and the DNS check. The owner's email is the one that
 * matters: if it fails, the send fails. If only the confirmation fails,
 * the message still arrived, so the send succeeds with
 * `confirmationSent: false`.
 */

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_TIMEOUT_MS = 10_000;

function readEmailJsEnv() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) return null;
  return { serviceId, templateId, publicKey, privateKey };
}

type EmailJsEnv = NonNullable<ReturnType<typeof readEmailJsEnv>>;

async function sendEmail(
  env: EmailJsEnv,
  email: RenderedEmail,
  envelope: { to: string; replyTo: string; fromName: string }
): Promise<void> {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: env.serviceId,
      template_id: env.templateId,
      user_id: env.publicKey,
      accessToken: env.privateKey,
      template_params: {
        to_email: envelope.to,
        reply_to: envelope.replyTo,
        from_name: envelope.fromName,
        email_subject: email.subject,
        html: email.html,
      },
    }),
    signal: AbortSignal.timeout(EMAILJS_TIMEOUT_MS),
  });

  if (!response.ok) {
    // EmailJS answers with a plain-text reason, e.g. "The Private Key is
    // invalid" or "API calls are disabled for non-browser applications".
    throw new Error(`EmailJS ${response.status}: ${await response.text()}`);
  }
}

export async function handleContactSubmission(
  data: ContactFormData,
  meta: { pageUrl: string }
): Promise<ContactSendResult> {
  // Honeypot — respond as if it succeeded so a bot gets no signal.
  if (data.honeypot) {
    return { success: true };
  }

  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errorCode: errors.email ?? "invalid_input",
    };
  }

  const fields = {
    name: data.name.trim(),
    email: data.email.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
  };

  if (
    contactConfig.verifyEmailDomain &&
    !(await verifyEmailDomain(fields.email))
  ) {
    return { success: false, errorCode: "invalid_email" };
  }

  const env = readEmailJsEnv();
  if (!env) {
    // Fails loudly in the server logs (Vercel → Logs) rather than
    // silently pretending to succeed.
    console.error(
      "Contact: EmailJS is not configured — set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY."
    );
    return { success: false, errorCode: "not_configured" };
  }

  const messageLocale = detectMessageLocale(
    `${fields.subject}\n${fields.message}`
  );
  const confirmationCopy = getContactContent(messageLocale).confirmationEmail;
  const ownerEmail = contactContent.email;

  const notification = renderNotificationEmail(fields, {
    messageLocale,
    sentAt: new Date().toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tehran",
    }),
    pageUrl: meta.pageUrl,
  });
  const confirmation = renderConfirmationEmail(
    fields,
    messageLocale,
    confirmationCopy
  );

  try {
    await sendEmail(env, notification, {
      to: ownerEmail,
      replyTo: fields.email,
      fromName: fields.name,
    });
  } catch (error) {
    console.error("Contact: notification send failed:", error);
    return { success: false, errorCode: "send_failed" };
  }

  try {
    await sendEmail(env, confirmation, {
      to: fields.email,
      replyTo: ownerEmail,
      fromName: confirmationCopy.signature,
    });
    return { success: true, confirmationSent: true };
  } catch (error) {
    console.error("Contact: confirmation send failed:", error);
    return { success: true, confirmationSent: false };
  }
}
