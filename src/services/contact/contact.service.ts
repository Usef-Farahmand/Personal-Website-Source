import { contactConfig } from "@/content/contact/contact.config";
import { emailJsProvider } from "./emailjs.provider";
import type {
  ContactFormData,
  ContactSendResult,
  EmailProvider,
} from "@/types/contact";

/**
 * Today's provider. Swapping EmailJS for a real backend later is this
 * one line — nothing in ContactForm, contact.service.ts's own exported
 * functions, or anything that depends on them needs to change, because
 * they all depend on the EmailProvider interface, not on EmailJS
 * specifically.
 */
const provider: EmailProvider = emailJsProvider;

export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pure validation — no I/O. Returns error *codes*, not display text
 * (see ContactTranslation.errors' doc comment for why): this function
 * has no reason to know what language the visitor reads, and a future
 * backend-API provider's own server-side validation would return the
 * same kind of codes for the same reason.
 */
export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ContactValidationErrors {
  const { validation } = contactConfig;
  const errors: ContactValidationErrors = {};

  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!name || name.length > validation.name.maxLength) {
    errors.name = "invalid_name";
  }
  if (!EMAIL_PATTERN.test(email) || email.length > validation.email.maxLength) {
    errors.email = "invalid_email";
  }
  if (data.subject.length > validation.subject.maxLength) {
    errors.subject = "invalid_subject";
  }
  if (
    message.length < validation.message.minLength ||
    message.length > validation.message.maxLength
  ) {
    errors.message = "invalid_message";
  }

  return errors;
}

/**
 * The one function the UI ever calls to send a message. Handles the
 * honeypot check and re-validates input before touching a provider at
 * all — never trust client-side validation alone, even on a form whose
 * entire send path happens to run in the browser.
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
    email: data.email,
    subject: data.subject,
    message: data.message,
  });
}
