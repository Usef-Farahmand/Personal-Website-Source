import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, listProjects } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Locale } from "@/content/types";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = params.locale as Locale;
  return listProjects(locale).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug, locale);
  if (!project) return {};
  return {
    title: { absolute: project.metaTitle },
    description: project.metaDescription,
  };
}

const OPTIONAL_SECTIONS = [
  "research",
  "design",
  "architecture",
  "implementation",
  "challenges",
] as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const [tProjects, tStatus, tDetail] = await Promise.all([
    getTranslations({ locale, namespace: "projectsIndex" }),
    getTranslations({ locale, namespace: "projectStatus" }),
    getTranslations({ locale, namespace: "projectDetail" }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Breadcrumb
        items={[
          { label: tProjects("title"), href: "/projects" },
          { label: project.title },
        ]}
      />

      <header className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <StatusBadge
            status={project.status}
            label={tStatus(project.status)}
          />
        </div>

        <h1 className="text-h1 text-text-primary font-semibold">
          {project.title}
        </h1>

        <p className="text-body-lg text-text-secondary">{project.summary}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-small text-background hover:bg-accent-hover rounded-md px-4 py-2 font-medium transition-colors"
            >
              {tDetail("viewDemo")}
            </a>
          )}
          {project.links.repository && (
            <a
              href={project.links.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-small text-text-primary hover:border-accent/50 rounded-md border px-4 py-2 font-medium transition-colors"
            >
              {tDetail("viewRepository")}
            </a>
          )}
        </div>
      </header>

      <article className="flex flex-col gap-10">
        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {tDetail("problem")}
          </h2>
          <p className="text-body text-text-secondary">{project.problem}</p>
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {tDetail("solution")}
          </h2>
          <p className="text-body text-text-secondary">{project.solution}</p>
        </section>

        {OPTIONAL_SECTIONS.map((key) => {
          const content = project[key];
          if (!content) return null;
          return (
            <section key={key}>
              <h2 className="text-h4 text-text-primary mb-2 font-semibold">
                {tDetail(key)}
              </h2>
              <p className="text-body text-text-secondary">{content}</p>
            </section>
          );
        })}

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {tDetail("lessonsLearned")}
          </h2>
          <p className="text-body text-text-secondary">
            {project.lessonsLearned}
          </p>
        </section>

        <section>
          <h2 className="text-h4 text-text-primary mb-2 font-semibold">
            {tDetail("technologies")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="bg-surface text-small text-text-secondary rounded-md px-2.5 py-1"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <div className="border-border mt-14 border-t pt-8">
        <Link
          href="/projects"
          className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
          {tDetail("backToProjects")}
        </Link>
      </div>
    </div>
  );
}
