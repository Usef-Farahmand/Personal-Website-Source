"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 10;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const inputClass =
  "border-border bg-background text-text-primary placeholder:text-text-secondary/60 focus-visible:ring-accent w-full rounded-md border px-3 py-2 text-small outline-none focus-visible:ring-2";

/**
 * Client-side form talking to POST /api/contact (src/app/api/contact/route.ts).
 * `company` is a honeypot: visually hidden, unreachable by tab order, and
 * never expected to hold a value from a real visitor — the server treats a
 * non-empty value as a bot submission.
 */
export function ContactForm() {
  const t = useTranslations("contactForm");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(formData: FormData): FieldErrors {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = t("errorInvalidName");
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = t("errorInvalidEmail");
    if (message.length < MESSAGE_MIN)
      nextErrors.message = t("errorInvalidMessage");
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const result = (await response.json()) as { ok: boolean };
      if (!response.ok || !result.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border-border bg-surface rounded-lg border p-6"
      >
        <p className="text-body text-text-primary font-semibold">
          {t("successTitle")}
        </p>
        <p className="text-small text-text-secondary mt-1">
          {t("successBody")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-small text-accent mt-4 font-medium hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot — hidden from sighted and screen-reader users alike;
          real visitors never populate this field. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-small text-text-primary font-medium"
        >
          {t("nameLabel")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(inputClass, errors.name && "border-error")}
        />
        {errors.name && (
          <p id="name-error" className="text-caption text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-small text-text-primary font-medium"
        >
          {t("emailLabel")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(inputClass, errors.email && "border-error")}
        />
        {errors.email && (
          <p id="email-error" className="text-caption text-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-small text-text-primary font-medium"
        >
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
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
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-caption text-error">
          {t("errorGeneric")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-accent text-background hover:bg-accent-hover focus-visible:ring-accent text-small mt-2 self-start rounded-md px-5 py-2.5 font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
