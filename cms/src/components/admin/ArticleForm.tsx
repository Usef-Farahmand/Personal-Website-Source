"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  createArticle,
  updateArticle,
  publishArticle,
  unpublishArticle,
  archiveArticle,
  restoreArticle,
  type ArticleFormState,
} from "@/lib/actions/articles";
import { ARTICLE_CATEGORIES } from "@/lib/validation/shared";
import {
  ARTICLE_SOURCE_PLATFORMS,
  ARTICLE_SOURCE_PLATFORM_LABELS,
} from "@/lib/validation/article.schema";
import type { ArticleDetail } from "@/lib/queries/articles";
import type { MediaOption } from "@/lib/queries/projects";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import TagListInput from "./project-form/TagListInput";
import MediaPicker from "./project-form/MediaPicker";
import DeleteArticleButton from "./DeleteArticleButton";
import WorkflowActionBar from "./WorkflowActionBar";

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function fieldLabelFromPath(path: string): string {
  const labels: Record<string, string> = {
    slug: "Slug",
    sourceUrl: "Source URL",
    sourcePlatform: "Source platform",
    readingTimeMinutes: "Reading time",
    publishedAt: "Publication date",
    order: "Order",
    relatedProjectIds: "Related project IDs",
    relatedArticleIds: "Related article IDs",
    coAuthors: "Co-authors",
    translations: "Translations",
    "translations.en": "English translation",
    "translations.fa": "Persian translation",
    form: "Form",
  };
  return labels[path] ?? path;
}

const initialFormState: ArticleFormState = null;

export default function ArticleForm({
  mode,
  article,
  mediaOptions,
}: {
  mode: "create" | "edit";
  article?: NonNullable<ArticleDetail>;
  mediaOptions: MediaOption[];
}) {
  const action =
    mode === "create" ? createArticle : updateArticle.bind(null, article!.id);
  const [state, formAction, isPending] = useActionState<
    ArticleFormState,
    FormData
  >(action, initialFormState);

  const translationFor = (locale: "en" | "fa") =>
    article?.translations.find((t) => t.locale === locale);
  const enTranslation = translationFor("en");
  const faTranslation = translationFor("fa");

  const [enTitle, setEnTitle] = useState(enTranslation?.title ?? "");
  const [faTitle, setFaTitle] = useState(faTranslation?.title ?? "");

  /** Task 07: reflects saved state, same rationale as ProjectForm's
   *  identical block. */
  const savedLocales = (article?.translations.map((t) => t.locale) ?? []) as (
    "en" | "fa"
  )[];
  const displayTitle =
    article?.translations.find((t) => t.locale === "en")?.title ??
    article?.translations[0]?.title ??
    article?.slug ??
    "";

  const formRef = useRef<HTMLFormElement>(null);
  const isDirtyRef = useRef(false);
  useUnsavedChangesWarning(() => isDirtyRef.current);

  const errors = state?.errors ?? {};
  const errorEntries = Object.entries(errors);

  return (
    <div className="space-y-6">
      {mode === "edit" && article ? (
        <WorkflowActionBar
          id={article.id}
          contentType="article"
          title={displayTitle}
          status={article.status}
          locales={savedLocales}
          publishedAt={article.cmsPublishedAt}
          previewHref={`/admin/articles/${article.id}/preview`}
          onPublish={publishArticle}
          onUnpublish={unpublishArticle}
          onArchive={archiveArticle}
          onRestore={restoreArticle}
        />
      ) : null}

      <form
        ref={formRef}
        action={formAction}
        onChange={() => {
          isDirtyRef.current = true;
        }}
        onSubmit={() => {
          isDirtyRef.current = false;
        }}
        className="space-y-6"
        noValidate
      >
        {state?.formError ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {state.formError}
          </div>
        ) : null}

        {errorEntries.length > 0 ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            <p className="font-medium">Please fix the following:</p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5">
              {errorEntries.map(([path, messages]) =>
                messages.map((message, index) => (
                  <li key={`${path}-${index}`}>
                    <span className="font-medium">
                      {fieldLabelFromPath(path)}:
                    </span>{" "}
                    {message}
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}

        {/* General */}
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            General
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="slug"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                defaultValue={article?.slug ?? ""}
                placeholder="my-article"
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label
                htmlFor="publishedAt"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Publication date
              </label>
              <input
                id="publishedAt"
                name="publishedAt"
                type="date"
                defaultValue={toDateInputValue(article?.publishedAt)}
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={article?.featured ?? false}
              className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700"
            />
            Featured
          </label>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="order"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Order
              </label>
              <input
                id="order"
                name="order"
                type="number"
                defaultValue={article?.order ?? 0}
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <TagListInput
              name="coAuthorsJson"
              label="Co-authors"
              initialValues={(article?.coAuthors as string[] | undefined) ?? []}
              placeholder="Name"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TagListInput
              name="relatedProjectIdsJson"
              label="Related project IDs"
              initialValues={
                (article?.relatedProjectIds as string[] | undefined) ?? []
              }
              placeholder="prj-example"
            />
            <TagListInput
              name="relatedArticleIdsJson"
              label="Related article IDs"
              initialValues={
                (article?.relatedArticleIds as string[] | undefined) ?? []
              }
              placeholder="art-example"
            />
          </div>
        </section>

        {/* English */}
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              English
            </h2>
            <span
              className={
                enTitle.trim()
                  ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-xs font-medium text-neutral-400 dark:text-neutral-600"
              }
            >
              {enTitle.trim() ? "✓ Complete" : "— Missing"}
            </span>
          </div>
          <TranslationFields
            locale="en"
            dir="ltr"
            translation={enTranslation}
            onTitleChange={setEnTitle}
          />
        </section>

        {/* Persian */}
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Persian
            </h2>
            <span
              className={
                faTitle.trim()
                  ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-xs font-medium text-neutral-400 dark:text-neutral-600"
              }
            >
              {faTitle.trim() ? "✓ Complete" : "— Missing"}
            </span>
          </div>
          <TranslationFields
            locale="fa"
            dir="rtl"
            translation={faTranslation}
            onTitleChange={setFaTitle}
          />
        </section>

        {/* Source */}
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Source
          </h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            This article is published externally — the CMS stores its metadata
            and a link to the original, not its content.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="sourceUrl"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Source URL
              </label>
              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                required
                dir="ltr"
                defaultValue={article?.sourceUrl ?? ""}
                placeholder="https://…"
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label
                htmlFor="sourcePlatform"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Source platform
              </label>
              <select
                id="sourcePlatform"
                name="sourcePlatform"
                defaultValue={article?.sourcePlatform ?? "OTHER"}
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              >
                {ARTICLE_SOURCE_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {ARTICLE_SOURCE_PLATFORM_LABELS[platform]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="readingTimeMinutes"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Reading time (minutes)
              </label>
              <input
                id="readingTimeMinutes"
                name="readingTimeMinutes"
                type="number"
                min={1}
                step={1}
                defaultValue={article?.readingTimeMinutes ?? ""}
                placeholder="e.g. 6"
                className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </section>

        {/* Header image */}
        <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Header Image
          </h2>
          <div className="mt-4">
            <MediaPicker
              name="headerMediaId"
              label="Header image"
              initialMediaId={article?.headerMediaId ?? undefined}
              mediaOptions={mediaOptions}
              allowedTypes={["IMAGE"]}
            />
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
            >
              {isPending
                ? "Saving…"
                : mode === "create"
                  ? "Create Article"
                  : "Save Changes"}
            </button>
            <Link
              href="/admin/articles"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Cancel
            </Link>
          </div>

          {mode === "edit" && article ? (
            <DeleteArticleButton
              id={article.id}
              title={enTitle || faTitle || article.slug}
              redirectTo="/admin/articles?success=deleted"
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
            />
          ) : null}
        </div>
      </form>
    </div>
  );
}

function TranslationFields({
  locale,
  dir,
  translation,
  onTitleChange,
}: {
  locale: "en" | "fa";
  dir: "ltr" | "rtl";
  translation: NonNullable<ArticleDetail>["translations"][number] | undefined;
  onTitleChange: (value: string) => void;
}) {
  const prefix = locale;

  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      <div>
        <label
          htmlFor={`${prefix}_title`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Title
        </label>
        <input
          id={`${prefix}_title`}
          name={`${prefix}_title`}
          type="text"
          dir={dir}
          defaultValue={translation?.title ?? ""}
          onChange={(event) => onTitleChange(event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}_summary`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Summary
        </label>
        <textarea
          id={`${prefix}_summary`}
          name={`${prefix}_summary`}
          dir={dir}
          rows={4}
          defaultValue={translation?.summary ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${prefix}_category`}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Category
          </label>
          <select
            id={`${prefix}_category`}
            name={`${prefix}_category`}
            defaultValue={translation?.category ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <option value="">Select a category…</option>
            {ARTICLE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <TagListInput
          name={`${prefix}_tagsJson`}
          label="Tags"
          initialValues={(translation?.tags as string[] | undefined) ?? []}
          dir={dir}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${prefix}_seoTitle`}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            SEO title
          </label>
          <input
            id={`${prefix}_seoTitle`}
            name={`${prefix}_seoTitle`}
            type="text"
            dir={dir}
            defaultValue={translation?.seoTitle ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label
            htmlFor={`${prefix}_seoDescription`}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            SEO description
          </label>
          <input
            id={`${prefix}_seoDescription`}
            name={`${prefix}_seoDescription`}
            type="text"
            dir={dir}
            defaultValue={translation?.seoDescription ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>
    </div>
  );
}
