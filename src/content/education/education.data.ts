import type { Education } from "@/types/content";

/**
 * From the LinkedIn profile export (2026-10) and the previous English CV,
 * which agree on institution, degree and years.
 */
export const education: Education[] = [
  {
    id: "edu-imam-reza-bsc",
    startDate: "2018-09-01",
    endDate: "2022-06-01",
    order: 1,
    translations: {
      en: {
        institution: "Imam Reza International University",
        degree: "Bachelor of Science",
        field: "Computer Engineering",
        note: "Programming teaching assistant during undergraduate studies; ICPC Asia Tehran Regional contestant (2018–2020).",
      },
      fa: {
        institution: "دانشگاه بین‌المللی امام رضا (ع)",
        degree: "کارشناسی",
        field: "مهندسی کامپیوتر",
        note: "دستیار آموزشی درس برنامه‌نویسی در دوران کارشناسی؛ شرکت در مسابقات منطقه‌ای ICPC آسیا-تهران (۲۰۱۸ تا ۲۰۲۰).",
      },
    },
  },
];
