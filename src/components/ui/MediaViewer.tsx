"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Maximize,
  Minimize,
  Gauge,
  Download,
  ExternalLink,
} from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { YoutubeEmbed } from "@/components/ui/YoutubeEmbed";
import { MediaInfoPanel } from "@/components/ui/MediaInfoPanel";
import {
  MediaViewerToolbar,
  type ToolbarAction,
} from "@/components/ui/MediaViewerToolbar";
import type { MediaItem } from "@/types/media";

interface MediaViewerProps {
  items: MediaItem[];
  index: number;
  onIndexChange: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75] as const;
/** Horizontal drag distance (px) that counts as an intentional swipe
 *  rather than an incidental touch-drag — matches the threshold feel of
 *  ProjectGallery's own drag handling. */
const SWIPE_THRESHOLD_PX = 50;

/**
 * The single Media Viewer used everywhere media is viewed on this site
 * (Projects gallery, Achievements certificates, and any future gallery)
 * — one modal, one toolbar, one set of keyboard/swipe/close behaviors,
 * with type-specific rendering isolated to three small dispatch targets
 * (ImageViewer/VideoPlayer/PdfViewer). Adding a fourth media type is one
 * new MediaFileType member (types/media.ts) plus one new branch in the
 * render dispatch below plus one new case in the actions list if that
 * type needs its own toolbar action — no other file changes.
 *
 * Built on the shared Overlay foundation rather than its own
 * Dialog+Anime.js implementation: focus trap, ESC-to-close, background
 * scroll lock, focus restoration, semantic dialog role, and the
 * open/close animation all come from there for free — the same
 * infrastructure RecommendationModal already uses, so "one Overlay
 * System" (the requirement's own words) is literal, not just a shared
 * visual style.
 */
export function MediaViewer({
  items,
  index,
  onIndexChange,
  isOpen,
  onClose,
}: MediaViewerProps) {
  const item = items[index];
  const hasMultiple = items.length > 1;

  const [isZoomed, setIsZoomed] = useState(false);
  const [fitMode, setFitMode] = useState<"fit" | "original">("fit");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Reset per-item toggle state whenever the active item changes — a
  // zoomed-in image or a slowed-down video shouldn't carry over to the
  // next item in the gallery. Adjusting state during render (comparing
  // against a tracked previous value) rather than in a useEffect: this
  // is React's own recommended pattern for "reset state when a value
  // changes" — an effect here would commit the stale state first, then
  // trigger a second render to correct it, which is exactly the
  // cascading-render cost the effect-based version paid for nothing.
  const [prevIndex, setPrevIndex] = useState(index);
  if (index !== prevIndex) {
    setPrevIndex(index);
    setIsZoomed(false);
    setFitMode("fit");
    setPlaybackRate(1);
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);

  if (!item) return null;

  const goNext = () => onIndexChange((index + 1) % items.length);
  const goPrev = () => onIndexChange((index - 1 + items.length) % items.length);

  function handleOverlayKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (!hasMultiple || touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    // Swipe left (negative delta) advances, same convention as
    // ArrowRight/ArrowLeft — direction of the gesture maps to "next"/
    // "previous", not to any particular visual side.
    if (delta < 0) goNext();
    else goPrev();
  }

  const isDownloadable = item.downloadable === true;
  const downloadUrl = item.downloadUrl ?? item.src;

  const actions: ToolbarAction[] = [];

  if (hasMultiple) {
    actions.push({
      key: "prev",
      label: "Previous",
      icon: <ChevronLeft className="h-4 w-4 rtl:-scale-x-100" />,
      onClick: goPrev,
    });
  }

  if (item.type === "image") {
    // Zoom In xor Zoom Out — never both, per the requirement. Same
    // pattern for Fit to Screen xor Original Size just below.
    actions.push(
      isZoomed
        ? {
            key: "zoom",
            label: "Zoom Out",
            icon: <ZoomOut className="h-4 w-4" />,
            onClick: () => setIsZoomed(false),
          }
        : {
            key: "zoom",
            label: "Zoom In",
            icon: <ZoomIn className="h-4 w-4" />,
            onClick: () => setIsZoomed(true),
          }
    );
    actions.push(
      fitMode === "fit"
        ? {
            key: "fit",
            label: "Original Size",
            icon: <Maximize2 className="h-4 w-4" />,
            onClick: () => setFitMode("original"),
          }
        : {
            key: "fit",
            label: "Fit to Screen",
            icon: <Minimize2 className="h-4 w-4" />,
            onClick: () => setFitMode("fit"),
          }
    );
  }

  if (item.type === "video") {
    actions.push({
      key: "speed",
      label: `Playback speed: ${playbackRate}x`,
      icon: <Gauge className="h-4 w-4" />,
      onClick: () => {
        const currentIndex = PLAYBACK_RATES.indexOf(
          playbackRate as (typeof PLAYBACK_RATES)[number]
        );
        setPlaybackRate(
          PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length]
        );
      },
    });
  }

  if (isDownloadable) {
    actions.push({
      key: "download",
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      href: downloadUrl,
    });
  }

  // External Resource: a real target="_blank" link, only ever reached by
  // an explicit click on this action — never an automatic redirect. The
  // media itself (src) is always what's shown in the viewer; externalUrl
  // is a separate, optional "verify/read this elsewhere" page (a Credly
  // credential, a certificate verification URL, the article this image
  // illustrates, ...).
  if (item.externalUrl) {
    actions.push({
      key: "external",
      label: item.externalLabel ?? "Open Original Source",
      icon: <ExternalLink className="h-4 w-4" />,
      href: item.externalUrl,
      openInNewTab: true,
    });
  }

  actions.push({
    key: "fullscreen",
    label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
    icon: isFullscreen ? (
      <Minimize className="h-4 w-4" />
    ) : (
      <Maximize className="h-4 w-4" />
    ),
    onClick: toggleFullscreen,
  });

  if (hasMultiple) {
    actions.push({
      key: "next",
      label: "Next",
      icon: <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />,
      onClick: goNext,
    });
  }

  const caption = item.title;

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title={caption ?? "Media viewer"}
      onKeyDown={handleOverlayKeyDown}
      contentClassName="max-h-[90vh] w-[calc(100vw-2rem)] p-0 sm:w-[36rem] md:w-[44rem] lg:w-[56rem] xl:w-[64rem]"
    >
      <div className="flex flex-col">
        <div className="border-border flex items-center justify-between gap-4 border-b px-4 py-2 pe-14 sm:px-6">
          <div className="min-w-0">
            {caption && (
              <p className="text-small text-text-primary truncate font-medium">
                {caption}
              </p>
            )}
            {hasMultiple && (
              <p className="text-caption text-text-secondary tabular-nums">
                {index + 1} / {items.length}
              </p>
            )}
          </div>
          <MediaViewerToolbar actions={actions} />
        </div>

        {/* Media + Information Panel: side-by-side from `lg` (a real
            side panel, per the requirement), stacked as a footer below
            the media on smaller screens — CSS-driven, not a JS viewport
            check, per "avoid unnecessary JavaScript". MediaInfoPanel
            itself renders null when there's nothing to show, so no empty
            panel space appears for media with no description/metadata. */}
        <div className="flex flex-col lg:flex-row">
          <div
            className="flex flex-1 items-center justify-center overflow-hidden bg-black/20 p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {item.type === "image" && (
              <ImageViewer item={item} isZoomed={isZoomed} fitMode={fitMode} />
            )}
            {item.type === "video" && (
              <VideoPlayer item={item} playbackRate={playbackRate} />
            )}
            {item.type === "pdf" && (
              <PdfViewer
                key={item.id}
                url={item.src}
                title={item.title ?? "PDF document"}
              />
            )}
            {item.type === "youtube" && <YoutubeEmbed item={item} />}
          </div>

          <MediaInfoPanel
            item={item}
            className="border-border shrink-0 border-t px-4 py-3 sm:px-6 lg:w-64 lg:border-s lg:border-t-0 lg:py-4"
          />
        </div>
      </div>

      {/* Preload adjacent gallery items (Performance requirement). Hidden
          <img> elements still trigger a real browser fetch regardless of
          `display: none` — the fetch is driven by the src attribute
          being parsed, not by visibility — so this warms the cache for
          Previous/Next without rendering anything visible or running
          extra JS. Images only: video/PDF preloading would need a
          meaningfully different mechanism (range requests, byte budgets)
          for uncertain benefit on a small portfolio gallery — scoped out
          rather than speculatively built, per "avoid unnecessary
          JavaScript" and "do not over-engineer". Indexes are deduped via
          Set before mapping — with exactly 2 items in the gallery,
          "previous" and "next" resolve to the same item, which would
          otherwise render two <img> elements sharing one key. */}
      {hasMultiple &&
        [
          ...new Set([
            (index - 1 + items.length) % items.length,
            (index + 1) % items.length,
          ]),
        ]
          .map((i) => items[i])
          .filter(
            (adjacent) => adjacent.type === "image" && adjacent.id !== item.id
          )
          .map((adjacent) => (
            // eslint-disable-next-line @next/next/no-img-element -- prefetch-only, never rendered visibly.
            <img
              key={adjacent.id}
              src={adjacent.src}
              alt=""
              className="hidden"
              aria-hidden="true"
            />
          ))}
    </Overlay>
  );
}
