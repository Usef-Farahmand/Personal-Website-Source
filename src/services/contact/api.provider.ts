import type { ContactSendResult, EmailProvider } from "@/types/contact";

/**
 * Browser side of the contact form: posts the message to the site's own
 * API route (app/api/contact/route.ts), which validates it again and
 * sends both emails through EmailJS server-side. Nothing here knows
 * about EmailJS — no key or template ID is ever bundled into the page.
 */
export const apiProvider: EmailProvider = {
  async send(data) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json()) as ContactSendResult;
      if (typeof body?.success !== "boolean") {
        return { success: false, errorCode: "send_failed" };
      }
      return body;
    } catch (error) {
      console.error("Contact: request to /api/contact failed:", error);
      return { success: false, errorCode: "send_failed" };
    }
  },
};
