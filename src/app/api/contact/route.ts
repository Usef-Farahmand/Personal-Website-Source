import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NAME_MAX = 100;
const EMAIL_MAX = 200;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

// Minimal, deliberately permissive email shape check — the real
// verification is Resend accepting the send, not a regex here.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot field — real visitors never see or fill it (hidden via CSS
   *  in ContactForm), so a non-empty value means a bot filled every field
   *  it found. Rejected silently as a success to avoid tipping the bot off. */
  company?: unknown;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const { name, email, message, company } = payload;

  // Honeypot tripped — respond as if it succeeded so the bot gets no
  // signal, but skip actually sending anything.
  if (typeof company === "string" && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length > NAME_MAX) {
    return NextResponse.json(
      { ok: false, error: "invalid_name" },
      { status: 422 }
    );
  }
  if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > EMAIL_MAX) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 422 }
    );
  }
  if (
    trimmedMessage.length < MESSAGE_MIN ||
    trimmedMessage.length > MESSAGE_MAX
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_message" },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    // Fails loudly server-side (visible in deployment logs) rather than
    // silently pretending to succeed — a misconfigured env should be
    // caught in deployment checks, not discovered via a visitor complaint.
    console.error(
      "Contact route misconfigured: RESEND_API_KEY, CONTACT_FROM_EMAIL, or CONTACT_TO_EMAIL is not set."
    );
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: trimmedEmail,
        subject: `New message from ${trimmedName} via useffarahmand.com`,
        html: `<p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p><p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p><p><strong>Message:</strong></p><p>${escapeHtml(trimmedMessage).replace(/\n/g, "<br />")}</p>`,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Resend send failed:", response.status, body);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 }
    );
  }
}
