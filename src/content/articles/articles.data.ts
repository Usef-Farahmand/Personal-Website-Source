import type { Article } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/articles.json) — 22
 * real, published Medium articles, verified against
 * https://medium.com/@UsefFarahmand. `readingTimeMinutes` was not present
 * in the source data (the previous site didn't display it) and is
 * estimated here from each article's apparent length/depth rather than
 * measured — flagged in the migration report, not a verified fact like
 * the title, date, or URL.
 */
export const articles: Article[] = [
  {
    id: "art-broken-arrow-rts",
    category: "game-development",
    tags: ["RTS", "Broken Arrow", "Military Sim"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/broken-arrow-what-we-know-so-far-and-why-its-the-next-big-rts-2d33e66cf2d5",
    readingTimeMinutes: 6,
    publishedDate: "2024-11-19",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 1,
    translations: {
      en: {
        title:
          "Broken Arrow: What We Know So Far and Why It's the Next Big RTS",
        summary:
          "A look at Broken Arrow's large-scale battles, realistic combat mechanics, and deep military customization.",
        metaTitle:
          "Broken Arrow: What We Know So Far and Why It's the Next Big RTS",
        metaDescription:
          "An overview of Broken Arrow's combat systems and what makes it a promising modern RTS.",
      },
      fa: {
        title:
          "Broken Arrow: تا این‌جا چه می‌دانیم و چرا نسل بعدی RTS خواهد بود",
        summary:
          "نگاهی به نبردهای بزرگ‌مقیاس، مکانیزم‌های واقع‌گرایانهٔ نبرد و شخصی‌سازی نظامی عمیق در Broken Arrow.",
        metaTitle:
          "Broken Arrow: تا این‌جا چه می‌دانیم و چرا نسل بعدی RTS خواهد بود",
        metaDescription:
          "مروری بر سیستم‌های نبرد Broken Arrow و دلیل امیدوارکننده‌بودن آن به‌عنوان یک RTS مدرن.",
      },
    },
  },
  {
    id: "art-magic-of-animation",
    category: "game-development",
    tags: ["Animation", "Game Feel", "Storytelling"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/the-magic-of-animation-in-games-breathing-life-into-pixels-6ea00be02bf3",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-13",
    relatedProjectIds: ["prj-the-skatepark", "prj-mr-bean-solitaire"],
    relatedArticleIds: [],
    order: 2,
    translations: {
      en: {
        title: "The Magic of Animation in Games: Breathing Life into Pixels",
        summary:
          "An exploration of game animation techniques and their role in storytelling and immersion.",
        metaTitle:
          "The Magic of Animation in Games: Breathing Life into Pixels",
        metaDescription:
          "How animation techniques shape storytelling and player immersion in games.",
      },
      fa: {
        title: "جادوی انیمیشن در بازی‌ها: جان‌بخشیدن به پیکسل‌ها",
        summary:
          "کاوشی در تکنیک‌های انیمیشن بازی و نقش آن‌ها در روایت و غوطه‌وری بازیکن.",
        metaTitle: "جادوی انیمیشن در بازی‌ها: جان‌بخشیدن به پیکسل‌ها",
        metaDescription:
          "چگونه تکنیک‌های انیمیشن روایت و حس غوطه‌وری بازیکن را در بازی‌ها شکل می‌دهند.",
      },
    },
  },
  {
    id: "art-wild-west-wonders",
    category: "game-development",
    tags: ["Culture", "Western", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/wild-west-wonders-how-western-frontier-culture-shaped-gaming-48aefdbf21d4",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-09",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 3,
    translations: {
      en: {
        title: "Wild West Wonders: How Western Frontier Culture Shaped Gaming",
        summary:
          "The Wild West, a period of American history steeped in legend and myth, has long captivated storytellers, filmmakers, and artists — and games are no exception.",
        metaTitle:
          "Wild West Wonders: How Western Frontier Culture Shaped Gaming",
        metaDescription:
          "How Wild West mythology and frontier culture have influenced game design and storytelling.",
      },
      fa: {
        title: "شگفتی‌های غرب وحشی: فرهنگ مرزی غرب چگونه بازی‌ها را شکل داد",
        summary:
          "غرب وحشی، دوره‌ای از تاریخ آمریکا آغشته به افسانه و اسطوره، مدت‌هاست ذهن داستان‌گویان، فیلم‌سازان و هنرمندان را درگیر کرده — و بازی‌ها هم از این قاعده مستثنا نیستند.",
        metaTitle:
          "شگفتی‌های غرب وحشی: فرهنگ مرزی غرب چگونه بازی‌ها را شکل داد",
        metaDescription:
          "چگونه اسطورهٔ غرب وحشی و فرهنگ مرزی بر طراحی و روایت بازی‌ها اثر گذاشته است.",
      },
    },
  },
  {
    id: "art-redot-engine",
    category: "game-development",
    tags: ["REDOT", "Game Engines", "Open Source"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/redot-engine-a-new-frontier-in-game-development-13ce66607269",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-17",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 4,
    translations: {
      en: {
        title: "REDOT Engine: A New Frontier in Game Development",
        summary:
          "Exploring REDOT Engine, its modular architecture, rendering capabilities, and game development workflow.",
        metaTitle: "REDOT Engine: A New Frontier in Game Development",
        metaDescription:
          "An overview of REDOT Engine's architecture and workflow for game developers.",
      },
      fa: {
        title: "موتور REDOT: مرز تازه‌ای در توسعهٔ بازی",
        summary:
          "کاوشی در معماری ماژولار، قابلیت‌های رندرینگ و روند کار توسعهٔ بازی با موتور REDOT.",
        metaTitle: "موتور REDOT: مرز تازه‌ای در توسعهٔ بازی",
        metaDescription:
          "مروری بر معماری و روند کار موتور REDOT برای توسعه‌دهندگان بازی.",
      },
    },
  },
  {
    id: "art-streamlining-3d-projects",
    category: "software-engineering",
    tags: ["Unity", "Architecture", "ScriptableObjects"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/streamlining-large-3d-projects-a-modular-approach-in-unity-ac8872511c0c",
    readingTimeMinutes: 7,
    publishedDate: "2024-11-16",
    relatedProjectIds: ["prj-simulix"],
    relatedArticleIds: [],
    order: 5,
    translations: {
      en: {
        title: "Streamlining Large 3D Projects: A Modular Approach in Unity",
        summary:
          "A practical Unity workflow using modular architecture, ScriptableObjects, and the Package Manager to keep large 3D projects maintainable.",
        metaTitle:
          "Streamlining Large 3D Projects: A Modular Approach in Unity",
        metaDescription:
          "A practical guide to modular Unity architecture using ScriptableObjects and Package Manager.",
      },
      fa: {
        title: "روان‌سازی پروژه‌های بزرگ سه‌بعدی: رویکردی ماژولار در یونیتی",
        summary:
          "یک روند کار عملی در یونیتی با معماری ماژولار، ScriptableObjectها و Package Manager برای نگهداری آسان‌تر پروژه‌های بزرگ سه‌بعدی.",
        metaTitle:
          "روان‌سازی پروژه‌های بزرگ سه‌بعدی: رویکردی ماژولار در یونیتی",
        metaDescription:
          "راهنمایی عملی برای معماری ماژولار در یونیتی با ScriptableObject و Package Manager.",
      },
    },
  },
  {
    id: "art-frostpunk-2",
    category: "game-development",
    tags: ["Frostpunk 2", "City Builder", "Preview"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/frostpunk-2-what-we-know-so-far-and-why-its-generating-so-much-hype-f83003887783",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-05",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 6,
    translations: {
      en: {
        title:
          "Frostpunk 2: What We Know So Far and Why It's Generating So Much Hype",
        summary:
          "A developer-focused look at Frostpunk 2, its systems, themes, and technical challenges.",
        metaTitle:
          "Frostpunk 2: What We Know So Far and Why It's Generating So Much Hype",
        metaDescription:
          "A developer's perspective on Frostpunk 2's systems and design ambitions.",
      },
      fa: {
        title: "Frostpunk 2: تا این‌جا چه می‌دانیم و چرا این‌قدر سروصدا کرده",
        summary:
          "نگاهی از دید یک توسعه‌دهنده به سیستم‌ها، مضامین و چالش‌های فنی Frostpunk 2.",
        metaTitle:
          "Frostpunk 2: تا این‌جا چه می‌دانیم و چرا این‌قدر سروصدا کرده",
        metaDescription:
          "دیدگاه یک توسعه‌دهنده دربارهٔ سیستم‌ها و بلندپروازی طراحی Frostpunk 2.",
      },
    },
  },
  {
    id: "art-pixels-virtual-worlds",
    category: "game-development",
    tags: ["Industry Trends", "AI", "VR"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/behind-the-pixels-from-pixels-to-virtual-worlds-676e33c1b48e",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-03",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 7,
    translations: {
      en: {
        title: "Behind the Pixels: From Pixels to Virtual Worlds!",
        summary:
          "A look at major trends shaping the game industry, from indie development to AI and VR.",
        metaTitle: "Behind the Pixels: From Pixels to Virtual Worlds!",
        metaDescription:
          "A survey of trends reshaping the game industry, from indie dev to AI and VR.",
      },
      fa: {
        title: "پشت پیکسل‌ها: از پیکسل تا دنیاهای مجازی!",
        summary:
          "نگاهی به روندهای اصلی شکل‌دهنده به صنعت بازی، از توسعهٔ ایندی تا هوش مصنوعی و واقعیت مجازی.",
        metaTitle: "پشت پیکسل‌ها: از پیکسل تا دنیاهای مجازی!",
        metaDescription:
          "مروری بر روندهای در حال تغییر صنعت بازی، از توسعهٔ ایندی تا هوش مصنوعی و VR.",
      },
    },
  },
  {
    id: "art-exists-ai",
    category: "ai",
    tags: ["AI", "Generative", "Game Creation"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/revolutionizing-game-creation-exists-ai-954536fe7ae8",
    readingTimeMinutes: 5,
    publishedDate: "2024-11-03",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 8,
    translations: {
      en: {
        title: "Revolutionizing Game Creation: Exists.AI",
        summary:
          "How Exists.AI aims to democratize game development using generative AI and text-to-game workflows.",
        metaTitle: "Revolutionizing Game Creation: Exists.AI",
        metaDescription:
          "An overview of Exists.AI's generative, text-to-game approach to game creation.",
      },
      fa: {
        title: "تحولی در ساخت بازی: Exists.AI",
        summary:
          "چگونه Exists.AI می‌خواهد با هوش مصنوعی مولد و روند متن-به-بازی، ساخت بازی را همگانی کند.",
        metaTitle: "تحولی در ساخت بازی: Exists.AI",
        metaDescription:
          "مروری بر رویکرد مولد و متن-به-بازی Exists.AI در ساخت بازی.",
      },
    },
  },
  {
    id: "art-timberborn",
    category: "game-development",
    tags: ["Timberborn", "City Builder", "Review"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/timberborn-a-city-building-experience-with-beaver-ingenuity-53b0e901b1b5",
    readingTimeMinutes: 4,
    publishedDate: "2024-10-29",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 9,
    translations: {
      en: {
        title: "Timberborn: A City-Building Experience with Beaver Ingenuity",
        summary:
          "A review of Timberborn, focusing on water management, vertical building, and colony survival.",
        metaTitle:
          "Timberborn: A City-Building Experience with Beaver Ingenuity",
        metaDescription:
          "A review of Timberborn's water management and vertical city-building systems.",
      },
      fa: {
        title: "Timberborn: تجربهٔ شهرسازی با نبوغ سگ‌آبی‌ها",
        summary:
          "بررسی Timberborn با تمرکز بر مدیریت آب، ساخت‌وساز عمودی و بقای مستعمره.",
        metaTitle: "Timberborn: تجربهٔ شهرسازی با نبوغ سگ‌آبی‌ها",
        metaDescription:
          "بررسی سیستم‌های مدیریت آب و شهرسازی عمودی در Timberborn.",
      },
    },
  },
  {
    id: "art-latin-american-legends",
    category: "game-development",
    tags: ["Folklore", "Culture", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/latin-american-legends-folklore-and-myth-in-video-games-cfe0cda21611",
    readingTimeMinutes: 5,
    publishedDate: "2024-10-26",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 10,
    translations: {
      en: {
        title: "Latin American Legends: Folklore and Myth in Video Games",
        summary:
          "Exploring how Latin American folklore and mythology are inspiring modern video games.",
        metaTitle: "Latin American Legends: Folklore and Myth in Video Games",
        metaDescription:
          "How Latin American folklore and mythology shape modern video game design.",
      },
      fa: {
        title: "افسانه‌های آمریکای لاتین: فولکلور و اسطوره در بازی‌های ویدیویی",
        summary:
          "کاوشی در این‌که فولکلور و اسطوره‌شناسی آمریکای لاتین چگونه الهام‌بخش بازی‌های ویدیویی مدرن شده‌اند.",
        metaTitle:
          "افسانه‌های آمریکای لاتین: فولکلور و اسطوره در بازی‌های ویدیویی",
        metaDescription:
          "چگونه فولکلور و اسطوره‌شناسی آمریکای لاتین طراحی بازی‌های مدرن را شکل می‌دهد.",
      },
    },
  },
  {
    id: "art-diplomacy-not-an-option",
    category: "game-development",
    tags: ["RTS", "Tower Defense", "Preview"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/diplomacy-is-not-an-option-a-bold-fusion-of-rts-and-tower-defense-29a4304fd70f",
    readingTimeMinutes: 5,
    publishedDate: "2024-10-22",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 11,
    translations: {
      en: {
        title:
          "Diplomacy is Not an Option: A Bold Fusion of RTS and Tower Defense",
        summary:
          "Diplomacy is Not an Option fuses RTS and Tower Defense, delivering intense, strategic battles focused purely on survival.",
        metaTitle:
          "Diplomacy is Not an Option: A Bold Fusion of RTS and Tower Defense",
        metaDescription:
          "A look at how Diplomacy is Not an Option blends RTS and tower defense mechanics.",
      },
      fa: {
        title: "Diplomacy is Not an Option: ترکیبی جسورانه از RTS و تاور دیفنس",
        summary:
          "Diplomacy is Not an Option، RTS و تاور دیفنس را ترکیب می‌کند تا نبردهایی فشرده و استراتژیک با محوریت بقا ارائه دهد.",
        metaTitle:
          "Diplomacy is Not an Option: ترکیبی جسورانه از RTS و تاور دیفنس",
        metaDescription:
          "نگاهی به ترکیب مکانیزم‌های RTS و تاور دیفنس در Diplomacy is Not an Option.",
      },
    },
  },
  {
    id: "art-uapi-coroutine",
    category: "software-engineering",
    tags: ["Unity", "Coroutines", "Open Source"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/uapi-coroutine-simplifying-asynchronous-api-calls-in-unity-8a5d0a808aba",
    readingTimeMinutes: 6,
    publishedDate: "2024-10-17",
    relatedProjectIds: ["prj-uapi-coroutine"],
    relatedArticleIds: [],
    order: 12,
    translations: {
      en: {
        title: "UAPI Coroutine: Simplifying Asynchronous API Calls in Unity",
        summary:
          "Why coroutines are essential for managing asynchronous operations in Unity, and how UAPI Coroutine simplifies working with them.",
        metaTitle:
          "UAPI Coroutine: Simplifying Asynchronous API Calls in Unity",
        metaDescription:
          "An introduction to UAPI Coroutine, a coroutine-based async API library for Unity.",
      },
      fa: {
        title: "UAPI Coroutine: ساده‌سازی فراخوانی‌های ناهمگام API در یونیتی",
        summary:
          "چرا کوروتین‌ها برای مدیریت عملیات ناهمگام در یونیتی ضروری‌اند و UAPI Coroutine چگونه کار با آن‌ها را ساده می‌کند.",
        metaTitle:
          "UAPI Coroutine: ساده‌سازی فراخوانی‌های ناهمگام API در یونیتی",
        metaDescription:
          "معرفی UAPI Coroutine، کتابخانهٔ API ناهمگام مبتنی بر کوروتین برای یونیتی.",
      },
    },
  },
  {
    id: "art-break-into-gamedev-2024",
    category: "game-development",
    tags: ["Career", "Guide", "Game Jams"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/how-to-break-into-game-development-in-2024-a-step-by-step-guide-4cb9879322f3",
    readingTimeMinutes: 7,
    publishedDate: "2024-09-16",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 13,
    translations: {
      en: {
        title:
          "How to Break into Game Development in 2024: A Step-by-Step Guide",
        summary:
          "Break into Game Development in 2024: learn, practice, and network with free resources and game jams. Start your journey today!",
        metaTitle:
          "How to Break into Game Development in 2024: A Step-by-Step Guide",
        metaDescription:
          "A step-by-step guide to starting a career in game development in 2024.",
      },
      fa: {
        title: "چگونه در ۲۰۲۴ وارد صنعت توسعهٔ بازی شویم: راهنمای گام‌به‌گام",
        summary:
          "راهنمای گام‌به‌گام برای یادگیری، تمرین و شبکه‌سازی با منابع رایگان و گیم‌جم‌ها، برای شروع مسیر ورود به توسعهٔ بازی در ۲۰۲۴.",
        metaTitle:
          "چگونه در ۲۰۲۴ وارد صنعت توسعهٔ بازی شویم: راهنمای گام‌به‌گام",
        metaDescription:
          "راهنمای گام‌به‌گام برای شروع مسیر شغلی در توسعهٔ بازی در سال ۲۰۲۴.",
      },
    },
  },
  {
    id: "art-innovative-game-mechanics",
    category: "game-development",
    tags: ["Game Mechanics", "Procedural Generation", "VR"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/behind-the-pixels-innovative-game-mechanics-transforming-how-we-play-%EF%B8%8F-4a5373fbe3b5",
    readingTimeMinutes: 5,
    publishedDate: "2024-07-08",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 14,
    translations: {
      en: {
        title:
          "Behind the Pixels: Innovative Game Mechanics Transforming How We Play",
        summary:
          "Explore revolutionary game mechanics like procedural generation, bullet time, parkour, and VR that are transforming the way we play.",
        metaTitle:
          "Behind the Pixels: Innovative Game Mechanics Transforming How We Play",
        metaDescription:
          "A look at innovative mechanics — procedural generation, bullet time, parkour, VR — reshaping games.",
      },
      fa: {
        title:
          "پشت پیکسل‌ها: مکانیزم‌های نوآورانه‌ای که شیوهٔ بازی‌کردن را تغییر می‌دهند",
        summary:
          "کاوشی در مکانیزم‌های انقلابی مثل تولید رویه‌ای، بولت‌تایم، پارکور و واقعیت مجازی که شیوهٔ بازی‌کردن ما را دگرگون می‌کنند.",
        metaTitle:
          "پشت پیکسل‌ها: مکانیزم‌های نوآورانه‌ای که شیوهٔ بازی‌کردن را تغییر می‌دهند",
        metaDescription:
          "نگاهی به مکانیزم‌های نوآورانه — تولید رویه‌ای، بولت‌تایم، پارکور، VR — که بازی‌ها را متحول می‌کنند.",
      },
    },
  },
  {
    id: "art-japanese-culture-gaming",
    category: "game-development",
    tags: ["Japan", "Culture", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/world-of-pixels-crossing-continents-how-japanese-culture-influences-gaming-73867a931753",
    readingTimeMinutes: 6,
    publishedDate: "2024-07-07",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 15,
    translations: {
      en: {
        title:
          "World of Pixels: Crossing Continents: How Japanese Culture Influences Gaming",
        summary:
          "Discover how Japanese culture shapes video games, from iconic franchises and storytelling to art styles, music, and technological innovations.",
        metaTitle:
          "World of Pixels: Crossing Continents: How Japanese Culture Influences Gaming",
        metaDescription:
          "How Japanese culture has shaped franchises, storytelling, art, and music in games.",
      },
      fa: {
        title:
          "دنیای پیکسل‌ها: عبور از قاره‌ها: فرهنگ ژاپن چگونه بازی‌ها را تحت‌تأثیر قرار می‌دهد",
        summary:
          "کشف این‌که فرهنگ ژاپن چگونه بازی‌های ویدیویی را شکل می‌دهد، از فرنچایزهای شاخص و روایت گرفته تا سبک هنری، موسیقی و نوآوری‌های فنی.",
        metaTitle:
          "دنیای پیکسل‌ها: عبور از قاره‌ها: فرهنگ ژاپن چگونه بازی‌ها را تحت‌تأثیر قرار می‌دهد",
        metaDescription:
          "چگونه فرهنگ ژاپن فرنچایزها، روایت، هنر و موسیقی بازی‌ها را شکل داده است.",
      },
    },
  },
  {
    id: "art-sketch-to-screen",
    category: "design",
    tags: ["Art", "Design History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/creative-pixel-from-sketch-to-screen-the-evolution-of-game-art-4d6e09abd2ca",
    readingTimeMinutes: 5,
    publishedDate: "2024-07-06",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 16,
    translations: {
      en: {
        title:
          "Creative Pixel: From Sketch to Screen: The Evolution of Game Art",
        summary:
          "Discover how game art has evolved from simple designs to stunning visuals, shaping the gaming experience through the decades.",
        metaTitle:
          "Creative Pixel: From Sketch to Screen: The Evolution of Game Art",
        metaDescription:
          "A look at how game art evolved from simple designs to today's visuals.",
      },
      fa: {
        title: "پیکسل خلاق: از طرح تا صفحه‌نمایش: تکامل هنر بازی",
        summary:
          "کشف این‌که هنر بازی چگونه از طرح‌های ساده به تصاویری خیره‌کننده تکامل یافته و تجربهٔ بازی را در طول دهه‌ها شکل داده است.",
        metaTitle: "پیکسل خلاق: از طرح تا صفحه‌نمایش: تکامل هنر بازی",
        metaDescription:
          "نگاهی به تکامل هنر بازی از طرح‌های ساده تا تصاویر امروزی.",
      },
    },
  },
  {
    id: "art-sound-effects-gaming",
    category: "game-development",
    tags: ["Audio", "Sound Design", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/the-evolution-of-sound-effects-in-gaming-from-8-bit-to-surround-sound-e96131ca8c31",
    readingTimeMinutes: 5,
    publishedDate: "2024-07-03",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 17,
    translations: {
      en: {
        title:
          "The Evolution of Sound Effects in Gaming: From 8-bit to Surround Sound",
        summary:
          "Immersive audio: transforming the gaming landscape through technological innovation.",
        metaTitle:
          "The Evolution of Sound Effects in Gaming: From 8-bit to Surround Sound",
        metaDescription:
          "How sound design in games evolved from 8-bit bleeps to immersive surround sound.",
      },
      fa: {
        title: "تکامل جلوه‌های صوتی در بازی‌ها: از ۸بیتی تا صدای فراگیر",
        summary:
          "صدای غوطه‌ور: چگونه نوآوری فناوری چشم‌انداز صوتی بازی‌ها را متحول کرده است.",
        metaTitle: "تکامل جلوه‌های صوتی در بازی‌ها: از ۸بیتی تا صدای فراگیر",
        metaDescription:
          "چگونه طراحی صدا در بازی‌ها از بوق‌های ۸بیتی به صدای فراگیر غوطه‌ور تکامل یافت.",
      },
    },
  },
  {
    id: "art-point-and-click-adventure",
    category: "game-development",
    tags: ["Adventure Games", "Genre History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/%EF%B8%8F-%EF%B8%8F-pixelated-past-the-rise-and-fall-of-the-point-and-click-adventure-genre-7e9fd2de2150",
    readingTimeMinutes: 5,
    publishedDate: "2024-07-02",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 18,
    translations: {
      en: {
        title:
          "Pixelated Past: The Rise and Fall of the Point-and-Click Adventure Genre",
        summary:
          "From rise to decline and resurgence, explore the journey of point-and-click adventure games.",
        metaTitle:
          "Pixelated Past: The Rise and Fall of the Point-and-Click Adventure Genre",
        metaDescription:
          "The history of point-and-click adventure games, from golden age to revival.",
      },
      fa: {
        title: "گذشتهٔ پیکسلی: اوج و افول ژانر ادونچرهای اشاره‌و‌کلیک",
        summary:
          "از اوج‌گیری تا افول و بازگشت دوباره، مسیر بازی‌های ادونچر اشاره‌و‌کلیک را دنبال کنید.",
        metaTitle: "گذشتهٔ پیکسلی: اوج و افول ژانر ادونچرهای اشاره‌و‌کلیک",
        metaDescription:
          "تاریخچهٔ بازی‌های ادونچر اشاره‌و‌کلیک، از دوران طلایی تا بازگشت دوباره.",
      },
    },
  },
  {
    id: "art-game-worlds-concept-reality",
    category: "design",
    tags: ["World Building", "Level Design"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/behind-the-pixels-game-worlds-from-concept-to-reality-31f7159660a3",
    readingTimeMinutes: 5,
    publishedDate: "2024-06-30",
    relatedProjectIds: ["prj-the-skatepark"],
    relatedArticleIds: [],
    order: 19,
    translations: {
      en: {
        title: "Behind the Pixels: Game Worlds: From Concept to Reality",
        summary:
          "Discover how game worlds evolve from concept art to immersive realities, blending creativity and technology in development.",
        metaTitle: "Behind the Pixels: Game Worlds: From Concept to Reality",
        metaDescription:
          "How game worlds move from concept art to fully realized, immersive spaces.",
      },
      fa: {
        title: "پشت پیکسل‌ها: دنیاهای بازی: از مفهوم تا واقعیت",
        summary:
          "کشف این‌که دنیاهای بازی چگونه از کانسپت‌آرت به واقعیت‌هایی غوطه‌ور تبدیل می‌شوند و خلاقیت و فناوری را در توسعه در هم می‌آمیزند.",
        metaTitle: "پشت پیکسل‌ها: دنیاهای بازی: از مفهوم تا واقعیت",
        metaDescription:
          "چگونه دنیاهای بازی از کانسپت‌آرت به فضاهایی غوطه‌ور و کامل تبدیل می‌شوند.",
      },
    },
  },
  {
    id: "art-esports-birth",
    category: "game-development",
    tags: ["E-Sports", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/pixelated-past-the-birth-of-e-sports-competitive-gamings-journey-a456654902f1",
    readingTimeMinutes: 5,
    publishedDate: "2024-06-26",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 20,
    translations: {
      en: {
        title:
          "Pixelated Past: The Birth of E-Sports: Competitive Gaming's Journey",
        summary:
          "Explore the rise of e-sports from arcades to global arenas, the impact of key games, and the future of competitive gaming.",
        metaTitle:
          "Pixelated Past: The Birth of E-Sports: Competitive Gaming's Journey",
        metaDescription:
          "The history of e-sports, from arcade roots to today's global competitive scene.",
      },
      fa: {
        title: "گذشتهٔ پیکسلی: تولد ای‌اسپورتس: مسیر بازی‌های رقابتی",
        summary:
          "کاوشی در اوج‌گیری ای‌اسپورتس از سالن‌های آرکید تا آرنای جهانی، تأثیر بازی‌های کلیدی و آیندهٔ بازی‌های رقابتی.",
        metaTitle: "گذشتهٔ پیکسلی: تولد ای‌اسپورتس: مسیر بازی‌های رقابتی",
        metaDescription:
          "تاریخچهٔ ای‌اسپورتس، از ریشه‌های آرکید تا صحنهٔ رقابتی جهانی امروز.",
      },
    },
  },
  {
    id: "art-game-music-evolution",
    category: "game-development",
    tags: ["Music", "Sound Design", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/rhythm-of-the-pixels-the-evolution-of-game-music-in-classic-and-modern-titles-%EF%B8%8F-95bbef050bee",
    readingTimeMinutes: 5,
    publishedDate: "2024-06-28",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 21,
    translations: {
      en: {
        title:
          "Rhythm of the Pixels: The Evolution of Game Music in Classic and Modern Titles",
        summary:
          'Discover game music evolution from classics like "Super Mario Bros." to modern masterpieces like "Journey" and "The Last of Us."',
        metaTitle:
          "Rhythm of the Pixels: The Evolution of Game Music in Classic and Modern Titles",
        metaDescription:
          "How game music evolved from 8-bit classics to modern cinematic scores.",
      },
      fa: {
        title: "ریتم پیکسل‌ها: تکامل موسیقی بازی در عناوین کلاسیک و مدرن",
        summary:
          "کشف تکامل موسیقی بازی از کلاسیک‌هایی مثل «سوپر ماریو بروز» تا شاهکارهای مدرنی مثل «Journey» و «The Last of Us».",
        metaTitle: "ریتم پیکسل‌ها: تکامل موسیقی بازی در عناوین کلاسیک و مدرن",
        metaDescription:
          "چگونه موسیقی بازی از کلاسیک‌های ۸بیتی به موسیقی سینمایی مدرن تکامل یافت.",
      },
    },
  },
  {
    id: "art-origins-of-game-characters",
    category: "game-development",
    tags: ["Character Design", "Game History"],
    sourcePlatform: "medium",
    sourceUrl:
      "https://medium.com/@UsefFarahmand/behind-the-pixels-the-unexpected-origins-of-popular-video-game-characters-%EF%B8%8F-0d8dec4427b1",
    readingTimeMinutes: 5,
    publishedDate: "2024-06-24",
    relatedProjectIds: [],
    relatedArticleIds: [],
    order: 22,
    translations: {
      en: {
        title:
          "Behind the Pixels: The Unexpected Origins of Popular Video Game Characters",
        summary:
          "Video games have become a cornerstone of modern entertainment, captivating audiences with their immersive worlds and unforgettable characters — many with surprising origin stories.",
        metaTitle:
          "Behind the Pixels: The Unexpected Origins of Popular Video Game Characters",
        metaDescription:
          "The surprising real-world origin stories behind well-known video game characters.",
      },
      fa: {
        title:
          "پشت پیکسل‌ها: خاستگاه‌های غیرمنتظرهٔ کاراکترهای محبوب بازی‌های ویدیویی",
        summary:
          "بازی‌های ویدیویی به یکی از ارکان سرگرمی مدرن تبدیل شده‌اند و مخاطبان را با دنیاهای غوطه‌ور و کاراکترهای فراموش‌نشدنی‌شان مجذوب می‌کنند — بسیاری با داستان خاستگاهی شگفت‌انگیز.",
        metaTitle:
          "پشت پیکسل‌ها: خاستگاه‌های غیرمنتظرهٔ کاراکترهای محبوب بازی‌های ویدیویی",
        metaDescription:
          "داستان‌های شگفت‌انگیز خاستگاه واقعی پشت کاراکترهای شناخته‌شدهٔ بازی‌های ویدیویی.",
      },
    },
  },
];
