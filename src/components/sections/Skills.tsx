import { getTranslations } from "next-intl/server";
import { listFeaturedSkills } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { SkillCard } from "@/components/ui/SkillCard";
import { SkillsGrid } from "@/components/sections/SkillsGrid";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type {
  Locale,
  SkillDomain,
  SkillExperienceLevel,
} from "@/content/types";

export async function Skills({ locale }: { locale: Locale }) {
  const featuredSkills = listFeaturedSkills(locale);
  const [t, tDomain, tLevel] = await Promise.all([
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skillDomain" }),
    getTranslations({ locale, namespace: "skillExperienceLevel" }),
  ]);

  if (featuredSkills.length === 0) {
    return null;
  }

  const domainLabel = (domain: SkillDomain) => tDomain(domain);
  const levelLabel = (level: SkillExperienceLevel) => tLevel(level);

  return (
    <Section id="skills" as="section">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/skills" label={t("viewAll")} />
      </div>

      <SkillsGrid>
        {featuredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            domainLabel={domainLabel(skill.domain)}
            levelLabel={levelLabel(skill.experienceLevel)}
            yearsSuffix={t("yearsSuffix")}
          />
        ))}
      </SkillsGrid>
    </Section>
  );
}
