import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  /** The page's route, shown as a small terminal-style `~/path` tag. */
  path: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** For fixed-height pages: below sm only the title shows, and the path
   *  tag also hides on short screens. */
  compact?: boolean;
}

/**
 * Title block for every section page, in the homepage hero's visual
 * language: a mono `~/path` tag with an accent marker, a large bold title,
 * a short accent bar and the intro line.
 */
export function PageHeader({
  path,
  title,
  intro,
  children,
  className,
  compact = false,
}: PageHeaderProps) {
  return (
    <header className={cn("landing-rise mb-12", className)}>
      <p
        dir="ltr"
        className={cn(
          "text-accent inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider",
          compact && "[@media(max-height:720px)]:hidden"
        )}
      >
        <span aria-hidden="true" className="bg-accent h-2 w-2" />~{path}
      </p>
      <h1
        className={cn(
          "text-text-primary mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] font-bold ltr:tracking-tight",
          compact && "text-[clamp(1.875rem,5vw,3.5rem)]"
        )}
      >
        {title}
      </h1>
      <div
        aria-hidden="true"
        className={cn("bg-accent mt-5 h-1 w-14", compact && "hidden sm:block")}
      />
      {intro && (
        <p
          className={cn(
            "text-text-secondary mt-5 max-w-2xl text-base sm:text-lg",
            compact && "hidden sm:block"
          )}
        >
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
