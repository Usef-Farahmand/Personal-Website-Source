import { contactConfig } from "@/content/contact/contact.config";
import { isValidEmailSyntax } from "./email-verification";

/**
 * Shared by the browser (instant field errors in ContactForm) and the
 * server (services/contact/contact.server.ts re-checks every request,
 * since anyone can call the API directly).
 */
export interface ContactValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Pure validation — no I/O. Returns error *codes*, not display text
 * (see ContactTranslation.errors' doc comment for why): this function
 * has no reason to know what language the visitor reads, and the API
 * route returns these same codes to the browser for the same reason.
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
  if (!isValidEmailSyntax(email) || email.length > validation.email.maxLength) {
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
