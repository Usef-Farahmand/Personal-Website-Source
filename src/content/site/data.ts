import type { SiteContent } from "@/content/types";

export const siteContent: SiteContent = {
  id: "site",
  socialLinks: {
    github: "https://github.com/usef-farahmand",
    linkedin: "https://linkedin.com/in/usef-farahmand",
    x: "https://x.com/usef_farahmand",
    email: "mailto:hello@useffarahmand.com",
  },
  translations: {
    en: {
      hero: {
        name: "Usef Farahmand",
        tagline:
          "Software engineer and product builder, shaping ideas into working products.",
        statusLine: "Currently building Personal AI at Jolly Panda Studio.",
      },
      aboutPreview: {
        excerpt:
          "I build things end to end, from the first sketch to the last line of code, and write about what I learn along the way. Jolly Panda Studio is where most of that work happens.",
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
