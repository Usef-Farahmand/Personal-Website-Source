"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, VideoOff } from "lucide-react";
import type { MediaItem } from "@/types/media";

/**
 * A direct video file in the browser's own player (play/pause, volume,
 * seeking, duration, fullscreen), at its own aspect ratio and no larger
 * than the viewer's media area. Never autoplays. MediaViewer remounts it
 * per item, so a previous video's playback and listeners never linger.
 * If the file can't be played, a short message and a link to the file.
 */
export function VideoPlayer({
  item,
  playbackRate,
  labels,
}: {
  item: MediaItem;
  playbackRate: number;
  labels: { failed: string; openOriginal: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  if (failed) {
    return (
      <div className="border-border bg-surface text-text-secondary flex aspect-video w-full max-w-[calc((100dvh-15rem)*16/9)] flex-col items-center justify-center gap-3 rounded-lg border px-4 text-center">
        <VideoOff className="h-8 w-8" aria-hidden="true" />
        <p className="text-sm">{labels.failed}</p>
        <a
          href={item.src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover inline-flex items-center gap-1.5 text-sm font-semibold"
        >
          {labels.openOriginal}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={item.src}
      poster={item.thumbnail}
      controls
      controlsList="nodownload"
      preload="metadata"
      playsInline
      onError={() => setFailed(true)}
      className="max-h-[calc(100dvh-15rem)] max-w-full rounded-lg bg-black"
    >
      <track kind="captions" />
    </video>
  );
}
