import type { ExploringEntry } from "@/content/types";

export const exploringEntries: ExploringEntry[] = [
  {
    id: "exp-on-device-ai",
    order: 1,
    relatedArticleId: "art-retrieval-ranking",
    translations: {
      en: {
        title: "On-device AI inference",
        description:
          "How small models can run locally in a game or tool without a server round-trip — and where that trade-off actually breaks down.",
      },
    },
  },
  {
    id: "exp-procedural-game-systems",
    order: 2,
    relatedArticleId: null,
    translations: {
      en: {
        title: "Procedural systems in small games",
        description:
          "Designing systems that generate content instead of hand-authoring it, without losing the intentionality a small team can still afford.",
      },
    },
  },
  {
    id: "exp-persian-web-typography",
    order: 3,
    relatedArticleId: "art-multilingual-architecture",
    translations: {
      en: {
        title: "Persian typography on the web",
        description:
          "The gap between technically-correct RTL support and Persian text that actually reads well — line height, numerals, and punctuation habits included.",
      },
    },
  },
  {
    id: "exp-agentic-dev-tools",
    order: 4,
    relatedArticleId: null,
    translations: {
      en: {
        title: "Agentic developer tools",
        description:
          "What it takes to trust a tool that acts on a codebase instead of just suggesting edits — and how to verify its work without re-doing it.",
      },
    },
  },
];
