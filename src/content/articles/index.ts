/** Task 08: see content/projects/index.ts's doc comment — the same
 *  seam and the same reasoning, applied to Article. */
import generatedArticles from "../generated/articles.json";
import type { Article } from "@/types/content";

export const articles = generatedArticles as unknown as Article[];
