import type { ProjectDetail } from "@/lib/queries/projects";
import { PROJECT_LINK_TYPE_LABELS } from "@/lib/validation/project.schema";
import type { Locale } from "@/lib/validation/shared";
import MissingTranslationNotice from "./MissingTranslationNotice";
import { getYoutubeWatchUrl } from "@/lib/media/youtube";

/**
 * Task 07, section 8: everything the Project structure defines,
 * rendered as close to the public site's information hierarchy as a
 * standalone CMS preview reasonably can be without importing the
 * public site's actual components (see the delivery notes for why that
 * cross-app import isn't attempted — this mirrors structure/order, not
 * literal markup). All data comes straight from the Project already
 * loaded by the preview route (getProjectById) — nothing is
 * re-fetched, duplicated, or fabricated here (section 8's "do not
 * create duplicate Project data").
 */
export default function ProjectPreviewContent({
  project,
  locale,
  previewBasePath,
}: {
  project: NonNullable<ProjectDetail>;
  locale: Locale;
  previewBasePath: string;
}) {
  const translation = project.translations.find((t) => t.locale === locale);
  const availableLocales = project.translations.map((t) => t.locale);

  if (!translation) {
    return (
      <MissingTranslationNotice
        locale={locale}
        availableLocales={availableLocales}
        previewBasePath={previewBasePath}
      />
    );
  }

  const technologies = (project.technologies as string[] | null) ?? [];
  const platforms = (project.platforms as string[] | null) ?? [];
  const tags = (translation.tags as string[] | null) ?? [];

  return (
    <article dir={locale === "fa" ? "rtl" : "ltr"} className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start gap-4">
          {project.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.logo.thumbnail || project.logo.source}
              alt=""
              className="h-16 w-16 rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                {translation.title}
              </h1>
              {project.featured ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Featured
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {translation.shortDescription}
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
              {translation.category}
              {project.releaseYear ? ` · ${project.releaseYear}` : ""}
            </p>
          </div>
        </div>

        {project.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover.source}
            alt=""
            className="aspect-video w-full rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
          />
        ) : null}
      </header>

      <section>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Description
        </h2>
        <p className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
          {translation.description}
        </p>
      </section>

      {technologies.length > 0 || platforms.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2">
          {technologies.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {platforms.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                Platforms
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {tags.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {project.links.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                {link.label || PROJECT_LINK_TYPE_LABELS[link.type]}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {project.gallery.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {project.gallery.map((item) => (
              <GalleryPreviewItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function GalleryPreviewItem({
  item,
}: {
  item: NonNullable<ProjectDetail>["gallery"][number];
}) {
  if (item.type === "YOUTUBE_VIDEO") {
    return (
      <a
        href={item.youtubeUrl ?? getYoutubeWatchUrl(item.youtubeVideoId ?? "")}
        target="_blank"
        rel="noreferrer"
        className="group relative block overflow-hidden rounded-lg ring-1 ring-neutral-200 dark:ring-neutral-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.youtubeThumbnailUrl ?? undefined}
          alt=""
          className="aspect-video w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          ▶ YouTube — {item.youtubeTitle}
        </span>
      </a>
    );
  }

  if (!item.media) return null;

  if (item.media.type === "VIDEO") {
    return (
      <video
        src={item.media.source}
        poster={item.media.thumbnail ?? undefined}
        controls
        className="aspect-video w-full rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.media.source}
      alt=""
      className="aspect-video w-full rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
    />
  );
}
