import type { Locale, TranslationFallbackMeta } from "@/types/content";

// ---------------------------------------------------------------------------
// Content (what's displayed) — read through
// services/content/contact.service.ts, same pattern as every other
// content domain.
// ---------------------------------------------------------------------------

export interface ContactTranslation {
  title: string;
  subtitle: string;
  location: string;
  responseTime: string;
  privacyNote: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    sendAnotherLabel: string;
  };
  success: {
    title: string;
    body: string;
  };
  /** Keyed by the validation/send failure it corresponds to, not by
   *  field name — validateContactForm (services/contact/contact.service.ts)
   *  returns error *codes* like "invalid_email", never display text, so
   *  the UI is the only layer that turns a code into a sentence. This
   *  keeps the service content-agnostic, which matters for a future
   *  backend-API provider that has no reason to know about copy at all. */
  errors: {
    invalidName: string;
    invalidEmail: string;
    invalidSubject: string;
    invalidMessage: string;
    sendFailed: string;
    notConfigured: string;
  };
}

export interface ContactContent {
  id: "contact";
  /** Shared, not translated — a literal address, not prose, same
   *  reasoning as SiteContent.socialLinks.email. */
  email: string;
  translations: Partial<Record<Locale, ContactTranslation>>;
}

export type ResolvedContactContent = Omit<ContactContent, "translations"> &
  ContactTranslation &
  TranslationFallbackMeta;

// ---------------------------------------------------------------------------
// Sending (what happens on submit) — flows through
// services/contact/contact.service.ts, never called directly by the UI.
// ---------------------------------------------------------------------------

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot value, if the field was filled. Never forwarded to a
   *  provider — services/contact/contact.service.ts checks it and
   *  short-circuits before any provider is involved. */
  honeypot?: string;
}

export type ContactSendResult =
  { success: true } | { success: false; errorCode: string };

/**
 * The seam between the Contact Service and whichever provider is
 * actually sending mail. Implemented today by
 * services/contact/emailjs.provider.ts; a future backend-API provider
 * implements the same interface and gets swapped in with a one-line
 * change in contact.service.ts — nothing above this interface (the UI)
 * or anything that depends only on it needs to change.
 */
export interface EmailProvider {
  send(data: Omit<ContactFormData, "honeypot">): Promise<ContactSendResult>;
}
