import type { AboutDocument } from "@/types/content";

/**
 * Empty for now: the resume moved to its own page (/resume) whose PDFs
 * are generated from the site content at build time (app/documents/),
 * so the About page links there instead of listing a static file. This
 * collection stays for future documents such as a portfolio PDF.
 */
export const aboutDocuments: AboutDocument[] = [];
