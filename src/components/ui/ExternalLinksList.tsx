import {
  ExternalLink as ExternalLinkIcon,
  FileText,
  Gamepad2,
  Video,
} from "lucide-react";
import { GitHubIcon } from "@/components/ui/icons";
import type { ExternalLink } from "@/types/content";

/**
 * Best-effort icon by label keyword, not a closed enum — this section is
 * explicitly open-ended (Steam, itch.io, Documentation, press, "whatever
 * comes up next"), so a fixed union like FeatureHighlightIcon would force
 * a schema change for every new link kind. Unrecognized labels fall back
 * to a plain ExternalLink glyph rather than a guessed brand mark, per the
 * same caution ArticleCard already applies to platform icons.
 *
 * Shared by Project's and Skill's `externalLinks` — both use the same
 * {label, url} shape (content/types.ts), so one component covers both
 * rather than a near-identical clone per content type.
 */
function iconForLabel(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("github")) return GitHubIcon;
  if (normalized.includes("doc")) return FileText;
  if (
    normalized.includes("steam") ||
    normalized.includes("itch") ||
    normalized.includes("game")
  )
    return Gamepad2;
  if (normalized.includes("demo") || normalized.includes("video")) return Video;
  return ExternalLinkIcon;
}

export function ExternalLinksList({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => {
        const Icon = iconForLabel(link.label);
        return (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-animate
              className="border-border text-small text-text-primary hover:border-accent/50 hover:text-accent inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-medium transition-colors"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
