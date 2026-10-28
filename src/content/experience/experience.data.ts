import type { Experience } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/experience.json) and
 * the English CV (assets/PDF/Usef Farahmand CV.pdf), both verified primary
 * sources. White Designers Studios is kept as separate entries (Intern ->
 * Junior Game Programmer -> Junior Technical Artist, plus the concurrent
 * intern-mentoring role) rather than one merged row, matching how the
 * source actually recorded distinct internal role changes at the same
 * company. Rastaar and the mentoring role come from the LinkedIn profile
 * export (2026-10). `resumeBullets` feed /resume and the generated PDFs.
 */
export const experience: Experience[] = [
  {
    id: "exp-rastaar",
    companyName: "Rastaar",
    employmentType: "full-time",
    startDate: "2026-10-01",
    endDate: null,
    technologies: ["Generative AI", "Prompt Engineering", "Anthropic Claude"],
    relatedProjectIds: [],
    order: 1,
    translations: {
      en: {
        role: "Generative AI Engineer",
        headlineAchievement:
          "Building generative AI features and LLM-powered tooling as a Generative AI Engineer.",
        fullDescription:
          "Joined Rastaar as a Generative AI Engineer, working with large language models, prompt engineering, and AI-assisted tooling.",
        location: "Remote",
      },
      fa: {
        role: "مهندس هوش مصنوعی مولد",
        headlineAchievement:
          "ساخت قابلیت‌های هوش مصنوعی مولد و ابزارهای مبتنی بر مدل‌های زبانی بزرگ.",
        fullDescription:
          "به‌عنوان مهندس هوش مصنوعی مولد به رستار پیوستم و با مدل‌های زبانی بزرگ، مهندسی پرامپت و ابزارهای مبتنی بر هوش مصنوعی کار می‌کنم.",
        location: "دورکاری",
      },
    },
  },
  {
    id: "exp-jolly-panda",
    companyName: "Jolly Panda",
    employmentType: "full-time",
    startDate: "2026-06-01",
    endDate: null,
    technologies: ["Unity", "C#", "Next.js", "TypeScript", "Figma"],
    relatedLinks: [
      {
        label: "Jolly Panda on LinkedIn",
        url: "https://www.linkedin.com/company/jolly-panda/?viewAsMember=true",
      },
    ],
    relatedProjectIds: [],
    order: 2,
    translations: {
      en: {
        role: "Founder",
        headlineAchievement:
          "Founded Jolly Panda, a creative game and app studio, and started building its first products end to end.",
        fullDescription:
          "I founded Jolly Panda to build joyful digital experiences on my own terms — games and apps designed and shipped end to end, from creative direction to engineering. This personal website is one of the first products I'm building under the studio.",
        location: "On-site",
        resumeBullets: [
          "Founded Jolly Panda, a creative studio that designs and ships games and apps end to end, from creative direction to engineering.",
          "Lead the studio's team, product direction, and project planning across game and web products.",
          "Designed and built this bilingual (English/Persian) personal website with Next.js and TypeScript, including a typed content system that also generates this resume.",
        ],
      },
      fa: {
        role: "بنیان‌گذار",
        headlineAchievement:
          "بنیان‌گذاری جولی پاندا، استودیویی خلاق برای بازی و اپلیکیشن، و شروع ساخت اولین محصولات آن از صفر تا صد.",
        fullDescription:
          "جولی پاندا را بنیان گذاشتم تا تجربه‌های دیجیتال شاد را به شیوهٔ خودم بسازم؛ بازی‌ها و اپلیکیشن‌هایی که از جهت‌گیری خلاقانه تا مهندسی، از ابتدا تا انتشار توسط خودم طراحی و ساخته می‌شوند. همین وب‌سایت شخصی یکی از اولین محصولاتی است که زیر نام استودیو می‌سازم.",
        location: "حضوری",
        resumeBullets: [
          "بنیان‌گذاری جولی پاندا، استودیویی خلاق که بازی‌ها و اپلیکیشن‌ها را از جهت‌گیری خلاقانه تا مهندسی، از ابتدا تا انتشار طراحی و می‌سازد.",
          "هدایت تیم، جهت‌گیری محصول و برنامه‌ریزی پروژه‌های بازی و وب استودیو.",
          "طراحی و ساخت همین وب‌سایت شخصی دوزبانه (انگلیسی/فارسی) با Next.js و TypeScript، همراه با یک سیستم محتوای تایپ‌شده که همین رزومه را هم تولید می‌کند.",
        ],
      },
    },
  },
  {
    id: "exp-content-creator",
    companyName: "Jolly Panda",
    employmentType: "freelance",
    startDate: "2024-06-01",
    endDate: null,
    technologies: ["Content Creation", "Blogging", "Storytelling"],
    relatedLinks: [
      { label: "Articles on Medium", url: "https://medium.com/@UsefFarahmand" },
    ],
    relatedProjectIds: [],
    order: 3,
    translations: {
      en: {
        role: "Game Developer Content Creator",
        headlineAchievement:
          "Wrote and published dozens of articles about game development, design, and the game industry.",
        fullDescription:
          "Alongside development work, I write about game development, design, and the industry — covering everything from technical breakdowns of my own tools to essays on game history and culture. Published primarily on Medium.",
        location: "Remote",
        resumeBullets: [
          "Write and publish articles on game development, game design, and the game industry, primarily on Medium and LinkedIn.",
          "Share technical breakdowns of my own tools, dev tips, and industry insights with the game dev community on Telegram.",
        ],
      },
      fa: {
        role: "تولیدکنندهٔ محتوا برای توسعه‌دهندگان بازی",
        headlineAchievement:
          "نگارش و انتشار ده‌ها مقاله دربارهٔ توسعهٔ بازی، طراحی و صنعت گیم.",
        fullDescription:
          "در کنار کار توسعه، دربارهٔ توسعهٔ بازی، طراحی و صنعت گیم می‌نویسم؛ از تحلیل فنی ابزارهای خودم گرفته تا یادداشت‌هایی دربارهٔ تاریخ و فرهنگ بازی‌ها. این مقالات عمدتاً در مدیوم منتشر می‌شوند.",
        location: "دورکاری",
        resumeBullets: [
          "نگارش و انتشار مقاله دربارهٔ توسعهٔ بازی، طراحی بازی و صنعت گیم، عمدتاً در مدیوم و لینکدین.",
          "اشتراک تحلیل فنی ابزارهای خودم، نکات توسعه و بینش‌های صنعت با جامعهٔ توسعه‌دهندگان بازی در تلگرام.",
        ],
      },
    },
  },
  {
    id: "exp-apexia-soft",
    companyName: "Apexia Soft",
    employmentType: "part-time",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    technologies: ["Unity", "C#", "UI Architecture", "REST APIs"],
    relatedLinks: [
      {
        label: "Apexia Soft on LinkedIn",
        url: "https://www.linkedin.com/company/apexiasoft/posts/?feedView=all",
      },
    ],
    relatedProjectIds: ["prj-simulix"],
    order: 4,
    translations: {
      en: {
        role: "Unity Game Developer & UI Developer",
        headlineAchievement:
          "Built the interactive UI and client-server communication for Simulix, a 3D real estate visualization platform.",
        fullDescription:
          "Developed scalable UI systems and interactive features for Simulix, a 3D presentation platform for real estate sales, including apartment filtering, 2D/3D floor plan interactions, and REST API integration with the backend. Worked closely with designers and backend developers to ship production-ready features and improve performance.",
        location: "Remote | Dubai, United Arab Emirates",
        resumeBullets: [
          "Developed scalable Unity UI systems for Simulix, a 3D real estate visualization platform for Windows.",
          "Implemented apartment filtering, navigation, and interactive 2D/3D floor plans.",
          "Integrated REST APIs and designed the client–server communication workflow with the backend team.",
          "Improved performance and usability through profiling, optimization, and refactoring.",
        ],
      },
      fa: {
        role: "توسعه‌دهندهٔ یونیتی و رابط کاربری",
        headlineAchievement:
          "ساخت رابط کاربری تعاملی و ارتباط کلاینت-سرور برای سیمولیکس، پلتفرم نمایش سه‌بعدی واحدهای املاک.",
        fullDescription:
          "توسعهٔ سیستم‌های رابط کاربری مقیاس‌پذیر و امکانات تعاملی برای سیمولیکس، پلتفرم ارائهٔ سه‌بعدی برای فروش واحدهای ساختمانی؛ از جمله فیلتر واحدها، تعامل با پلان‌های دوبعدی و سه‌بعدی، و اتصال به بک‌اند از طریق REST API. همکاری نزدیک با طراحان و توسعه‌دهندگان بک‌اند برای رساندن قابلیت‌ها به تولید و بهبود کارایی.",
        location: "دورکاری | دبی، امارات متحده عربی",
        resumeBullets: [
          "توسعهٔ سیستم‌های رابط کاربری مقیاس‌پذیر در Unity برای سیمولیکس، پلتفرم نمایش سه‌بعدی املاک برای ویندوز.",
          "پیاده‌سازی فیلتر و ناوبری واحدها و پلان‌های تعاملی دوبعدی و سه‌بعدی.",
          "اتصال به REST APIها و طراحی روند ارتباط کلاینت-سرور همراه با تیم بک‌اند.",
          "بهبود کارایی و تجربهٔ کاربری با پروفایلینگ، بهینه‌سازی و بازنویسی کد.",
        ],
      },
    },
  },
  {
    id: "exp-mci",
    companyName: "Hamrahe Aval (MCI)",
    employmentType: "part-time",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    technologies: ["Unity", "Virtual Reality (VR)", "Augmented Reality (AR)"],
    relatedLinks: [
      {
        label: "Hamrahe Aval (MCI) on LinkedIn",
        url: "https://www.linkedin.com/company/hamraheaval/",
      },
    ],
    relatedProjectIds: [],
    order: 5,
    translations: {
      en: {
        role: "Virtual Reality Developer",
        headlineAchievement:
          "Built a VR training simulator for Meta Quest, including interaction systems and performance optimization.",
        fullDescription:
          "Developed interactive VR and AR experiences using Unity, including a virtual reality training simulator for Meta Quest. Implemented VR interaction systems, built immersive training environments, and optimized frame rate and usability for standalone hardware.",
        location: "Remote",
        resumeBullets: [
          "Developed a virtual reality training simulator for Meta Quest in Unity.",
          "Implemented VR interaction systems and immersive training environments.",
          "Optimized frame rate and interaction flow for standalone VR hardware.",
        ],
      },
      fa: {
        role: "توسعه‌دهندهٔ واقعیت مجازی",
        headlineAchievement:
          "ساخت یک شبیه‌ساز آموزشی واقعیت مجازی برای متا کوئست، شامل سیستم‌های تعامل و بهینه‌سازی کارایی.",
        fullDescription:
          "توسعهٔ تجربه‌های تعاملی واقعیت مجازی و واقعیت افزوده با یونیتی، از جمله یک شبیه‌ساز آموزشی واقعیت مجازی برای متا کوئست. پیاده‌سازی سیستم‌های تعامل در VR، ساخت محیط‌های آموزشی غوطه‌ور، و بهینه‌سازی نرخ فریم و تجربهٔ کاربری برای سخت‌افزار مستقل.",
        location: "دورکاری",
        resumeBullets: [
          "توسعهٔ یک شبیه‌ساز آموزشی واقعیت مجازی برای متا کوئست با Unity.",
          "پیاده‌سازی سیستم‌های تعامل VR و محیط‌های آموزشی غوطه‌ور.",
          "بهینه‌سازی نرخ فریم و روند تعامل برای سخت‌افزار VR مستقل.",
        ],
      },
    },
  },
  {
    id: "exp-unbound",
    companyName: "Unbound Game Studio",
    employmentType: "full-time",
    startDate: "2022-12-01",
    endDate: "2024-11-30",
    technologies: [
      "Unity",
      "C#",
      "UI Programming",
      "AppLovin MAX",
      "GameAnalytics",
    ],
    relatedLinks: [
      {
        label: "Unbound Game Studio on LinkedIn",
        url: "https://www.linkedin.com/company/unboundgamestudio2/",
      },
    ],
    relatedProjectIds: ["prj-mr-bean-solitaire"],
    order: 6,
    translations: {
      en: {
        role: "Game Developer",
        headlineAchievement:
          "Shipped gameplay systems and UI across several commercial mobile games, including Mr. Bean Solitaire: Adventure.",
        fullDescription:
          "Developed gameplay mechanics and game systems for commercial mobile titles, implementing scalable architecture and AI-driven mechanics. Beyond Mr. Bean Solitaire: Adventure, contributed gameplay features and SDK integrations to Football Manager, Risky Rope, Flying Teddy, and Sandwich Stack on Android — integrating AppLovin MAX and GameAnalytics, and optimizing performance and monetization across the portfolio.",
        location: "Remote | İzmir, Türkiye",
        resumeBullets: [
          "Shipped gameplay mechanics and UI for commercial Android titles, including Mr. Bean Solitaire: Adventure.",
          "Built match management and AI-driven gameplay for Football Manager on reusable, expandable game systems.",
          "Integrated AppLovin MAX and GameAnalytics and optimized monetization across Risky Rope, Flying Teddy, and Sandwich Stack.",
          "Fixed production issues and improved stability and performance across a wide range of Android devices.",
        ],
      },
      fa: {
        role: "توسعه‌دهندهٔ بازی",
        headlineAchievement:
          "پیاده‌سازی مکانیزم‌های گیم‌پلی و رابط کاربری در چند بازی موبایل تجاری، از جمله Mr. Bean Solitaire: Adventure.",
        fullDescription:
          "توسعهٔ مکانیزم‌های گیم‌پلی و سیستم‌های بازی برای عناوین موبایل تجاری، با پیاده‌سازی معماری مقیاس‌پذیر و مکانیزم‌های مبتنی بر هوش مصنوعی. علاوه بر Mr. Bean Solitaire: Adventure، در بازی‌های Football Manager، Risky Rope، Flying Teddy و Sandwich Stack روی اندروید نیز امکانات گیم‌پلی و اتصال SDKها را انجام دادم؛ از جمله یکپارچه‌سازی AppLovin MAX و GameAnalytics و بهینه‌سازی کارایی و مانتیزیشن در کل مجموعه.",
        location: "دورکاری | ازمیر، ترکیه",
        resumeBullets: [
          "پیاده‌سازی مکانیزم‌های گیم‌پلی و رابط کاربری برای بازی‌های تجاری اندروید، از جمله Mr. Bean Solitaire: Adventure.",
          "ساخت مدیریت مسابقه و گیم‌پلی مبتنی بر هوش مصنوعی برای Football Manager روی سیستم‌های قابل‌استفادهٔ مجدد و توسعه‌پذیر.",
          "یکپارچه‌سازی AppLovin MAX و GameAnalytics و بهینه‌سازی درآمدزایی در Risky Rope، Flying Teddy و Sandwich Stack.",
          "رفع مشکلات نسخهٔ منتشرشده و بهبود پایداری و کارایی روی طیف گسترده‌ای از دستگاه‌های اندرویدی.",
        ],
      },
    },
  },
  {
    id: "exp-wds-tech-artist",
    companyName: "White Designers Studios",
    employmentType: "full-time",
    startDate: "2022-02-01",
    endDate: "2022-10-31",
    technologies: ["Unity", "C#", "Technical Animation", "VFX", "Shaders"],
    relatedLinks: [
      {
        label: "White Designers Studios on LinkedIn",
        url: "https://www.linkedin.com/company/wdstudios/posts/?feedView=all",
      },
    ],
    relatedProjectIds: ["prj-the-skatepark"],
    order: 7,
    translations: {
      en: {
        role: "Junior Technical Artist",
        headlineAchievement:
          "Built the character animation and technical art pipeline for The Skatepark Project.",
        fullDescription:
          "Worked on technical art pipelines, character animations, game mechanics, tools, and asset workflows — most notably as Technical Artist and Animator on The Skatepark Project, where I handled character creation and animation, integrated art assets into the engine, and built tools to streamline the pipeline.",
        location: "On-site",
        resumeBullets: [
          "Technical Artist and Animator on The Skatepark Project: character creation, animation, and customization systems.",
          "Integrated art assets into Unity and built technical animation and VFX workflows.",
          "Built reusable Unity editor tools that streamlined the studio's art pipeline.",
        ],
      },
      fa: {
        role: "تکنیکال آرتیست جونیور",
        headlineAchievement:
          "ساخت پایپ‌لاین انیمیشن کاراکتر و تکنیکال آرت برای پروژهٔ The Skatepark.",
        fullDescription:
          "کار روی پایپ‌لاین‌های تکنیکال آرت، انیمیشن کاراکتر، مکانیزم‌های بازی، ابزارها و روند کار اسِت‌ها؛ مهم‌ترین آن نقش تکنیکال آرتیست و انیماتور در پروژهٔ The Skatepark بود، جایی که مسئول ساخت و انیمیشن کاراکترها، یکپارچه‌سازی اسِت‌های گرافیکی در انجین، و ساخت ابزارهایی برای روان‌تر شدن پایپ‌لاین بودم.",
        location: "حضوری",
        resumeBullets: [
          "تکنیکال آرتیست و انیماتور پروژهٔ The Skatepark: ساخت کاراکتر، انیمیشن و سیستم شخصی‌سازی.",
          "یکپارچه‌سازی اسِت‌های گرافیکی در Unity و ساخت روند کار انیمیشن فنی و VFX.",
          "ساخت ابزارهای ادیتور Unity قابل‌استفادهٔ مجدد برای روان‌تر شدن پایپ‌لاین آرت استودیو.",
        ],
      },
    },
  },
  {
    id: "exp-wds-intern-mentor",
    companyName: "White Designers Studios",
    employmentType: "part-time",
    startDate: "2021-09-01",
    endDate: "2022-10-31",
    technologies: ["Unity", "C#", "Mentoring"],
    relatedLinks: [
      {
        label: "White Designers Studios on LinkedIn",
        url: "https://www.linkedin.com/company/wdstudios/posts/?feedView=all",
      },
    ],
    relatedProjectIds: [],
    order: 8,
    translations: {
      en: {
        role: "Game Intern Mentor",
        headlineAchievement:
          "Mentored the studio's game development interns alongside my own programming and technical art roles.",
        fullDescription:
          "Alongside my programming and technical art roles, mentored the studio's game development interns on Unity, C#, and the studio's production workflow.",
        location: "On-site",
        resumeBullets: [
          "Mentored the studio's game development interns on Unity, C#, and production workflows alongside my own development role.",
        ],
      },
      fa: {
        role: "منتور کارآموزان بازی",
        headlineAchievement:
          "منتورینگ کارآموزان توسعهٔ بازی استودیو در کنار نقش برنامه‌نویسی و تکنیکال آرت.",
        fullDescription:
          "در کنار نقش برنامه‌نویسی و تکنیکال آرت، کارآموزان توسعهٔ بازی استودیو را در Unity، C# و روند تولید استودیو همراهی و راهنمایی کردم.",
        location: "حضوری",
        resumeBullets: [
          "منتورینگ کارآموزان توسعهٔ بازی استودیو در Unity، C# و روند تولید، در کنار نقش توسعهٔ خودم.",
        ],
      },
    },
  },
  {
    id: "exp-wds-junior-programmer",
    companyName: "White Designers Studios",
    employmentType: "full-time",
    startDate: "2021-04-01",
    endDate: "2022-03-31",
    technologies: ["Unity", "C#", "Gameplay Programming", "Mobile Games"],
    relatedLinks: [
      {
        label: "White Designers Studios on LinkedIn",
        url: "https://www.linkedin.com/company/wdstudios/posts/?feedView=all",
      },
    ],
    relatedProjectIds: [
      "prj-hide-and-seek",
      "prj-balloon-boomer",
      "prj-nailer-mailer",
      "prj-farmand",
    ],
    order: 9,
    translations: {
      en: {
        role: "Junior Game Programmer",
        headlineAchievement:
          "Shipped gameplay, UI, and shopping systems across several Android and playable-ad titles.",
        fullDescription:
          "Developed Android games and playable ads, implementing gameplay mechanics, UI systems, and interactive features with Unity and C#. Built the shooting and shopping systems for Nailer Mailer, the UI and shop for Balloon Boomer!, and the swap/hiding mechanics for Hide and Seek.",
        location: "On-site",
        resumeBullets: [
          "Developed Android games and playable ads with Unity and C#.",
          "Built the shooting and shopping systems for Nailer Mailer, the UI and shop for Balloon Boomer!, and the swap/hiding mechanics for Hide and Seek.",
          "Integrated third-party SDKs and optimized performance on mobile devices.",
        ],
      },
      fa: {
        role: "برنامه‌نویس جونیور بازی",
        headlineAchievement:
          "پیاده‌سازی گیم‌پلی، رابط کاربری و سیستم‌های فروشگاهی در چند عنوان اندرویدی و تبلیغات تعاملی.",
        fullDescription:
          "توسعهٔ بازی‌های اندروید و تبلیغات تعاملی (playable ads)، پیاده‌سازی مکانیزم‌های گیم‌پلی، سیستم‌های رابط کاربری و امکانات تعاملی با یونیتی و سی‌شارپ. سیستم تیراندازی و فروشگاه Nailer Mailer، رابط کاربری و فروشگاه Balloon Boomer!، و مکانیزم جابه‌جایی و پنهان‌شدن Hide and Seek را ساختم.",
        location: "حضوری",
        resumeBullets: [
          "توسعهٔ بازی‌های اندروید و تبلیغات تعاملی با Unity و C#.",
          "ساخت سیستم تیراندازی و فروشگاه Nailer Mailer، رابط کاربری و فروشگاه Balloon Boomer! و مکانیزم جابه‌جایی و پنهان‌شدن Hide and Seek.",
          "یکپارچه‌سازی SDKهای جانبی و بهینه‌سازی کارایی روی دستگاه‌های موبایل.",
        ],
      },
    },
  },
  {
    id: "exp-wds-intern",
    companyName: "White Designers Studios",
    employmentType: "internship",
    startDate: "2021-02-01",
    endDate: "2021-04-30",
    technologies: ["Unity", "C#", "Game Development"],
    relatedLinks: [
      {
        label: "White Designers Studios on LinkedIn",
        url: "https://www.linkedin.com/company/wdstudios/posts/?feedView=all",
      },
    ],
    relatedProjectIds: ["prj-gt-racing"],
    order: 10,
    translations: {
      en: {
        role: "Game Programmer Intern",
        headlineAchievement:
          "Started my professional game development career working on gameplay programming and production workflows.",
        fullDescription:
          "Started my professional game development journey by working on gameplay programming and learning production workflows, including early work on the GT Racing playable ad.",
        location: "On-site",
        resumeBullets: [
          "Worked on gameplay programming and learned the studio's production workflow, including early work on the GT Racing playable ad.",
        ],
      },
      fa: {
        role: "کارآموز برنامه‌نویسی بازی",
        headlineAchievement:
          "شروع مسیر حرفه‌ای توسعهٔ بازی با کار روی برنامه‌نویسی گیم‌پلی و آشنایی با روند تولید.",
        fullDescription:
          "شروع مسیر حرفه‌ای توسعهٔ بازی با کار روی برنامه‌نویسی گیم‌پلی و آشنایی با روند تولید استودیو، از جمله همکاری اولیه در تبلیغ تعاملی GT Racing.",
        location: "حضوری",
        resumeBullets: [
          "کار روی برنامه‌نویسی گیم‌پلی و آشنایی با روند تولید استودیو، از جمله همکاری اولیه در تبلیغ تعاملی GT Racing.",
        ],
      },
    },
  },
];
