import type { AboutDocument } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (assets/PDF/Usef Farahmand
 * CV.pdf) — the one real, verified document across all provided sources.
 * No Persian resume, English portfolio, or Persian portfolio exists in
 * any source (previous site, CV, or LinkedIn), so those three placeholder
 * entries are removed rather than left pointing at a sample PDF — see the
 * migration report. `lastUpdatedDate` is the PDF's own embedded
 * CreationDate/ModDate metadata, not a guess.
 */
export const aboutDocuments: AboutDocument[] = [
  {
    id: "doc-resume-en",
    kind: "resume",
    language: "en",
    version: "v1.0",
    lastUpdatedDate: "2026-09-05",
    media: {
      id: "media-resume-en",
      type: "pdf",
      src: "/documents/usef-farahmand-resume-en.pdf",
      title: "Resume (English)",
      downloadable: true,
    },
    order: 1,
    translations: {
      en: {
        title: "Resume (English)",
      },
      fa: {
        title: "رزومه (انگلیسی)",
      },
    },
  },
  {
    id: "doc-resume-fa",
    kind: "resume",
    language: "fa",
    version: "v1.0",
    lastUpdatedDate: "2026-09-05",
    media: {
      id: "media-resume-fa",
      type: "pdf",
      src: "/documents/usef-farahmand-resume-fa.pdf",
      title: "Resume (Persian)",
      downloadable: true,
    },
    order: 1,
    translations: {
      en: {
        title: "Resume (Persian)",
      },
      fa: {
        title: "رزومه (فارسی)",
      },
    },
  }
];
