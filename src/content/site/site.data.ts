import type { SiteContent } from "@/types/content";

export const siteContent: SiteContent = {
  id: "site",
  socialLinks: {
    github: "https://github.com/useffarahmand",
    linkedin: "https://www.linkedin.com/in/useffarahmand/",
    telegram: "https://t.me/UsefGameLab",
    email: "mailto:contact@useffarahmand.com",
  },
  availability: {
    isAvailable: true,
  },
  // Order is authored intentionally (web/mobile/game work first — the
  // bulk of what ships from Jolly Panda Studio — then AI, automation,
  // and websites) and drives the grid's left-to-right, top-to-bottom
  // order directly. Reordering the About page's "What I Build" grid is
  // a content change here, never a component change.
  aboutBuildAreas: [
    "webApps",
    "mobileApps",
    "games",
    "aiTools",
    "automation",
    "websites",
  ],
  translations: {
    en: {
      hero: {
        greeting: "Hello, I'm",
        name: "Usef Farahmand",
        professionalTitle: "Software Engineer & Product Builder",
        introduction:
          "I design and build digital products end to end, then write about what I learn along the way. Most of that work happens at Jolly Panda Studio, my independent studio.",
        availabilityStatus: "Available for new projects",
      },
      aboutPreview: {
        introduction:
          "I'm a software engineer and product builder who likes finishing what I start.",
        professionalSummary:
          "I work across the stack, from interface to infrastructure, and spend most of my time building products end to end at Jolly Panda Studio, the independent studio I founded.",
        highlights: [
          "Founder of Jolly Panda Studio",
          "Shipped AI tools, games, and web products",
          "Writes about what actually happens while building",
        ],
        philosophy:
          "I'd rather ship something small and real than plan something large and theoretical.",
      },
      about: {
        introduction:
          "I'm a software engineer and product builder based on curiosity more than a career plan. I spend most of my time turning ideas into working products at Jolly Panda Studio, my independent studio, then writing honestly about what actually happened along the way.",
        story: [
          "I build across the stack — web apps, mobile apps, games, and AI-powered tools — because I'd rather understand a whole product than one layer of it. Most of that work happens under Jolly Panda Studio, the small independent studio I run.",
          "I enjoy building software because finishing something real teaches me more than planning something large ever does. Every shipped project, even a small one, forces honest answers that a roadmap alone never gives me.",
          "What keeps me building is the same curiosity that started it: wanting to know if an idea actually holds up once it's real, and being willing to be wrong in public about how it got there.",
        ],
        currentFocus: [
          "Building AI-powered software",
          "Game development at Jolly Panda Studio",
          "Refining this personal website",
          "Growing Jolly Panda Studio",
        ],
      },
    },
  },
};
