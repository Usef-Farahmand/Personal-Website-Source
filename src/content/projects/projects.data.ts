import type { Project } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/projects.json) and
 * cross-checked against the English CV. Covers must be genuinely local —
 * screenshots and logos copied from the previous site's own assets — with
 * one deliberate exception: Mr. Bean Solitaire's images are hotlinked from
 * the Google Play CDN (see next.config.ts remotePatterns) because no local
 * copy exists in any provided source; this is the one project where the
 * previous site itself did the same thing.
 *
 * Two CV-mentioned personal projects — Last Flag and Wild Guest List —
 * are intentionally NOT included here: local screenshots exist for Last
 * Flag, but neither project has a verified release date in any source,
 * and startDate is a required field this content model does not allow
 * guessing.
 */
export const projects: Project[] = [
  {
    id: "prj-simulix",
    slug: "simulix",
    status: "shipped",
    featured: true,
    category: "tool",
    technologies: ["Unity", "C#", "UI Architecture", "REST APIs"],
    platforms: ["desktop"],
    releaseYear: 2024,
    startDate: "2024-06-01",
    endDate: "2024-12-16",
    logoUrl: "/projects/simulix-logo.png",
    coverImageUrl: "/projects/simulix-cover.jpg",
    gallery: [
      {
        id: "media-simulix-cover",
        type: "image",
        src: "/projects/simulix-cover.jpg",
        title: "Simulix",
        description: "Simulix 3D real estate presentation software",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [
      {
        label: "Project Showcase (LinkedIn)",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7201563858644193280?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_projects_details%3BEyWmixycTAKvJQc3QtXaYw%3D%3D",
      },
    ],
    relatedProjectIds: [],
    relatedArticleIds: [],
    experienceId: "exp-apexia-soft",
    order: 1,
    translations: {
      en: {
        title: "Simulix",
        summary:
          "A 3D presentation platform that lets real estate clients explore and customize building units before they're built.",
        problem:
          "Presenting and selling building units to clients is hard to do convincingly from 2D floor plans and static renders alone.",
        solution:
          "Built a 3D presentation tool where clients can explore a project in 360° day or night, browse surrounding landmarks, filter and select available units with 2D/3D plans, and tour each unit's interior and balcony view — with the flexible UI, filtering system, and client-server communication as my responsibility.",
        lessonsLearned:
          "Real estate clients care more about a smooth, confident tour than technical polish under the hood — the filtering and navigation UI ended up mattering as much as the 3D visuals themselves.",
        targetAudience:
          "Real estate developers presenting and selling building units to prospective buyers.",
        myRole:
          "Programmer — flexible UI system, unit filtering system, and client-server communication.",
        featureHighlights: [
          {
            icon: "customization",
            title: "360° day/night exploration",
            description:
              "Clients can explore the project in full 360°, switching between day and night lighting.",
          },
          {
            icon: "integration",
            title: "2D/3D unit filtering",
            description:
              "Filter and select available units, viewing both 2D and 3D floor plans for each.",
          },
        ],
        metaTitle: "Simulix — Usef Farahmand",
        metaDescription:
          "A 3D presentation platform for real estate sales, built for Apexia Soft.",
      },
      fa: {
        title: "سیمولیکس",
        summary:
          "پلتفرم ارائهٔ سه‌بعدی که به مشتریان املاک اجازه می‌دهد پیش از ساخت، واحدهای ساختمانی را کاوش و سفارشی‌سازی کنند.",
        problem:
          "ارائه و فروش واحدهای ساختمانی به مشتریان فقط با پلان‌های دوبعدی و رندرهای ثابت کار متقاعدکننده‌ای نیست.",
        solution:
          "ساخت ابزار ارائهٔ سه‌بعدی که در آن مشتریان می‌توانند پروژه را در نمای ۳۶۰ درجه روز یا شب کاوش کنند، لندمارک‌های اطراف را ببینند، واحدهای موجود را فیلتر و انتخاب کنند و پلان‌های دوبعدی و سه‌بعدی هر واحد و نمای بالکن و داخل آن را ببینند؛ رابط کاربری منعطف، سیستم فیلتر واحدها و ارتباط کلاینت-سرور مسئولیت من بود.",
        lessonsLearned:
          "مشتریان املاک بیشتر به یک تور روان و مطمئن اهمیت می‌دهند تا ظرافت فنی پشت صحنه — رابط کاربری فیلتر و ناوبری به‌اندازهٔ خود بصری‌سازی سه‌بعدی اهمیت پیدا کرد.",
        targetAudience:
          "سازندگان و فروشندگان املاک که واحدهای ساختمانی را به خریداران بالقوه ارائه می‌کنند.",
        myRole:
          "برنامه‌نویس — سیستم رابط کاربری منعطف، سیستم فیلتر واحدها و ارتباط کلاینت-سرور.",
        featureHighlights: [
          {
            icon: "customization",
            title: "کاوش ۳۶۰ درجه روز و شب",
            description:
              "مشتریان می‌توانند پروژه را در نمای کامل ۳۶۰ درجه و در نور روز یا شب کاوش کنند.",
          },
          {
            icon: "integration",
            title: "فیلتر واحدها با پلان ۲بعدی و ۳بعدی",
            description:
              "فیلتر و انتخاب واحدهای موجود، همراه با مشاهدهٔ پلان دوبعدی و سه‌بعدی هرکدام.",
          },
        ],
        metaTitle: "سیمولیکس — یوسف فرح‌مند",
        metaDescription:
          "پلتفرم ارائهٔ سه‌بعدی برای فروش املاک، ساخته‌شده برای Apexia Soft.",
      },
    },
  },
  {
    id: "prj-uapi-unitask",
    slug: "uapi-unitask",
    status: "active",
    featured: false,
    category: "tool",
    technologies: ["Unity", "C#", "UniTask"],
    platforms: ["cross-platform"],
    releaseYear: 2024,
    startDate: "2024-07-01",
    endDate: null,
    logoUrl: "/projects/uapi-unitask-logo.png",
    gallery: [],
    links: {
      repository: "https://github.com/UModules/UAPI-UniTask",
    },
    externalLinks: [],
    relatedProjectIds: ["prj-uapi-coroutine"],
    relatedArticleIds: [],
    experienceId: null,
    order: 2,
    translations: {
      en: {
        title: "UAPI UniTask",
        summary:
          "An open-source C# library that streamlines API integration in Unity projects using UniTask.",
        problem:
          "Connecting and configuring external API services inside a Unity project usually means rebuilding similar plumbing for every service.",
        solution:
          "Built a unified, async-first system for managing external API connections in Unity, using UniTask to keep integration flexible and performant across services.",
        lessonsLearned:
          "Publishing a small library as open source forces a different kind of discipline than a game project — the API surface has to make sense to someone who's never seen the code before.",
        targetAudience:
          "Unity developers who need to connect and manage multiple external API services.",
        myRole: "Author and maintainer.",
        metaTitle: "UAPI UniTask — Usef Farahmand",
        metaDescription:
          "An open-source C# library for streamlined, UniTask-based API integration in Unity.",
      },
      fa: {
        title: "UAPI UniTask",
        summary:
          "کتابخانهٔ متن‌باز سی‌شارپ برای ساده‌سازی یکپارچه‌سازی API در پروژه‌های یونیتی با UniTask.",
        problem:
          "اتصال و پیکربندی سرویس‌های API خارجی در یک پروژهٔ یونیتی معمولاً یعنی بازسازی زیرساخت مشابه برای هر سرویس.",
        solution:
          "ساخت یک سیستم یکپارچه و async-first برای مدیریت اتصال به API‌های خارجی در یونیتی، با استفاده از UniTask برای انعطاف و کارایی بیشتر در سرویس‌های مختلف.",
        lessonsLearned:
          "انتشار یک کتابخانهٔ کوچک به‌صورت متن‌باز نظمی متفاوت از یک پروژهٔ بازی می‌طلبد — طراحی API باید برای کسی که هیچ‌وقت کد را ندیده هم قابل‌فهم باشد.",
        targetAudience:
          "توسعه‌دهندگان یونیتی که نیاز به اتصال و مدیریت چند سرویس API خارجی دارند.",
        myRole: "نویسنده و نگهدارنده.",
        metaTitle: "UAPI UniTask — یوسف فرح‌مند",
        metaDescription:
          "کتابخانهٔ متن‌باز سی‌شارپ برای یکپارچه‌سازی سادهٔ API در یونیتی با UniTask.",
      },
    },
  },
  {
    id: "prj-uapi-coroutine",
    slug: "uapi-coroutine",
    status: "active",
    featured: false,
    category: "tool",
    technologies: ["Unity", "C#", "IEnumerator"],
    platforms: ["cross-platform"],
    releaseYear: 2024,
    startDate: "2024-10-01",
    endDate: null,
    logoUrl: "/projects/uapi-coroutine-logo.png",
    gallery: [],
    links: {
      repository: "https://github.com/UModules/UAPI-Coroutine",
    },
    externalLinks: [],
    relatedProjectIds: ["prj-uapi-unitask"],
    relatedArticleIds: ["art-uapi-coroutine"],
    experienceId: null,
    order: 3,
    translations: {
      en: {
        title: "UAPI Coroutine",
        summary:
          "An open-source C# library for asynchronous API requests in Unity, built on IEnumerator instead of async/await.",
        problem:
          "Not every Unity project wants async/await or Task in its API layer — some need a lighter, coroutine-native option.",
        solution:
          "Built a coroutine-based system for handling asynchronous API requests using Unity's built-in IEnumerator, giving developers a flexible, lightweight alternative to UAPI UniTask.",
        lessonsLearned:
          "Offering two API libraries with different async models — one Task-based, one coroutine-based — clarified how differently teams actually structure async code depending on the rest of their project.",
        targetAudience:
          "Unity developers who prefer coroutine-based asynchronous code over async/await or Task.",
        myRole: "Author and maintainer.",
        metaTitle: "UAPI Coroutine — Usef Farahmand",
        metaDescription:
          "An open-source, coroutine-based C# library for asynchronous API requests in Unity.",
      },
      fa: {
        title: "UAPI Coroutine",
        summary:
          "کتابخانهٔ متن‌باز سی‌شارپ برای درخواست‌های ناهمگام API در یونیتی، مبتنی بر IEnumerator به‌جای async/await.",
        problem:
          "هر پروژهٔ یونیتی نمی‌خواهد از async/await یا Task در لایهٔ API استفاده کند — بعضی‌ها به گزینه‌ای سبک‌تر و کوروتین-محور نیاز دارند.",
        solution:
          "ساخت سیستمی مبتنی بر کوروتین برای مدیریت درخواست‌های ناهمگام API با استفاده از IEnumerator داخلی یونیتی، به‌عنوان جایگزینی سبک و منعطف برای UAPI UniTask.",
        lessonsLearned:
          "ارائهٔ دو کتابخانهٔ API با دو مدل ناهمگام متفاوت — یکی مبتنی بر Task و دیگری مبتنی بر کوروتین — نشان داد تیم‌های مختلف چقدر متفاوت کد ناهمگام را در پروژه‌شان می‌چینند.",
        targetAudience:
          "توسعه‌دهندگان یونیتی که کد ناهمگام مبتنی بر کوروتین را به async/await یا Task ترجیح می‌دهند.",
        myRole: "نویسنده و نگهدارنده.",
        metaTitle: "UAPI Coroutine — یوسف فرح‌مند",
        metaDescription:
          "کتابخانهٔ متن‌باز سی‌شارپ مبتنی بر کوروتین برای درخواست‌های ناهمگام API در یونیتی.",
      },
    },
  },
  {
    id: "prj-mr-bean-solitaire",
    slug: "mr-bean-solitaire",
    status: "shipped",
    featured: true,
    category: "game",
    technologies: ["Unity", "C#", "UI Programming", "Technical Animation"],
    platforms: ["android"],
    releaseYear: 2023,
    startDate: "2023-12-01",
    endDate: "2024-08-09",
    coverImageUrl:
      "https://play-lh.googleusercontent.com/dv0G3uNTd5nO4yIgiRf7rEG87AJnB6030DmZjA5jGyDxfR50SOfGa6gBHLMShHpTk5zeW8CKdOoJLpIJrOK7=w240-h480-rw",
    gallery: [
      {
        id: "media-mr-bean-solitaire-1",
        type: "image",
        src: "https://play-lh.googleusercontent.com/3Ljir9VAOJkZxsLYHaM4Ml44EvW7UZr_YIUSmQ5WhJA66U3QEjsMdP2RwMytthHTHSd4qu7tJrBuv6yEaAGK=w2560-h1440-rw",
        title: "Mr. Bean Solitaire: Adventure",
        downloadable: false,
      },
      {
        id: "media-mr-bean-solitaire-2",
        type: "image",
        src: "https://play-lh.googleusercontent.com/gpdMjrmPlq325JJKUHhuJ_Z36a_9RbLeDV-O4hwiDr8tSssUbbQDrAeBNhfaEWPfUA-6a9TaAcCxLE_jwK-t=w2560-h1440-rw",
        title: "Mr. Bean Solitaire: Adventure",
        downloadable: false,
      },
      {
        id: "media-mr-bean-solitaire-3",
        type: "image",
        src: "https://play-lh.googleusercontent.com/0Fh02d68ikjaHkb2SXd9rQvFaF1gS2jY9-fD1AECfAklCMr_9jaqb9VXroxhiNaMKmEGjGTiKHC-b684C2KVlAc=w2560-h1440-rw",
        title: "Mr. Bean Solitaire: Adventure",
        downloadable: false,
      },
    ],
    links: {
      googlePlay:
        "https://play.google.com/store/apps/details?id=com.mrbean.solitaire.card.game.tripeaks&hl=en_US",
    },
    externalLinks: [],
    relatedProjectIds: [],
    relatedArticleIds: [],
    experienceId: "exp-unbound",
    order: 4,
    translations: {
      en: {
        title: "Mr. Bean Solitaire: Adventure",
        summary:
          "A casual solitaire card game on Google Play, set in the Mr. Bean universe.",
        problem:
          "Solitaire is a crowded genre — a licensed theme needed gameplay and UI polish to stand out rather than ride on the license alone.",
        solution:
          "Contributed to core gameplay mechanics and UI design, and created and integrated animations for cards and UI elements to keep interactions smooth and satisfying.",
        lessonsLearned:
          "In a game this reliant on repeated short sessions, the feel of individual card and UI animations mattered more to players than any single new mechanic.",
        targetAudience:
          "Casual mobile players looking for a licensed, TriPeaks-style solitaire game.",
        myRole:
          "Gameplay and UI programmer — core mechanics, interface design, and card/UI animation.",
        metaTitle: "Mr. Bean Solitaire: Adventure — Usef Farahmand",
        metaDescription:
          "A casual Mr. Bean–themed solitaire card game shipped on Google Play with Unbound Game Studio.",
      },
      fa: {
        title: "Mr. Bean Solitaire: Adventure",
        summary:
          "یک بازی کارتی سالیتر با فضای فکری شخصیت آقای بین، منتشرشده در گوگل پلی.",
        problem:
          "سالیتر ژانری شلوغ است — یک تم لایسنس‌دار به تنهایی کافی نیست و به گیم‌پلی و رابط کاربری صیقل‌خورده نیاز دارد تا متمایز شود.",
        solution:
          "مشارکت در مکانیزم‌های اصلی گیم‌پلی و طراحی رابط کاربری، و ساخت و یکپارچه‌سازی انیمیشن کارت‌ها و عناصر رابط کاربری برای تعامل روان و رضایت‌بخش.",
        lessonsLearned:
          "در بازی‌ای که این‌قدر به جلسات کوتاه و تکرارشونده وابسته است، حس انیمیشن‌های کارت و رابط کاربری برای بازیکنان اهمیت بیشتری از هر مکانیزم تازه‌ای داشت.",
        targetAudience:
          "بازیکنان موبایل که به دنبال یک بازی سالیتر لایسنس‌دار به سبک TriPeaks هستند.",
        myRole:
          "برنامه‌نویس گیم‌پلی و رابط کاربری — مکانیزم‌های اصلی، طراحی رابط و انیمیشن کارت/UI.",
        metaTitle: "Mr. Bean Solitaire: Adventure — یوسف فرح‌مند",
        metaDescription:
          "یک بازی کارتی سالیتر با تم آقای بین، منتشرشده در گوگل پلی همراه با Unbound Game Studio.",
      },
    },
  },
  {
    id: "prj-the-skatepark",
    slug: "the-skatepark",
    status: "shipped",
    featured: true,
    category: "game",
    technologies: ["Unity", "C#", "Technical Animation", "Character Rigging"],
    platforms: ["web"],
    releaseYear: 2022,
    startDate: "2022-03-01",
    endDate: "2022-09-01",
    coverImageUrl: "/projects/the-skatepark-cover.jpg",
    gallery: [
      {
        id: "media-the-skatepark-cover",
        type: "image",
        src: "/projects/the-skatepark-cover.jpg",
        title: "The Skatepark Project",
        downloadable: true,
      },
      {
        id: "media-the-skatepark-1",
        type: "image",
        src: "/projects/the-skatepark-gallery-1.jpg",
        title: "The Skatepark Project — screenshot",
        downloadable: true,
      },
      {
        id: "media-the-skatepark-2",
        type: "image",
        src: "/projects/the-skatepark-gallery-2.jpg",
        title: "The Skatepark Project — screenshot",
        downloadable: true,
      },
      {
        id: "media-the-skatepark-3",
        type: "image",
        src: "/projects/the-skatepark-gallery-3.jpg",
        title: "The Skatepark Project — screenshot",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [
      {
        label: "Project Showcase (LinkedIn)",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7096860562759766016",
      },
    ],
    relatedProjectIds: ["prj-hide-and-seek"],
    relatedArticleIds: [],
    experienceId: "exp-wds-tech-artist",
    order: 5,
    translations: {
      en: {
        title: "The Skatepark Project",
        summary:
          "An open-world skateboarding game featuring characters based on Nounz NFTs, playable in WebGL.",
        problem:
          "Bringing a customizable, NFT-based cast of characters into a real-time skateboarding game meant building an animation and asset pipeline that could keep up with an evolving character roster.",
        solution:
          "As Technical Artist and Animator, handled character creation and animation, integrated art assets into the engine, and built technical tools to streamline the pipeline — including core skateboard trick mechanics and a customization system for character avatars and skateboard skins.",
        lessonsLearned:
          "Building the customization system before the trick roster was finished meant every new trick had to work with characters and skins nobody had designed yet — that ordering taught me to build for the unknown case first, not the one in front of me.",
        targetAudience:
          "Web players interested in open-world skateboarding games and NFT-based character collections.",
        myRole:
          "Technical Artist and Animator — character creation, animation, tools, core skateboard mechanics, and customization systems.",
        featureHighlights: [
          {
            icon: "customization",
            title: "Character & skin customization",
            description:
              "Players personalize their skater and board through a dedicated customization system built for the NFT-based cast.",
          },
        ],
        metaTitle: "The Skatepark Project — Usef Farahmand",
        metaDescription:
          "An open-world WebGL skateboarding game with an NFT-based character cast, built for White Designers Studios.",
      },
      fa: {
        title: "The Skatepark Project",
        summary:
          "بازی اسکیت‌بردسواری اوپن‌ورلد با کاراکترهایی بر پایهٔ NFTهای Nounz، قابل بازی در WebGL.",
        problem:
          "آوردن مجموعه‌ای شخصی‌سازی‌پذیر از کاراکترهای مبتنی بر NFT به یک بازی اسکیت‌بردسواری بلادرنگ یعنی ساخت پایپ‌لاین انیمیشن و اسِتی که بتواند با یک لیست کاراکتر روبه‌رشد همراه شود.",
        solution:
          "به‌عنوان تکنیکال آرتیست و انیماتور، مسئول ساخت و انیمیشن کاراکترها، یکپارچه‌سازی اسِت‌های گرافیکی در انجین، و ساخت ابزارهای فنی برای روان‌ترشدن پایپ‌لاین بودم — از جمله مکانیزم‌های اصلی ترفندهای اسکیت‌برد و سیستم شخصی‌سازی آواتار و اسکین اسکیت‌بردها.",
        lessonsLearned:
          "ساخت سیستم شخصی‌سازی پیش از تکمیل‌شدن فهرست ترفندها یعنی هر ترفند جدید باید با کاراکترها و اسکین‌هایی کار می‌کرد که هنوز طراحی نشده بودند — این ترتیب به من یاد داد اول برای حالت نامعلوم بسازم، نه حالتی که جلوی چشمم است.",
        targetAudience:
          "بازیکنان وب علاقه‌مند به بازی‌های اوپن‌ورلد اسکیت‌بردسواری و مجموعه‌کاراکترهای مبتنی بر NFT.",
        myRole:
          "تکنیکال آرتیست و انیماتور — ساخت کاراکتر، انیمیشن، ابزار، مکانیزم اصلی اسکیت‌برد و سیستم‌های شخصی‌سازی.",
        featureHighlights: [
          {
            icon: "customization",
            title: "شخصی‌سازی کاراکتر و اسکین",
            description:
              "بازیکنان از طریق سیستم اختصاصی شخصی‌سازی، اسکیتر و بردشان را برای مجموعهٔ کاراکتر مبتنی بر NFT شخصی‌سازی می‌کنند.",
          },
        ],
        metaTitle: "The Skatepark Project — یوسف فرح‌مند",
        metaDescription:
          "بازی اسکیت‌بردسواری اوپن‌ورلد در WebGL با کاراکترهای مبتنی بر NFT، ساخته‌شده برای White Designers Studios.",
      },
    },
  },
  {
    id: "prj-hide-and-seek",
    slug: "hide-and-seek",
    status: "shipped",
    featured: false,
    category: "game",
    technologies: ["Unity", "C#", "Multiplayer", "Networking"],
    platforms: ["android"],
    releaseYear: 2021,
    startDate: "2021-11-01",
    endDate: "2022-02-01",
    coverImageUrl: "/projects/hide-and-seek-cover.jpg",
    gallery: [
      {
        id: "media-hide-and-seek-cover",
        type: "image",
        src: "/projects/hide-and-seek-cover.jpg",
        title: "Hide and Seek",
        downloadable: true,
      },
      {
        id: "media-hide-and-seek-1",
        type: "image",
        src: "/projects/hide-and-seek-gallery-1.jpg",
        title: "Hide and Seek — screenshot",
        downloadable: true,
      },
      {
        id: "media-hide-and-seek-2",
        type: "image",
        src: "/projects/hide-and-seek-gallery-2.jpg",
        title: "Hide and Seek — screenshot",
        downloadable: true,
      },
      {
        id: "media-hide-and-seek-3",
        type: "image",
        src: "/projects/hide-and-seek-gallery-3.jpg",
        title: "Hide and Seek — map",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [
      {
        label: "Gameplay Video",
        url: "https://www.youtube.com/watch?v=cBpBIwBkTus",
      },
    ],
    relatedProjectIds: ["prj-the-skatepark"],
    relatedArticleIds: [],
    experienceId: "exp-wds-junior-programmer",
    order: 6,
    translations: {
      en: {
        title: "Hide and Seek",
        summary:
          "A multiplayer action-shooter putting a twist on the Prop Hunt genre, with a design inspired by pre-1990s Iranian everyday objects.",
        problem:
          "Prop Hunt's core hide-and-seek loop is well established — the challenge was giving it a distinct visual and cultural identity rather than a generic reskin.",
        solution:
          "Built a multiplayer game where players hide as everyday props — a chair, a box, even a toilet bowl — drawing the prop set and setting from old Iranian comics and household objects rarely represented in games.",
        lessonsLearned:
          "Leaning into a specific, under-represented cultural reference gave the game more identity than a generic prop set ever could have — distinctiveness came from specificity, not from more content.",
        targetAudience:
          "Mobile players who enjoy Prop Hunt–style multiplayer hide-and-seek games.",
        myRole: "Gameplay programmer.",
        metaTitle: "Hide and Seek — Usef Farahmand",
        metaDescription:
          "A multiplayer Prop Hunt–style action game with a design rooted in Iranian everyday objects, built for White Designers Studios.",
      },
      fa: {
        title: "Hide and Seek",
        summary:
          "بازی چندنفرهٔ اکشن-اختفا با روایتی تازه از ژانر Prop Hunt، الهام‌گرفته از اشیای روزمرهٔ ایران پیش از دههٔ ۱۳۷۰.",
        problem:
          "حلقهٔ اصلی مخفی‌شدن-و-پیداکردن در Prop Hunt شناخته‌شده است — چالش این بود که به آن هویتی بصری و فرهنگی متمایز بدهیم، نه یک ری‌اسکین عمومی.",
        solution:
          "ساخت بازی چندنفره‌ای که در آن بازیکنان در قالب اشیای روزمره پنهان می‌شوند — یک صندلی، یک جعبه، حتی یک توالت فرنگی — با الهام از کمیک‌های قدیمی ایرانی و اشیای خانگی که کمتر در بازی‌ها دیده شده‌اند.",
        lessonsLearned:
          "تکیه‌کردن روی یک مرجع فرهنگی خاص و کمتردیده‌شده به بازی هویتی داد که یک مجموعهٔ شیء عمومی هرگز نمی‌توانست بدهد — تمایز از خاص‌بودن آمد، نه از حجم بیشتر محتوا.",
        targetAudience:
          "بازیکنان موبایل که بازی‌های چندنفرهٔ اختفا به سبک Prop Hunt را دوست دارند.",
        myRole: "برنامه‌نویس گیم‌پلی.",
        metaTitle: "Hide and Seek — یوسف فرح‌مند",
        metaDescription:
          "بازی چندنفرهٔ اکشن به سبک Prop Hunt با طراحی ریشه‌گرفته از اشیای روزمرهٔ ایرانی، ساخته‌شده برای White Designers Studios.",
      },
    },
  },
  {
    id: "prj-balloon-boomer",
    slug: "balloon-boomer",
    status: "shipped",
    featured: false,
    category: "game",
    technologies: ["Unity", "C#", "UI Programming"],
    platforms: ["android"],
    releaseYear: 2021,
    startDate: "2021-08-01",
    endDate: "2021-09-01",
    logoUrl: "/projects/balloon-boomer-logo.webp",
    coverImageUrl: "/projects/balloon-boomer-cover.webp",
    gallery: [
      {
        id: "media-balloon-boomer-1",
        type: "image",
        src: "/projects/balloon-boomer-gallery-1.webp",
        title: "Balloon Boomer! — screenshot",
        downloadable: true,
      },
      {
        id: "media-balloon-boomer-2",
        type: "image",
        src: "/projects/balloon-boomer-gallery-2.webp",
        title: "Balloon Boomer! — screenshot",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [],
    relatedProjectIds: ["prj-nailer-mailer"],
    relatedArticleIds: [],
    experienceId: "exp-wds-junior-programmer",
    order: 7,
    translations: {
      en: {
        title: "Balloon Boomer!",
        summary:
          "A hyper-casual Android shooter where players battle through rooms of enemies to unlock new stages.",
        problem:
          "Hyper-casual shooters live or die on how immediately readable and satisfying each room feels — the interface and feedback loop needed to carry that on their own.",
        solution:
          "Designed and implemented the user interface system and in-game shopping mechanics, and built interactive environment features that improved gameplay feedback and immersion.",
        lessonsLearned:
          "In hyper-casual, the shop screen gets as much player attention as any level — treating its UI as a first-class design surface, not an afterthought, was the right call.",
        targetAudience:
          "Casual Android players looking for short, replayable arcade shooter sessions.",
        myRole: "UI and gameplay programmer.",
        metaTitle: "Balloon Boomer! — Usef Farahmand",
        metaDescription:
          "A hyper-casual Android shooter with UI, shop, and environment systems built for White Designers Studios.",
      },
      fa: {
        title: "Balloon Boomer!",
        summary:
          "یک بازی تیراندازی هایپرکژوال اندرویدی که در آن بازیکنان اتاق‌های پر از دشمن را رد می‌کنند تا مرحله‌های جدید باز شوند.",
        problem:
          "بازی‌های تیراندازی هایپرکژوال به این بستگی دارند که هر اتاق چقدر فوری خوانا و رضایت‌بخش باشد — رابط کاربری و حلقهٔ بازخورد باید به‌تنهایی این حس را منتقل کنند.",
        solution:
          "طراحی و پیاده‌سازی سیستم رابط کاربری و مکانیزم خرید درون‌بازی، و ساخت امکانات محیطی تعاملی که بازخورد گیم‌پلی و حس غوطه‌وری را بهتر کرد.",
        lessonsLearned:
          "در بازی‌های هایپرکژوال، صفحهٔ فروشگاه به‌اندازهٔ هر مرحله‌ای توجه بازیکن را جلب می‌کند — رفتار با UI آن به‌عنوان یک سطح طراحی درجه‌یک، نه یک افزودهٔ فرعی، تصمیم درستی بود.",
        targetAudience:
          "بازیکنان کژوال اندروید که به دنبال جلسه‌های کوتاه و تکرارپذیر آرکید هستند.",
        myRole: "برنامه‌نویس رابط کاربری و گیم‌پلی.",
        metaTitle: "Balloon Boomer! — یوسف فرح‌مند",
        metaDescription:
          "بازی تیراندازی هایپرکژوال اندرویدی با سیستم رابط کاربری، فروشگاه و محیط، ساخته‌شده برای White Designers Studios.",
      },
    },
  },
  {
    id: "prj-nailer-mailer",
    slug: "nailer-mailer",
    status: "shipped",
    featured: false,
    category: "game",
    technologies: ["Unity", "C#", "Puppet Master", "Ragdoll Physics"],
    platforms: ["android"],
    releaseYear: 2021,
    startDate: "2021-07-01",
    endDate: "2021-09-01",
    logoUrl: "/projects/nailer-mailer-logo.webp",
    coverImageUrl: "/projects/nailer-mailer-cover.jpg",
    gallery: [
      {
        id: "media-nailer-mailer-cover",
        type: "image",
        src: "/projects/nailer-mailer-cover.jpg",
        title: "Nailer Mailer",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [
      {
        label: "Gameplay Video",
        url: "https://www.youtube.com/watch?v=2uNSR1E4CDg",
      },
    ],
    relatedProjectIds: ["prj-balloon-boomer"],
    relatedArticleIds: [],
    experienceId: "exp-wds-junior-programmer",
    order: 8,
    translations: {
      en: {
        title: "Nailer Mailer",
        summary:
          "A super-casual Android shooter where players battle through enemy-filled rooms, with physics-driven environment destruction.",
        problem:
          "Making a super-casual shooter feel physically satisfying, not just mechanically functional, needed environment and character reactions that actually responded to impact.",
        solution:
          "Developed the UI system, shopping mechanics, and shooting system with enemy wall-attachment behavior, plus interactive environment effects — wall cracking, blood splatters, object shaking — and character ragdoll systems using Puppet Master and Unity's built-in ragdoll solution.",
        lessonsLearned:
          "Combining Puppet Master with Unity's built-in ragdoll solution for different situations taught me that 'physically satisfying' is often several smaller systems working together, not one impressive one.",
        targetAudience:
          "Casual Android players looking for quick, physical, arcade-style shooter sessions.",
        myRole:
          "Gameplay programmer — UI, shop, shooting system, and ragdoll/physics-driven environment effects.",
        metaTitle: "Nailer Mailer — Usef Farahmand",
        metaDescription:
          "A super-casual Android shooter with ragdoll physics and destructible environment effects, built for White Designers Studios.",
      },
      fa: {
        title: "Nailer Mailer",
        summary:
          "بازی تیراندازی فوق‌کژوال اندرویدی که بازیکنان اتاق‌های پر از دشمن را رد می‌کنند، همراه با تخریب محیط مبتنی بر فیزیک.",
        problem:
          "برای اینکه یک بازی تیراندازی فوق‌کژوال از نظر فیزیکی رضایت‌بخش باشد، نه فقط از نظر مکانیکی کارکردی، محیط و کاراکترها باید واقعاً به ضربه واکنش نشان می‌دادند.",
        solution:
          "توسعهٔ سیستم رابط کاربری، مکانیزم خرید، و سیستم تیراندازی با رفتار چسبیدن دشمن به دیوار، به‌همراه جلوه‌های محیطی تعاملی — ترک‌خوردن دیوار، پاشیدن خون، لرزش اشیا — و سیستم رگدال کاراکتر با استفاده از Puppet Master و راه‌حل رگدال داخلی یونیتی.",
        lessonsLearned:
          "ترکیب Puppet Master با راه‌حل رگدال داخلی یونیتی برای موقعیت‌های مختلف به من نشان داد «رضایت‌بخشی فیزیکی» معمولاً حاصل چند سیستم کوچک‌تر است که با هم کار می‌کنند، نه یک سیستم چشمگیر تنها.",
        targetAudience:
          "بازیکنان کژوال اندروید که به دنبال جلسه‌های سریع و آرکید تیراندازی هستند.",
        myRole:
          "برنامه‌نویس گیم‌پلی — رابط کاربری، فروشگاه، سیستم تیراندازی و جلوه‌های محیطی مبتنی بر فیزیک/رگدال.",
        metaTitle: "Nailer Mailer — یوسف فرح‌مند",
        metaDescription:
          "بازی تیراندازی فوق‌کژوال اندرویدی با فیزیک رگدال و جلوه‌های محیطی قابل‌تخریب، ساخته‌شده برای White Designers Studios.",
      },
    },
  },
  {
    id: "prj-farmand",
    slug: "farmand",
    status: "shipped",
    featured: false,
    category: "playable-ad",
    technologies: ["Unity", "C#"],
    platforms: ["web"],
    releaseYear: 2021,
    startDate: "2021-06-01",
    endDate: "2021-06-01",
    logoUrl: "/projects/farmand-logo.png",
    coverImageUrl: "/projects/farmand-cover.jpg",
    gallery: [
      {
        id: "media-farmand-cover",
        type: "image",
        src: "/projects/farmand-cover.jpg",
        title: "Farmand",
        downloadable: true,
      },
    ],
    links: {},
    externalLinks: [
      {
        label: "Gameplay Video",
        url: "https://www.youtube.com/watch?v=SOQxlsLB2fI",
      },
    ],
    relatedProjectIds: ["prj-gt-racing"],
    relatedArticleIds: [],
    experienceId: "exp-wds-junior-programmer",
    order: 9,
    translations: {
      en: {
        title: "Farmand",
        summary:
          "An interactive playable ad built for the Fermand Chocolate Company's commercial campaign.",
        problem:
          "A playable ad has seconds to convert an impression into an install — it has to communicate its hook almost instantly.",
        solution:
          "Built an interactive advertisement for Fermand Chocolate that was incorporated directly into one of the company's commercial campaigns.",
        lessonsLearned:
          "Playable ads are a different discipline from games proper — every extra second before the core hook lands is a player who's already gone.",
        targetAudience:
          "Mobile ad impressions for Fermand Chocolate's commercial campaign.",
        myRole: "Developer.",
        metaTitle: "Farmand — Usef Farahmand",
        metaDescription:
          "An interactive playable ad built for Fermand Chocolate Company, developed at White Designers Studios.",
      },
      fa: {
        title: "فرمند",
        summary:
          "یک تبلیغ تعاملی (playable ad) ساخته‌شده برای کمپین تبلیغاتی شرکت شکلات فرمند.",
        problem:
          "یک تبلیغ تعاملی چند ثانیه فرصت دارد تا یک نمایش تبلیغ را به نصب تبدیل کند — باید تقریباً بلافاصله جذابیتش را منتقل کند.",
        solution:
          "ساخت یک تبلیغ تعاملی برای شکلات فرمند که مستقیماً در یکی از کمپین‌های تبلیغاتی این شرکت به‌کار رفت.",
        lessonsLearned:
          "تبلیغات تعاملی رشته‌ای متفاوت از بازی‌های معمولی است — هر ثانیهٔ اضافه پیش از رسیدن به نقطهٔ جذابیت اصلی، یعنی از دست‌دادن بازیکنی که همین حالا رفته است.",
        targetAudience:
          "نمایش‌های تبلیغاتی موبایل برای کمپین تبلیغاتی شکلات فرمند.",
        myRole: "توسعه‌دهنده.",
        metaTitle: "فرمند — یوسف فرح‌مند",
        metaDescription:
          "یک تبلیغ تعاملی ساخته‌شده برای شرکت شکلات فرمند، توسعه‌یافته در White Designers Studios.",
      },
    },
  },
  {
    id: "prj-gt-racing",
    slug: "gt-racing",
    status: "shipped",
    featured: false,
    category: "playable-ad",
    technologies: [
      "Cocos Creator",
      "TypeScript",
      "Cocos2d",
      "Playable Ads",
      "2D Animation",
    ],
    platforms: ["web"],
    releaseYear: 2021,
    startDate: "2021-04-01",
    endDate: "2021-05-31",
    coverImageUrl: "/projects/gt-racing-cover.jpg",
    gallery: [
      {
        id: "media-gt-racing-cover",
        type: "image",
        src: "/projects/gt-racing-cover.jpg",
        title: "GT Racing",
        downloadable: true,
      },
      {
        id: "media-gt-racing-car-select",
        type: "image",
        src: "/projects/gt-racing/gt-racing-car-select.png",
        title: "Car Selection",
        description: "Choosing a car before the race starts.",
        downloadable: true,
      },
      {
        id: "media-gt-racing-color-select",
        type: "image",
        src: "/projects/gt-racing/gt-racing-color-select.png",
        title: "Color Customization",
        description: "Picking a color for the selected car in the garage.",
        downloadable: true,
      },
      {
        id: "media-gt-racing-stats",
        type: "image",
        src: "/projects/gt-racing/gt-racing-stats.png",
        title: "Upgrades & Stats",
        description:
          "Car stats and upgrade options — Turbo, Intake, Body, Nitrous, and Tires.",
        downloadable: true,
      },
      {
        id: "media-gt-racing-city",
        type: "image",
        src: "/projects/gt-racing/gt-racing-city.png",
        title: "City Race",
        description: "Racing through the city streets at night.",
        downloadable: true,
      },
    ],
    links: {
      playable: "/projects/gt-racing/index.html",
    },
    externalLinks: [],
    relatedProjectIds: ["prj-farmand"],
    relatedArticleIds: [],
    experienceId: "exp-wds-intern",
    order: 10,
    translations: {
      en: {
        title: "GT Racing",
        summary:
          "A playable ad introducing GT Racing's gameplay, commissioned by Berga Games.",
        problem:
          "Berga Games needed a quick, self-contained way to let mobile users try GT Racing's core driving feel before installing.",
        solution:
          "Built the interactive mobile ad in Cocos Creator with TypeScript, my first professional project after starting as a game programmer intern.",
        lessonsLearned:
          "This was my first shipped commercial work — it's where I first had to make a game systems decision under a real client deadline instead of a self-imposed one.",
        targetAudience:
          "Mobile ad impressions promoting GT Racing to prospective players.",
        myRole:
          "Developer — first professional project, built during my internship.",
        metaTitle: "GT Racing — Usef Farahmand",
        metaDescription:
          "A playable ad for GT Racing built in Cocos Creator and TypeScript, commissioned by Berga Games.",
      },
      fa: {
        title: "GT Racing",
        summary:
          "یک تبلیغ تعاملی معرفی‌کنندهٔ گیم‌پلی GT Racing، سفارش Berga Games.",
        problem:
          "Berga Games به راهی سریع و مستقل نیاز داشت تا کاربران موبایل پیش از نصب، حس رانندگی اصلی GT Racing را امتحان کنند.",
        solution:
          "ساخت تبلیغ تعاملی موبایل در Cocos Creator با تایپ‌اسکریپت؛ اولین پروژهٔ حرفه‌ای‌ام پس از شروع به‌عنوان کارآموز برنامه‌نویسی بازی.",
        lessonsLearned:
          "این اولین کار تجاری منتشرشدهٔ من بود — جایی که برای اولین بار باید تصمیمات سیستم بازی را زیر ددلاین واقعی یک کارفرما می‌گرفتم، نه ددلاینی که خودم تعیین کرده بودم.",
        targetAudience:
          "نمایش‌های تبلیغاتی موبایل برای معرفی GT Racing به بازیکنان بالقوه.",
        myRole:
          "توسعه‌دهنده — اولین پروژهٔ حرفه‌ای، ساخته‌شده در دوران کارآموزی.",
        metaTitle: "GT Racing — یوسف فرح‌مند",
        metaDescription:
          "تبلیغ تعاملی GT Racing، ساخته‌شده با Cocos Creator و تایپ‌اسکریپت، سفارش Berga Games.",
      },
    },
  },
];
