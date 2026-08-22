"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/lib/actions/projects";
import { PROJECT_CATEGORIES } from "@/lib/validation/shared";
import type { ProjectDetail, MediaOption } from "@/lib/queries/projects";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import TagListInput from "./project-form/TagListInput";
import PlatformsPicker from "./project-form/PlatformsPicker";
import LinksEditor from "./project-form/LinksEditor";
import MediaPicker from "./project-form/MediaPicker";
import GalleryEditor from "./project-form/GalleryEditor";
import TeamEditor from "./project-form/TeamEditor";
import FeatureHighlightsEditor from "./project-form/FeatureHighlightsEditor";
import DeleteProjectButton from "./DeleteProjectButton";

const STATUS_OPTIONS: {
  value: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  label: string;
}[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function fieldLabelFromPath(path: string): string {
  const labels: Record<string, string> = {
    slug: "Slug",
    status: "Status",
    endDate: "End date",
    startDate: "Start date",
    translations: "Translations",
    "translations.en": "English translation",
    "translations.fa": "Persian translation",
    technologies: "Technologies",
    platforms: "Platforms",
    links: "Links",
    gallery: "Gallery",
    team: "Team",
    releaseYear: "Release year",
    order: "Order",
    relatedProjectIds: "Related project IDs",
    relatedArticleIds: "Related article IDs",
    experienceId: "Experience ID",
    form: "Form",
  };
  return labels[path] ?? path;
}

const initialFormState: ProjectFormState = null;

export default function ProjectForm({
  mode,
  project,
  mediaOptions,
}: {
  mode: "create" | "edit";
  project?: NonNullable<ProjectDetail>;
  mediaOptions: MediaOption[];
}) {
  const action =
    mode === "create" ? createProject : updateProject.bind(null, project!.id);
  const [state, formAction, isPending] = useActionState<
    ProjectFormState,
    FormData
  >(action, initialFormState);

  const translationFor = (locale: "en" | "fa") =>
    project?.translations.find((t) => t.locale === locale);
  const enTranslation = translationFor("en");
  const faTranslation = translationFor("fa");

  const [enTitle, setEnTitle] = useState(enTranslation?.title ?? "");
  const [faTitle, setFaTitle] = useState(faTranslation?.title ?? "");

  const formRef = useRef<HTMLFormElement>(null);
  const isDirtyRef = useRef(false);
  useUnsavedChangesWarning(() => isDirtyRef.current);

  const errors = state?.errors ?? {};
  const errorEntries = Object.entries(errors);

  return (
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
              defaultValue={project?.slug ?? ""}
              placeholder="my-project"
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={project?.status ?? "DRAFT"}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Start date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={toDateInputValue(project?.startDate)}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              End date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={toDateInputValue(project?.endDate)}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="releaseYear"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Release year
            </label>
            <input
              id="releaseYear"
              name="releaseYear"
              type="number"
              defaultValue={project?.releaseYear ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

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
              defaultValue={project?.order ?? 0}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="experienceId"
              className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Experience ID
            </label>
            <input
              id="experienceId"
              name="experienceId"
              type="text"
              defaultValue={project?.experienceId ?? ""}
              placeholder="exp-example"
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              External reference — Experience isn&apos;t managed in this CMS
              yet.
            </p>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured ?? false}
            className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700"
          />
          Featured
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TagListInput
            name="relatedProjectIdsJson"
            label="Related project IDs"
            initialValues={
              (project?.relatedProjectIds as string[] | undefined) ?? []
            }
            placeholder="prj-example"
          />
          <TagListInput
            name="relatedArticleIdsJson"
            label="Related article IDs"
            initialValues={
              (project?.relatedArticleIds as string[] | undefined) ?? []
            }
            placeholder="art-example"
          />
        </div>
      </section>

      {/* Team */}
      <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
        <TeamEditor
          name="teamJson"
          initialValues={
            project?.team.map((member) => ({
              name: member.name,
              links: member.links.map((link) => ({
                label: link.label,
                url: link.url,
              })),
            })) ?? []
          }
        />
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

      {/* Technologies & Platforms */}
      <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Technologies &amp; Platforms
        </h2>
        <div className="mt-4 space-y-4">
          <TagListInput
            name="technologiesJson"
            label="Technologies"
            initialValues={
              (project?.technologies as string[] | undefined) ?? []
            }
            placeholder="Next.js"
          />
          <PlatformsPicker
            name="platformsJson"
            initialValues={(project?.platforms as string[] | undefined) ?? []}
          />
        </div>
      </section>

      {/* Links */}
      <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
        <LinksEditor
          name="linksJson"
          initialValues={
            project?.links.map((link) => ({
              type: link.type as
                | "WEBSITE"
                | "REPOSITORY"
                | "PLAYABLE"
                | "DOWNLOAD"
                | "APP_STORE"
                | "GOOGLE_PLAY"
                | "OTHER",
              label: link.label,
              url: link.url,
            })) ?? []
          }
        />
      </section>

      {/* Media */}
      <section className="rounded-lg border border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Media
        </h2>
        <div className="mt-4 space-y-5">
          <MediaPicker
            name="logoMediaId"
            label="Logo"
            initialMediaId={project?.logoMediaId ?? undefined}
            mediaOptions={mediaOptions}
            allowedTypes={["IMAGE"]}
          />
          <MediaPicker
            name="coverMediaId"
            label="Cover image"
            initialMediaId={project?.coverMediaId ?? undefined}
            mediaOptions={mediaOptions}
            allowedTypes={["IMAGE"]}
          />
          <GalleryEditor
            name="galleryJson"
            initialItems={project?.gallery.map((entry) => entry.media) ?? []}
            mediaOptions={mediaOptions}
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
                ? "Create Project"
                : "Save Changes"}
          </button>
          <Link
            href="/admin/projects"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            Cancel
          </Link>
        </div>

        {mode === "edit" && project ? (
          <DeleteProjectButton
            id={project.id}
            title={enTitle || faTitle || project.slug}
            redirectTo="/admin/projects?success=deleted"
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-950/30"
          />
        ) : null}
      </div>
    </form>
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
  translation: NonNullable<ProjectDetail>["translations"][number] | undefined;
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
          htmlFor={`${prefix}_shortDescription`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Short description
        </label>
        <input
          id={`${prefix}_shortDescription`}
          name={`${prefix}_shortDescription`}
          type="text"
          dir={dir}
          defaultValue={translation?.shortDescription ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}_description`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Description
        </label>
        <textarea
          id={`${prefix}_description`}
          name={`${prefix}_description`}
          dir={dir}
          rows={5}
          defaultValue={translation?.description ?? ""}
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
            {PROJECT_CATEGORIES.map((category) => (
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

      <div>
        <label
          htmlFor={`${prefix}_problem`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Problem
        </label>
        <textarea
          id={`${prefix}_problem`}
          name={`${prefix}_problem`}
          dir={dir}
          rows={3}
          defaultValue={translation?.problem ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}_solution`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Solution
        </label>
        <textarea
          id={`${prefix}_solution`}
          name={`${prefix}_solution`}
          dir={dir}
          rows={3}
          defaultValue={translation?.solution ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}_lessonsLearned`}
          className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          Lessons learned
        </label>
        <textarea
          id={`${prefix}_lessonsLearned`}
          name={`${prefix}_lessonsLearned`}
          dir={dir}
          rows={3}
          defaultValue={translation?.lessonsLearned ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${prefix}_targetAudience`}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Target audience
          </label>
          <input
            id={`${prefix}_targetAudience`}
            name={`${prefix}_targetAudience`}
            type="text"
            dir={dir}
            defaultValue={translation?.targetAudience ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div>
          <label
            htmlFor={`${prefix}_myRole`}
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            My role
          </label>
          <input
            id={`${prefix}_myRole`}
            name={`${prefix}_myRole`}
            type="text"
            dir={dir}
            defaultValue={translation?.myRole ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      <FeatureHighlightsEditor
        name={`${prefix}_featureHighlightsJson`}
        label="Feature highlights"
        dir={dir}
        initialValues={
          (translation?.featureHighlights as
            | { icon: string; title: string; description: string }[]
            | undefined) ?? []
        }
      />

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
