import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface ViewAllLinkProps {
  href: string;
  label: string;
}

/**
 * The "View All [Collection] →" pattern, shared by every homepage section
 * that previews a limited subset of a larger collection (Featured Work,
 * Experience, Achievements). Kept visually distinct from content-specific
 * CTAs like About Preview's "Read Full Story" — that's a "continue
 * reading" action, not a "view the full collection" action, and the two
 * are deliberately styled differently.
 */
export function ViewAllLink({ href, label }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
    >
      {label}
      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
    </Link>
  );
}
