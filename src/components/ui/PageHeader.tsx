import type { ReactNode } from "react";

interface PageHeaderProps {
  /** The page's route, shown as a small terminal-style `~/path` tag. */
  path: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/**
 * Title block for every section page, in the homepage hero's visual
 * language: a mono `~/path` tag with an accent marker, a large bold title,
 * a short accent bar and the intro line.
 */
export function PageHeader({ path, title, intro, children }: PageHeaderProps) {
  return (
    <header className="landing-rise mb-12">
      <p
        dir="ltr"
        className="text-accent inline-flex items-center gap-2 font-mono text-xs font-medium tracking-wider"
      >
        <span aria-hidden="true" className="bg-accent h-2 w-2" />~{path}
      </p>
      <h1 className="text-text-primary mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] font-bold ltr:tracking-tight">
        {title}
      </h1>
      <div aria-hidden="true" className="bg-accent mt-5 h-1 w-14" />
      {intro && (
        <p className="text-text-secondary mt-5 max-w-2xl text-base sm:text-lg">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
