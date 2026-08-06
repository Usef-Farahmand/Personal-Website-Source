import type { ReactNode } from "react";

export interface ToolbarAction {
  key: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  /** For a real download link instead of a click handler — a plain
   *  anchor with `download` is the correct, dependency-free way to
   *  trigger a browser download, so Download actions pass `href`
   *  instead of `onClick` rather than reimplementing download-triggering
   *  in JS. */
  href?: string;
  downloadFilename?: string;
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
            download={action.downloadFilename ?? true}
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
