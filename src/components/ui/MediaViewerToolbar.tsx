import type { ReactNode } from "react";

export interface ToolbarAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  /** For a real link instead of a click handler — a plain anchor is the
   *  correct, dependency-free way to trigger either a download or a
   *  navigation, so both Download and "Open Original Source" pass `href`
   *  instead of `onClick` rather than reimplementing either in JS. */
  href?: string;
  downloadFilename?: string;
  /** True for External Resource links (target="_blank", no `download`
   *  attribute) — false/omitted for Download links (`download` attribute,
   *  no new tab). Conflating the two would make Download try to
   *  navigate away instead of saving a file, or make "Open Original
   *  Source" try to download the linked page instead of opening it. */
  openInNewTab?: boolean;
}

/**
 * Renders whatever action list the caller builds for the current media
 * type + state (see MediaViewer's buildToolbarActions) — this component
 * has no per-media-type knowledge itself, which is what makes it
 * genuinely shared rather than a switch statement wearing a shared
 * component's name. Adding a new media type never touches this file.
 */
export function MediaViewerToolbar({ actions }: { actions: ToolbarAction[] }) {
  if (actions.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {actions.map((action) =>
        action.href ? (
          <a
            key={action.key}
            href={action.href}
            {...(action.openInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : { download: action.downloadFilename ?? true })}
            aria-label={action.label}
            title={action.label}
            className="text-text-primary hover:text-accent hover:bg-surface/80 inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          >
            {action.icon}
          </a>
        ) : (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            aria-label={action.label}
            title={action.label}
            className="text-text-primary hover:text-accent hover:bg-surface/80 inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          >
            {action.icon}
          </button>
        )
      )}
    </div>
  );
}
