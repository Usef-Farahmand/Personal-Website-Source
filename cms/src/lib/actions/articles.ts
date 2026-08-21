"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getArticleById, isArticleSlugTaken } from "@/lib/queries/articles";
import { SUPPORTED_LOCALES } from "@/lib/queries/shared";
import {
  articleInputSchema,
  type ArticleTranslationInput,
} from "@/lib/validation/article.schema";
import type { Locale } from "@/lib/validation/shared";

export type ArticleFormState = {
  /** Field-path -> messages, e.g. "slug" or "translations.en". Read by
   *  ArticleForm to show inline errors next to the right field. */
  errors: Record<string, string[]>;
  /** A single top-level message for errors that aren't tied to one
   *  field (failed save, database error, etc.) — section 15: never a
   *  raw Prisma error. */
  formError?: string;
} | null;

const REQUIRED_TRANSLATION_FIELDS = ["title", "summary", "category"] as const;

/**
 * Reads one locale's translation fields out of the submitted FormData
 * and classifies it as: not attempted (every field blank — fine for a
 * Draft), complete (ready to validate), or partial (started but missing
 * a required field — a human-facing error, not a silent drop, per
 * section 4's "the missing translation must be visible").
 */
function readTranslationFromForm(
  formData: FormData,
  locale: Locale
):
  | { kind: "empty" }
  | { kind: "partial" }
  | { kind: "complete"; value: ArticleTranslationInput } {
  const get = (field: string) =>
    (formData.get(`${locale}_${field}`) as string | null)?.trim() ?? "";

  const values = Object.fromEntries(
    REQUIRED_TRANSLATION_FIELDS.map((field) => [field, get(field)])
  );
  const filled = REQUIRED_TRANSLATION_FIELDS.filter((field) => values[field]);

  if (filled.length === 0) return { kind: "empty" };
  if (filled.length < REQUIRED_TRANSLATION_FIELDS.length) {
    return { kind: "partial" };
  }

  let tags: string[] = [];
  try {
    const raw = formData.get(`${locale}_tagsJson`);
    tags = raw ? JSON.parse(raw as string) : [];
  } catch {
    tags = [];
  }

  return {
    kind: "complete",
    value: {
      locale,
      title: values.title,
      summary: values.summary,
      category: values.category as ArticleTranslationInput["category"],
      tags,
      seoTitle: get("seoTitle") || undefined,
      seoDescription: get("seoDescription") || undefined,
    },
  };
}

/**
 * Builds the raw candidate object for `articleInputSchema` and collects
 * translation-completeness problems the base schema can't express
 * (partial translations, publish-readiness) as pre-formed field errors.
 */
function parseArticleForm(formData: FormData): {
  candidate: unknown;
  extraErrors: Record<string, string[]>;
} {
  const extraErrors: Record<string, string[]> = {};

  const translations: ArticleTranslationInput[] = [];
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

  const status = formData.get("status");

  if (translations.length === 0) {
    extraErrors.translations = [
      "At least one translation (English or Persian) is required, even for a Draft.",
    ];
  } else if (
    status === "PUBLISHED" &&
    translations.length < SUPPORTED_LOCALES.length
  ) {
    extraErrors.status = [
      "Both English and Persian translations are required before publishing. Save as Draft until both are complete.",
    ];
  }

  const readingTimeRaw = (formData.get("readingTimeMinutes") as string) || "";

  const candidate = {
    slug: (formData.get("slug") as string)?.trim() ?? "",
    status: (status as string) ?? "DRAFT",
    featured: formData.get("featured") === "on",
    sourceUrl: (formData.get("sourceUrl") as string)?.trim() ?? "",
    sourcePlatform: (formData.get("sourcePlatform") as string) ?? "OTHER",
    readingTimeMinutes: readingTimeRaw || undefined,
    publishedAt: (formData.get("publishedAt") as string) || undefined,
    headerMediaId: (formData.get("headerMediaId") as string) || undefined,
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
 *  every other Prisma error surfaces as a generic message. Section 15:
 *  never expose a raw Prisma error to the user. */
function toHumanDatabaseError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  ) {
    return "That slug is already in use by another article.";
  }
  return "Something went wrong saving this article. Please try again.";
}

/** Transaction-scoped client type, derived from the `prisma` singleton
 *  itself — see lib/actions/projects.ts's identical helper for why. */
type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

async function writeArticleTranslations(
  tx: TransactionClient,
  articleId: string,
  translations: ArticleTranslationInput[]
) {
  await tx.articleTranslation.deleteMany({ where: { articleId } });
  if (translations.length > 0) {
    await tx.articleTranslation.createMany({
      data: translations.map((t) => ({ articleId, ...t })),
    });
  }
}

export async function createArticle(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const { candidate, extraErrors } = parseArticleForm(formData);
  const parsed = articleInputSchema.safeParse(candidate);

  if (!parsed.success || Object.keys(extraErrors).length > 0) {
    return {
      errors: {
        ...extraErrors,
        ...(parsed.success ? {} : zodErrorsToFieldMap(parsed.error)),
      },
    };
  }

  const data = parsed.data;

  if (await isArticleSlugTaken(data.slug)) {
    return {
      errors: { slug: ["That slug is already in use by another article."] },
    };
  }

  let articleId: string;
  try {
    const article = await prisma.$transaction(async (tx) => {
      const created = await tx.article.create({
        data: {
          slug: data.slug,
          status: data.status,
          featured: data.featured,
          sourceUrl: data.sourceUrl,
          sourcePlatform: data.sourcePlatform,
          readingTimeMinutes: data.readingTimeMinutes,
          publishedAt: data.publishedAt,
          headerMediaId: data.headerMediaId || null,
        },
      });
      await writeArticleTranslations(tx, created.id, data.translations);
      return created;
    });
    articleId = article.id;
  } catch (error) {
    return { errors: {}, formError: toHumanDatabaseError(error) };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  redirect(`/admin/articles/${articleId}?success=created`);
}

export async function updateArticle(
  id: string,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const existing = await getArticleById(id);
  if (!existing) {
    return { errors: {}, formError: "This article no longer exists." };
  }

  const { candidate, extraErrors } = parseArticleForm(formData);
  const parsed = articleInputSchema.safeParse(candidate);

  if (!parsed.success || Object.keys(extraErrors).length > 0) {
    return {
      errors: {
        ...extraErrors,
        ...(parsed.success ? {} : zodErrorsToFieldMap(parsed.error)),
      },
    };
  }

  const data = parsed.data;

  if (await isArticleSlugTaken(data.slug, id)) {
    return {
      errors: { slug: ["That slug is already in use by another article."] },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.article.update({
        where: { id },
        data: {
          slug: data.slug,
          status: data.status,
          featured: data.featured,
          sourceUrl: data.sourceUrl,
          sourcePlatform: data.sourcePlatform,
          readingTimeMinutes: data.readingTimeMinutes ?? null,
          publishedAt: data.publishedAt ?? null,
          headerMediaId: data.headerMediaId || null,
        },
      });
      await writeArticleTranslations(tx, id, data.translations);
    });
  } catch (error) {
    return { errors: {}, formError: toHumanDatabaseError(error) };
  }

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/admin");
  redirect(`/admin/articles/${id}?success=updated`);
}

/**
 * Deletion (section 13). Relies on the schema's own cascade rule
 * (ArticleTranslation `onDelete: Cascade` from Article) to clean up
 * dependent rows — this action doesn't need to (and must not) touch
 * the referenced header Media, since it may be reused elsewhere.
 *
 * Not bound to a `<form action>` — called directly from
 * DeleteArticleButton after a client-side confirmation, since the
 * confirmation dialog itself has to run on the client.
 */
export async function deleteArticle(id: string): Promise<{ error?: string }> {
  try {
    await prisma.article.delete({ where: { id } });
  } catch {
    return { error: "Couldn't delete this article. Please try again." };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  return {};
}
