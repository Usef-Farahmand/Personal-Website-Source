import type { Article } from "@/content/types";

export const articles: Article[] = [
  {
    id: "art-multilingual-architecture",
    category: "software-engineering",
    tags: ["Next.js", "i18n", "Architecture"],
    sourcePlatform: "medium",
    sourceUrl: "https://medium.com/@usef-farahmand/multilingual-architecture",
    readingTimeMinutes: 8,
    publishedDate: "2026-06-10",
    headerImageUrl: "/articles/multilingual-architecture-header.svg",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 1,
    translations: {
      en: {
        title: "Designing a Multilingual Architecture from Day One",
        summary:
          "Why locale and domain should be fully independent concepts, and what that decision actually costs to build correctly.",
        metaTitle: "Designing a Multilingual Architecture from Day One",
        metaDescription:
          "A look at decoupling domain and locale in a real Next.js project, and what it takes to get right.",
      },
    },
  },
  {
    id: "art-motion-system",
    category: "design",
    tags: ["Motion Design", "Anime.js", "Accessibility"],
    sourcePlatform: "medium",
    sourceUrl: "https://medium.com/@usef-farahmand/designing-a-motion-system",
    readingTimeMinutes: 6,
    publishedDate: "2026-04-22",
    headerImageUrl: "/articles/motion-system-header.svg",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 2,
    translations: {
      en: {
        title: "Designing a Motion System, Not Just Animations",
        summary:
          "How a shared token vocabulary keeps motion consistent across a whole product instead of one-off per component.",
        metaTitle: "Designing a Motion System, Not Just Animations",
        metaDescription:
          "Why consistent motion tokens matter more than individually clever animations.",
      },
    },
  },
  {
    id: "art-founder-lessons",
    category: "personal-journey",
    tags: ["Founder", "Studio", "Lessons"],
    sourcePlatform: "linkedin",
    sourceUrl:
      "https://www.linkedin.com/pulse/lessons-from-a-year-of-jolly-panda-studio",
    readingTimeMinutes: 5,
    publishedDate: "2026-01-18",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 3,
    translations: {
      en: {
        title: "A Year of Running Jolly Panda Studio",
        summary:
          "What actually changed, technically and personally, after a year of building on my own terms.",
        metaTitle: "A Year of Running Jolly Panda Studio",
        metaDescription:
          "Reflections on a year of independent product work at Jolly Panda Studio.",
      },
    },
  },
  {
    id: "art-retrieval-ranking",
    category: "ai",
    tags: ["AI", "RAG", "Product"],
    sourcePlatform: "medium",
    sourceUrl: "https://medium.com/@usef-farahmand/what-to-forget",
    readingTimeMinutes: 7,
    publishedDate: "2025-12-02",
    relatedProjectIds: ["prj-personal-ai"],
    relatedArticleIds: [],
    order: 4,
    translations: {
      en: {
        title: "The Hardest Part of a Personal AI Isn't the Model",
        summary:
          "Deciding what an assistant should forget turned out to matter more than which model it runs on.",
        metaTitle: "The Hardest Part of a Personal AI Isn't the Model",
        metaDescription:
          "Notes on retrieval ranking and forgetting in a retrieval-augmented personal assistant.",
      },
    },
  },
];
