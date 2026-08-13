import type { Achievement } from "@/types/content";

/**
 * Migrated from the previous useffarahmand.com (data/achievements.json).
 * Certificates are the real local PDFs from that site's
 * assets/certificates/ directory — not placeholders.
 */
export const achievements: Achievement[] = [
  {
    id: "ach-icpc-2018",
    category: "competition",
    organization: "ICPC - International Collegiate Programming Contest",
    date: "2018-12-01",
    media: {
      id: "media-icpc-2018-certificate",
      type: "pdf",
      src: "/certificates/icpc-2018.pdf",
      title: "The 2018 ICPC Asia Tehran Regional Contest",
      downloadable: true,
      metadata: {
        date: "December 2018",
        organization: "ICPC - International Collegiate Programming Contest",
        category: "Competition",
      },
    },
    order: 1,
    translations: {
      en: {
        title: "The 2018 ICPC Asia Tehran Regional Contest",
        description:
          "Participated in programming challenges involving algorithms, problem solving, and competitive programming.",
      },
      fa: {
        title: "مسابقهٔ منطقه‌ای ICPC آسیا-تهران ۲۰۱۸",
        description:
          "شرکت در چالش‌های برنامه‌نویسی حول الگوریتم‌ها، حل مسئله و برنامه‌نویسی رقابتی.",
      },
    },
  },
  {
    id: "ach-icpc-2019",
    category: "competition",
    organization: "ICPC - International Collegiate Programming Contest",
    date: "2019-12-01",
    media: {
      id: "media-icpc-2019-certificate",
      type: "pdf",
      src: "/certificates/icpc-2019.pdf",
      title: "The 2019 ICPC Asia Tehran Regional Contest",
      downloadable: true,
      metadata: {
        date: "December 2019",
        organization: "ICPC - International Collegiate Programming Contest",
        category: "Competition",
      },
    },
    order: 2,
    translations: {
      en: {
        title: "The 2019 ICPC Asia Tehran Regional Contest",
        description:
          "Participated in competitive programming challenges focused on data structures and algorithms.",
      },
      fa: {
        title: "مسابقهٔ منطقه‌ای ICPC آسیا-تهران ۲۰۱۹",
        description:
          "شرکت در چالش‌های برنامه‌نویسی رقابتی با تمرکز بر ساختمان داده و الگوریتم.",
      },
    },
  },
  {
    id: "ach-icpc-2020",
    category: "competition",
    organization: "ICPC - International Collegiate Programming Contest",
    date: "2020-12-01",
    media: {
      id: "media-icpc-2020-certificate",
      type: "pdf",
      src: "/certificates/icpc-2020.pdf",
      title: "The 2020 ICPC Asia Tehran Regional Contest",
      downloadable: true,
      metadata: {
        date: "December 2020",
        organization: "ICPC - International Collegiate Programming Contest",
        category: "Competition",
      },
    },
    order: 3,
    translations: {
      en: {
        title: "The 2020 ICPC Asia Tehran Regional Contest",
        description:
          "Participated in the ICPC regional programming competition.",
      },
      fa: {
        title: "مسابقهٔ منطقه‌ای ICPC آسیا-تهران ۲۰۲۰",
        description: "شرکت در مسابقهٔ منطقه‌ای برنامه‌نویسی ICPC.",
      },
    },
  },
];
