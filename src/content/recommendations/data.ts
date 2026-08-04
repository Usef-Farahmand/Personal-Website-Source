import type { Recommendation } from "@/content/types";

export const recommendations: Recommendation[] = [
  {
    id: "rec-sara-moradi",
    authorName: "Sara Moradi",
    authorPosition: "Product Manager",
    authorCompany: "Northbeam Technologies",
    source: "linkedin",
    date: "2024-07-12",
    linkedinUrl: "https://www.linkedin.com/in/sara-moradi-example",
    relatedExperienceId: "exp-northbeam",
    relatedProjectId: null,
    order: 1,
    published: true,
    translations: {
      en: {
        quote:
          "Usef was the engineer I trusted with the parts of the system nobody else wanted to touch. He led our service migration with almost no drama, and he was honest early whenever a deadline was genuinely at risk instead of letting it become a surprise.",
      },
    },
  },
  {
    id: "rec-daniel-price",
    authorName: "Daniel Price",
    authorPosition: "Engineering Manager",
    authorCompany: "Northbeam Technologies",
    source: "linkedin",
    date: "2024-05-30",
    linkedinUrl: "https://www.linkedin.com/in/daniel-price-example",
    relatedExperienceId: "exp-northbeam",
    relatedProjectId: null,
    order: 2,
    published: true,
    translations: {
      en: {
        quote:
          "He has a rare habit of asking 'what happens when this breaks' before shipping, not after. Our incident rate dropped noticeably once he started reviewing architecture decisions on the team.",
      },
    },
  },
  {
    id: "rec-lena-brooks",
    authorName: "Lena Brooks",
    authorPosition: "Independent Product Consultant",
    source: "manual",
    date: "2025-02-18",
    websiteUrl: "https://lenabrooks.example.com",
    relatedExperienceId: "exp-jolly-panda-studio",
    relatedProjectId: "prj-personal-ai",
    order: 3,
    published: true,
    translations: {
      en: {
        quote:
          "I've advised a lot of solo founders building their first real product. Usef was one of the few who could explain a technical trade-off in plain language without dumbing it down — that made our working sessions genuinely productive.",
      },
    },
  },
  {
    id: "rec-arman-kazemi",
    authorName: "Arman Kazemi",
    authorPosition: "Game Designer",
    source: "manual",
    date: "2025-08-02",
    relatedExperienceId: "exp-jolly-panda-studio",
    relatedProjectId: "prj-jolly-panda-arcade",
    order: 4,
    published: true,
    translations: {
      en: {
        quote:
          "We shipped three games together in under six months as a two-person team. Usef handled the entire engineering side without ever becoming the bottleneck — that's rarer than it sounds in game dev.",
      },
    },
  },
  {
    id: "rec-priya-nair",
    authorName: "Priya Nair",
    authorPosition: "Senior Software Engineer",
    authorCompany: "Vantix Software",
    source: "linkedin",
    date: "2021-03-10",
    relatedExperienceId: "exp-vantix",
    relatedProjectId: null,
    order: 5,
    published: true,
    translations: {
      en: {
        quote:
          "Usef was still early in his career when we worked together, but he already owned his features end to end instead of waiting to be told what 'done' meant. That instinct clearly stuck with him.",
      },
    },
  },
];
