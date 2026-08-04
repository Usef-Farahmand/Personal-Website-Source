import type { Skill } from "@/content/types";

export const skills: Skill[] = [
  {
    id: "skill-typescript",
    domain: "frontend",
    experienceLevel: "expert",
    yearsOfExperience: 6,
    technologies: ["Node.js", "ESLint", "Zod"],
    relatedProjectIds: ["prj-personal-ai", "prj-devnotes"],
    relatedArticleIds: ["art-multilingual-architecture"],
    order: 1,
    translations: {
      en: {
        name: "TypeScript",
        description:
          "Primary language for almost everything I build — frontend, backend, and tooling alike.",
      },
    },
  },
  {
    id: "skill-react-nextjs",
    domain: "frontend",
    experienceLevel: "expert",
    yearsOfExperience: 6,
    technologies: ["Next.js App Router", "Tailwind CSS", "next-intl"],
    relatedProjectIds: ["prj-personal-ai"],
    relatedArticleIds: ["art-multilingual-architecture", "art-motion-system"],
    externalLinks: [{ label: "Next.js Docs", url: "https://nextjs.org/docs" }],
    order: 2,
    translations: {
      en: {
        name: "React & Next.js",
        description:
          "Building content-driven, multilingual frontends with the App Router as the default architecture.",
      },
    },
  },
  {
    id: "skill-nodejs",
    domain: "backend",
    experienceLevel: "advanced",
    yearsOfExperience: 5,
    technologies: ["Express", "PostgreSQL", "Redis"],
    relatedProjectIds: ["prj-devnotes"],
    order: 3,
    translations: {
      en: {
        name: "Node.js",
        description:
          "API design, service architecture, and background processing for production systems.",
      },
    },
  },
  {
    id: "skill-postgresql",
    domain: "database",
    experienceLevel: "advanced",
    yearsOfExperience: 5,
    technologies: ["Prisma", "pgvector"],
    relatedProjectIds: ["prj-devnotes"],
    order: 4,
    translations: {
      en: {
        name: "PostgreSQL",
        description:
          "Schema design, query performance, and migrations for relational data at production scale.",
      },
    },
  },
  {
    id: "skill-ai-integration",
    domain: "ai",
    experienceLevel: "advanced",
    yearsOfExperience: 2,
    technologies: ["OpenAI API", "Vector search", "Retrieval pipelines"],
    relatedProjectIds: ["prj-personal-ai"],
    relatedArticleIds: ["art-retrieval-ranking"],
    externalLinks: [
      {
        label: "OpenAI Platform Docs",
        url: "https://platform.openai.com/docs",
      },
    ],
    order: 5,
    translations: {
      en: {
        name: "AI Integration",
        description:
          "Retrieval-augmented systems, prompt architecture, and applied LLM product features.",
      },
    },
  },
  {
    id: "skill-unity-csharp",
    domain: "game",
    experienceLevel: "intermediate",
    yearsOfExperience: 2,
    technologies: ["Unity", "C#"],
    relatedProjectIds: ["prj-jolly-panda-arcade"],
    relatedArticleIds: ["art-founder-lessons"],
    order: 6,
    translations: {
      en: {
        name: "Unity & C#",
        description:
          "Gameplay systems and small-scale game production, from prototype to shipped build.",
      },
    },
  },
  {
    id: "skill-aws",
    domain: "cloud",
    experienceLevel: "advanced",
    yearsOfExperience: 4,
    technologies: ["EC2", "S3", "CloudFront"],
    order: 7,
    translations: {
      en: {
        name: "AWS",
        description:
          "Designing and operating cloud infrastructure with cost and reliability both in mind.",
      },
    },
  },
  {
    id: "skill-docker-ci",
    domain: "devops",
    experienceLevel: "intermediate",
    yearsOfExperience: 4,
    technologies: ["Docker", "GitHub Actions"],
    order: 8,
    translations: {
      en: {
        name: "Docker & CI/CD",
        description:
          "Containerized environments and automated pipelines that make deploys boring, on purpose.",
      },
    },
  },
  {
    id: "skill-figma",
    domain: "ui-ux",
    experienceLevel: "intermediate",
    yearsOfExperience: 5,
    technologies: ["Figma", "Design tokens"],
    relatedProjectIds: ["prj-jolly-panda-arcade"],
    order: 9,
    translations: {
      en: {
        name: "Figma",
        description:
          "Interface design and prototyping — enough fluency to design my own products end to end.",
      },
    },
  },
  {
    id: "skill-react-native",
    domain: "mobile",
    experienceLevel: "beginner",
    yearsOfExperience: 1,
    technologies: ["Expo"],
    order: 10,
    translations: {
      en: {
        name: "React Native",
        description:
          "Cross-platform mobile development, currently the newest domain I'm actively building in.",
      },
    },
  },
  {
    id: "skill-git",
    domain: "tools",
    experienceLevel: "expert",
    yearsOfExperience: 8,
    technologies: ["Git", "GitHub Actions", "Conventional Commits"],
    order: 11,
    translations: {
      en: {
        name: "Git & GitHub",
        description:
          "Branching strategy, code review workflow, and release hygiene across every project here.",
      },
    },
  },
];
