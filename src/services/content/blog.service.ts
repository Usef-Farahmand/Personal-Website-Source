import { listArticles } from "./articles.service";
import { listLearning } from "./learning.service";
import {
  getVideoCover,
  getVideoPlatforms,
  listVideos,
} from "./videos.service";
import { toPublicSrc } from "@/lib/publicPath";
import type { Locale } from "@/types/content";

/**
 * The blog is one stream built from three content types that each keep
 * their own data file: articles (published on Medium/LinkedIn, so their
 * posts link out), learning notes (hosted here, at /blog/<slug>) and
 * videos (YouTube/Instagram). Newest first.
 *
 * Every post has one category: an article's own category, or the
 * "learning-notes" / "videos" category for the other two types. Tags are
 * the content's own tags.
 */

export type BlogPostKind = "article" | "note" | "video";

export interface BlogPost {
  id: string;
  kind: BlogPostKind;
  title: string;
  excerpt: string;
  image: string | null;
  /** ISO date. */
  date: string;
  category: string;
  tags: string[];
  /** Internal path for notes, the external URL otherwise. */
  href: string;
  external: boolean;
  /** Articles: Medium/LinkedIn/...; videos: YouTube/Instagram. */
  platform?: string;
  readingMinutes?: number;
}

export const NOTE_CATEGORY = "learning-notes";
export const VIDEO_CATEGORY = "videos";

export function listBlogPosts(locale: Locale): BlogPost[] {
  const articles: BlogPost[] = listArticles(locale).map((article) => ({
    id: article.id,
    kind: "article",
    title: article.title,
    excerpt: article.summary,
    image: article.headerImageUrl ?? null,
    date: article.publishedDate,
    category: article.category,
    tags: article.tags,
    href: article.sourceUrl,
    external: true,
    platform: article.sourcePlatform,
    readingMinutes: article.readingTimeMinutes,
  }));

  const notes: BlogPost[] = listLearning(locale).map((entry) => ({
    id: entry.id,
    kind: "note",
    title: entry.title,
    excerpt: entry.summary,
    image: entry.imageUrl ? toPublicSrc(entry.imageUrl) : null,
    date: entry.date,
    category: NOTE_CATEGORY,
    tags: entry.tags,
    href: `/blog/${entry.slug}`,
    external: false,
  }));

  const videos: BlogPost[] = listVideos(locale).flatMap((video) => {
    const [platform] = getVideoPlatforms(video);
    if (!platform) return [];
    return [
      {
        id: video.id,
        kind: "video" as const,
        title: video.title,
        excerpt: "",
        image: getVideoCover(video),
        date: video.publishedDate,
        category: VIDEO_CATEGORY,
        tags: video.tags,
        href: video.links[platform] as string,
        external: true,
        platform,
      },
    ];
  });

  return [...articles, ...notes, ...videos].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

/** Categories with post counts, largest first. */
export function blogCategories(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/** The most used tags across all posts. */
export function popularTags(posts: BlogPost[], limit = 16): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}
