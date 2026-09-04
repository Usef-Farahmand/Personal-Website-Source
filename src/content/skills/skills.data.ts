import type { Skill } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/skills.json) and the
 * English CV's Technical Skills section, both verified primary sources.
 * Experience levels and years follow the CV's "6+ years" Unity/C# summary;
 * skills without a stated duration in any source omit yearsOfExperience
 * rather than guessing one.
 */
export const skills: Skill[] = [
  {
    id: "skill-unity-csharp",
    domain: "game",
    experienceLevel: "expert",
    yearsOfExperience: 6,
    technologies: ["Unity", "C#", "Gameplay Programming", "AI"],
    relatedProjectIds: [
      "prj-mr-bean-solitaire",
      "prj-hide-and-seek",
      "prj-balloon-boomer",
      "prj-nailer-mailer",
    ],
    relatedArticleIds: ["art-streamlining-3d-projects"],
    order: 1,
    translations: {
      en: {
        name: "Unity & C#",
        description:
          "Primary engine and language for 6+ years of commercial game development — gameplay systems, editor tools, and shipped Android and PC titles.",
      },
      fa: {
        name: "یونیتی و C#",
        description:
          "انجین و زبان اصلی من در بیش از ۶ سال توسعهٔ حرفه‌ای بازی؛ سیستم‌های گیم‌پلی، ابزارهای ادیتور و عناوین منتشرشده روی اندروید و PC.",
      },
    },
  },
  {
    id: "skill-technical-art",
    domain: "game",
    experienceLevel: "advanced",
    technologies: [
      "Shader Graph",
      "Animator",
      "URP",
      "VFX",
      "Technical Animation",
    ],
    relatedProjectIds: ["prj-the-skatepark"],
    order: 2,
    translations: {
      en: {
        name: "Technical Art & Animation",
        description:
          "Character rigging and animation, shader work, and VFX — the technical-artist side of taking a project from art assets to a working game.",
      },
      fa: {
        name: "تکنیکال آرت و انیمیشن",
        description:
          "ریگ و انیمیشن کاراکتر، کار روی شیدرها و جلوه‌های ویژه؛ سمت تکنیکال‌آرتیستی مسیر از اسِت گرافیکی تا بازی قابل‌اجرا.",
      },
    },
  },
  {
    id: "skill-ui-programming",
    domain: "ui-ux",
    experienceLevel: "advanced",
    technologies: ["UI Architecture", "Save System", "Localization"],
    relatedProjectIds: [
      "prj-simulix",
      "prj-balloon-boomer",
      "prj-nailer-mailer",
    ],
    order: 3,
    translations: {
      en: {
        name: "Gameplay UI Programming",
        description:
          "Architecting UI systems, in-game shops, and save/localization systems for shipped mobile games and interactive applications.",
      },
      fa: {
        name: "برنامه‌نویسی رابط کاربری بازی",
        description:
          "طراحی معماری سیستم‌های رابط کاربری، فروشگاه درون‌بازی و سیستم‌های ذخیره و بومی‌سازی برای بازی‌های موبایل و اپلیکیشن‌های تعاملی منتشرشده.",
      },
    },
  },
  {
    id: "skill-multi-engine",
    domain: "game",
    experienceLevel: "intermediate",
    technologies: ["Godot", "Cocos Creator"],
    relatedProjectIds: ["prj-gt-racing"],
    order: 4,
    translations: {
      en: {
        name: "Godot & Cocos Creator",
        description:
          "Additional engines used outside Unity, including Cocos Creator with TypeScript for playable-ad work.",
      },
      fa: {
        name: "گودو و کوکوس کریتور",
        description:
          "انجین‌های تکمیلی خارج از یونیتی، از جمله کوکوس کریتور همراه با تایپ‌اسکریپت برای ساخت تبلیغات تعاملی.",
      },
    },
  },
  {
    id: "skill-vr-ar",
    domain: "game",
    experienceLevel: "intermediate",
    technologies: ["Meta Quest", "Unity XR"],
    order: 5,
    translations: {
      en: {
        name: "VR & AR Development",
        description:
          "Building immersive VR training experiences for standalone headsets, including interaction systems and performance optimization.",
      },
      fa: {
        name: "توسعهٔ واقعیت مجازی و افزوده",
        description:
          "ساخت تجربه‌های آموزشی غوطه‌ور در واقعیت مجازی برای هدست‌های مستقل، شامل سیستم‌های تعامل و بهینه‌سازی کارایی.",
      },
    },
  },
  {
    id: "skill-git",
    domain: "tools",
    experienceLevel: "advanced",
    technologies: ["Git", "GitHub"],
    relatedProjectIds: ["prj-uapi-unitask", "prj-uapi-coroutine"],
    order: 6,
    translations: {
      en: {
        name: "Git & GitHub",
        description:
          "Version control and open-source workflow for every project here, including maintaining public Unity packages.",
      },
      fa: {
        name: "گیت و گیت‌هاب",
        description:
          "کنترل نسخه و روند کار متن‌باز برای همهٔ پروژه‌ها، از جمله نگهداری پکیج‌های عمومی یونیتی.",
      },
    },
  },
  {
    id: "skill-figma",
    domain: "ui-ux",
    experienceLevel: "intermediate",
    technologies: ["Figma", "Photoshop"],
    order: 7,
    translations: {
      en: {
        name: "Figma & Photoshop",
        description:
          "Interface design and visual asset prep — enough fluency to design UI and marketing visuals myself before handing off, or building alone.",
      },
      fa: {
        name: "فیگما و فتوشاپ",
        description:
          "طراحی رابط کاربری و آماده‌سازی اسِت‌های گرافیکی؛ تسلط کافی برای طراحی مستقل رابط کاربری و تصاویر تبلیغاتی.",
      },
    },
  },
  {
    id: "skill-game-sdks",
    domain: "tools",
    experienceLevel: "advanced",
    technologies: ["Firebase", "AppLovin MAX", "GameAnalytics", "REST APIs"],
    relatedProjectIds: ["prj-mr-bean-solitaire", "prj-simulix"],
    order: 8,
    translations: {
      en: {
        name: "Game SDKs & Analytics",
        description:
          "Integrating monetization, analytics, and backend SDKs into shipped mobile games and client applications.",
      },
      fa: {
        name: "SDKهای بازی و تحلیل داده",
        description:
          "یکپارچه‌سازی SDKهای مانتیزیشن، تحلیل داده و بک‌اند در بازی‌های موبایل و اپلیکیشن‌های سفارشی منتشرشده.",
      },
    },
  },
  {
    id: "skill-typescript-nextjs",
    domain: "frontend",
    experienceLevel: "intermediate",
    technologies: ["Next.js App Router", "Tailwind CSS", "next-intl"],
    order: 9,
    translations: {
      en: {
        name: "TypeScript & Next.js",
        description:
          "The stack behind this personal website itself — a bilingual, content-driven frontend built and maintained end to end, my most recent domain outside game development.",
      },
      fa: {
        name: "تایپ‌اسکریپت و Next.js",
        description:
          "زیرساخت همین وب‌سایت شخصی؛ یک فرانت‌اند دوزبانه و مبتنی بر محتوا که از ابتدا تا انتها خودم ساخته و نگهداری می‌کنم — تازه‌ترین حوزهٔ من خارج از توسعهٔ بازی.",
      },
    },
  },
];
