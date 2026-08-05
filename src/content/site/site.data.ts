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
          "I'm Usef Farahmand, a software engineer and product builder. I spend most of my time turning ideas into working products, then writing about what actually happened along the way.",
        mission:
          "I want to build products that are genuinely useful, and be honest in public about how they got built, mistakes included.",
        philosophy:
          "I'd rather ship something small and real than plan something large and theoretical. Every project should teach me something I can only learn by finishing it.",
        journey:
          "I started building things out of curiosity long before it was a career. That curiosity turned into a habit of shipping, which turned into Jolly Panda Studio, a small independent studio where I build games, AI tools, and web products under one roof.",
        interests:
          "Outside of shipped work, I spend time exploring applied AI, game design, and tools that make other builders faster.",
      },
      contact: {
        availabilityNote:
          "Open to new conversations about products, collaborations, and interesting problems.",
        privacyNote:
          "Your message is used only to reply to you. It is never shared or used for anything else.",
      },
    },
  },
};
