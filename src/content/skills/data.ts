import type { Skill } from "@/content/types";

export const skills: Skill[] = [
  {
    id: "skill-typescript",
    domain: "frontend",
    experienceLevel: "expert",
    yearsOfExperience: 6,
    featured: true,
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
    featured: true,
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
    featured: true,
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
    domain: "backend",
    experienceLevel: "advanced",
    yearsOfExperience: 5,
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
    featured: true,
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
    order: 10,
    translations: {
      en: {
        name: "React Native",
        description:
          "Cross-platform mobile development, currently the newest domain I'm actively building in.",
      },
    },
  },
];
