import type { AboutDocument } from "@/types/content";

/**
 * Resume + Portfolio, English and Persian — the fixed, small set the
 * About page's Documents section supports. One flat list (not split into
 * resume.data.ts / portfolio.data.ts) since both are the same shape and
 * are always rendered together as one section, matching this codebase's
 * "one file per collection" convention elsewhere (achievements, projects,
 * ...) rather than splitting an identical shape across two files.
 *
 * `media.src` below points at the repo's existing sample PDF as a
 * placeholder — swap each `src` (and `downloadUrl` if the downloadable
 * file should differ from the previewed one) for the real resume/
 * portfolio files when they're ready. Nothing else needs to change.
 */
export const aboutDocuments: AboutDocument[] = [
  {
    id: "doc-resume-en",
    kind: "resume",
    language: "en",
    version: "v1.0",
    lastUpdatedDate: "2026-06-01",
    media: {
      id: "media-resume-en",
      type: "pdf",
      src: "/certificates/sample-certificate.pdf",
      title: "Resume (English)",
      downloadable: true,
    },
    order: 1,
    translations: {
      en: {
        title: "Resume (English)",
      },
    },
  },
  {
    id: "doc-resume-fa",
    kind: "resume",
    language: "fa",
    version: "v1.0",
    lastUpdatedDate: "2026-06-01",
    media: {
      id: "media-resume-fa",
      type: "pdf",
      src: "/certificates/sample-certificate.pdf",
      title: "Resume (Persian)",
      downloadable: true,
    },
    order: 2,
    translations: {
      en: {
        title: "Resume (Persian)",
      },
    },
  },
  {
    id: "doc-portfolio-en",
    kind: "portfolio",
    language: "en",
    version: "v1.0",
    lastUpdatedDate: "2026-05-15",
    media: {
      id: "media-portfolio-en",
      type: "pdf",
      src: "/certificates/sample-certificate.pdf",
      title: "Portfolio (English)",
      downloadable: true,
    },
    order: 3,
    translations: {
      en: {
        title: "Portfolio (English)",
      },
    },
  },
  {
    id: "doc-portfolio-fa",
    kind: "portfolio",
    language: "fa",
    version: "v1.0",
    lastUpdatedDate: "2026-05-15",
    media: {
      id: "media-portfolio-fa",
      type: "pdf",
      src: "/certificates/sample-certificate.pdf",
      title: "Portfolio (Persian)",
      downloadable: true,
    },
    order: 4,
    translations: {
      en: {
        title: "Portfolio (Persian)",
      },
    },
  },
];
