import { getTranslations } from "next-intl/server";
import { listProjects } from "@/services/content/projects.service";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "projectsIndex" });
  return { title: t("title") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const projects = listProjects(locale);
  const t = await getTranslations({ locale, namespace: "projectsIndex" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Breadcrumb locale={locale} />

      <header className="mb-10">
        <h1 className="text-h1 text-text-primary font-semibold">
          {t("title")}
        </h1>
        <p className="text-body text-text-secondary mt-2 max-w-xl">
          {t("intro")}
        </p>
      </header>

      <ProjectsGrid>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </ProjectsGrid>
    </div>
  );
}
