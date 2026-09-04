import type { SiteContent } from "@/types/content";

export const siteContent: SiteContent = {
  id: "site",

  socialLinks: [
    {
      id: "github",
      platform: "github",
      url: "https://github.com/usef-farahmand",
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

  aboutBuildAreas: [
    "games",
    "websites",
    "webApps",
    "mobileApps",
    "automation",
    "aiTools",
  ],

  translations: {
    en: {
      hero: {
        greeting: "Hello, I'm",
        name: "Usef Farahmand",
        professionalTitle: "Programmer & Game Industry Enthusiast",
        introduction:
          "I've been active in game development for more than 6 years, building games and interactive software for companies and individuals alongside my own personal projects. These days, I'm focused on game programming and managing the Jolly Panda team.",
        availabilityStatus: "Available for new projects",
      },

      aboutPreview: {
        introduction:
          "I'm a Game Developer and Technical Artist who enjoys turning ideas into real, playable experiences.",

        professionalSummary:
          "My experience spans Game Development, Gameplay Programming, Technical Art, and interactive software, with projects ranging from mobile games and VR experiences to browser-based games and web applications. I've worked with both companies and individuals while continuing to develop my own projects under Jolly Panda.",

        highlights: [
          "6+ years of experience in Game Development",
          "Game Programmer & Technical Artist",
          "Managing the Jolly Panda team",
        ],

        philosophy:
          "I'd rather build something real and learn from it than spend too much time planning something that never gets made.",
      },

      about: {
        introduction:
          "I've been active in Game Development for more than 6 years, building games and interactive software for companies and individuals alongside my own personal projects. These days, I'm focused on Game Programming and managing the Jolly Panda team.",

        story: [
          "I started my career as a Game Programmer intern at White Designers Studios, where I worked on Gameplay Programming and gradually expanded into Technical Art. I later worked with Unbound Game Studio, Hamrahe Aval (MCI), and Apexia Soft, contributing to mobile games, a VR training simulator, and a 3D real estate platform.",
          "Alongside my professional work, I've continued building personal projects covering different areas of Game Development, including browser-based games, interactive experiences, and experimental projects under Jolly Panda.",
          "In recent projects, I've also been exploring Web Development and Full-Stack technologies, building projects with HTML, CSS, JavaScript, TypeScript, React, Next.js, databases, and APIs.",
          "I also write about Game Development, Game Design, and the game industry.",
          "What keeps me building is curiosity — I like taking an idea and finding out what happens when it becomes a real, playable, and working product.",
        ],

        currentFocus: [
          "Game Programming",
          "Managing the Jolly Panda team",
          "Developing personal Game Development projects",
          "Exploring Web Development and Full-Stack technologies",
          "Writing about Game Development and the game industry",
        ],
      },
    },

    fa: {
      hero: {
        greeting: "سلام، من",
        name: "یوسف فرحمند",
        professionalTitle: "برنامه‌نویس و فعال در حوزهٔ بازی",
        introduction:
          "بیش از ۶ سال است که در حوزهٔ بازی‌سازی فعالیت می‌کنم و در کنار پروژه‌های شخصی خودم، برای شرکت‌ها و افراد بازی و نرم‌افزارهای تعاملی می‌سازم. این روزها هم مشغول برنامه‌نویسی بازی و مدیریت تیم Jolly Panda هستم.",
        availabilityStatus: "برای پروژه‌های جدید در دسترسم",
      },

      aboutPreview: {
        introduction:
          "من یک Game Developer و Technical Artist هستم که از تبدیل ایده‌ها به تجربه‌های واقعی و قابل بازی لذت می‌برم.",

        professionalSummary:
          "تجربهٔ من حوزه‌هایی مانند Game Development، Gameplay Programming، Technical Art و ساخت نرم‌افزارهای تعاملی را شامل می‌شود؛ از بازی‌های موبایل و تجربه‌های VR گرفته تا بازی‌های browser-based و web applicationها. در کنار همکاری با شرکت‌ها و افراد، پروژه‌های شخصی خودم را نیز تحت Jolly Panda توسعه می‌دهم.",

        highlights: [
          "بیش از ۶ سال فعالیت در حوزهٔ Game Development",
          "Game Programmer و Technical Artist",
          "مدیریت تیم Jolly Panda",
        ],

        philosophy:
          "ترجیح می‌دهم چیزی واقعی بسازم و از نتیجه‌اش یاد بگیرم تا این‌که زمان زیادی صرف برنامه‌ریزی برای چیزی کنم که هیچ‌وقت ساخته نمی‌شود.",
      },

      about: {
        introduction:
          "بیش از ۶ سال است که در حوزهٔ Game Development فعالیت می‌کنم و در کنار پروژه‌های شخصی خودم، برای شرکت‌ها و افراد بازی و نرم‌افزارهای تعاملی می‌سازم. این روزها بیشتر روی Game Programming و مدیریت تیم Jolly Panda تمرکز دارم.",

        story: [
          "مسیر حرفه‌ای خودم را به‌عنوان Game Programmer در White Designers Studios شروع کردم؛ جایی که روی Gameplay Programming کار کردم و به‌تدریج وارد حوزهٔ Technical Art شدم. بعد از آن در Unbound Game Studio، همراه اول (MCI) و Apexia Soft فعالیت کردم و در پروژه‌هایی مانند بازی‌های موبایل، یک VR training simulator و یک 3D real estate platform مشارکت داشتم.",
          "در کنار فعالیت حرفه‌ای، همیشه روی پروژه‌های شخصی خودم در زمینهٔ Game Development نیز کار کرده‌ام؛ از بازی‌های browser-based و تجربه‌های تعاملی گرفته تا پروژه‌های experimental مختلف تحت Jolly Panda.",
          "در پروژه‌های اخیر، در کنار Game Development، در حال گسترش تجربه‌ام در Web Development و Full-Stack هستم و با تکنولوژی‌هایی مانند HTML، CSS، JavaScript، TypeScript، React، Next.js، databases و APIs کار کرده‌ام.",
          "همچنین دربارهٔ Game Development، Game Design و صنعت بازی می‌نویسم.",
          "چیزی که همچنان باعث می‌شود به ساختن ادامه بدهم، کنجکاوی است؛ دوست دارم یک ایده را به چیزی واقعی، قابل بازی و قابل استفاده تبدیل کنم و ببینم در عمل چه نتیجه‌ای می‌دهد.",
        ],

        currentFocus: [
          "Game Programming",
          "مدیریت تیم Jolly Panda",
          "توسعهٔ پروژه‌های شخصی در حوزهٔ Game Development",
          "گسترش تجربه در Web Development و Full-Stack",
          "نوشتن دربارهٔ Game Development و صنعت بازی",
        ],
      },
    },
  },
};