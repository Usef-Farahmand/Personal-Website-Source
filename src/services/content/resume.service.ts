import { siteUrl } from "@/config/site";
import { getSiteContent } from "./site.service";
import { getContactContent } from "./contact.service";
import { listExperience } from "./experience.service";
import { isPersonalProject, listFeaturedProjects } from "./projects.service";
import { groupSkillsByDomain, listSkills } from "./skills.service";
import { listEducation } from "./education.service";
import { listAchievements } from "./achievements.service";
import { formatMonthYear } from "@/lib/date";
import enMessages from "@/messages/en.json";
import faMessages from "@/messages/fa.json";
import type { Locale } from "@/types/content";

/**
 * One locale's resume, assembled entirely from the rest of src/content so
 * it never drifts from the site: the /resume page and the generated PDFs
 * (app/documents/*.pdf) both render this exact object. Only the headline,
 * summary, location and languages are resume-specific copy
 * (SiteTranslation.resume); experience bullets come from
 * ExperienceTranslation.resumeBullets.
 *
 * Labels are read from the message files directly (like lib/llms.ts)
 * rather than through next-intl, because the PDF route handlers render
 * outside a request's locale context.
 */

const MESSAGES = { en: enMessages, fa: faMessages } as const;

export interface ResumeLink {
  label: string;
  /** Shown text — the URL without protocol, or the bare email address. */
  display: string;
  url: string;
}

export interface ResumeRole {
  role: string;
  dateRange: string;
  bullets: string[];
}

export interface ResumeExperienceGroup {
  company: string;
  location: string;
  roles: ResumeRole[];
}

export interface ResumeData {
  locale: Locale;
  name: string;
  headline: string;
  summary: string;
  location: string;
  links: ResumeLink[];
  experience: ResumeExperienceGroup[];
  projects: {
    title: string;
    summary: string;
    technologies: string[];
    url: string;
  }[];
  skills: { label: string; items: string[] }[];
  education: {
    institution: string;
    degree: string;
    dateRange: string;
    note?: string;
  }[];
  achievements: { title: string; organization?: string }[];
  languages: { name: string; level: string }[];
  labels: (typeof enMessages)["resume"];
}

/** Public path of each locale's generated PDF — the route handlers live
 *  at exactly these paths under app/documents/. */
export function resumePdfPath(locale: Locale): string {
  return `/documents/usef-farahmand-resume-${locale}.pdf`;
}

function dateRange(
  start: string,
  end: string | null,
  locale: Locale,
  present: string
): string {
  return `${formatMonthYear(start, locale)} – ${end ? formatMonthYear(end, locale) : present}`;
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function getResume(locale: Locale): ResumeData {
  const labels = MESSAGES[locale].resume;
  const skillDomains = MESSAGES[locale].skillDomain as Record<string, string>;
  const site = getSiteContent(locale);
  const contact = getContactContent(locale);

  const profileUrl = (platform: string) =>
    site.socialLinks.find((link) => link.platform === platform && link.enabled)
      ?.url;
  const websiteUrl = new URL(`/${locale}`, siteUrl).toString();
  const links: ResumeLink[] = [
    { label: "Email", display: contact.email, url: `mailto:${contact.email}` },
    {
      label: "Website",
      display: stripProtocol(siteUrl.toString()),
      url: websiteUrl,
    },
    ...(
      [
        ["linkedin", "LinkedIn"],
        ["github", "GitHub"],
      ] as const
    ).flatMap(([platform, label]) => {
      const url = profileUrl(platform);
      return url ? [{ label, display: stripProtocol(url), url }] : [];
    }),
  ];

  // Consecutive roles at the same company (White Designers Studios'
  // internal promotions) read as one employer with several titles, the
  // usual resume convention, instead of repeating the company name.
  const experience: ResumeExperienceGroup[] = [];
  for (const entry of listExperience(locale)) {
    const role: ResumeRole = {
      role: entry.role,
      dateRange: dateRange(
        entry.startDate,
        entry.endDate,
        locale,
        labels.present
      ),
      bullets: entry.resumeBullets ?? [entry.headlineAchievement],
    };
    const last = experience.at(-1);
    if (last && last.company === entry.companyName) {
      last.roles.push(role);
    } else {
      experience.push({
        company: entry.companyName,
        location: entry.location,
        roles: [role],
      });
    }
  }

  return {
    locale,
    name: site.hero.name,
    headline: site.resume.headline,
    summary: site.resume.summary,
    location: site.resume.location,
    links,
    experience,
    // Usef's own featured games only, at most three (keeps the PDF at the
    // usual two pages); everything else is a click away on the site.
    projects: listFeaturedProjects(locale)
      .filter(
        (project) =>
          isPersonalProject(project) &&
          (project.category === "game" || project.category === "playable-ad")
      )
      .slice(0, 3)
      .map((project) => ({
        title: project.title,
        summary: project.summary,
        technologies: project.technologies,
        url: new URL(`/${locale}/projects/${project.slug}`, siteUrl).toString(),
      })),
    skills: groupSkillsByDomain(listSkills(locale)).map((group) => ({
      label: skillDomains[group.domain] ?? group.domain,
      items: group.skills.map((skill) => skill.name),
    })),
    education: listEducation(locale).map((entry) => ({
      institution: entry.institution,
      degree: `${entry.degree}${locale === "fa" ? "، " : ", "}${entry.field}`,
      dateRange: dateRange(
        entry.startDate,
        entry.endDate,
        locale,
        labels.present
      ),
      note: entry.note,
    })),
    // No separate date: every current title already names its year.
    achievements: listAchievements(locale).map((entry) => ({
      title: entry.title,
      organization: entry.organization,
    })),
    languages: site.resume.languages,
    labels,
  };
}
