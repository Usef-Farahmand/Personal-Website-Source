import { getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import { getResume, resumePdfPath } from "@/services/content/resume.service";
import { CornerHandles } from "@/components/ui/CornerHandles";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.resume" });
  const site = getSiteContent(locale);
  return buildPageMetadata({
    locale,
    path: "/resume",
    title: t("title"),
    description: t("description", { years: site.experienceYears }),
    siteName: site.hero.name,
  });
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border border-t pt-6">
      <h2 className="text-accent mb-4 text-sm font-bold ltr:tracking-[0.15em] ltr:uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The resume as a web page, in the visitor's locale. Same data as the
 * generated PDFs (services/content/resume.service.ts), so the page and
 * the Download PDF button can never disagree.
 */
export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const resume = getResume(locale);
  const { labels } = resume;
  const t = await getTranslations({ locale, namespace: "resume" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p
            dir="ltr"
            className="text-accent inline-flex items-center gap-2 self-start font-mono text-xs font-medium tracking-wider"
          >
            <span aria-hidden="true" className="bg-accent h-2 w-2" />
            ~/resume
          </p>
          <h1 className="text-text-primary text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-bold ltr:tracking-tight">
            {resume.name}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg">
            {resume.headline}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <a
            href={resumePdfPath(locale)}
            download
            className="bg-accent text-background hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-[0_8px_30px_-8px_rgb(249_115_22/0.6)] transition-colors"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {labels.download}
          </a>
          <span className="text-text-secondary text-xs">
            {t("downloadHint", { language: t("language") })}
          </span>
        </div>
      </header>

      <article className="border-border bg-surface/60 relative mt-10 flex flex-col gap-8 rounded-xl border p-6 backdrop-blur-sm sm:p-10">
        <CornerHandles />
        <ul className="text-text-secondary flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>{resume.location}</li>
          {resume.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                dir="ltr"
                className="hover:text-accent transition-colors"
                {...(link.url.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="sr-only">{link.label}: </span>
                {link.display}
              </a>
            </li>
          ))}
        </ul>

        <ResumeSection title={labels.sections.summary}>
          <p className="text-text-secondary leading-relaxed">
            {resume.summary}
          </p>
        </ResumeSection>

        <ResumeSection title={labels.sections.experience}>
          <div className="flex flex-col gap-7">
            {resume.experience.map((group) => (
              <div key={`${group.company}-${group.roles[0].dateRange}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-text-primary text-lg font-bold">
                    {group.company}
                  </h3>
                  <span className="text-text-secondary text-sm">
                    {group.location}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-4">
                  {group.roles.map((role) => (
                    <div key={role.role}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <p className="text-text-primary font-semibold">
                          {role.role}
                        </p>
                        <span className="text-text-secondary text-xs ltr:font-mono">
                          {role.dateRange}
                        </span>
                      </div>
                      <ul className="text-text-secondary mt-2 flex list-disc flex-col gap-1.5 ps-5 text-sm leading-relaxed marker:text-[var(--color-accent)]">
                        {role.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title={labels.sections.projects}>
          <div className="flex flex-col gap-5">
            {resume.projects.map((project) => (
              <div key={project.url}>
                <a
                  href={project.url}
                  className="text-text-primary hover:text-accent font-semibold transition-colors"
                >
                  {project.title}
                </a>
                <p className="text-text-secondary mt-1 text-sm leading-relaxed">
                  {project.summary}
                </p>
                <p
                  dir="ltr"
                  className="text-text-secondary mt-1 font-mono text-xs rtl:text-right"
                >
                  {project.technologies.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection title={labels.sections.skills}>
          <dl className="grid gap-3 text-sm sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-x-6">
            {resume.skills.map((group) => (
              <div key={group.label} className="contents">
                <dt className="text-text-primary font-semibold">
                  {group.label}
                </dt>
                <dd className="text-text-secondary">
                  {group.items.join(locale === "fa" ? "، " : ", ")}
                </dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection title={labels.sections.education}>
          {resume.education.map((entry) => (
            <div key={entry.institution}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-text-primary font-semibold">
                  {entry.degree}
                </h3>
                <span className="text-text-secondary text-xs ltr:font-mono">
                  {entry.dateRange}
                </span>
              </div>
              <p className="text-text-secondary text-sm">{entry.institution}</p>
              {entry.note && (
                <p className="text-text-secondary mt-1 text-sm">{entry.note}</p>
              )}
            </div>
          ))}
        </ResumeSection>

        <div className="grid gap-8 sm:grid-cols-2">
          <ResumeSection title={labels.sections.achievements}>
            <ul className="text-text-secondary flex flex-col gap-2 text-sm">
              {resume.achievements.map((entry) => (
                <li key={entry.title}>
                  <span className="text-text-primary">{entry.title}</span>
                  {entry.organization && (
                    <span className="block text-xs">{entry.organization}</span>
                  )}
                </li>
              ))}
            </ul>
          </ResumeSection>

          <ResumeSection title={labels.sections.languages}>
            <ul className="text-text-secondary flex flex-col gap-2 text-sm">
              {resume.languages.map((language) => (
                <li key={language.name}>
                  <span className="text-text-primary">{language.name}</span>
                  {" — "}
                  {language.level}
                </li>
              ))}
            </ul>
          </ResumeSection>
        </div>

        <p className="text-text-secondary border-border border-t pt-4 text-xs">
          {t("updated")}
        </p>
      </article>
    </div>
  );
}
