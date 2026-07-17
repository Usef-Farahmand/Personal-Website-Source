import { getTranslations } from "next-intl/server";
import { listFeaturedProjects } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

export async function FeaturedWork({ locale }: { locale: Locale }) {
  const featuredProjects = listFeaturedProjects(locale);
  const t = await getTranslations({ locale, namespace: "featuredWork" });

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <Section id="featured-work" as="section" className="border-border border-t">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/projects" label={t("viewAll")} />
      </div>

      <Grid gap="md" className="grid-cols-1 sm:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </Grid>
    </Section>
  );
}
