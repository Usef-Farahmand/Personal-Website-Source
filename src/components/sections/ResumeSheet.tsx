import { getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { getResume, resumePdfPath } from "@/services/content/resume.service";
import { CornerHandles } from "@/components/ui/CornerHandles";
import type { Locale } from "@/types/content";

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
 * The resume itself — header with the Download PDF button, then the
 * sheet. Rendered by both the /resume page and the About page's resume
 * popup (ResumeDialog), from the same data as the generated PDFs
 * (services/content/resume.service.ts), so none of them can disagree.
 * `headingAs` lets the popup keep the page's single h1 intact;
 * `scrollBody` (popup) keeps the header — name, Download PDF — in place
 * and scrolls only the sheet below it.
 */
export async function ResumeSheet({
  locale,
  headingAs: Heading = "h1",
  scrollBody = false,
}: {
  locale: Locale;
  headingAs?: "h1" | "h2";
  scrollBody?: boolean;
}) {
  const resume = getResume(locale);
  const { labels } = resume;
  const t = await getTranslations({ locale, namespace: "resume" });

  return (
    <>
      <header className="flex shrink-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <p
            dir="ltr"
            className="text-accent inline-flex items-center gap-2 self-start font-mono text-xs font-medium tracking-wider"
          >
            <span aria-hidden="true" className="bg-accent h-2 w-2" />
            ~/resume
          </p>
          <Heading className="text-text-primary text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-bold ltr:tracking-tight">
            {resume.name}
          </Heading>
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

      <div
        className={
          scrollBody
            ? "-mx-1 mt-8 min-h-0 flex-1 overflow-y-auto px-1 pt-2 pb-1"
            : "mt-10"
        }
      >
        <article className="border-border bg-surface/60 relative flex flex-col gap-8 rounded-xl border p-6 backdrop-blur-sm sm:p-10">
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
                        <ul className="text-text-secondary mt-2 flex list-disc flex-col gap-1.5 ps-5 text-justify text-sm leading-relaxed hyphens-auto marker:text-[var(--color-accent)]">
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
                <p className="text-text-secondary text-sm">
                  {entry.institution}
                </p>
                {entry.note && (
                  <p className="text-text-secondary mt-1 text-sm">
                    {entry.note}
                  </p>
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
                      <span className="block text-xs">
                        {entry.organization}
                      </span>
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
        </article>
      </div>
    </>
  );
}
