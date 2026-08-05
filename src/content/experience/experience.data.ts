import type { Experience } from "@/types/content";

export const experience: Experience[] = [
  {
    id: "exp-jolly-panda-studio",
    companyName: "Jolly Panda Studio",
    employmentType: "full-time",
    startDate: "2024-06-01",
    endDate: null,
    technologies: ["Next.js", "TypeScript", "Unity", "C#", "Figma"],
    relatedLinks: [
      { label: "Studio Website", url: "https://jollypanda.studio" },
    ],
    relatedProjectIds: ["prj-personal-ai", "prj-jolly-panda-arcade"],
    order: 1,
    translations: {
      en: {
        role: "Founder & Lead Engineer",
        headlineAchievement:
          "Founded an independent studio and shipped AI tools, games, and web products end to end.",
        fullDescription:
          "I started Jolly Panda Studio to build products on my own terms, from first sketch to production. I handle everything from architecture and engineering to design direction, and I write publicly about how each project actually gets built.",
        location: "Remote",
      },
    },
  },
  {
    id: "exp-northbeam",
    companyName: "Northbeam Technologies",
    employmentType: "full-time",
    startDate: "2021-06-01",
    endDate: "2024-05-31",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    relatedProjectIds: [],
    order: 2,
    translations: {
      en: {
        role: "Senior Software Engineer",
        headlineAchievement:
          "Led the migration of a core product surface to a service-oriented architecture, cutting deploy time significantly.",
        fullDescription:
          "I worked across the full stack on Northbeam's main product, with a focus on backend architecture and reliability. I led a multi-quarter migration off a monolithic deployment process, mentored two junior engineers, and helped establish the team's code review and testing practices.",
        location: "Remote",
      },
    },
  },
  {
    id: "exp-vantix",
    companyName: "Vantix Software",
    employmentType: "full-time",
    startDate: "2019-01-01",
    endDate: "2021-05-31",
    technologies: ["JavaScript", "React", "Express"],
    relatedProjectIds: [],
    order: 3,
    translations: {
      en: {
        role: "Software Engineer",
        headlineAchievement:
          "Built and maintained customer-facing features for a B2B SaaS product from the ground up.",
        fullDescription:
          "My first role out of learning to build software professionally. I worked on a small team shipping customer-facing features end to end, which is where I first developed the habit of owning a feature from design through deployment.",
        location: "Tehran, Iran",
      },
    },
  },
];
