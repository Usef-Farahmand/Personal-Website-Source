"use client";

import { useEffect, useRef } from "react";
import type { MediaItem } from "@/types/media";

interface VideoPlayerProps {
  item: MediaItem;
  playbackRate: number;
}

/**
 * Deliberately built on native `<video controls>` rather than a fully
 * custom player. The requirement lists nine controls: play, pause,
 * progress bar, current time, duration, volume, playback speed,
 * fullscreen, and Picture-in-Picture. Native controls already implement
 * eight of those — reliably, accessibly, and for free, in every browser
 * this site needs to support. Rebuilding a scrubber, volume slider, and
 * fullscreen/PiP toggle from scratch to visually match a design system
 * would be real, ongoing maintenance for something browsers already do
 * well; that's exactly the over-engineering this task's own Code Quality
 * section warns against.
 *
 * Playback speed is the one item native controls don't expose
 * consistently across browsers, so it's the one custom control — driven
 * by MediaViewer's shared toolbar (the single source of truth for the
 * current rate, same reasoning as ImageViewer's zoom/fit state) and
 * applied here via effect, since `<video>` has no declarative
 * `playbackRate` prop.
 */
export function VideoPlayer({ item, playbackRate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video
      ref={videoRef}
      key={item.id}
      src={item.src}
      poster={item.thumbnail}
      controls
      controlsList="nodownload"
      // Autoplay only once the visitor has explicitly opened the viewer
      // (a deliberate click) — never in the gallery thumbnail, where it
      // would be an unrequested motion.
      autoPlay
      className="max-h-[75vh] max-w-full rounded-md"
    >
      <track kind="captions" />
    </video>
  );
}
