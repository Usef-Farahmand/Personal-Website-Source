import type { SVGProps } from "react";
import { TECH_ICON_PATHS, type TechIconSlug } from "@/lib/techIconPaths";

/**
 * Renders an official technology brand mark, monochrome via
 * `currentColor` — same convention as the existing GitHubIcon /
 * LinkedInIcon / XIcon (src/components/ui/icons). Deliberately not the
 * brand's own hex color: several of these marks are pure black
 * (Next.js's logo, for one) and would be invisible on this site's dark
 * background, and mixing nine different brand colors into a chip row
 * would fight the single-accent design system documented in
 * DESIGN_SYSTEM.md. Consistent sizing + a single inherited color is what
 * "visually consistent across all skills" means here.
 */
export function TechIcon({
  slug,
  ...props
}: { slug: TechIconSlug } & SVGProps<SVGSVGElement>) {
  const icon = TECH_ICON_PATHS[slug];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  );
}
