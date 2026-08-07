"use client";

import { useRef, useState, type FormEvent } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/cn";
import { contactConfig } from "@/content/contact/contact.config";
import {
  sendContactMessage,
  validateContactForm,
  type ContactValidationErrors,
} from "@/services/contact/contact.service";
import type { ResolvedContactContent } from "@/types/contact";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const inputClass =
  "border-border bg-background text-text-primary placeholder:text-text-secondary/60 focus-visible:ring-accent w-full rounded-md border px-3 py-2 text-small outline-none focus-visible:ring-2";

/** Maps the Contact Service's error *codes* to this locale's display
 *  text — kept here, in the UI layer, rather than in the service, so the
 *  service stays content-agnostic (see ContactTranslation.errors' doc
 *  comment in types/contact.ts for the full reasoning). */
function errorMessage(
  code: string | undefined,
  content: ResolvedContactContent
): string | undefined {
  switch (code) {
    case "invalid_name":
      return content.errors.invalidName;
    case "invalid_email":
      return content.errors.invalidEmail;
    case "invalid_subject":
      return content.errors.invalidSubject;
    case "invalid_message":
      return content.errors.invalidMessage;
    case "not_configured":
      return content.errors.notConfigured;
    default:
      return content.errors.sendFailed;
  }
}

export function ContactForm({ content }: { content: ResolvedContactContent }) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [sendErrorCode, setSendErrorCode] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  function shakeInvalidFields(fieldErrors: ContactValidationErrors) {
    if (!formRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    for (const field of Object.keys(fieldErrors)) {
      const el = formRef.current.querySelector(`#${field}`);
      if (!el) continue;
      animate(el, {
        translateX: [0, -6, 6, -4, 4, 0],
        duration: 350,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      });
    }
  }

  function animateSuccess() {
    if (!successRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    animate(successRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 300,
      ease: "cubic-bezier(0, 0, 0.2, 1)",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // belt-and-suspenders against a double-fire

    const formData = new FormData(event.currentTarget);
    const data = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      honeypot: String(
        formData.get(contactConfig.spamProtection.honeypotFieldName) ?? ""
      ),
    };

    const validationErrors = validateContactForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      shakeInvalidFields(validationErrors);
      return;
    }
    setErrors({});

    setStatus("submitting");
    const result = await sendContactMessage(data);

    if (!result.success) {
      setSendErrorCode(result.errorCode);
      setStatus("error");
      return;
    }

    setStatus("success");
    formRef.current?.reset();
    requestAnimationFrame(animateSuccess);
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        className="border-border bg-surface rounded-lg border p-6"
      >
        <p className="text-body text-text-primary font-semibold">
          {content.success.title}
        </p>
        <p className="text-small text-text-secondary mt-1">
          {content.success.body}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-small text-accent mt-4 font-medium hover:underline"
        >
          {content.form.sendAnotherLabel}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      {/* Honeypot — hidden from sighted and screen-reader users alike;
          real visitors never populate this field. Field name is
          config-driven (contactConfig.spamProtection.honeypotFieldName)
          rather than hardcoded, so the form and the service that checks
          it can never drift out of sync. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={contactConfig.spamProtection.honeypotFieldName}>
          Company
        </label>
        <input
          type="text"
          id={contactConfig.spamProtection.honeypotFieldName}
          name={contactConfig.spamProtection.honeypotFieldName}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-small text-text-primary font-medium"
        >
          {content.form.nameLabel}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={content.form.namePlaceholder}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(inputClass, errors.name && "border-error")}
        />
        {errors.name && (
          <p id="name-error" className="text-caption text-error">
            {errorMessage(errors.name, content)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-small text-text-primary font-medium"
        >
          {content.form.emailLabel}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder={content.form.emailPlaceholder}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(inputClass, errors.email && "border-error")}
        />
        {errors.email && (
          <p id="email-error" className="text-caption text-error">
            {errorMessage(errors.email, content)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject"
          className="text-small text-text-primary font-medium"
        >
          {content.form.subjectLabel}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder={content.form.subjectPlaceholder}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={cn(inputClass, errors.subject && "border-error")}
        />
        {errors.subject && (
          <p id="subject-error" className="text-caption text-error">
            {errorMessage(errors.subject, content)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-small text-text-primary font-medium"
        >
          {content.form.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={content.form.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            inputClass,
            "resize-y",
            errors.message && "border-error"
          )}
        />
        {errors.message && (
          <p id="message-error" className="text-caption text-error">
            {errorMessage(errors.message, content)}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-caption text-error">
          {errorMessage(sendErrorCode, content)}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-accent text-background hover:bg-accent-hover focus-visible:ring-accent text-small mt-2 self-start rounded-md px-5 py-2.5 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting"
          ? content.form.submittingLabel
          : content.form.submitLabel}
      </button>
    </form>
  );
}
