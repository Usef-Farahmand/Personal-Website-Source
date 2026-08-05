import { skills } from "@/content/skills";
import { resolveTranslation } from "./shared";
import type { Locale, ResolvedSkill } from "@/types/content";

export function listSkills(locale: Locale): ResolvedSkill[] {
  return [...skills]
    .sort((a, b) => a.order - b.order)
    .map((skill) => resolveTranslation(skill, locale) as ResolvedSkill);
}

/** Groups the already-ordered skill list by domain, preserving each
 *  domain's first-appearance order (driven by Skill.order in the content
 *  data, not alphabetically) — both SkillsPreview (homepage) and the
 *  Skills page render from this so the category order can never drift
 *  between the two surfaces. */
export function groupSkillsByDomain(
  skillList: ResolvedSkill[]
): { domain: ResolvedSkill["domain"]; skills: ResolvedSkill[] }[] {
  const groups: { domain: ResolvedSkill["domain"]; skills: ResolvedSkill[] }[] =
    [];
  for (const skill of skillList) {
    const existing = groups.find((g) => g.domain === skill.domain);
    if (existing) {
      existing.skills.push(skill);
    } else {
      groups.push({ domain: skill.domain, skills: [skill] });
    }
  }
  return groups;
}
