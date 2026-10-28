"use client";

import { ExternalLink, VideoOff } from "lucide-react";
import type { VideoEmbed } from "@/lib/videoEmbed";

/**
 * A YouTube or Aparat video in its platform's own embedded player (its
 * own controls; nothing is drawn over it), in a 16:9 frame sized to the
 * viewer. `embed` null means the URL couldn't be resolved: a short
 * message and, when there is one, a link to the original page.
 */
export function EmbedPlayer({
  embed,
  title,
  sourceUrl,
  labels,
}: {
  embed: VideoEmbed | null;
  title: string;
  sourceUrl?: string;
  labels: { failed: string; openOriginal: string };
}) {
  if (!embed) {
    return (
      <div className="border-border bg-surface text-text-secondary flex aspect-video w-full max-w-[calc((100dvh-15rem)*16/9)] flex-col items-center justify-center gap-3 rounded-lg border px-4 text-center">
        <VideoOff className="h-8 w-8" aria-hidden="true" />
        <p className="text-sm">{labels.failed}</p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            {labels.openOriginal}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video w-full max-w-[calc((100dvh-15rem)*16/9)]">
      <iframe
        src={embed.embedUrl}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        allowFullScreen
        className="h-full w-full rounded-lg bg-black"
      />
    </div>
  );
}
