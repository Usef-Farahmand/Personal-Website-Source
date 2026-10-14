import { apiProvider } from "./api.provider";
import { validateContactForm } from "./validation";
import type {
  ContactFormData,
  ContactSendResult,
  EmailProvider,
} from "@/types/contact";

export {
  validateContactForm,
  type ContactValidationErrors,
} from "./validation";

/**
 * Today's provider: the site's own API route (app/api/contact), which
 * sends through EmailJS server-side so no EmailJS key ever reaches the
 * browser. Swapping it is this one line — nothing in ContactForm or
 * anything that depends on this module needs to change, because they
 * all depend on the EmailProvider interface.
 */
const provider: EmailProvider = apiProvider;

/**
 * The one function the UI ever calls to send a message. Handles the
 * honeypot check and validates input before calling the provider, so an
 * obviously broken form never costs a request. The server repeats every
 * check (plus the DNS check on the email's domain) — this is only the
 * fast path for real visitors.
 *
 * A domain the server rejects comes back as `invalid_email`, the same
 * code validateContactForm uses, so the UI can show it on the email
 * field.
 */
export async function sendContactMessage(
  data: ContactFormData
): Promise<ContactSendResult> {
  // Honeypot — a real visitor never fills this field. Respond as if it
  // succeeded so a bot gets no signal, without actually sending anything.
  if (data.honeypot) {
    return { success: true };
  }

  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, errorCode: "invalid_input" };
  }

  return provider.send({
    name: data.name,
    email: data.email.trim(),
    subject: data.subject,
    message: data.message,
  });
}
