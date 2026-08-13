import type { SiteContent } from "@/types/content";

export const siteContent: SiteContent = {
  id: "site",
  // Verified against the previous useffarahmand.com (index.html) and the
  // English CV. GitHub uses the casing given directly as a known profile
  // (https://github.com/useffarahmand) — the previous site's Contact.html
  // page used a differing "usef-farahmand" variant; see the migration
  // report for that conflict. YouTube/Medium confirmed via index.html's
  // own footer links. Instagram is NOT included — no source (previous
  // site, CV, or the provided LinkedIn/GitHub/Telegram list) contains a
  // verified Instagram profile for Usef.
  socialLinks: [
    {
      id: "github",
      platform: "github",
      url: "https://github.com/useffarahmand",
      enabled: true,
    },
    {
      id: "linkedin",
      platform: "linkedin",
      url: "https://www.linkedin.com/in/useffarahmand/",
      enabled: true,
    },
    {
      id: "telegram",
      platform: "telegram",
      url: "https://t.me/UsefGameLab",
      enabled: true,
    },
    {
      id: "email",
      platform: "email",
      url: "mailto:contact@useffarahmand.com",
      enabled: true,
    },
    {
      id: "youtube",
      platform: "youtube",
      url: "https://www.youtube.com/@UsefFarahmand",
      enabled: true,
    },
    {
      id: "medium",
      platform: "medium",
      url: "https://medium.com/@UsefFarahmand",
      enabled: true,
    },
  ],
  availability: {
    isAvailable: true,
  },
  // Reordered to reflect verified work: games and mobile are the core,
  // 6+ year practice (Unity/C#, shipped Android titles); websites/webApps
  // reflect this personal site and Simulix; automation reflects the UAPI
  // open-source libraries; aiTools is kept last as a genuine area of
  // interest (see the Exists.AI article) rather than shipped work.
  aboutBuildAreas: [
    "games",
    "mobileApps",
    "websites",
    "webApps",
    "automation",
    "aiTools",
  ],
  translations: {
    en: {
      hero: {
        greeting: "Hello, I'm",
        name: "Usef Farahmand",
        professionalTitle: "Software Engineer & Product Builder",
        introduction:
          "I've spent 6+ years building games and interactive software — mostly with Unity and C# — for studios and my own projects. Now I'm building Jolly Panda Studio, and this website, end to end.",
        availabilityStatus: "Available for new projects",
      },
      aboutPreview: {
        introduction:
          "I'm a game developer and technical artist who likes finishing what I start.",
        professionalSummary:
          "I've spent 6+ years shipping games and interactive software with Unity and C#, from mobile titles to VR training simulators, and I write about the industry along the way. These days I'm also building Jolly Panda Studio and this website.",
        highlights: [
          "6+ years building games with Unity & C#",
          "Founder of Jolly Panda Studio",
          "Writes about game development on Medium",
        ],
        philosophy:
          "I'd rather ship something small and real than plan something large and theoretical.",
      },
      about: {
        introduction:
          "I'm a game developer and technical artist based on curiosity more than a career plan. I've spent 6+ years building games and interactive software, mostly with Unity and C#, and I'm now building Jolly Panda Studio and this website.",
        story: [
          "I started as a game programmer intern at White Designers Studios, working my way through gameplay programming and technical art before moving on to Unbound Game Studio, Hamrahe Aval (MCI), and Apexia Soft — shipping mobile games, a VR training simulator, and a 3D real estate platform along the way.",
          "In parallel, I write about game development, design, and the industry, and maintain a couple of small open-source Unity libraries (UAPI UniTask and UAPI Coroutine) for handling asynchronous API calls.",
          "What keeps me building is the same curiosity that started it: wanting to know if an idea actually holds up once it's real, whether that's a game mechanic, a tool, or — most recently — a personal website built from scratch with Next.js.",
        ],
        currentFocus: [
          "Building Jolly Panda Studio",
          "Building this personal website with Next.js",
          "Writing about game development",
          "Maintaining UAPI UniTask & UAPI Coroutine",
        ],
      },
    },
    fa: {
      hero: {
        greeting: "سلام، من",
        name: "یوسف فرح‌مند",
        professionalTitle: "مهندس نرم‌افزار و سازندهٔ محصول",
        introduction:
          "بیش از ۶ سال است که بازی و نرم‌افزار تعاملی می‌سازم — عمدتاً با یونیتی و سی‌شارپ — برای استودیوها و پروژه‌های شخصی خودم. این روزها هم دارم جولی پاندا استودیو و همین وب‌سایت را از صفر تا صد می‌سازم.",
        availabilityStatus: "برای پروژه‌های جدید در دسترسم",
      },
      aboutPreview: {
        introduction:
          "توسعه‌دهندهٔ بازی و تکنیکال آرتیستی هستم که دوست دارد کاری را که شروع می‌کند تمام کند.",
        professionalSummary:
          "بیش از ۶ سال است بازی و نرم‌افزار تعاملی با یونیتی و سی‌شارپ می‌سازم؛ از عناوین موبایل تا شبیه‌سازهای آموزشی واقعیت مجازی، و در کنارش دربارهٔ صنعت گیم هم می‌نویسم. این روزها هم روی جولی پاندا استودیو و همین وب‌سایت کار می‌کنم.",
        highlights: [
          "بیش از ۶ سال ساخت بازی با یونیتی و سی‌شارپ",
          "بنیان‌گذار جولی پاندا استودیو",
          "نویسندهٔ مقالات توسعهٔ بازی در مدیوم",
        ],
        philosophy:
          "ترجیح می‌دهم چیزی کوچک و واقعی بسازم تا این‌که چیزی بزرگ و صرفاً نظری برنامه‌ریزی کنم.",
      },
      about: {
        introduction:
          "توسعه‌دهندهٔ بازی و تکنیکال آرتیستی هستم که بیشتر از یک برنامهٔ شغلی، از کنجکاوی پیش می‌رود. بیش از ۶ سال است بازی و نرم‌افزار تعاملی می‌سازم، عمدتاً با یونیتی و سی‌شارپ، و حالا دارم جولی پاندا استودیو و همین وب‌سایت را می‌سازم.",
        story: [
          "مسیرم را به‌عنوان کارآموز برنامه‌نویسی بازی در White Designers Studios شروع کردم؛ از برنامه‌نویسی گیم‌پلی تا تکنیکال آرت پیش رفتم و بعد به Unbound Game Studio، همراه اول (MCI) و Apexia Soft رسیدم — در این مسیر بازی‌های موبایل، یک شبیه‌ساز آموزشی واقعیت مجازی و یک پلتفرم سه‌بعدی املاک ساختم.",
          "در کنار این‌ها، دربارهٔ توسعهٔ بازی، طراحی و صنعت گیم می‌نویسم و چند کتابخانهٔ کوچک متن‌باز یونیتی (UAPI UniTask و UAPI Coroutine) برای مدیریت فراخوانی‌های ناهمگام API نگهداری می‌کنم.",
          "چیزی که مرا به ساختن ادامه می‌دهد همان کنجکاوی اولیه است: می‌خواهم بدانم وقتی یک ایده واقعی می‌شود، واقعاً جواب می‌دهد یا نه — چه یک مکانیزم بازی باشد، چه یک ابزار، و چه — تازه‌ترینش — یک وب‌سایت شخصی که با Next.js از صفر ساخته‌ام.",
        ],
        currentFocus: [
          "ساخت جولی پاندا استودیو",
          "ساخت همین وب‌سایت شخصی با Next.js",
          "نوشتن دربارهٔ توسعهٔ بازی",
          "نگهداری UAPI UniTask و UAPI Coroutine",
        ],
      },
    },
  },
};
