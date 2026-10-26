"use client";

import { useEffect, useRef, useState } from "react";
import { loaderConfig } from "@/config/loader";
import { supportsAlphaWebm } from "@/lib/loader/readiness";

const { landscape, portrait, videoDelayMs } = loaderConfig.characters;
const PORTRAIT_QUERY = "(orientation: portrait)";

function pickVideo(): string {
  if (window.matchMedia(PORTRAIT_QUERY).matches) return portrait.video;
  return window.matchMedia(`(max-width: ${landscape.video.smallMaxWidth}px)`)
    .matches
    ? landscape.video.small
    : landscape.video.large;
}

/**
 * The two characters as one composition — seated and playing on landscape
 * screens, standing full-body on portrait ones. The transparent still is
 * part of the server HTML (a <picture> art-directed by orientation), so
 * something is on screen from the first paint; once hydrated, browsers
 * that render VP9 alpha (Chromium, Firefox) swap in the looping video when
 * it actually starts playing. Safari/iOS, reduced motion and any video
 * failure simply keep the still.
 */
export function LoaderCharacters() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !supportsAlphaWebm()
    ) {
      return;
    }

    const orientation = window.matchMedia(PORTRAIT_QUERY);
    const onOrientationChange = () => {
      setPlaying(false);
      setSrc(pickVideo());
    };
    // Request the video only once the scene is about to be seen and the
    // loader is still up: a page that's ready by then never fetches it.
    const delay = Math.max(
      videoDelayMs,
      loaderConfig.sceneDelayMs - performance.now()
    );
    const timer = window.setTimeout(() => {
      const overlay = document.getElementById(loaderConfig.elementId);
      if (overlay?.getAttribute("data-state") !== "boot") return;
      setSrc(pickVideo());
      orientation.addEventListener("change", onOrientationChange);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      orientation.removeEventListener("change", onOrientationChange);
    };
  }, []);

  useEffect(() => {
    const element = videoRef.current;
    if (!src || !element) return;

    const onVisibilityChange = () => {
      if (document.hidden) element.pause();
      else element.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      element.pause();
      // Releases the decoder and cancels any in-flight download.
      element.removeAttribute("src");
      element.load();
    };
  }, [src]);

  return (
    <div className="site-loader__media" data-playing={playing || undefined}>
      <picture>
        <source
          media={PORTRAIT_QUERY}
          srcSet={portrait.still.src}
          width={portrait.still.width}
          height={portrait.still.height}
        />
        <img
          className="site-loader__still"
          src={landscape.still.src}
          width={landscape.still.width}
          height={landscape.still.height}
          alt=""
          decoding="async"
          fetchPriority="low"
          draggable={false}
        />
      </picture>
      {src && (
        <video
          key={src}
          ref={videoRef}
          className="site-loader__video"
          src={src}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
          onError={() => {
            setPlaying(false);
            setSrc(null);
          }}
        />
      )}
    </div>
  );
}
