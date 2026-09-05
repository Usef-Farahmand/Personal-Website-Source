import { teamMembers } from "@/content/team";
import { resolveTranslation } from "./shared";
import type {
  ExternalLink,
  Locale,
  ResolvedTeamMember,
} from "@/types/content";

/** Looks up one team member by id and resolves their name/role for the
 *  given locale. Returns `undefined` (never throws) on a miss — callers
 *  decide whether that's a hard error (content authoring should catch
 *  it during development, per getTeamMembersByIds' warning below) or
 *  something to render around. */
export function getTeamMemberById(
  id: string,
  locale: Locale
): ResolvedTeamMember | undefined {
  const member = teamMembers.find((candidate) => candidate.id === id);
  return member
    ? (resolveTranslation(member, locale) as ResolvedTeamMember)
    : undefined;
}

/**
 * Resolves Project.team's id list into full, locale-resolved TeamMember
 * records, in the order authored, the same "silently skip a dangling id
 * rather than crash the page" contract as projects.service.ts's
 * getProjectsByIds. An id with no match is dropped and logged in
 * development, so a typo in a project's `team` array is easy to spot
 * locally instead of quietly disappearing a collaborator from the page
 * in production.
 */
export function getTeamMembersByIds(
  ids: string[],
  locale: Locale
): ResolvedTeamMember[] {
  return ids
    .map((id) => {
      const member = getTeamMemberById(id, locale);
      if (!member && process.env.NODE_ENV !== "production") {
        console.warn(
          `[content/team] No team member found for id "${id}". Skipping — check content/team/team.json and whatever referenced this id.`
        );
      }
      return member;
    })
    .filter((member): member is ResolvedTeamMember => Boolean(member));
}

/** Best-effort match of a team member's open-ended `links` list by
 *  keyword in the label — same "keyword, not a closed platform enum"
 *  convention as ExternalLinksList's iconForLabel. Used by
 *  recommendations.service.ts to pull a specific LinkedIn/website URL
 *  out of a person's links when resolving a personId-referencing
 *  recommendation into the {linkedin, website} shape RecommendationCard/
 *  RecommendationModal already expect. */
export function findLinkByKeyword(
  links: ExternalLink[] | undefined,
  keyword: string
): string | undefined {
  return links?.find((link) => link.label.toLowerCase().includes(keyword))
    ?.url;
}
