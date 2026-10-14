import type { ContactTranslation } from "@/types/contact";
import type { Locale } from "@/types/content";

/**
 * Renders the two contact emails as complete HTML documents. EmailJS
 * gets the result as one variable and prints it unescaped (`{{{html}}}`),
 * so one dashboard template serves both emails and the layout lives in
 * version control instead of the dashboard.
 *
 * Because EmailJS no longer escapes anything, every value that came from
 * the visitor MUST go through `escapeHtml` here — that's the only thing
 * stopping a message from injecting markup into the email.
 *
 * Email-client rules: table layout, inline styles only, no external CSS
 * or web fonts, light colors only (dark-mode rewriting in Gmail/Outlook
 * handles the rest).
 */

export interface RenderedEmail {
  subject: string;
  html: string;
}

interface MessageFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Arabic-script letters — Persian text, Persian digits and Arabic presentation forms. */
const ARABIC_SCRIPT = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g;
const LATIN = /[A-Za-z]/g;

/**
 * Persian if the message has more Arabic-script letters than Latin ones,
 * else English — so "سلام، یک پروژهٔ React دارم" reads as Persian and
 * "Hi, my name is علی" as English.
 */
export function detectMessageLocale(text: string): Locale {
  const persian = text.match(ARABIC_SCRIPT)?.length ?? 0;
  const latin = text.match(LATIN)?.length ?? 0;
  return persian > 0 && persian >= latin ? "fa" : "en";
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escaped, with line breaks kept — `white-space: pre-wrap` is ignored by
 *  some clients (older Outlook), `<br>` isn't. */
function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

const COLORS = {
  page: "#f4f4f5",
  card: "#ffffff",
  border: "#e4e4e7",
  header: "#0a0a0b",
  headerText: "#f5f5f4",
  accent: "#f97316",
  accentText: "#ea580c",
  text: "#18181b",
  muted: "#71717a",
  faint: "#a1a1aa",
  panel: "#fafafa",
};

const SITE_URL = "https://www.useffarahmand.com";

function layout({
  locale,
  title,
  heading,
  body,
  footer,
}: {
  locale: Locale;
  title: string;
  heading: string;
  body: string;
  footer: string;
}): string {
  const dir = locale === "fa" ? "rtl" : "ltr";
  const align = locale === "fa" ? "right" : "left";
  const font =
    locale === "fa"
      ? "Vazirmatn, Tahoma, 'Segoe UI', Arial, sans-serif"
      : "'Segoe UI', Helvetica, Arial, sans-serif";

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(title)}</title>
</head>
<body dir="${dir}" style="margin:0;padding:0;background-color:${COLORS.page};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.page};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" dir="${dir}" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${COLORS.card};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;font-family:${font};text-align:${align};">
<tr><td style="background-color:${COLORS.header};padding:24px 28px;border-bottom:3px solid ${COLORS.accent};text-align:${align};">
<span dir="ltr" style="font-size:13px;letter-spacing:1px;color:${COLORS.accent};font-weight:700;">useffarahmand.com</span>
<div style="font-size:21px;line-height:30px;color:${COLORS.headerText};font-weight:700;margin-top:6px;">${escapeHtml(heading)}</div>
</td></tr>
${body}
<tr><td style="padding:16px 28px;background-color:${COLORS.panel};border-top:1px solid ${COLORS.border};font-size:12px;line-height:20px;color:${COLORS.faint};text-align:${align};">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Label/value block inside the grey panel. `value` is already HTML. */
function panelRow(label: string, value: string, align: string, first: boolean) {
  const divider = first ? "" : `border-top:1px solid ${COLORS.border};`;
  return `<tr><td style="padding:14px 16px 2px 16px;font-size:13px;color:${COLORS.muted};text-align:${align};${divider}">${escapeHtml(label)}</td></tr>
<tr><td dir="auto" style="padding:0 16px 14px 16px;font-size:15px;line-height:24px;color:${COLORS.text};word-break:break-word;text-align:${align};">${value}</td></tr>`;
}

function panel(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.panel};border:1px solid ${COLORS.border};border-radius:8px;">${rows}</table>`;
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background-color:${COLORS.accent};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;">${escapeHtml(label)}</a>`;
}

/** The visitor's message, to the site owner. Always English — it's for you. */
export function renderNotificationEmail(
  fields: MessageFields,
  meta: { messageLocale: Locale; sentAt: string; pageUrl: string }
): RenderedEmail {
  const subject = fields.subject || "(no subject)";
  const rows = [
    panelRow(
      "Name",
      `<strong>${escapeHtml(fields.name)}</strong>`,
      "left",
      true
    ),
    panelRow(
      "Email",
      `<a href="mailto:${escapeHtml(fields.email)}" style="color:${COLORS.accentText};text-decoration:none;font-weight:600;">${escapeHtml(fields.email)}</a>`,
      "left",
      false
    ),
    panelRow("Subject", escapeHtml(subject), "left", false),
    panelRow("Message", multiline(fields.message), "left", false),
  ].join("");

  const body = `<tr><td style="padding:24px 28px 8px 28px;">${panel(rows)}</td></tr>
<tr><td style="padding:12px 28px 4px 28px;font-size:13px;line-height:20px;color:${COLORS.muted};">
Sent ${escapeHtml(meta.sentAt)} (Tehran) · Confirmation sent in ${meta.messageLocale === "fa" ? "Persian" : "English"}
</td></tr>
<tr><td style="padding:16px 28px 28px 28px;">${button(`mailto:${fields.email}`, `Reply to ${fields.name}`)}</td></tr>`;

  return {
    subject: `New message: ${subject} — from ${fields.name}`,
    html: layout({
      locale: "en",
      title: "New contact message",
      heading: "New message from the contact form",
      body,
      footer: `Sent from <a href="${escapeHtml(meta.pageUrl)}" style="color:${COLORS.faint};">${escapeHtml(meta.pageUrl)}</a>. Replying to this email goes straight to the sender.`,
    }),
  };
}

/** Confirmation back to the visitor, in the language they wrote in. */
export function renderConfirmationEmail(
  fields: MessageFields,
  locale: Locale,
  copy: ContactTranslation["confirmationEmail"]
): RenderedEmail {
  const align = locale === "fa" ? "right" : "left";
  const rows = [
    panelRow(
      copy.subjectLabel,
      `<strong>${escapeHtml(fields.subject || copy.noSubject)}</strong>`,
      align,
      true
    ),
    panelRow(copy.messageLabel, multiline(fields.message), align, false),
  ].join("");

  const body = `<tr><td style="padding:28px 28px 8px 28px;font-size:15px;line-height:26px;color:${COLORS.text};text-align:${align};">
<p style="margin:0 0 12px 0;font-weight:700;">${escapeHtml(copy.greeting.replace("{name}", fields.name))}</p>
<p style="margin:0 0 20px 0;">${escapeHtml(copy.intro)}</p>
<p style="margin:0 0 10px 0;font-size:13px;color:${COLORS.muted};">${escapeHtml(copy.summaryHeading)}</p>
</td></tr>
<tr><td style="padding:0 28px 24px 28px;">${panel(rows)}</td></tr>
<tr><td style="padding:0 28px 28px 28px;font-size:15px;line-height:26px;color:${COLORS.text};text-align:${align};">
<p style="margin:0;">${escapeHtml(copy.closing)}</p>
<p style="margin:0 0 14px 0;font-weight:700;">${escapeHtml(copy.signature)}</p>
<span dir="ltr">${button(`${SITE_URL}/${locale}`, "useffarahmand.com")}</span>
</td></tr>`;

  return {
    subject: copy.subject,
    html: layout({
      locale,
      title: copy.subject,
      heading: copy.subject,
      body,
      footer: escapeHtml(copy.footer),
    }),
  };
}
