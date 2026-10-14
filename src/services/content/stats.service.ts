import { getSiteContent } from "./site.service";
import { listProjects } from "./projects.service";
import { listArticles } from "./articles.service";
import type { Locale } from "@/types/content";

export interface ProfileStats {
  experienceYears: number;
  projects: number;
  articles: number;
}

/**
 * The headline numbers shown on the homepage hero and the About page.
 * Projects/articles are counts of the very lists /projects and /articles
 * render, so they change whenever that content does — never hand-typed.
 */
export function getProfileStats(locale: Locale): ProfileStats {
  return {
    experienceYears: getSiteContent(locale).experienceYears,
    projects: listProjects(locale).length,
    articles: listArticles(locale).length,
  };
}
