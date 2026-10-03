import learningData from "./learning.json";
import type { LearningEntry } from "@/types/content";

/**
 * Learning notes live in learning.json — edit that file to add or change
 * entries (see "Learning" in doc/CONTENT_GUIDE_fa.md). JSON can't enforce the
 * LearningEntry shape at authoring time, so learning.schema.json gives
 * editors (VS Code, via .vscode/settings.json) validation and autocomplete,
 * and this cast stands in for compile-time checking, same as
 * recommendations/index.ts. The list is sorted by `date` in the service, so
 * array order doesn't matter.
 */
export const learningEntries = learningData as unknown as LearningEntry[];
