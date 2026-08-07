"use client";

import { FileText, Download } from "lucide-react";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { useMediaViewer } from "@/hooks/useMediaViewer";
import type { ResolvedAboutDocument } from "@/types/content";

interface DocumentCardProps {
  document: ResolvedAboutDocument;
  versionLabel?: string;
  lastUpdatedLabel?: string;
  previewLabel: string;
  downloadLabel: string;
}

/**
 * Preview opens the file in the site's one Universal Media Viewer (the
 * same modal Achievements and Project galleries use) — never a new
 * browser tab, per the explicit requirement. Download is a plain
 * anchor with the `download` attribute, the same dependency-free
 * approach MediaViewerToolbar's own Download action uses, so a visitor
 * can save the file without opening the preview first if that's what
 * they came for.
 */
export function DocumentCard({
  document,
  versionLabel,
  lastUpdatedLabel,
  previewLabel,
  downloadLabel,
}: DocumentCardProps) {
  const viewer = useMediaViewer([document.media]);
  const downloadUrl = document.media.downloadUrl ?? document.media.src;
  const isDownloadable = document.media.downloadable === true;

  return (
    <div
      data-animate
      className="border-border bg-surface flex flex-col gap-3 rounded-lg border p-5"
    >
      <div className="flex items-start gap-3">
        <span className="bg-accent/10 text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-small text-text-primary font-semibold">
            {document.title}
          </h3>
          {(versionLabel ?? lastUpdatedLabel) && (
            <p className="text-caption text-text-secondary">
              {[versionLabel, lastUpdatedLabel].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-4 pt-1">
        <button
          type="button"
          onClick={() => viewer.open(0)}
          className="text-small text-accent hover:text-accent-hover font-medium transition-colors"
        >
          {previewLabel}
        </button>
        {isDownloadable && (
          <a
            href={downloadUrl}
            download
            className="text-small text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {downloadLabel}
          </a>
        )}
      </div>

      <MediaViewer
        items={viewer.items}
        index={viewer.index}
        onIndexChange={viewer.setIndex}
        isOpen={viewer.isOpen}
        onClose={viewer.close}
      />
    </div>
  );
}
