/**
 * Task 07: the Draft → Preview → Publish workflow's shared rules,
 * usable by both lib/actions/projects.ts and lib/actions/articles.ts
 * (and their respective forms) without duplicating the state machine
 * or the "which locales are missing" logic twice.
 *
 * No Prisma/Node-only imports here on purpose — this stays a plain,
 * synchronous module so it can be imported from client components too
 * (e.g. WorkflowActionBar building a confirmation message) as well as
 * from server actions.
 */

import { SUPPORTED_LOCALES } from "@/lib/queries/shared";
import type { ContentStatus, Locale } from "@/lib/validation/shared";

export type WorkflowAction = "publish" | "unpublish" | "archive" | "restore";

/**
 * The only status transitions the CMS exposes (section 24's contextual
 * action lists, restated as data): Draft ⇄ Published via publish/
 * unpublish, Draft/Published → Archived via archive, and Archived →
 * Draft via restore. There is no Archived → Published shortcut — restore
 * to Draft first, then publish — which is what keeps this a 2-step
 * state machine instead of a fuller workflow graph (section 14: "do not
 * create a complicated workflow").
 */
const ALLOWED_TRANSITIONS: Record<
  WorkflowAction,
  { from: ContentStatus[]; to: ContentStatus }
> = {
  publish: { from: ["DRAFT"], to: "PUBLISHED" },
  unpublish: { from: ["PUBLISHED"], to: "DRAFT" },
  archive: { from: ["DRAFT", "PUBLISHED"], to: "ARCHIVED" },
  restore: { from: ["ARCHIVED"], to: "DRAFT" },
};

const ACTION_VERB: Record<WorkflowAction, string> = {
  publish: "publish",
  unpublish: "unpublish",
  archive: "archive",
  restore: "restore",
};

/**
 * Checks whether `action` is legal from `currentStatus` and, if so,
 * what status it lands on. The UI (WorkflowActionBar) already only
 * offers actions valid for the current status, so hitting the `ok:
 * false` branch server-side means either a stale page (someone else —
 * well, this is single-user, so more likely a second open tab —
 * changed the status first) or a direct/replayed action call. Either
 * way this is the single place that enforces it, so the server action
 * never trusts "the button was visible" as proof the transition is
 * still valid.
 */
export function resolveWorkflowTransition(
  action: WorkflowAction,
  currentStatus: ContentStatus
): { ok: true; nextStatus: ContentStatus } | { ok: false; error: string } {
  const rule = ALLOWED_TRANSITIONS[action];
  if (!rule.from.includes(currentStatus)) {
    return {
      ok: false,
      error: `Can't ${ACTION_VERB[action]} this — it's currently ${currentStatus.toLowerCase()}, not ${rule.from
        .map((status) => status.toLowerCase())
        .join(" or ")}. The page may be out of date — try reloading.`,
    };
  }
  return { ok: true, nextStatus: rule.to };
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fa: "Persian",
};

/**
 * Section 13's publish check: which of the CMS's supported locales
 * don't have a translation row yet. A persisted translation row is
 * already guaranteed "complete" (every required field filled) by
 * readTranslationFromForm in the actions layer — a partial translation
 * is never saved as a row at all — so "locale present" and "locale
 * complete" are the same question here.
 */
export function missingLocalesFor(
  translations: { locale: Locale }[]
): Locale[] {
  const present = new Set(
    translations.map((translation) => translation.locale)
  );
  return SUPPORTED_LOCALES.filter((locale) => !present.has(locale));
}

/** "English", "English and Persian" — for error/confirmation copy. */
export function describeLocales(locales: Locale[]): string {
  return locales.map((locale) => LOCALE_LABELS[locale]).join(" and ");
}
