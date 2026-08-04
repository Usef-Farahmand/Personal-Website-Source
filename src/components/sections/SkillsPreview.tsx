import { getTranslations } from "next-intl/server";
import { listSkills, groupSkillsByDomain } from "@/lib/content";
import { Section } from "@/components/layout/Section";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SkillCategoryCard } from "@/components/ui/SkillCategoryCard";
import { ViewAllLink } from "@/components/ui/ViewAllLink";
import type { Locale } from "@/content/types";

/**
 * Full redesign per the Skills feature spec: the homepage is an entry
 * point showing every skill (grouped by category) as lightweight chips —
 * not a curated "featured" subset of detailed cards. Depth lives
 * entirely on the Skills page (SkillsGrid + SkillCard).
 *
 * Categories render as their own cards in a fixed 2-column grid (capped
 * at 2 even on wide desktop, per the layout requirement — unlike the
 * site's other card grids, which grow to 3 columns at `lg`), rather than
 * one long vertical list. This is what actually fixes the "too long to
 * scan" feedback: a 10-category vertical stack and a 10-category 2-up
 * grid have the same content but roughly half the scroll length.
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

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <SkillCategoryCard
            key={group.domain}
            domain={group.domain}
            domainLabel={tDomain(group.domain)}
            skills={group.skills}
          />
        ))}
      </RevealGroup>
    </Section>
  );
}
