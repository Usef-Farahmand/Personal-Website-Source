import { prisma } from "@/lib/db";
import type { MediaType } from "@/lib/validation/shared";
import type { MediaTypeFilter } from "@/lib/validation/media.schema";

// ---------------------------------------------------------------------------
// Lightweight option shape — used by MediaPicker/GalleryEditor (logo,
// cover, header image, gallery pickers) where only enough to render a
// thumbnail + label is needed. Moved here from queries/projects.ts,
// which now re-exports it (see that file) so the several existing
// import sites (ProjectForm, ArticleForm, GalleryEditor, MediaPicker,
// lib/actions/media.ts) don't all need touching for Task 06.
// ---------------------------------------------------------------------------

export type MediaOption = {
  id: string;
  type: MediaType;
  title: string | null;
  source: string;
  thumbnail: string | null;
};

export async function listMedia(): Promise<MediaOption[]> {
  return prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      title: true,
      source: true,
      thumbnail: true,
    },
  });
}

// ---------------------------------------------------------------------------
// Full Media Library (/admin/media) — search, type filter (section 8),
// and enough per-item detail for the grid's thumbnails/badges/sizes
// (section 7) without a second round trip per row.
// ---------------------------------------------------------------------------

export type MediaLibraryItem = {
  id: string;
  type: MediaType;
  title: string | null;
  source: string;
  thumbnail: string | null;
  fileSize: number | null;
  createdAt: Date;
};

export async function listMediaLibrary(params: {
  search?: string;
  type?: MediaTypeFilter;
}): Promise<MediaLibraryItem[]> {
  const search = params.search?.trim();
  const type = params.type && params.type !== "ALL" ? params.type : undefined;

  return prisma.media.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { originalFilename: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      title: true,
      source: true,
      thumbnail: true,
      fileSize: true,
      createdAt: true,
    },
  });
}

// ---------------------------------------------------------------------------
// Single Media item — full metadata plus "what references this" (section
// 9/11), used by both the detail/edit page and the delete-usage check.
// ---------------------------------------------------------------------------

export type MediaUsage = {
  projects: {
    id: string;
    slug: string;
    title: string;
    role: "logo" | "cover" | "gallery";
  }[];
  articles: { id: string; slug: string; title: string }[];
};

export async function getMediaUsage(mediaId: string): Promise<MediaUsage> {
  const [logoProjects, coverProjects, galleryEntries, articles] =
    await Promise.all([
      prisma.project.findMany({
        where: { logoMediaId: mediaId },
        select: {
          id: true,
          slug: true,
          translations: { select: { locale: true, title: true } },
        },
      }),
      prisma.project.findMany({
        where: { coverMediaId: mediaId },
        select: {
          id: true,
          slug: true,
          translations: { select: { locale: true, title: true } },
        },
      }),
      prisma.projectMedia.findMany({
        where: { mediaId },
        select: {
          project: {
            select: {
              id: true,
              slug: true,
              translations: { select: { locale: true, title: true } },
            },
          },
        },
      }),
      prisma.article.findMany({
        where: { headerMediaId: mediaId },
        select: {
          id: true,
          slug: true,
          translations: { select: { locale: true, title: true } },
        },
      }),
    ]);

  const titleOf = (
    slug: string,
    translations: { locale: string; title: string }[]
  ) =>
    translations.find((t) => t.locale === "en")?.title ??
    translations[0]?.title ??
    slug;

  const projects: MediaUsage["projects"] = [
    ...logoProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: titleOf(p.slug, p.translations),
      role: "logo" as const,
    })),
    ...coverProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: titleOf(p.slug, p.translations),
      role: "cover" as const,
    })),
    ...galleryEntries.map((entry) => ({
      id: entry.project.id,
      slug: entry.project.slug,
      title: titleOf(entry.project.slug, entry.project.translations),
      role: "gallery" as const,
    })),
  ];

  return {
    projects,
    articles: articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: titleOf(a.slug, a.translations),
    })),
  };
}

export type MediaDetail = {
  id: string;
  type: MediaType;
  title: string | null;
  description: string | null;
  source: string;
  thumbnail: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  downloadable: boolean;
  downloadUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getMediaById(id: string): Promise<MediaDetail | null> {
  return prisma.media.findUnique({
    where: { id },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      source: true,
      thumbnail: true,
      originalFilename: true,
      mimeType: true,
      fileSize: true,
      downloadable: true,
      downloadUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
