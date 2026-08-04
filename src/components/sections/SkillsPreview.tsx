import { getTranslations } from "next-intl/server";
import { listSkills, groupSkillsByDomain } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { SkillChip } from "@/components/ui/SkillChip";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

/**
 * Full redesign per the Skills feature spec: the homepage is an entry
 * point showing every skill (grouped by category) as lightweight chips —
 * not a curated "featured" subset of detailed cards. Depth lives
 * entirely on the Skills page (SkillsGrid + SkillCard); this component
 * renders nothing but a name and a link for each skill, which is what
 * keeps it "lightweight" per the Performance requirement — no
 * description, level, or technology data is even read here.
 */
export async function SkillsPreview({ locale }: { locale: Locale }) {
  const allSkills = listSkills(locale);
  const groups = groupSkillsByDomain(allSkills);

  const [t, tDomain] = await Promise.all([
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skillDomain" }),
  ]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <Section id="skills" as="section">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-h2 text-text-primary font-semibold">
          {t("title")}
        </h2>
        <ViewAllLink href="/skills" label={t("viewAll")} />
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.domain}>
            <h3 className="text-caption text-text-secondary mb-2.5 font-semibold tracking-wide uppercase">
              {tDomain(group.domain)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <SkillChip key={skill.id} id={skill.id} name={skill.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
