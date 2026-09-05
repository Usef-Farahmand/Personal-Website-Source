import { recommendations } from "@/content/recommendations";
import { resolveTranslation, type ListOptions } from "./shared";
import { findLinkByKeyword, getTeamMemberById } from "./team.service";
import type { Locale, Recommendation, ResolvedRecommendation } from "@/types/content";

/** The {name, avatar, linkedin, website} fields RecommendationCard/
 *  RecommendationModal render, resolved either from the referenced team
 *  member (personId) or from the fields authored directly on the
 *  recommendation. A personId with no matching team member falls back
 *  to whatever was authored directly (or the id itself, as a visibly
 *  broken placeholder rather than a blank name) and logs in
 *  development — the recommendations list still renders, per the
 *  "fail gracefully, don't crash the page" requirement. */
function resolveRecommendationPerson(
  recommendation: Recommendation,
  locale: Locale
): Pick<ResolvedRecommendation, "name" | "avatar" | "linkedin" | "website"> {
  if (recommendation.personId) {
    const member = getTeamMemberById(recommendation.personId, locale);
    if (member) {
      return {
        name: member.name,
        avatar: member.avatarUrl,
        linkedin: findLinkByKeyword(member.links, "linkedin"),
        website:
          findLinkByKeyword(member.links, "website") ??
          findLinkByKeyword(member.links, "portfolio"),
      };
    }
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[recommendations] Recommendation "${recommendation.id}" references unknown team member id "${recommendation.personId}". Check content/team/team.json.`
      );
    }
  }

  return {
    name: recommendation.name ?? recommendation.personId ?? recommendation.id,
    avatar: recommendation.avatar,
    linkedin: recommendation.linkedin,
    website: recommendation.website,
  };
}

export function listRecommendations(
  locale: Locale,
  options?: ListOptions
): ResolvedRecommendation[] {
  const published = [...recommendations]
    .filter((recommendation) => recommendation.published)
    .sort((a, b) => a.order - b.order)
    .map((recommendation) => {
      const resolved = resolveTranslation(
        recommendation,
        locale
      ) as ResolvedRecommendation;
      return {
        ...resolved,
        ...resolveRecommendationPerson(recommendation, locale),
      };
    });
  return options?.limit ? published.slice(0, options.limit) : published;
}
