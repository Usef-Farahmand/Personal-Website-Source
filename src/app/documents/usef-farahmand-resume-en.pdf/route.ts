import { renderResumePdf } from "@/lib/resume-pdf";

// Built once at build time from src/content — see lib/resume-pdf.tsx.
export const dynamic = "force-static";

export async function GET() {
  const pdf = await renderResumePdf("en");
  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
}
