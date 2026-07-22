import type { Project } from "@/content/types";

/**
 * Placeholder project data.
 *
 * Structurally production-shaped: every field a real project would have
 * is present. Only `translations.fa` is left unpopulated for now — the
 * content-access layer falls back to `en` and flags the fallback, exactly
 * as it will for real content until Persian translations are written.
 *
 * Logo, cover, and gallery images are real local SVG assets (not
 * unverified placeholder paths) — see /public/projects/.
 */
export const projects: Project[] = [
  {
    id: "prj-personal-ai",
    slug: "personal-ai",
    status: "active",
    featured: true,
    category: "ai",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Vector DB"],
    platforms: ["web"],
    releaseYear: 2025,
    startDate: "2025-11-01",
    endDate: null,
    logoUrl: "/projects/personal-ai-logo.svg",
    coverImageUrl: "/projects/personal-ai-cover.svg",
    gallery: [
      {
        type: "image",
        url: "/projects/personal-ai-gallery-1.svg",
        alt: "Personal AI chat interface",
        title: "Chat Interface",
      },
      {
        type: "image",
        url: "/projects/personal-ai-gallery-2.svg",
        alt: "Personal AI retrieval pipeline diagram",
        title: "Retrieval Pipeline",
      },
    ],
    timeline: [
      { date: "2025-11-01", label: "Project kickoff" },
      { date: "2025-12-15", label: "Retrieval pipeline v1" },
      { date: "2026-01-10", label: "Private beta" },
    ],
    links: {
      repository: "https://github.com/usef-farahmand/personal-ai",
    },
    externalLinks: [],
    relatedProjectIds: [],
    relatedArticleIds: ["art-retrieval-ranking"],
    experienceId: "exp-jolly-panda-studio",
    order: 1,
    translations: {
      en: {
        title: "Personal AI",
        summary:
          "An always-on assistant that learns from a person's own notes and conversations.",
        problem:
          "General-purpose assistants forget everything between sessions and have no grounding in a person's actual context, history, or preferences.",
        solution:
          "Built a retrieval-augmented assistant that indexes a person's notes, messages, and decisions over time, giving every response real continuity instead of starting from zero.",
        lessonsLearned:
          "The hardest part wasn't the model, it was deciding what to forget. An assistant that remembers everything equally becomes noisy rather than helpful; the retrieval ranking needed as much design attention as the generation itself.",
        challenges:
          "Balancing retrieval recall against response latency required several rounds of re-architecting the indexing pipeline.",
        features: [
          "Retrieval-augmented responses grounded in personal context",
          "Continuous indexing of notes and conversations over time",
          "Configurable retention and forgetting rules",
        ],
        metaTitle: "Personal AI — Usef Farahmand",
        metaDescription:
          "A retrieval-augmented personal assistant built to learn from real context over time.",
      },
    },
  },
  {
    id: "prj-jolly-panda-arcade",
    slug: "jolly-panda-arcade",
    status: "shipped",
    featured: true,
    category: "game",
    technologies: ["Unity", "C#", "Figma"],
    platforms: ["web", "desktop"],
    releaseYear: 2025,
    startDate: "2025-03-01",
    endDate: "2025-08-15",
    logoUrl: "/projects/jolly-panda-arcade-logo.svg",
    coverImageUrl: "/projects/jolly-panda-arcade-cover.svg",
    gallery: [],
    timeline: [
      { date: "2025-03-01", label: "Art direction established" },
      { date: "2025-08-15", label: "Launched all three games" },
    ],
    links: {
      demo: "https://jollypanda.studio/arcade",
    },
    externalLinks: [],
    relatedProjectIds: [],
    relatedArticleIds: [],
    experienceId: "exp-jolly-panda-studio",
    order: 2,
    translations: {
      en: {
        title: "Jolly Panda Arcade",
        summary:
          "A small collection of bite-sized browser games built around a single playful mascot.",
        problem:
          "Jolly Panda Studio needed a low-stakes, high-craft project to establish its visual identity before larger product work began.",
        solution:
          "Designed and shipped three short arcade games sharing one consistent art direction, sound identity, and mascot behavior system.",
        lessonsLearned:
          "Shipping something small end-to-end, start to finish, taught more about the studio's actual production pipeline than any amount of planning would have.",
        features: [
          "Three short, replayable browser games",
          "Shared mascot and sound identity across every game",
          "Playable directly in-browser, no install required",
        ],
        metaTitle: "Jolly Panda Arcade — Usef Farahmand",
        metaDescription:
          "A small arcade game collection establishing Jolly Panda Studio's visual identity.",
      },
    },
  },
  {
    id: "prj-devnotes",
    slug: "devnotes",
    status: "paused",
    featured: false,
    category: "tool",
    technologies: ["React", "Node.js", "PostgreSQL"],
    platforms: ["web"],
    startDate: "2024-09-01",
    endDate: null,
    gallery: [],
    links: {
      repository: "https://github.com/usef-farahmand/devnotes",
    },
    externalLinks: [],
    relatedProjectIds: [],
    relatedArticleIds: [],
    experienceId: null,
    order: 3,
    translations: {
      en: {
        title: "DevNotes",
        summary:
          "A structured note-taking tool built specifically for tracking engineering decisions.",
        problem:
          "Engineering decisions and their reasoning tend to live in Slack threads and get lost within weeks.",
        solution:
          "A lightweight tool that pairs every note with a decision status and links it to related notes automatically.",
        lessonsLearned:
          "Paused this to focus on Personal AI — a useful reminder that finishing fewer things well beats half-finishing many.",
        metaTitle: "DevNotes — Usef Farahmand",
        metaDescription:
          "A structured note-taking tool for tracking engineering decisions over time.",
      },
    },
  },
];
