"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Gauge,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { EmbedPlayer } from "@/components/ui/EmbedPlayer";
import {
  MediaViewerToolbar,
  type ToolbarAction,
} from "@/components/ui/MediaViewerToolbar";
import { resolveVideoEmbed } from "@/lib/videoEmbed";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/types/media";

interface MediaViewerProps {
  items: MediaItem[];
  index: number;
  onIndexChange: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 2, 0.75] as const;
const ZOOM_LEVELS = [1, 1.5, 2, 3] as const;
/** Horizontal distance (px) that counts as a deliberate swipe. */
const SWIPE_THRESHOLD_PX = 50;

/**
 * The one media viewer on the site (project gallery, achievement
 * certificates, documents): a shared shell — title and description
 * centred on top, the media below, orange previous/next buttons beside
 * the media (below it on phones) — around three modes: image (zoom and
 * pan), video (direct file in the native player, or a YouTube/Aparat
 * embed) and PDF (the browser's PDF viewer). Built on Overlay: focus
 * trap, Escape, backdrop click, scroll lock, focus return, animation.
 *
 * Navigation follows the gallery order and stops at both ends (no
 * wrapping); with a single item there are no navigation buttons. Arrow
 * keys and swipes navigate, except while the focus or the gesture is in
 * a player, a PDF, or a zoomed image.
 */
export function MediaViewer({
  items,
  index,
  onIndexChange,
  isOpen,
  onClose,
}: MediaViewerProps) {
  const t = useTranslations("mediaViewer");
  const item = items[index];
  const hasMultiple = items.length > 1;
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  const [zoomStep, setZoomStep] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const touchStartX = useRef<number | null>(null);

  // Per-item state resets when the item changes (React's "adjust state
  // during render" pattern, not an effect that would render twice).
  const [prevIndex, setPrevIndex] = useState(index);
  if (index !== prevIndex) {
    setPrevIndex(index);
    setZoomStep(0);
    setPlaybackRate(1);
  }

  if (!item) return null;

  const zoom = ZOOM_LEVELS[zoomStep];
  const embed = resolveVideoEmbed(item);
  const isFileVideo = item.type === "video" && !embed;
  const isEmbed = embed !== null || item.type === "youtube";

  const goPrev = () => canPrev && onIndexChange(index - 1);
  const goNext = () => canNext && onIndexChange(index + 1);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, video, iframe")) return;
    if (zoom > 1) return;
    // Arrow keys follow the screen: in RTL the previous item is on the
    // right, so ArrowRight goes back.
    const rtl = document.documentElement.dir === "rtl";
    if (event.key === "ArrowRight") (rtl ? goPrev : goNext)();
    if (event.key === "ArrowLeft") (rtl ? goNext : goPrev)();
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    // Only images swipe: players, PDFs and a zoomed image use the gesture.
    if (!hasMultiple || startX === null) return;
    if (item.type !== "image" || zoom > 1) return;
    const delta = (event.changedTouches[0]?.clientX ?? startX) - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    const rtl = document.documentElement.dir === "rtl";
    // Swiping toward the start side shows the next item.
    if (delta < 0 !== rtl) goNext();
    else goPrev();
  }

  const actions: ToolbarAction[] = [];

  if (item.type === "image") {
    actions.push(
      {
        key: "zoom-out",
        label: t("zoomOut"),
        icon: <ZoomOut className="h-4 w-4" />,
        onClick: () => setZoomStep((s) => Math.max(0, s - 1)),
        disabled: zoomStep === 0,
      },
      {
        key: "zoom-in",
        label: t("zoomIn"),
        icon: <ZoomIn className="h-4 w-4" />,
        onClick: () =>
          setZoomStep((s) => Math.min(ZOOM_LEVELS.length - 1, s + 1)),
        disabled: zoomStep === ZOOM_LEVELS.length - 1,
      },
      {
        key: "zoom-reset",
        label: t("resetZoom"),
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: () => setZoomStep(0),
        disabled: zoomStep === 0,
      }
    );
  }

  if (isFileVideo) {
    actions.push({
      key: "speed",
      label: t("speed", { rate: playbackRate }),
      icon: <Gauge className="h-4 w-4" />,
      badge: `${playbackRate}×`,
      onClick: () => {
        const i = PLAYBACK_RATES.indexOf(
          playbackRate as (typeof PLAYBACK_RATES)[number]
        );
        setPlaybackRate(PLAYBACK_RATES[(i + 1) % PLAYBACK_RATES.length]);
      },
    });
  }

  if (item.downloadable === true && !isEmbed) {
    actions.push({
      key: "download",
      label: t("download"),
      icon: <Download className="h-4 w-4" />,
      href: item.downloadUrl ?? item.src,
    });
  }

  // The original page: the item's own external link, else (for embeds
  // and PDFs) the video page or the file itself in a new tab.
  const externalUrl =
    item.externalUrl ??
    embed?.pageUrl ??
    (item.type === "youtube" || item.type === "pdf" ? item.src : undefined);
  if (externalUrl) {
    actions.push({
      key: "external",
      label: item.externalLabel ?? t("openOriginal"),
      icon: <ExternalLink className="h-4 w-4" />,
      href: externalUrl,
      openInNewTab: true,
    });
  }

  const metadata = item.metadata
    ? Object.values(item.metadata).filter(Boolean).join(" · ")
    : "";
  const hasHeader = Boolean(item.title || item.description || metadata);
  const altText = item.alt ?? item.title ?? item.description ?? "";

  const navButton = (direction: "prev" | "next", className?: string) => {
    const isPrev = direction === "prev";
    const Icon = isPrev ? ChevronLeft : ChevronRight;
    return (
      <button
        type="button"
        onClick={isPrev ? goPrev : goNext}
        disabled={isPrev ? !canPrev : !canNext}
        aria-label={t(isPrev ? "previous" : "next")}
        className={cn(
          "bg-accent text-background hover:bg-accent-hover flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg shadow-black/30 transition-[background-color,opacity,scale] active:scale-95 disabled:pointer-events-none disabled:opacity-25 motion-reduce:transition-none",
          className
        )}
      >
        <Icon className="h-6 w-6 rtl:-scale-x-100" aria-hidden="true" />
      </button>
    );
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title={item.title ?? t("dialogTitle")}
      closeLabel={t("close")}
      onKeyDown={handleKeyDown}
      contentClassName="flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl p-0 sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] lg:w-[60rem] xl:w-[68rem]"
    >
      {/* Media-specific actions, opposite the close button. */}
      <div className="absolute start-2 top-2 z-10">
        <MediaViewerToolbar actions={actions} />
      </div>

      {hasHeader ? (
        <header className="shrink-0 px-14 pt-4 pb-3 text-center sm:px-20">
          {item.title && (
            <h3 className="text-text-primary text-base font-semibold sm:text-lg">
              {item.title}
            </h3>
          )}
          {(item.description || metadata) && (
            <div className="text-text-secondary mx-auto mt-1 max-h-16 max-w-2xl overflow-y-auto text-sm leading-relaxed sm:max-h-20">
              {item.description && (
                <p className="text-center">{item.description}</p>
              )}
              {metadata && (
                <p className="mt-0.5 text-center text-xs">{metadata}</p>
              )}
            </div>
          )}
        </header>
      ) : (
        <div className="h-12 shrink-0" aria-hidden="true" />
      )}

      <div className="flex min-h-0 flex-1 items-center gap-3 px-3 pb-3 sm:px-4 lg:gap-5 lg:px-5 lg:pb-5">
        {hasMultiple && navButton("prev", "hidden lg:flex")}

        <div
          className="flex min-h-0 min-w-0 flex-1 items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {item.type === "image" && (
            <ImageViewer key={item.id} item={item} zoom={zoom} alt={altText} />
          )}
          {isFileVideo && (
            <VideoPlayer
              key={item.id}
              item={item}
              playbackRate={playbackRate}
              labels={{
                failed: t("videoFailed"),
                openOriginal: t("openOriginal"),
              }}
            />
          )}
          {isEmbed && (
            <EmbedPlayer
              key={item.id}
              embed={embed}
              title={item.title ?? t("videoTitle")}
              sourceUrl={item.src}
              labels={{
                failed: t("videoFailed"),
                openOriginal: t("openOriginal"),
              }}
            />
          )}
          {item.type === "pdf" && (
            <PdfViewer
              key={item.id}
              url={item.src}
              title={item.title ?? t("pdfTitle")}
              labels={{
                loading: t("pdfLoading"),
                failed: t("pdfFailed"),
                openPdf: t("openPdf"),
              }}
            />
          )}
        </div>

        {hasMultiple && navButton("next", "hidden lg:flex")}
      </div>

      {hasMultiple && (
        <div className="flex shrink-0 items-center justify-center gap-6 pb-3 lg:-mt-2 lg:pb-4">
          {navButton("prev", "lg:hidden")}
          <p className="text-text-secondary text-sm tabular-nums">
            {t("counter", { current: index + 1, total: items.length })}
          </p>
          {navButton("next", "lg:hidden")}
        </div>
      )}

      {/* Warm the cache for the neighbouring images. */}
      {[items[index - 1], items[index + 1]]
        .filter((n): n is MediaItem => n?.type === "image")
        .map((n) => (
          // eslint-disable-next-line @next/next/no-img-element -- prefetch only, never shown.
          <img
            key={n.id}
            src={n.src}
            alt=""
            className="hidden"
            aria-hidden="true"
          />
        ))}
    </Overlay>
  );
}
