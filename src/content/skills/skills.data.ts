import type { Skill } from "@/types/content";

export const skills: Skill[] = [
  {
    id: "skill-unity-csharp",
    domain: "game",
    order:1,
    experienceLevel: "expert",
    yearsOfExperience: 7,
    technologies: ["Unity", "C#"],
    relatedProjectIds: [
      "prj-mr-bean-solitaire",
      "prj-the-skatepark",
      "prj-simulix"
    ],
    relatedArticleIds: [
      "art-streamlining-3d-projects",
      "art-uapi-coroutine",
      "art-break-into-gamedev-2024"
    ],
    translations: {
      en: {
        name: "Unity & C#",
        description:
          "My primary game engine and programming language for 7 years of game development, covering gameplay systems, AI, tools, and shipped Android and PC titles."
      },
      fa: {
        name: "Unity و C#",
        description:
          "انجین و زبان برنامه‌نویسی اصلی من در ۷ سال توسعه بازی؛ با تجربه در سیستم‌های گیم‌پلی، هوش مصنوعی، ابزارهای توسعه و عناوین منتشرشده برای Android و PC."
      }
    }
  },

  {
    id: "skill-gameplay-programming",
    domain: "game",
    order:2,
    experienceLevel: "expert",
    yearsOfExperience: 7,
    technologies: [
      "Gameplay Programming",
      "Game Logic",
      "Player Systems",
      "AI"
    ],
    relatedProjectIds: [
      "prj-mr-bean-solitaire",
      "prj-the-skatepark",
      "prj-simulix",
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [
      "art-innovative-game-mechanics",
      "art-uapi-coroutine"
    ],
    translations: {
      en: {
        name: "Gameplay Programming",
        description:
          "Designing and implementing gameplay logic, player interactions, game rules, AI behavior, and reusable gameplay systems with a focus on maintainability and iteration."
      },
      fa: {
        name: "برنامه‌نویسی گیم‌پلی",
        description:
          "طراحی و پیاده‌سازی منطق گیم‌پلی، تعاملات بازیکن، قوانین بازی، رفتار هوش مصنوعی و سیستم‌های قابل‌استفاده مجدد با تمرکز بر نگهداری و توسعه سریع."
      }
    }
  },

  {
    id: "skill-game-design",
    domain: "game",
    order:3,
    experienceLevel: "advanced",
    technologies: [
      "Game Design",
      "Game Mechanics",
      "Game Balancing",
      "Player Experience"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [
      "art-innovative-game-mechanics",
      "art-frostpunk-2",
      "art-diplomacy-not-an-option",
      "art-timberborn",
      "art-broken-arrow-rts"
    ],
    translations: {
      en: {
        name: "Game Design",
        description:
          "Designing gameplay mechanics, rules, player decisions, progression, and balance with an iterative approach based on testing and player experience."
      },
      fa: {
        name: "طراحی بازی",
        description:
          "طراحی مکانیک‌های گیم‌پلی، قوانین، تصمیم‌های بازیکن، روند پیشرفت و بالانس بازی با رویکردی تکرارشونده و مبتنی بر تست و تجربه بازیکن."
      }
    }
  },

  {
    id: "skill-game-systems",
    domain: "game",
    order:4,
    experienceLevel: "advanced",
    technologies: [
      "Game Architecture",
      "State Machines",
      "Event-Driven Systems",
      "Data-Driven Design",
      "Save Systems"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list",
      "prj-mr-bean-solitaire",
      "prj-the-skatepark",
      "prj-simulix"
    ],
    relatedArticleIds: [
      "art-streamlining-3d-projects",
      "art-innovative-game-mechanics",
      "art-diplomacy-not-an-option",
      "art-frostpunk-2",
      "art-timberborn"
    ],
    translations: {
      en: {
        name: "Game Systems",
        description:
          "Designing modular and data-driven game systems that keep gameplay logic maintainable, configurable, and easy to iterate on."
      },
      fa: {
        name: "سیستم‌های بازی",
        description:
          "طراحی سیستم‌های ماژولار و داده‌محور برای بازی با هدف ایجاد ساختاری قابل‌نگهداری، قابل‌تنظیم و مناسب برای توسعه و تغییر سریع."
      }
    }
  },

  {
    id: "skill-game-ui-development",
    domain: "ui-ux",
    order:5,
    experienceLevel: "advanced",
    technologies: [
      "Game UI",
      "UI Architecture",
      "UI Programming",
      "Responsive UI",
      "Localization"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list",
      "prj-mr-bean-solitaire",
      "prj-the-skatepark",
      "prj-simulix"
    ],
    relatedArticleIds: [
      "art-magic-of-animation",
      "art-game-worlds-concept-reality"
    ],
    translations: {
      en: {
        name: "Game UI Development",
        description:
          "Designing and implementing responsive, interactive game interfaces with a focus on usability, clarity, localization, and seamless integration with gameplay."
      },
      fa: {
        name: "توسعه رابط کاربری بازی",
        description:
          "طراحی و پیاده‌سازی رابط‌های کاربری تعاملی و واکنش‌گرا برای بازی با تمرکز بر کاربردپذیری، وضوح، بومی‌سازی و هماهنگی با گیم‌پلی."
      }
    }
  },

  {
    id: "skill-ux",
    domain: "ui-ux",
    order:6,
    experienceLevel: "advanced",
    technologies: [
      "UX Design",
      "User Flows",
      "Interaction Design",
      "Usability"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [
      "art-innovative-game-mechanics",
      "art-magic-of-animation"
    ],
    translations: {
      en: {
        name: "UX Design",
        description:
          "Designing clear user flows and interactions for games and digital experiences, with a focus on usability, accessibility, and reducing friction for users."
      },
      fa: {
        name: "طراحی تجربه کاربری",
        description:
          "طراحی جریان‌های کاربری و تعاملات واضح برای بازی‌ها و تجربه‌های دیجیتال با تمرکز بر کاربردپذیری، دسترسی‌پذیری و کاهش پیچیدگی برای کاربر."
      }
    }
  },

  {
    id: "skill-technical-art",
    domain: "art",
    order:7,
    experienceLevel: "advanced",
    technologies: [
      "Shader Graph",
      "Animator",
      "URP",
      "VFX",
      "Technical Animation"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list",
      "prj-mr-bean-solitaire",
      "prj-the-skatepark",
      "prj-simulix"
    ],
    relatedArticleIds: [
      "art-magic-of-animation",
      "art-sketch-to-screen",
      "art-game-worlds-concept-reality",
      "art-pixels-virtual-worlds"
    ],
    translations: {
      en: {
        name: "Technical Art",
        description:
          "Bridging art and programming through shaders, VFX, animation, and technical workflows that turn visual assets into production-ready game systems."
      },
      fa: {
        name: "تکنیکال آرت",
        description:
          "ایجاد ارتباط میان هنر و برنامه‌نویسی از طریق شیدر، VFX، انیمیشن و فرایندهای تکنیکال برای تبدیل اسِت‌های گرافیکی به سیستم‌های قابل‌استفاده در بازی."
      }
    }
  },

  {
    id: "skill-2d-animation",
    domain: "art",
    order:8,
    experienceLevel: "advanced",
    technologies: [
      "2D Animation",
      "Sprite Animation",
      "Animation Systems"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [
      "art-magic-of-animation"
    ],
    translations: {
      en: {
        name: "2D Animation",
        description:
          "Creating and implementing 2D animations, sprite-based animations, and animation systems for games and interactive experiences."
      },
      fa: {
        name: "انیمیشن دوبعدی",
        description:
          "ساخت و پیاده‌سازی انیمیشن‌های دوبعدی، انیمیشن‌های مبتنی بر Sprite و سیستم‌های انیمیشن برای بازی‌ها و تجربه‌های تعاملی."
      }
    }
  },

  {
    id: "skill-html-css-js",
    domain: "frontend",
    order:9,
    experienceLevel: "advanced",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "HTML, CSS & JavaScript",
        description:
          "Building browser-based games, interactive experiences, and web interfaces using HTML, CSS, and JavaScript."
      },
      fa: {
        name: "HTML، CSS و JavaScript",
        description:
          "ساخت بازی‌های تحت وب، تجربه‌های تعاملی و رابط‌های وب با استفاده از HTML، CSS و JavaScript."
      }
    }
  },

  {
    id: "skill-html5-game-development",
    domain: "game",
    order:10,
    experienceLevel: "advanced",
    technologies: [
      "HTML5",
      "Canvas",
      "Web Game"
    ],
    relatedProjectIds: [
      "prj-gt-racing",
      "prj-farmand"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "HTML5 Game Development",
        description:
          "Developing lightweight browser-based game experiences and playable advertising content using HTML5 technologies."
      },
      fa: {
        name: "توسعه بازی با HTML5",
        description:
          "توسعه تجربه‌های بازی سبک و محتوای تبلیغاتی تعاملی تحت وب با استفاده از فناوری‌های HTML5."
      }
    }
  },

  {
    id: "skill-web-game-development",
    domain: "frontend",
    order:11,
    experienceLevel: "advanced",
    technologies: [
      "Web Game",
      "Game Architecture",
      "Responsive Design"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "Web Game Development",
        description:
          "Building browser-based games and interactive experiences with a focus on gameplay architecture, responsive interfaces, and lightweight web technologies."
      },
      fa: {
        name: "توسعه بازی‌های تحت وب",
        description:
          "ساخت بازی‌ها و تجربه‌های تعاملی تحت وب با تمرکز بر معماری گیم‌پلی، رابط‌های واکنش‌گرا و استفاده از فناوری‌های سبک وب."
      }
    }
  },

  {
    id: "skill-typescript-nextjs",
    domain: "frontend",
    order:12,
    experienceLevel: "intermediate",
    technologies: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "next-intl"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "TypeScript & Next.js",
        description:
          "Building and maintaining bilingual, content-driven web applications with TypeScript, Next.js, Tailwind CSS, and modern frontend architecture."
      },
      fa: {
        name: "TypeScript و Next.js",
        description:
          "ساخت و نگهداری اپلیکیشن‌های وب دوزبانه و مبتنی بر محتوا با استفاده از TypeScript، Next.js، Tailwind CSS و معماری مدرن فرانت‌اند."
      }
    }
  },

  {
    id: "skill-cocos-creator",
    domain: "game",
    order:13,
    experienceLevel: "intermediate",
    technologies: [
      "Cocos Creator",
      "TypeScript"
    ],
    relatedProjectIds: [
      "prj-gt-racing",
      "prj-farmand"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "Cocos Creator",
        description:
          "Experience with Cocos Creator and TypeScript for browser-based and playable-ad projects, expanding my workflow beyond Unity."
      },
      fa: {
        name: "Cocos Creator",
        description:
          "تجربه کار با Cocos Creator و TypeScript برای پروژه‌های تحت وب و تبلیغات تعاملی، در کنار انجین اصلی من یعنی Unity."
      }
    }
  },

  {
    id: "skill-godot-engine",
    domain: "game",
    order:14,
    experienceLevel: "intermediate",
    technologies: [
      "Godot"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-redot-engine"
    ],
    translations: {
      en: {
        name: "Godot",
        description:
          "Experience with Godot for developing and prototyping games outside my primary Unity workflow."
      },
      fa: {
        name: "Godot",
        description:
          "تجربه کار با Godot برای توسعه و نمونه‌سازی بازی‌ها در کنار جریان کاری اصلی من با Unity."
      }
    }
  },

  {
    id: "skill-vr-development",
    domain: "game",
    order:15,
    experienceLevel: "intermediate",
    technologies: [
      "Unity XR",
      "Meta Quest",
      "VR Interaction",
      "Performance Optimization"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-innovative-game-mechanics",
      "art-pixels-virtual-worlds"
    ],
    translations: {
      en: {
        name: "VR Development",
        description:
          "Building immersive VR training experiences for standalone headsets, including interaction systems and performance optimization."
      },
      fa: {
        name: "توسعه واقعیت مجازی",
        description:
          "ساخت تجربه‌های آموزشی غوطه‌ور در واقعیت مجازی برای هدست‌های مستقل، شامل سیستم‌های تعامل و بهینه‌سازی عملکرد."
      }
    }
  },

  {
    id: "skill-game-services",
    domain: "tools",
    order:16,
    experienceLevel: "advanced",
    technologies: [
      "Firebase",
      "AppLovin MAX",
      "GameAnalytics",
      "REST APIs"
    ],
    relatedProjectIds: [
      "prj-mr-bean-solitaire",
      "prj-simulix"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "Game Services & SDK Integration",
        description:
          "Integrating monetization, analytics, backend services, and third-party SDKs into shipped mobile games and interactive applications."
      },
      fa: {
        name: "سرویس‌ها و SDKهای بازی",
        description:
          "یکپارچه‌سازی سرویس‌های درآمدزایی، تحلیل داده، بک‌اند و SDKهای شخص ثالث در بازی‌های موبایل و اپلیکیشن‌های تعاملی منتشرشده."
      }
    }
  },

  {
    id: "skill-figma",
    domain: "ui-ux",
    order:17,
    experienceLevel: "intermediate",
    technologies: [
      "Figma",
      "UI Design",
      "Prototyping"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "Figma",
        description:
          "Designing game interfaces, layouts, and interactive prototypes before implementation, with a focus on clear and practical UI systems."
      },
      fa: {
        name: "Figma",
        description:
          "طراحی رابط کاربری بازی، چیدمان صفحات و نمونه‌های تعاملی پیش از پیاده‌سازی، با تمرکز بر ساختارهای واضح و کاربردی."
      }
    }
  },

  {
    id: "skill-photoshop",
    domain: "art",
    order:18,
    experienceLevel: "intermediate",
    technologies: [
      "Adobe Photoshop",
      "Image Editing",
      "Game Asset Preparation"
    ],
    relatedProjectIds: [
      "prj-wild-guest-list"
    ],
    relatedArticleIds: [
      "art-sketch-to-screen"
    ],
    translations: {
      en: {
        name: "Adobe Photoshop",
        description:
          "Preparing and editing visual assets for games, UI elements, promotional materials, and other production needs."
      },
      fa: {
        name: "Adobe Photoshop",
        description:
          "آماده‌سازی و ویرایش اسِت‌های گرافیکی برای بازی، عناصر رابط کاربری، محتوای تبلیغاتی و سایر نیازهای تولید."
      }
    }
  },

  {
    id: "skill-illustrator",
    domain: "art",
    order:19,
    experienceLevel: "intermediate",
    technologies: [
      "Adobe Illustrator",
      "Vector Graphics",
      "Icon Design"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-sketch-to-screen"
    ],
    translations: {
      en: {
        name: "Adobe Illustrator",
        description:
          "Creating and editing vector graphics, icons, logos, and scalable visual assets for games, interfaces, and digital projects."
      },
      fa: {
        name: "Adobe Illustrator",
        description:
          "طراحی و ویرایش گرافیک‌های وکتور، آیکون‌ها، لوگوها و اسِت‌های گرافیکی مقیاس‌پذیر برای بازی، رابط کاربری و پروژه‌های دیجیتال."
      }
    }
  },

  {
    id: "skill-git",
    domain: "tools",
    order:20,
    experienceLevel: "advanced",
    technologies: [
      "Git",
      "GitHub"
    ],
    relatedProjectIds: [
      "prj-uapi-unitask",
      "prj-uapi-coroutine"
    ],
    relatedArticleIds: [
      "art-uapi-coroutine"
    ],
    translations: {
      en: {
        name: "Git & GitHub",
        description:
          "Version control, branching, project collaboration, and GitHub workflows across game and software projects."
      },
      fa: {
        name: "Git و GitHub",
        description:
          "مدیریت نسخه، کار با شاخه‌ها، همکاری روی پروژه‌ها و استفاده از فرایندهای Git و GitHub در پروژه‌های بازی و نرم‌افزاری."
      }
    }
  },

  {
    id: "skill-ai-assisted-development",
    domain: "ai",
    order:21,
    experienceLevel: "advanced",
    technologies: [
      "AI-Assisted Programming",
      "LLM Coding Workflows",
      "Prompt Engineering",
      "Code Review"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-exists-ai",
      "art-pixels-virtual-worlds"
    ],
    translations: {
      en: {
        name: "AI-Assisted Development",
        description:
          "Using AI coding tools for code generation, debugging, refactoring, documentation, research, and rapid prototyping while maintaining developer ownership of the final implementation."
      },
      fa: {
        name: "توسعه با کمک هوش مصنوعی",
        description:
          "استفاده از ابزارهای هوش مصنوعی برای تولید و بررسی کد، دیباگ، بازنویسی، مستندسازی، تحقیق و نمونه‌سازی سریع، در حالی که تصمیم‌گیری و مسئولیت نهایی پیاده‌سازی بر عهده توسعه‌دهنده است."
      }
    }
  },

  {
    id: "skill-project-management",
    domain: "management",
    order:22,
    experienceLevel: "advanced",
    technologies: [
      "Project Management",
      "Planning",
      "Roadmapping",
      "Task Management"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-break-into-gamedev-2024"
    ],
    translations: {
      en: {
        name: "Project Management",
        description:
          "Planning and managing development projects through task breakdown, prioritization, roadmaps, milestones, and iterative delivery."
      },
      fa: {
        name: "مدیریت پروژه",
        description:
          "برنامه‌ریزی و مدیریت پروژه‌های توسعه از طریق تقسیم وظایف، اولویت‌بندی، تهیه Roadmap، تعیین نقاط عطف و تحویل مرحله‌ای."
      }
    }
  },

  {
    id: "skill-team-management",
    domain: "management",
    order:23,
    experienceLevel: "advanced",
    technologies: [
      "Team Management",
      "Task Delegation",
      "Communication",
      "Team Coordination"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [],
    translations: {
      en: {
        name: "Team Management",
        description:
          "Coordinating development teams through task delegation, communication, progress tracking, and aligning individual contributions with project goals."
      },
      fa: {
        name: "مدیریت تیم",
        description:
          "هماهنگی تیم‌های توسعه از طریق تقسیم وظایف، ارتباط مؤثر، پیگیری پیشرفت و همسو کردن فعالیت اعضا با اهداف پروژه."
      }
    }
  },

  {
    id: "skill-blogging",
    domain: "content",
    order:24,
    experienceLevel: "advanced",
    technologies: [
      "Blogging",
      "Content Creation",
      "Game Development Content"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-broken-arrow-rts",
      "art-magic-of-animation",
      "art-wild-west-wonders",
      "art-redot-engine",
      "art-streamlining-3d-projects",
      "art-frostpunk-2",
      "art-pixels-virtual-worlds",
      "art-exists-ai",
      "art-timberborn",
      "art-latin-american-legends",
      "art-diplomacy-not-an-option",
      "art-uapi-coroutine",
      "art-break-into-gamedev-2024",
      "art-innovative-game-mechanics",
      "art-japanese-culture-gaming",
      "art-sketch-to-screen",
      "art-sound-effects-gaming",
      "art-point-and-click-adventure",
      "art-game-worlds-concept-reality",
      "art-esports-birth",
      "art-game-music-evolution",
      "art-origins-of-game-characters"
    ],
    translations: {
      en: {
        name: "Blogging",
        description:
          "Writing and publishing articles about game development, technology, games, and development experiences with a focus on making technical topics accessible."
      },
      fa: {
        name: "وبلاگ‌نویسی",
        description:
          "نوشتن و انتشار مطالب درباره توسعه بازی، فناوری، بازی‌ها و تجربیات توسعه با تمرکز بر قابل‌فهم و کاربردی کردن موضوعات فنی."
      }
    }
  },

  {
    id: "skill-technical-writing",
    domain: "content",
    order:25,
    experienceLevel: "advanced",
    technologies: [
      "Technical Writing",
      "Documentation",
      "Developer Education"
    ],
    relatedProjectIds: [
      "prj-uapi-coroutine"
    ],
    relatedArticleIds: [
      "art-streamlining-3d-projects",
      "art-uapi-coroutine",
      "art-break-into-gamedev-2024"
    ],
    translations: {
      en: {
        name: "Technical Writing",
        description:
          "Writing technical content and documentation that explains development workflows, programming concepts, tools, and practical game development techniques."
      },
      fa: {
        name: "نویسندگی فنی",
        description:
          "تولید محتوای فنی و مستنداتی که فرایندهای توسعه، مفاهیم برنامه‌نویسی، ابزارها و تکنیک‌های عملی توسعه بازی را به شکلی قابل‌فهم توضیح می‌دهد."
      }
    }
  },

  {
    id: "skill-game-analysis",
    domain: "game",
    order:26,
    experienceLevel: "advanced",
    technologies: [
      "Game Analysis",
      "Game Reviews",
      "Mechanics Analysis"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-broken-arrow-rts",
      "art-frostpunk-2",
      "art-timberborn",
      "art-diplomacy-not-an-option",
      "art-innovative-game-mechanics"
    ],
    translations: {
      en: {
        name: "Game Analysis",
        description:
          "Analyzing game mechanics, systems, player experience, and design decisions across different genres to understand what makes games engaging and effective."
      },
      fa: {
        name: "تحلیل بازی",
        description:
          "تحلیل مکانیک‌ها، سیستم‌ها، تجربه بازیکن و تصمیم‌های طراحی در ژانرهای مختلف برای درک عواملی که باعث جذابیت و اثربخشی بازی‌ها می‌شوند."
      }
    }
  },

  {
    id: "skill-game-research",
    domain: "game",
    order:27,
    experienceLevel: "advanced",
    technologies: [
      "Game Research",
      "Game History",
      "Cultural Research",
      "Design Research"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-wild-west-wonders",
      "art-latin-american-legends",
      "art-japanese-culture-gaming",
      "art-esports-birth",
      "art-game-music-evolution",
      "art-sound-effects-gaming",
      "art-point-and-click-adventure",
      "art-origins-of-game-characters"
    ],
    translations: {
      en: {
        name: "Game Research",
        description:
          "Researching game history, cultural influences, genres, mechanics, and industry developments to explore how games evolve and influence interactive experiences."
      },
      fa: {
        name: "تحقیق در حوزه بازی",
        description:
          "تحقیق درباره تاریخ بازی‌ها، تأثیرات فرهنگی، ژانرها، مکانیک‌ها و تحولات صنعت برای بررسی چگونگی تکامل بازی‌ها و تأثیر آن‌ها بر تجربه‌های تعاملی."
      }
    }
  },

  {
    id: "skill-game-industry-analysis",
    domain: "game",
    order:28,
    experienceLevel: "advanced",
    technologies: [
      "Game Industry",
      "Industry Trends",
      "Market Analysis"
    ],
    relatedProjectIds: [],
    relatedArticleIds: [
      "art-broken-arrow-rts",
      "art-redot-engine",
      "art-pixels-virtual-worlds",
      "art-exists-ai",
      "art-esports-birth"
    ],
    translations: {
      en: {
        name: "Game Industry Analysis",
        description:
          "Following and analyzing trends, technologies, business directions, and emerging developments across the game industry."
      },
      fa: {
        name: "تحلیل صنعت بازی",
        description:
          "پیگیری و تحلیل روندها، فناوری‌ها، مسیرهای کسب‌وکار و تحولات نوظهور در صنعت بازی."
      }
    }
  }
];