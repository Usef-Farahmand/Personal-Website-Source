import type { Achievement } from "@/types/content";

export const achievements: Achievement[] = [
  {
    id: "ach-aws-solutions-architect",
    category: "certificate",
    organization: "Amazon Web Services",
    date: "2023-09-01",
    relatedLink: {
      label: "Verify credential",
      url: "https://www.credly.com/badges/example-aws-saa",
    },
    // A real local asset, not a placeholder path — demonstrates the
    // Media Viewer's image flow end to end.
    media: {
      type: "image",
      url: "/certificates/sample-certificate.svg",
      alt: "AWS Certified Solutions Architect – Associate certificate",
      title: "AWS Certified Solutions Architect – Associate",
    },
    order: 1,
    translations: {
      en: {
        title: "AWS Certified Solutions Architect – Associate",
        description:
          "Certified in designing distributed systems on AWS, covering compute, storage, networking, and cost-aware architecture decisions.",
      },
    },
  },
  {
    id: "ach-hackathon-win",
    category: "competition",
    organization: "TehranHacks",
    date: "2022-11-01",
    // Demonstrates the PDF path — a genuinely valid local PDF, not a
    // placeholder reference.
    media: {
      type: "pdf",
      url: "/certificates/sample-certificate.pdf",
      title: "TehranHacks 1st Place Certificate",
    },
    order: 2,
    translations: {
      en: {
        title: "1st Place, TehranHacks",
        description:
          "Won first place among 40+ teams for a rapid prototype built in 24 hours, judged on technical execution and product thinking.",
      },
    },
  },
  {
    id: "ach-oss-contributor",
    category: "open-source",
    organization: "next-intl",
    date: "2024-02-01",
    relatedLink: {
      label: "View contribution",
      url: "https://github.com/amannn/next-intl",
    },
    order: 3,
    translations: {
      en: {
        title: "Open Source Contributor",
        description:
          "Contributed routing and type-safety improvements to next-intl, a widely used internationalization library for the Next.js App Router.",
      },
    },
  },
  {
    id: "ach-conference-talk",
    category: "speaking",
    organization: "React Tehran Meetup",
    date: "2024-10-01",
    order: 4,
    translations: {
      en: {
        title: "Speaker — Building Multilingual Products",
        description:
          "Gave a talk on architecting content-driven, multilingual frontends, covering locale routing, RTL support, and typography systems.",
      },
    },
  },
];
