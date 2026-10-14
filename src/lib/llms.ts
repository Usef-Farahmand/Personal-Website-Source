import { siteUrl } from "@/config/site";
import { getSiteContent } from "@/services/content/site.service";
import { getContactContent } from "@/services/content/contact.service";
import { listProjects } from "@/services/content/projects.service";
import { listLearning } from "@/services/content/learning.service";
import { listArticles } from "@/services/content/articles.service";
import { listExperience } from "@/services/content/experience.service";
import { listSkills } from "@/services/content/skills.service";
import { listRecommendations } from "@/services/content/recommendations.service";
import messages from "@/messages/en.json";
import type { LearningContentBlock, Locale } from "@/types/content";

/**
 * Plain-Markdown summaries of the site for LLMs and AI answer engines,
 * following the llms.txt proposal (https://llmstxt.org): an H1, a short
 * blockquote summary, then sections of annotated links.
 *
 * - /llms.txt is the short index: who Usef is plus every page worth citing.
 * - /llms-full.txt inlines the actual content (story, experience, skills,
 *   projects, learning notes) so a model can answer from one fetch,
 *   without having to execute the site's JavaScript.
 *
 * Written in English (the default locale); every page also exists under
 * /fa in Persian, which the file says so models can point Persian
 * speakers there. Everything is generated from src/content, so it never
 * drifts from the pages themselves.
 */

const LOCALE: Locale = "en";

function url(path: string = "", locale: Locale = LOCALE): string {
  return new URL(`/${locale}${path}`, siteUrl).toString();
}

function yearMonth(date: string | null): string {
  return date ? date.slice(0, 7) : "present";
}

function blockToText(block: LearningContentBlock): string {
  if (typeof block === "string") return block;
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "heading":
      return `${"#".repeat((block.level ?? 2) + 2)} ${block.text}`;
    case "list":
      return block.items
        .map((item, i) => (block.ordered ? `${i + 1}. ${item}` : `- ${item}`))
        .join("\n");
    case "table":
      return [
        `| ${block.headers.join(" | ")} |`,
        `| ${block.headers.map(() => "---").join(" | ")} |`,
        ...block.rows.map((row) => `| ${row.join(" | ")} |`),
      ].join("\n");
    case "image":
      return block.caption
        ? `[Image: ${block.caption}]`
        : `[Image: ${block.alt}]`;
    case "video":
      return block.caption ? `[Video: ${block.caption}]` : "";
  }
}

function header(): string[] {
  const site = getSiteContent(LOCALE);
  const fa = getSiteContent("fa");
  const contact = getContactContent(LOCALE);
  return [
    `# ${site.hero.name}`,
    "",
    `> ${site.hero.name} (Persian: ${fa.hero.name}) — ${site.hero.professionalTitle}. A game programmer and technical artist with ${site.experienceYears}+ years in game development, and founder of the ${site.studio.name} game and app studio (${site.studio.url}).`,
    "",
    site.about.introduction,
    "",
    `- Contact: ${contact.email} — ${contact.location}`,
    `- Profiles: ${site.socialLinks
      .filter((link) => link.enabled && link.platform !== "email")
      .map((link) => link.url)
      .join(", ")}`,
    `- Languages: every page is available in English (${url()}) and Persian (${url("", "fa")}).`,
    "",
  ];
}

export function buildLlmsTxt(): string {
  const projects = listProjects(LOCALE);
  const learning = listLearning(LOCALE);
  const articles = listArticles(LOCALE);
  const seo = messages.seo;

  const lines = [
    ...header(),
    "## Pages",
    "",
    `- [About](${url("/about")}): Who Usef is: story, studio, achievements, résumé and FAQ.`,
    `- [Projects](${url("/projects")}): ${seo.projects.description}`,
    `- [Experience](${url("/experience")}): ${seo.experience.description}`,
    `- [Skills](${url("/skills")}): ${seo.skills.description}`,
    `- [Learning notes](${url("/learning")}): ${seo.learning.description}`,
    `- [Articles](${url("/articles")}): ${seo.articles.description}`,
    `- [Recommendations](${url("/recommendations")}): ${seo.recommendations.description}`,
    `- [Contact](${url("/contact")}): ${seo.contact.description}`,
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) =>
        `- [${p.title}](${url(`/projects/${p.slug}`)}): ${p.summary} (${p.technologies.join(", ")})`
    ),
    "",
  ];

  if (learning.length > 0) {
    lines.push(
      "## Learning notes",
      "",
      ...learning.map(
        (e) => `- [${e.title}](${url(`/learning/${e.slug}`)}): ${e.summary}`
      ),
      ""
    );
  }

  lines.push(
    "## Articles",
    "",
    ...articles.map((a) => `- [${a.title}](${a.sourceUrl}): ${a.summary}`),
    "",
    "## Optional",
    "",
    `- [Full content for LLMs](${new URL("/llms-full.txt", siteUrl).toString()}): every section above, inlined as plain text.`,
    `- [Sitemap](${new URL("/sitemap.xml", siteUrl).toString()})`,
    ""
  );

  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  const site = getSiteContent(LOCALE);
  const categories = messages.projectCategory as Record<string, string>;
  const levels = messages.skillExperienceLevel as Record<string, string>;
  const employment = messages.employmentType as Record<string, string>;

  const lines = [
    ...header(),
    "## About",
    "",
    ...site.about.story.flatMap((p) => [p, ""]),
    "Current focus:",
    ...site.about.currentFocus.map((item) => `- ${item}`),
    "",
    `### ${site.studio.name} (${site.studio.url})`,
    "",
    `${site.studioIntro.role}. ${site.studioIntro.description}`,
    "",
    "## Experience",
    "",
  ];

  for (const exp of listExperience(LOCALE)) {
    lines.push(
      `### ${exp.role} — ${exp.companyName}`,
      "",
      `${yearMonth(exp.startDate)} to ${yearMonth(exp.endDate)} · ${employment[exp.employmentType] ?? exp.employmentType} · ${exp.location}`,
      "",
      exp.fullDescription,
      "",
      ...(exp.technologies.length > 0
        ? [`Technologies: ${exp.technologies.join(", ")}`, ""]
        : [])
    );
  }

  lines.push("## Skills", "");
  for (const skill of listSkills(LOCALE)) {
    const years = skill.yearsOfExperience
      ? `, ${skill.yearsOfExperience}+ years`
      : "";
    lines.push(
      `- **${skill.name}** (${levels[skill.experienceLevel] ?? skill.experienceLevel}${years}): ${skill.description}`
    );
  }
  lines.push("", "## Projects", "");

  for (const p of listProjects(LOCALE)) {
    const links = [
      ...Object.entries(p.links).map(([label, href]) => `${label}: ${href}`),
      ...(p.externalLinks ?? []).map((link) => `${link.label}: ${link.url}`),
    ];
    lines.push(
      `### ${p.title}`,
      "",
      `URL: ${url(`/projects/${p.slug}`)}`,
      `Category: ${categories[p.category] ?? p.category} · Status: ${p.status} · ${yearMonth(p.startDate)} to ${yearMonth(p.endDate)}`,
      `Technologies: ${p.technologies.join(", ")}`,
      ...(p.myRole ? [`Role: ${p.myRole}`] : []),
      ...(links.length > 0 ? [`Links: ${links.join(" · ")}`] : []),
      "",
      p.summary,
      "",
      `Problem: ${p.problem}`,
      "",
      `Solution: ${p.solution}`,
      "",
      `Lessons learned: ${p.lessonsLearned}`,
      ""
    );
  }

  const learning = listLearning(LOCALE);
  if (learning.length > 0) {
    lines.push("## Learning notes", "");
    for (const e of learning) {
      lines.push(
        `### ${e.title}`,
        "",
        `URL: ${url(`/learning/${e.slug}`)} · Published: ${e.date} · Tags: ${e.tags.join(", ")}`,
        ...(e.sourceCodeUrl ? [`Source code: ${e.sourceCodeUrl}`] : []),
        "",
        ...e.content
          .map(blockToText)
          .filter(Boolean)
          .flatMap((t) => [t, ""])
      );
    }
  }

  lines.push("## Articles", "");
  for (const a of listArticles(LOCALE)) {
    lines.push(
      `- [${a.title}](${a.sourceUrl}) (${a.publishedDate}): ${a.summary}`
    );
  }

  const recommendations = listRecommendations(LOCALE);
  if (recommendations.length > 0) {
    lines.push("", "## Recommendations", "");
    for (const r of recommendations) {
      lines.push(
        `> ${r.recommendation.replace(/\n+/g, " ")}`,
        `> — ${r.name}, ${r.jobTitle}${r.company ? ` at ${r.company}` : ""}`,
        ""
      );
    }
  }

  return lines.join("\n");
}
