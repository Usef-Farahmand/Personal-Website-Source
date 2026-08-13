import type { ExploringEntry } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/exploring.json),
 * plus one addition — frontend/Next.js — verified directly by this
 * project itself (source #3 in the migration brief) rather than by
 * the previous site or LinkedIn.
 */
export const exploringEntries: ExploringEntry[] = [
  {
    id: "exploring-advanced-unity",
    order: 1,
    relatedArticleId: "art-streamlining-3d-projects",
    translations: {
      en: {
        title: "Advanced Unity Development",
        description:
          "Exploring advanced gameplay systems, architecture, and optimization techniques.",
      },
      fa: {
        title: "توسعهٔ پیشرفتهٔ یونیتی",
        description:
          "کاوش در سیستم‌های پیشرفتهٔ گیم‌پلی، معماری و تکنیک‌های بهینه‌سازی.",
      },
    },
  },
  {
    id: "exploring-technical-art",
    order: 2,
    relatedArticleId: null,
    translations: {
      en: {
        title: "Technical Art",
        description:
          "Improving skills in shaders, animation workflows, and visual effects.",
      },
      fa: {
        title: "تکنیکال آرت",
        description:
          "بهبود مهارت در شیدرها، روند کار انیمیشن و جلوه‌های ویژهٔ بصری.",
      },
    },
  },
  {
    id: "exploring-vr-ar",
    order: 3,
    relatedArticleId: null,
    translations: {
      en: {
        title: "VR & AR Experiences",
        description: "Experimenting with immersive interactive experiences.",
      },
      fa: {
        title: "تجربه‌های واقعیت مجازی و افزوده",
        description: "آزمایش تجربه‌های تعاملی و غوطه‌ور.",
      },
    },
  },
  {
    id: "exploring-frontend-nextjs",
    order: 4,
    relatedArticleId: null,
    translations: {
      en: {
        title: "Frontend Engineering",
        description:
          "Learning Next.js, TypeScript, and bilingual frontend architecture by building this personal website end to end.",
      },
      fa: {
        title: "مهندسی فرانت‌اند",
        description:
          "یادگیری Next.js، تایپ‌اسکریپت و معماری فرانت‌اند دوزبانه با ساخت همین وب‌سایت شخصی از ابتدا تا انتها.",
      },
    },
  },
  {
    id: "exploring-game-design-writing",
    order: 5,
    relatedArticleId: "art-break-into-gamedev-2024",
    translations: {
      en: {
        title: "Game Design & Writing",
        description:
          "Developing storytelling skills and writing about game development.",
      },
      fa: {
        title: "طراحی بازی و نگارش",
        description: "توسعهٔ مهارت روایت‌گویی و نوشتن دربارهٔ توسعهٔ بازی.",
      },
    },
  },
];
