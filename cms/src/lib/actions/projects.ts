"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getProjectById, isSlugTaken } from "@/lib/queries/projects";
import { SUPPORTED_LOCALES } from "@/lib/queries/shared";
import { extractYoutubeVideoId } from "@/lib/media/youtube";
import {
  missingLocalesFor,
  describeLocales,
  resolveWorkflowTransition,
  type WorkflowAction,
} from "@/lib/content-workflow";
import {
  projectInputSchema,
  type ProjectInput,
  type ProjectTranslationInput,
} from "@/lib/validation/project.schema";
import type { ContentStatus, Locale } from "@/lib/validation/shared";

export type ProjectFormState = {
  /** Field-path -> messages, e.g. "slug" or "translations.en.title". Read
   *  by ProjectForm to show inline errors next to the right field. */
  errors: Record<string, string[]>;
  /** A single top-level message for errors that aren't tied to one
   *  field (failed save, database error, duplicate slug at the DB
   *  level, etc.) — section 17: understandable to a human, never a raw
   *  Prisma error. */
  formError?: string;
} | null;

const REQUIRED_TRANSLATION_FIELDS = [
  "title",
  "shortDescription",
  "description",
  "category",
] as const;

/**
 * Reads one locale's translation fields out of the submitted FormData
 * and classifies it as: not attempted (every field blank — fine for a
 * Draft), complete (ready to validate), or partial (started but missing
 * a required field — a human-facing error, not a silent drop, per
 * section 4's "make the missing translation clearly visible").
 */
function readTranslationFromForm(
  formData: FormData,
  locale: Locale
):
  | { kind: "empty" }
  | { kind: "partial"; missing: string[] }
  | {
      kind: "complete";
      value: ProjectTranslationInput;
    } {
  const get = (field: string) =>
    (formData.get(`${locale}_${field}`) as string | null)?.trim() ?? "";

  const values = Object.fromEntries(
    REQUIRED_TRANSLATION_FIELDS.map((field) => [field, get(field)])
  );
  const filled = REQUIRED_TRANSLATION_FIELDS.filter((field) => values[field]);

  if (filled.length === 0) return { kind: "empty" };
  if (filled.length < REQUIRED_TRANSLATION_FIELDS.length) {
    return {
      kind: "partial",
      missing: REQUIRED_TRANSLATION_FIELDS.filter((field) => !values[field]),
    };
  }

  let tags: string[] = [];
  try {
    const raw = formData.get(`${locale}_tagsJson`);
    tags = raw ? JSON.parse(raw as string) : [];
  } catch {
    tags = [];
  }

  let featureHighlights: ProjectTranslationInput["featureHighlights"] = [];
  try {
    const raw = formData.get(`${locale}_featureHighlightsJson`);
    featureHighlights = raw ? JSON.parse(raw as string) : [];
  } catch {
    featureHighlights = [];
  }

  return {
    kind: "complete",
    value: {
      locale,
      title: values.title,
      shortDescription: values.shortDescription,
      description: values.description,
      category: values.category as ProjectTranslationInput["category"],
      tags,
      seoTitle: get("seoTitle") || undefined,
      seoDescription: get("seoDescription") || undefined,
      // Task 06.1: narrative fields — optional, so `undefined` (not "")
      // when blank, same convention as seoTitle/seoDescription above.
      problem: get("problem") || undefined,
      solution: get("solution") || undefined,
      lessonsLearned: get("lessonsLearned") || undefined,
      targetAudience: get("targetAudience") || undefined,
      myRole: get("myRole") || undefined,
      featureHighlights,
    },
  };
}

function readJsonArray(formData: FormData, field: string): unknown[] {
  const raw = formData.get(field);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Task 06.3: re-derives `youtubeVideoId` for every YOUTUBE_VIDEO gallery
 * item from its `youtubeUrl` rather than trusting whatever the client
 * submitted for that field — see projectGalleryYoutubeItemInputSchema's
 * comment (project.schema.ts) for why. Runs before the Zod schema so a
 * URL that no longer resolves to a valid id fails the schema's own
 * pattern check with the normal field-error path, instead of a special
 * case here. Non-YOUTUBE_VIDEO entries pass through unchanged; anything
 * that isn't a plain object is left as-is so the schema reports its own
 * "not an object" error rather than this function throwing.
 */
function reconcileYoutubeGalleryItems(gallery: unknown[]): unknown[] {
  return gallery.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      (item as { type?: unknown }).type !== "YOUTUBE_VIDEO"
    ) {
      return item;
    }
    const youtubeUrl = (item as { youtubeUrl?: unknown }).youtubeUrl;
    const videoId =
      typeof youtubeUrl === "string" ? extractYoutubeVideoId(youtubeUrl) : null;
    return { ...item, youtubeVideoId: videoId ?? "" };
  });
}

/**
 * Builds the raw candidate object for `projectInputSchema` and collects
 * translation-completeness problems the base schema can't express
 * (partial translations, publish-readiness) as pre-formed field errors.
 *
 * Task 07: `status` is no longer read from the submitted form at all —
 * it used to be a free-form `<select>`, which meant an ordinary Save
 * could silently change (and even publish) content (see section 1).
 * The caller now passes the *locked* status this Save is allowed to
 * write — `"DRAFT"` for a new Project, or the Project's own current
 * status for an edit — so Save can never change status; only the
 * explicit publish/unpublish/archive/restore actions below can. The
 * "Published content needs both translations" check is kept exactly as
 * it was, just re-anchored to that locked status instead of a
 * client-supplied one, so editing an already-Published Project down to
 * one translation still surfaces a clear error instead of silently
 * leaving it incomplete.
 */
function parseProjectForm(
  formData: FormData,
  currentStatus: ContentStatus
): {
  candidate: unknown;
  extraErrors: Record<string, string[]>;
} {
  const extraErrors: Record<string, string[]> = {};

  const translations: ProjectTranslationInput[] = [];
  for (const locale of SUPPORTED_LOCALES) {
    const result = readTranslationFromForm(formData, locale);
    if (result.kind === "complete") {
      translations.push(result.value);
    } else if (result.kind === "partial") {
      extraErrors[`translations.${locale}`] = [
        `The ${locale.toUpperCase()} translation is incomplete — finish it or clear all of its fields to leave it out entirely.`,
      ];
    }
  }

  if (translations.length === 0) {
    extraErrors.translations = [
      "At least one translation (English or Persian) is required, even for a Draft.",
    ];
  } else if (
    currentStatus === "PUBLISHED" &&
    translations.length < SUPPORTED_LOCALES.length
  ) {
    extraErrors.translations = [
      "This project is Published and requires both English and Persian translations — finish the missing one, or move it back to Draft first.",
    ];
  }

  const releaseYearRaw = (formData.get("releaseYear") as string)?.trim();

  const candidate = {
    slug: (formData.get("slug") as string)?.trim() ?? "",
    status: currentStatus,
    featured: formData.get("featured") === "on",
    technologies: readJsonArray(formData, "technologiesJson"),
    platforms: readJsonArray(formData, "platformsJson"),
    releaseYear: releaseYearRaw || undefined,
    startDate: (formData.get("startDate") as string) || undefined,
    endDate: (formData.get("endDate") as string) || undefined,
    order: (formData.get("order") as string)?.trim() || 0,
    relatedProjectIds: readJsonArray(formData, "relatedProjectIdsJson"),
    relatedArticleIds: readJsonArray(formData, "relatedArticleIdsJson"),
    experienceId: (formData.get("experienceId") as string)?.trim() || undefined,
    logoMediaId: (formData.get("logoMediaId") as string) || undefined,
    coverMediaId: (formData.get("coverMediaId") as string) || undefined,
    links: readJsonArray(formData, "linksJson"),
    gallery: reconcileYoutubeGalleryItems(
      readJsonArray(formData, "galleryJson")
    ),
    team: readJsonArray(formData, "teamJson"),
    translations,
  };

  return { candidate, extraErrors };
}

function zodErrorsToFieldMap(
  error: import("zod").ZodError
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    map[key] = [...(map[key] ?? []), issue.message];
  }
  return map;
}

/** Human-readable translation of the one Prisma error shape this form
 *  can realistically hit at the DB layer (unique constraint on slug) —
 *  every other Prisma error surfaces as a generic message. Section 17:
 *  never expose a raw Prisma error to the user. */
function toHumanDatabaseError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  ) {
    return "That slug is already in use by another project.";
  }
  return "Something went wrong saving this project. Please try again.";
}

/** Transaction-scoped client type, derived from the `prisma` singleton
 *  itself (see lib/db.ts: only that file imports `@prisma/client`
 *  directly — every other module, including this one, stays on the
 *  singleton and its inferred types). */
type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

async function writeProjectRelations(
  tx: TransactionClient,
  projectId: string,
  data: ProjectInput
) {
  await tx.projectTranslation.deleteMany({ where: { projectId } });
  if (data.translations.length > 0) {
    await tx.projectTranslation.createMany({
      data: data.translations.map((t) => ({ projectId, ...t })),
    });
  }

  await tx.projectLink.deleteMany({ where: { projectId } });
  if (data.links.length > 0) {
    await tx.projectLink.createMany({
      data: data.links.map((link, order) => ({ projectId, order, ...link })),
    });
  }

  // Task 06.3: a gallery row is either a MEDIA reference (unchanged
  // behavior) or a YOUTUBE_VIDEO external reference — see
  // ProjectMedia's schema.prisma comment. `mediaId`/`youtube*` are set
  // mutually exclusively per row based on the discriminated union's
  // `type`.
  await tx.projectMedia.deleteMany({ where: { projectId } });
  if (data.gallery.length > 0) {
    await tx.projectMedia.createMany({
      data: data.gallery.map((item, order) =>
        item.type === "YOUTUBE_VIDEO"
          ? {
              projectId,
              type: "YOUTUBE_VIDEO" as const,
              youtubeVideoId: item.youtubeVideoId,
              youtubeUrl: item.youtubeUrl,
              youtubeTitle: item.youtubeTitle,
              youtubeThumbnailUrl: item.youtubeThumbnailUrl ?? null,
              order,
            }
          : {
              projectId,
              type: "MEDIA" as const,
              mediaId: item.mediaId,
              order,
            }
      ),
    });
  }

  // Task 06.1: Team members + their links. Nested writes (not
  // createMany) because each member needs its own id before its links
  // can reference it — createMany can't express that one-to-many shape
  // in a single call the way it can for the flat link/gallery lists
  // above.
  await tx.projectTeamMember.deleteMany({ where: { projectId } });
  for (const [order, member] of data.team.entries()) {
    await tx.projectTeamMember.create({
      data: {
        projectId,
        name: member.name,
        order,
        links: {
          create: member.links.map((link, linkOrder) => ({
            label: link.label,
            url: link.url,
            order: linkOrder,
          })),
        },
      },
    });
  }
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const { candidate, extraErrors } = parseProjectForm(formData, "DRAFT");
  const parsed = projectInputSchema.safeParse(candidate);

  if (!parsed.success || Object.keys(extraErrors).length > 0) {
    return {
      errors: {
        ...extraErrors,
        ...(parsed.success ? {} : zodErrorsToFieldMap(parsed.error)),
      },
    };
  }

  const data = parsed.data;

  if (await isSlugTaken(data.slug)) {
    return {
      errors: { slug: ["That slug is already in use by another project."] },
    };
  }

  let projectId: string;
  try {
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          slug: data.slug,
          status: data.status,
          featured: data.featured,
          technologies: data.technologies,
          platforms: data.platforms,
          releaseYear: data.releaseYear ?? null,
          startDate: data.startDate,
          endDate: data.endDate,
          order: data.order,
          relatedProjectIds: data.relatedProjectIds,
          relatedArticleIds: data.relatedArticleIds,
          experienceId: data.experienceId || null,
          logoMediaId: data.logoMediaId || null,
          coverMediaId: data.coverMediaId || null,
        },
      });
      await writeProjectRelations(tx, created.id, data);
      return created;
    });
    projectId = project.id;
  } catch (error) {
    return { errors: {}, formError: toHumanDatabaseError(error) };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  redirect(`/admin/projects/${projectId}?success=created`);
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const existing = await getProjectById(id);
  if (!existing) {
    return { errors: {}, formError: "This project no longer exists." };
  }

  const { candidate, extraErrors } = parseProjectForm(
    formData,
    existing.status
  );
  const parsed = projectInputSchema.safeParse(candidate);

  if (!parsed.success || Object.keys(extraErrors).length > 0) {
    return {
      errors: {
        ...extraErrors,
        ...(parsed.success ? {} : zodErrorsToFieldMap(parsed.error)),
      },
    };
  }

  const data = parsed.data;

  if (await isSlugTaken(data.slug, id)) {
    return {
      errors: { slug: ["That slug is already in use by another project."] },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id },
        data: {
          slug: data.slug,
          status: data.status,
          featured: data.featured,
          technologies: data.technologies,
          platforms: data.platforms,
          releaseYear: data.releaseYear ?? null,
          startDate: data.startDate ?? null,
          endDate: data.endDate ?? null,
          order: data.order,
          relatedProjectIds: data.relatedProjectIds,
          relatedArticleIds: data.relatedArticleIds,
          experienceId: data.experienceId || null,
          logoMediaId: data.logoMediaId || null,
          coverMediaId: data.coverMediaId || null,
        },
      });
      await writeProjectRelations(tx, id, data);
    });
  } catch (error) {
    return { errors: {}, formError: toHumanDatabaseError(error) };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/projects/${id}?success=updated`);
}

/**
 * Deletion (section 14). Relies on the schema's own cascade rules
 * (ProjectTranslation, ProjectLink, ProjectMedia all `onDelete:
 * Cascade` from Project) to clean up dependent rows — this action
 * doesn't need to (and must not) touch the referenced Media records
 * themselves, since those may be reused by other Projects.
 *
 * Not bound to a `<form action>` — called directly from
 * DeleteProjectButton after a client-side confirmation, since the
 * confirmation dialog itself has to run on the client.
 */
export async function deleteProject(id: string): Promise<{ error?: string }> {
  try {
    await prisma.project.delete({ where: { id } });
  } catch {
    return { error: "Couldn't delete this project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  return {};
}

// ---------------------------------------------------------------------------
// Task 07: explicit Draft/Preview/Publish workflow actions.
//
// Each is a standalone server action — not bound to `<form action>`, same
// pattern as `deleteProject` above — called directly by WorkflowActionBar
// after its own client-side confirmation (section 12). None of these ever
// touch content fields; they only move `status` (and, for publish, backfill
// `publishedAt` the first time) through the transitions
// `resolveWorkflowTransition` allows.
// ---------------------------------------------------------------------------

async function transitionProjectStatus(
  id: string,
  action: WorkflowAction
): Promise<{ error?: string }> {
  const existing = await getProjectById(id);
  if (!existing) {
    return { error: "This project no longer exists." };
  }

  const resolved = resolveWorkflowTransition(action, existing.status);
  if (!resolved.ok) {
    return { error: resolved.error };
  }

  if (action === "publish") {
    const missing = missingLocalesFor(existing.translations);
    if (missing.length > 0) {
      return {
        error: `Add a ${describeLocales(missing)} translation before publishing — Published projects need both languages.`,
      };
    }
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        status: resolved.nextStatus,
        // Section 16: set publishedAt only the first time this Project
        // is published — never overwritten by a later edit, and never
        // reset by an unpublish → re-publish cycle, since `existing`
        // is re-read fresh on every call.
        ...(action === "publish" && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    });
  } catch {
    return { error: `Couldn't ${action} this project. Please try again.` };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath(`/admin/projects/${id}/preview`);
  revalidatePath("/admin");
  return {};
}

export async function publishProject(id: string): Promise<{ error?: string }> {
  return transitionProjectStatus(id, "publish");
}

export async function unpublishProject(
  id: string
): Promise<{ error?: string }> {
  return transitionProjectStatus(id, "unpublish");
}

export async function archiveProject(id: string): Promise<{ error?: string }> {
  return transitionProjectStatus(id, "archive");
}

export async function restoreProject(id: string): Promise<{ error?: string }> {
  return transitionProjectStatus(id, "restore");
}
