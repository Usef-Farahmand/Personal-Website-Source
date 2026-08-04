import recommendationsData from "./recommendations.json";
import type { Recommendation } from "@/content/types";

/**
 * Recommendations now live in recommendations.json (moved from a typed
 * .ts literal per the data-driven architecture requirement), so this
 * cast is the one place that stands in for compile-time type-checking on
 * the content itself — JSON has no way to enforce the Recommendation
 * shape at authoring time the way a .ts file could. Adding real runtime
 * validation (e.g. a Zod schema) here would be the natural next step
 * once this file is fed by an actual CMS export rather than hand-edited;
 * not added now since nothing today produces malformed entries to guard
 * against, and adding it speculatively would be exactly the kind of
 * unnecessary abstraction this task's Code Quality section warns against.
 */
export const recommendations = recommendationsData as Recommendation[];
