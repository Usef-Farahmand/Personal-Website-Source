import Image from "next/image";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { BlogPost } from "@/services/content/blog.service";

/** Notes open here; articles and videos open on their platform. */
function PostLink({
  post,
  children,
  className,
  tabIndex,
}: {
  post: BlogPost;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
}) {
  return post.external ? (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  ) : (
    <Link href={post.href} className={className} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

/**
 * One post in the blog list: a wide image with the category on it, then
 * the date line, a large title, the excerpt and a "read more" link.
 * Notes open here; articles and videos open on their platform.
 */
export function BlogPostCard({
  post,
  categoryLabel,
  metaLine,
  actionLabel,
  priority = false,
}: {
  post: BlogPost;
  categoryLabel: string;
  metaLine: string;
  actionLabel: string;
  priority?: boolean;
}) {
  return (
    <article data-animate className="group flex flex-col gap-5">
      <PostLink
        post={post}
        tabIndex={-1}
        className="border-border bg-surface relative block aspect-video overflow-hidden rounded-2xl border"
      >
        {post.image ? (
          <Image
            src={post.image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 48rem, 100vw"
            className="object-cover transition-transform duration-700 ease-(--motion-ease-smooth) group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            <BrandLogo size={64} className="opacity-25" />
          </span>
        )}
        {post.kind === "video" && (
          <span className="bg-background/70 absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm">
            <Play
              className="text-accent h-7 w-7 fill-current"
              aria-hidden="true"
            />
          </span>
        )}
        <span className="bg-accent text-background absolute start-4 top-4 rounded-full px-3 py-1 text-xs font-bold ltr:tracking-wider ltr:uppercase">
          {categoryLabel}
        </span>
      </PostLink>

      <div className="flex flex-col gap-3">
        <p className="text-text-secondary text-xs font-medium ltr:tracking-wider ltr:uppercase">
          {metaLine}
        </p>
        <h2 className="text-text-primary group-hover:text-accent text-2xl leading-tight font-bold transition-colors sm:text-3xl">
          <PostLink post={post}>{post.title}</PostLink>
        </h2>
        {post.excerpt && (
          <p className="text-text-secondary line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <PostLink
          post={post}
          className="text-accent hover:text-accent-hover inline-flex items-center gap-1.5 self-start text-sm font-semibold"
        >
          {actionLabel}
          {post.external ? (
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowRight
              className="h-4 w-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
          )}
        </PostLink>
      </div>
    </article>
  );
}
